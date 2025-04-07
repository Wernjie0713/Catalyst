<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;
use App\Models\Friend;

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
                $data = [
                    ...$event->toArray(),
                    'formatted_time' => Carbon::parse($event->time)->format('g:i A'),
                    'is_enrolled' => $event->enrollments->contains('user_id', $user->id),
                    'creator' => $event->creator,
                    'enrollments' => $event->enrollments
                ];
                
                // For team events, add the enrolled team information
                if ($event->is_team_event) {
                    $data['enrolled_team'] = $event->userEnrolledTeam();
                }
                
                return $data;
            });

        // Get IDs of existing friends (where status is 'accepted')
        $existingFriendIds = Friend::where(function($query) use ($user) {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('friend_id', $user->id);
            })
            ->where('status', 'accepted');
        })
        ->get()
        ->map(function($friend) use ($user) {
            return $friend->user_id == $user->id ? $friend->friend_id : $friend->user_id;
        })
        ->toArray();

        // Fetch other users for friend suggestions, excluding admins and existing friends
        $friendSuggestions = User::where('id', '!=', $user->id)
            ->whereNotIn('id', $existingFriendIds)
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'admin');
            })
            ->with(['roles', $role])
            ->inRandomOrder()
            ->take(3)
            ->get()
            ->map(function ($user) {
                $roleType = $user->roles()->first()?->name;
                $profilePhotoPath = null;
                
                if ($user->{$roleType} && $user->{$roleType}->profile_photo_path) {
                    $profilePhotoPath = $user->{$roleType}->profile_photo_path;
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'profile_picture' => $profilePhotoPath
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
                    }),
                    'notifications' => $user->notifications
                ]
            ],
            'currentRole' => $role,
            'stats' => $stats,
            'recentEvents' => $recentEvents,
            'friendSuggestions' => $friendSuggestions
        ]);
    }
} 