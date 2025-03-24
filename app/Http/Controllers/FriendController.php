<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                    return redirect()->back()->with('success', 'Friend request sent!');
                } elseif ($existingRequest->status === 'pending') {
                    return redirect()->back()->with('info', 'Friend request already pending.');
                }
            }

            // Create new request if none exists
            Friend::create([
                'user_id' => auth()->id(),
                'friend_id' => $userId,
                'status' => 'pending'
            ]);

            return redirect()->back()->with('success', 'Friend request sent!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Unable to send friend request.');
        }
    }

    public function acceptRequest($requestId)
    {
        try {
            $friend = Friend::findOrFail($requestId);
            
            // Verify the current user is the recipient of the request
            if ($friend->friend_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Unauthorized action.');
            }

            $friend->update(['status' => 'accepted']);

            return redirect()->back()->with('success', 'Friend request accepted!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Unable to accept friend request.');
        }
    }

    public function rejectRequest($requestId)
    {
        try {
            $friend = Friend::findOrFail($requestId);
            
            // Verify the current user is the recipient of the request
            if ($friend->friend_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Unauthorized action.');
            }

            $friend->update(['status' => 'rejected']);

            return redirect()->back()->with('success', 'Friend request rejected.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Unable to reject friend request.');
        }
    }

    public function getFriendsList()
    {
        $friends = Friend::where('user_id', auth()->id())
            ->orWhere('friend_id', auth()->id())
            ->with(['user.student', 'user.lecturer', 'user.department_staff', 'user.organizer',
                    'friend.student', 'friend.lecturer', 'friend.department_staff', 'friend.organizer'])
            ->get();

        return Inertia::render('Friend/list', [
            'friends' => $friends
        ]);
    }

    public function getPendingRequests()
    {
        $pendingRequests = Friend::where('friend_id', auth()->id())
            ->where('status', 'pending')
            ->with('user')
            ->get();

        return Inertia::render('Friend/PendingRequests', [
            'pendingRequests' => $pendingRequests
        ]);
    }
}
