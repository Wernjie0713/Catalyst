<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\User;
use App\Notifications\FriendRequestSentNotification;
use App\Notifications\FriendRequestAcceptedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Models\TeamMember;

class FriendController extends Controller
{
    public function sendRequest($userId)
    {
        try {
            // Check if there's an existing request that was rejected
            $existingRequest = Friend::where(function($query) use ($userId) {
                $query->where('user_id', auth()->id())
                      ->where('friend_id', $userId);
            })->first();

            if ($existingRequest) {
                if ($existingRequest->status === 'rejected') {
                    // If rejected, allow new request
                    $existingRequest->update(['status' => 'pending']);
                    
                    // Send notification to the friend
                    $friend = User::find($userId);
                    if ($friend) {
                        $friend->notify(new FriendRequestSentNotification(auth()->user()));
                    }
                    
                    return back()->with('success', 'Friend request sent!');
                } elseif ($existingRequest->status === 'pending') {
                    return back()->with('info', 'Friend request already pending.');
                }
            }

            // Create new request if none exists
            Friend::create([
                'user_id' => auth()->id(),
                'friend_id' => $userId,
                'status' => 'pending'
            ]);

            // Send notification to the friend
            $friend = User::find($userId);
            if ($friend) {
                $friend->notify(new FriendRequestSentNotification(auth()->user()));
            }

            return back()->with('success', 'Friend request sent!');
        } catch (\Exception $e) {
            return back()->with('error', 'Unable to send friend request.');
        }
    }

    public function acceptRequest($requestId)
    {
        try {
            $friend = Friend::findOrFail($requestId);
            
            // Verify the current user is the recipient of the request
            if ($friend->friend_id !== auth()->id()) {
                return back()->with('error', 'Unauthorized action.');
            }

            $friend->update(['status' => 'accepted']);

            // Send notification to the requester
            $requester = User::find($friend->user_id);
            if ($requester) {
                $requester->notify(new FriendRequestAcceptedNotification(auth()->user()));
            }

            return back()->with('success', 'Friend request accepted!');
        } catch (\Exception $e) {
            return back()->with('error', 'Unable to accept friend request.');
        }
    }

    public function rejectRequest($requestId)
    {
        try {
            $friend = Friend::findOrFail($requestId);
            
            // Verify the current user is the recipient of the request
            if ($friend->friend_id !== auth()->id()) {
                return back()->with('error', 'Unauthorized action.');
            }

            $friend->update(['status' => 'rejected']);

            return back()->with('success', 'Friend request rejected.');
        } catch (\Exception $e) {
            return back()->with('error', 'Unable to reject friend request.');
        }
    }

    public function getFriendsList()
    {
        if (!Gate::allows('team_grouping')) {
            return Inertia::render('Unauthorized', [
                'message' => 'You are not authorized to access Team Grouping.'
            ]);
        }

        $friends = Friend::where('user_id', auth()->id())
            ->orWhere('friend_id', auth()->id())
            ->with(['user.student', 'user.lecturer', 'user.department_staff', 'user.organizer',
                    'friend.student', 'friend.lecturer', 'friend.department_staff', 'friend.organizer'])
            ->get();

        // Friend suggestions (moved from Dashboard)
        $authUser = auth()->user();
        $role = $authUser->roles()->first()?->name;

        $friendSuggestions = collect();
        if ($role === 'student') {
            $existingFriendIds = Friend::where(function($query) use ($authUser) {
                $query->where(function($q) use ($authUser) {
                    $q->where('user_id', $authUser->id)
                      ->orWhere('friend_id', $authUser->id);
                })
                ->where('status', 'accepted');
            })
            ->get()
            ->map(function($friend) use ($authUser) {
                return $friend->user_id == $authUser->id ? $friend->friend_id : $friend->user_id;
            })
            ->toArray();

            $friendSuggestions = User::where('id', '!=', $authUser->id)
                ->whereNotIn('id', $existingFriendIds)
                ->whereHas('roles', function ($query) {
                    $query->where('name', 'student');
                })
                ->with(['roles', 'student'])
                ->inRandomOrder()
                ->take(3)
                ->get()
                ->map(function ($user) {
                    $profilePhotoPath = null;
                    if ($user->student && $user->student->profile_photo_path) {
                        $profilePhotoPath = $user->student->profile_photo_path;
                    }
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'profile_picture' => $profilePhotoPath
                    ];
                });
        }

        return Inertia::render('Friend/list', [
            'friends' => $friends,
            'friendSuggestions' => $friendSuggestions,
            'userRelations' => [
                'isStudent' => auth()->user()->student !== null,
                'isLecturer' => auth()->user()->lecturer !== null,
            ],
            'can' => [
                'team_grouping' => Gate::allows('team_grouping')
            ]
        ]);
    }

    public function getPendingRequests()
    {
        // Only get requests where current user is the recipient (friend_id)
        $pendingRequests = Friend::where('friend_id', auth()->id())
            ->where('status', 'pending')
            ->with(['user', 'friend'])
            ->get();

        return response()->json($pendingRequests);
    }
}
