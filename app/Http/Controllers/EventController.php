<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    public function create()
    {
        if (!Gate::allows('event_upload')) {
            abort(403);
        }
        
        return Inertia::render('Events/Create');
    }

    public function store(Request $request)
    {
        if (!Gate::allows('event_upload')) {
            abort(403);
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'event_type' => 'required|in:Workshop,Competition,Seminar',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_external' => 'required|boolean',
            // Conditional validation based on event type
            'max_participants' => 'required_if:is_external,false|nullable|integer|min:1',
            'registration_url' => 'required_if:is_external,true|nullable|url',
            'organizer_name' => 'required_if:is_external,true|nullable|string|max:255',
            'organizer_website' => 'nullable|url',
        ]);

        // Handle image upload
        $coverImagePath = null;
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/EventCover'), $filename);
            $coverImagePath = 'images/EventCover/' . $filename;
        }

        // Calculate initial status based on event date
        $eventDate = Carbon::parse($validated['date'])->startOfDay();
        $today = Carbon::now()->startOfDay();

        if ($eventDate->equalTo($today)) {
            $status = 'Ongoing';
        } else if ($eventDate->greaterThan($today)) {
            $status = 'Upcoming';
        } else {
            $status = 'Completed';
        }

        $event = Event::create([
            'event_id' => Str::uuid()->toString(),
            'title' => $validated['title'],
            'date' => $validated['date'],
            'time' => Carbon::parse($validated['time'])->format('H:i:s'),
            'location' => $validated['location'],
            'description' => $validated['description'],
            'max_participants' => $validated['is_external'] ? null : $validated['max_participants'],
            'enrolled_count' => $validated['is_external'] ? null : 0,
            'status' => $status, // Set the calculated status
            'event_type' => $validated['event_type'],
            'creator_id' => auth()->id(),
            'cover_image' => $coverImagePath,
            'is_external' => $validated['is_external'],
            'registration_url' => $validated['registration_url'] ?? null,
            'organizer_name' => $validated['organizer_name'] ?? null,
            'organizer_website' => $validated['organizer_website'] ?? null,
        ]);

        return redirect()->route('events.index')
            ->with('message', 'Event created successfully');
    }

    public function index()
    {
        $user = auth()->user();
        
        $events = Event::with(['creator'])
            ->latest()
            ->paginate(12)
            ->through(function ($event) use ($user) {
                $event->is_enrolled = Enrollment::where('user_id', $user->id)
                    ->where('event_id', $event->event_id)
                    ->exists();
                // Format the time
                $event->formatted_time = Carbon::parse($event->time)->format('g:i A');
                return $event;
            });

        return Inertia::render('Events/Index', [
            'events' => $events,
            'can' => [
                'event_upload' => Gate::allows('event_upload'),
                'event_enroll' => Gate::allows('event_enroll'),
            ],
        ]);
    }

    public function myEvents()
    {
        $user = auth()->user();
        
        // Get events organized by the user
        $organizedEvents = Event::where('creator_id', $user->id)
            ->with('creator')
            ->get()
            ->map(function ($event) {
                // Calculate and add status to each event
                $event->status = $this->calculateEventStatus($event);
                $event->enrolled_count = $event->enrolledUsers()->count();
                return $event;
            });
        
        // Get events the user is enrolled in
        $enrolledEvents = $user->enrolledEvents()
            ->with('creator')
            ->get()
            ->map(function ($event) {
                // Calculate and add status to each event
                $event->status = $this->calculateEventStatus($event);
                return $event;
            });
        
        return Inertia::render('Events/MyEvents', [
            'organizedEvents' => $organizedEvents,
            'enrolledEvents' => $enrolledEvents,
            'can' => [
                'event_edit' => Gate::allows('event_edit'),
                'event_feedback' => Gate::allows('event_feedback'),
                'event_feedbackview' => Gate::allows('event_feedbackview'),
            ]
        ]);
    }

    public function edit(Event $event)
    {
        // Check if user is the creator
        if ($event->creator_id !== auth()->id()) {
            abort(403);
        }

        if (!Gate::allows('event_edit')) {
            abort(403);
        }

        // Ensure the cover_image path is correct
        if ($event->cover_image) {
            // Make sure the path is relative to public directory
            $event->cover_image = str_replace('public/', '', $event->cover_image);
        }

        return Inertia::render('Events/Edit', [
            'event' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        if (!Gate::allows('event_edit')) {
            abort(403);
        }

        // Separate validation rules for external and internal events
        $commonRules = [
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'event_type' => 'required|in:Workshop,Competition,Seminar',
            'status' => 'required|in:Upcoming,Ongoing,Completed',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_external' => 'required|boolean',
        ];

        // Add specific rules based on event type
        if ($request->boolean('is_external')) {
            $specificRules = [
                'registration_url' => 'required|url',
                'organizer_name' => 'required|string|max:255',
                'organizer_website' => 'nullable|url',
            ];
        } else {
            $specificRules = [
                'max_participants' => 'required|integer|min:1',
                'registration_url' => 'nullable',
                'organizer_name' => 'nullable',
                'organizer_website' => 'nullable',
            ];
        }

        $validated = $request->validate(array_merge($commonRules, $specificRules));

        // Start with validated data
        $dataToUpdate = $validated;

        // Handle image upload if provided
        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($event->cover_image) {
                Storage::delete($event->cover_image);
            }
            
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/EventCover'), $filename);
            $dataToUpdate['cover_image'] = 'images/EventCover/' . $filename;
        } else {
            // Remove cover_image from update data if no new image is uploaded
            unset($dataToUpdate['cover_image']);
        }

        // Format time
        $dataToUpdate['time'] = Carbon::parse($validated['time'])->format('H:i:s');

        // Update the event
        $event->update($dataToUpdate);

        return redirect()->route('events.my-events')
            ->with('message', 'Event updated successfully');
    }

    public function dashboard()
    {
        $user = auth()->user();
        
        $stats = [
            'totalEvents' => Event::count(),
            'upcomingEvents' => Event::where('date', '>', now())->count(),
            'myEvents' => Event::where('creator_id', $user->id)->count(),
            'enrolledEvents' => $user->enrollments()->count(),
        ];

        $recentEvents = Event::with(['creator', 'enrollments'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($event) use ($user) {
                $event->formatted_time = Carbon::parse($event->time)->format('g:i A');
                $event->is_enrolled = $event->enrollments->contains('user_id', $user->id);
                return $event;
            });

        return Inertia::render('Dashboard', [
            'abilities' => [
                'isStudent' => $user->can('view-studentdashboard'),
                'isLecturer' => $user->can('view-lecturerdashboard'),
                'isUniversity' => $user->can('view-universitydashboard'),
                'isDepartment' => $user->can('view-departmentdashboard'),
                'isOrganizer' => $user->can('view-organizerdashboard'),
            ],
            'currentRole' => $user->role,
            'stats' => $stats,
            'recentEvents' => $recentEvents
        ]);
    }

    private function calculateEventStatus($event)
    {
        $eventDate = Carbon::parse($event->date)->startOfDay();
        $today = Carbon::now()->startOfDay();

        if ($event->status === 'Completed') {
            return 'Completed';
        } else if ($eventDate->equalTo($today)) {
            return 'Ongoing';
        } else if ($eventDate->greaterThan($today)) {
            return 'Upcoming';
        } else {
            return 'Completed';
        }
    }

    public function getEnrolledUsers(Event $event)
    {
        // Eager load the enrolledUsers with their basic information
        $enrolledUsers = $event->enrolledUsers()
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json($enrolledUsers);
    }
} 