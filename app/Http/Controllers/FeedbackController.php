<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Controller as BaseController;

class FeedbackController extends BaseController
{
    /**
     * Constructor to apply middleware
     */
    public function __construct()
    {
        // This is the correct way to apply middleware in a controller
        $this->middleware('can:event_feedback')->only(['create', 'store']);
        $this->middleware('can:event_feedbackview')->only('index');
    }

    /**
     * Show the form to create feedback for an event
     */
    public function create(Event $event)
    {
        // Check if the event is completed
        if ($event->status !== 'Completed') {
            return redirect()->back()->with('error', 'You can only provide feedback for completed events.');
        }

        // Check if the user is enrolled in this event
        $isEnrolled = $event->enrolledUsers()->where('user_id', Auth::id())->exists();
        if (!$isEnrolled) {
            return redirect()->back()->with('error', 'You must be enrolled in this event to provide feedback.');
        }

        // Check if the user has already provided feedback
        $existingFeedback = Feedback::where('event_id', $event->event_id)
            ->where('user_id', Auth::id())
            ->first();

        return Inertia::render('Feedback/Create', [
            'event' => $event,
            'existingFeedback' => $existingFeedback,
            'can' => [
                'event_feedback' => Gate::allows('event_feedback'),
            ]
        ]);
    }

    /**
     * Store a new feedback
     */
    public function store(Request $request, Event $event)
    {
        // Validate the request
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if the user has already provided feedback
        $existingFeedback = Feedback::where('event_id', $event->event_id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingFeedback) {
            // Update existing feedback
            $existingFeedback->update($validated);
            return redirect()->route('events.my-events')->with('success', 'Feedback updated successfully.');
        } else {
            // Create new feedback
            Feedback::create([
                'feedback_id' => Str::uuid()->toString(),
                'event_id' => $event->event_id,
                'user_id' => Auth::id(),
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]);
            
            return redirect()->route('events.my-events')->with('success', 'Feedback submitted successfully.');
        }
    }

    /**
     * View all feedback for an event (for organizers)
     */
    public function index(Event $event)
    {
        // Check if the user is the creator of this event
        if ($event->creator_id !== Auth::id()) {
            return redirect()->back()->with('error', 'You can only view feedback for events you organized.');
        }

        $feedback = $event->feedback()->with('user')->get();
        
        // Calculate average rating
        $averageRating = $feedback->avg('rating');

        return Inertia::render('Feedback/Index', [
            'event' => $event,
            'feedback' => $feedback,
            'averageRating' => $averageRating,
            'can' => [
                'event_feedbackview' => Gate::allows('event_feedbackview'),
            ]
        ]);
    }
} 