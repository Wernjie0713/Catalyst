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
            'max_participants' => 'required|integer|min:1',
            'event_type' => 'required|in:Workshop,Competition,Seminar',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        $coverImagePath = null;
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/EventCover'), $filename);
            $coverImagePath = 'images/EventCover/' . $filename;
        }

        $event = Event::create([
            'event_id' => Str::uuid()->toString(),
            'title' => $validated['title'],
            'date' => $validated['date'],
            'time' => Carbon::parse($validated['time'])->format('H:i:s'),
            'location' => $validated['location'],
            'description' => $validated['description'],
            'max_participants' => $validated['max_participants'],
            'enrolled_count' => 0,
            'status' => 'Upcoming',
            'event_type' => $validated['event_type'],
            'creator_id' => auth()->id(),
            'cover_image' => $coverImagePath,
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

    public function show(Event $event)
    {
        $event->formatted_time = Carbon::parse($event->time)->format('g:i A');
        
        return Inertia::render('Events/Show', [
            'event' => $event->load('creator')
        ]);
    }

    public function myEvents()
    {
        $user = auth()->user();
        
        $organizedEvents = Event::where('creator_id', $user->id)
            ->with(['creator', 'enrollments.user'])
            ->withCount('enrollments')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($event) {
                return [
                    ...$event->toArray(),
                    'formatted_time' => Carbon::parse($event->time)->format('g:i A'),
                    'enrolled_count' => $event->enrollments_count,
                    'status' => $this->getEventStatus($event)
                ];
            });

        $enrolledEvents = $user->enrolledEvents()
            ->with(['creator', 'enrollments.user'])
            ->withCount('enrollments')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($event) {
                return [
                    ...$event->toArray(),
                    'formatted_time' => Carbon::parse($event->time)->format('g:i A'),
                    'enrolled_count' => $event->enrollments_count,
                    'status' => $this->getEventStatus($event)
                ];
            });

        return Inertia::render('Events/MyEvents', [
            'organizedEvents' => $organizedEvents,
            'enrolledEvents' => $enrolledEvents,
            'can' => [
                'event_upload' => Gate::allows('event_upload'),
                'event_edit' => Gate::allows('event_edit')
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
        Log::info('Update event request started', [
            'event_id' => $event->event_id,
            'request_data' => $request->all(),
            'files' => $request->hasFile('cover_image') ? 'yes' : 'no'
        ]);

        // Check if user is the creator
        if ($event->creator_id !== auth()->id()) {
            Log::warning('Unauthorized update attempt', [
                'user_id' => auth()->id(),
                'event_creator_id' => $event->creator_id
            ]);
            abort(403);
        }

        if (!Gate::allows('event_edit')) {
            Log::warning('User lacks event_edit permission', [
                'user_id' => auth()->id()
            ]);
            abort(403);
        }

        // Get current enrollment count
        $currentEnrollments = $event->enrollments()->count();
        Log::info('Current enrollments', [
            'count' => $currentEnrollments,
            'event_id' => $event->event_id
        ]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'date' => 'required|date',
                'time' => 'required',
                'location' => 'required|string|max:255',
                'description' => 'required|string',
                'max_participants' => [
                    'required',
                    'integer',
                    'min:' . $currentEnrollments,
                ],
                'event_type' => 'required|in:Workshop,Competition,Seminar',
                'status' => 'required|in:Upcoming,Ongoing,Completed',
                'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Handle image upload if present
            if ($request->hasFile('cover_image')) {
                $file = $request->file('cover_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images/EventCover'), $filename);
                $validated['cover_image'] = 'images/EventCover/' . $filename;
            }

            // Update the event
            $event->update($validated);

            Log::info('Event updated successfully', [
                'event_id' => $event->event_id,
                'updated_data' => $validated
            ]);

            return redirect()->route('events.my-events')
                ->with('message', 'Event updated successfully');

        } catch (\Exception $e) {
            Log::error('Event update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
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

    private function getEventStatus($event)
    {
        $today = Carbon::today();
        $eventDate = Carbon::parse($event->date);
        
        if ($eventDate->isPast()) {
            return 'Completed';
        } elseif ($eventDate->isToday()) {
            return 'Ongoing';
        } else {
            return 'Upcoming';
        }
    }
} 