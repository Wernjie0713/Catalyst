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
} 