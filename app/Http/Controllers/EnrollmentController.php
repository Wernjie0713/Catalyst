<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

class EnrollmentController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if (!Gate::allows('event_enroll')) {
            abort(403);
        }

        $user = auth()->user();

        // Check if user is already enrolled
        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('event_id', $event->event_id)
            ->first();

        if ($existingEnrollment) {
            return back()->with('error', 'You are already enrolled in this event.');
        }

        // Check if event is full
        if ($event->enrolled_count >= $event->max_participants) {
            return back()->with('error', 'This event is already full.');
        }

        // Create enrollment
        $enrollment = new Enrollment();
        $enrollment->enrollment_id = Str::uuid();
        $enrollment->user_id = $user->id;
        $enrollment->event_id = $event->event_id;
        $enrollment->save();

        return back()->with('success', 'Successfully enrolled in the event.');
    }

    public function destroy(Event $event)
    {
        if (!Gate::allows('event_enroll')) {
            abort(403);
        }

        $user = auth()->user();

        // Find the enrollment
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('event_id', $event->event_id)
            ->first();

        if (!$enrollment) {
            return back()->with('error', 'You are not enrolled in this event.');
        }
        // Check if the event is already ongoing or completed
        if ($event->status !== 'Upcoming') {
            return back()->with('error', 'Cannot unenroll from an ongoing or completed event.');
        }
        $enrollment->delete();

        return back()->with('success', 'Successfully unenrolled from the event.');
    }
} 