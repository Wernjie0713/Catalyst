<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = $user->roles()->first()?->name;

        $stats = [
            'totalEvents' => Event::count(),
            'upcomingEvents' => Event::where('date', '>', now())->count(),
            'myEvents' => Event::where('creator_id', $user->id)->count(),
            'enrolledEvents' => $user->enrolledEvents()->count(),
        ];

        $recentEvents = Event::with(['creator', 'enrollments'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($event) use ($user) {
                return [
                    ...$event->toArray(),
                    'formatted_time' => Carbon::parse($event->time)->format('g:i A'),
                    'is_enrolled' => $event->enrollments->contains('user_id', $user->id),
                    'creator' => $event->creator,
                    'enrollments' => $event->enrollments
                ];
            });

        return Inertia::render('Dashboard', [
            'abilities' => [
                'isStudent' => $user->isA('student'),
                'isLecturer' => $user->isA('lecturer'),
                'isUniversity' => $user->isA('university'),
                'isDepartment' => $user->isA('department_staff'),
                'isOrganizer' => $user->isA('organizer'),
            ],
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles()->get()->map(function($role) {
                        return [
                            'name' => $role->name,
                            'title' => $role->title
                        ];
                    })
                ]
            ],
            'currentRole' => $role,
            'stats' => $stats,
            'recentEvents' => $recentEvents
        ]);
    }
} 