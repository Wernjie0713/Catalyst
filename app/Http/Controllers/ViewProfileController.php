<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Silber\Bouncer\BouncerFacade as Bouncer;
use App\Models\User;
use App\Models\Friend;
use App\Models\Mentor;
use Inertia\Inertia;

class ViewProfileController extends Controller
{
    public function show($userId)
    {
        // Get the current auth user with student relationship for accurate role checking
        $authUser = User::with(['student', 'lecturer', 'roles'])->find(auth()->id());
        
        // Get the user first to determine their role
        $profileUser = User::with('roles')->findOrFail($userId);
        $role = $profileUser->roles->first();
        $roleType = $role ? $role->name : 'invalid';

        // Load the role relationship which includes profile_photo_path
        $profileUser = User::with(['roles', $roleType])->findOrFail($userId);

        // Get profile photo path directly
        $profilePhotoPath = null;
        if ($profileUser->{$roleType} && $profileUser->{$roleType}->profile_photo_path) {
            // Make sure the path is relative to public directory
            $profilePhotoPath = $profileUser->{$roleType}->profile_photo_path;
        }

        // Get friend request status
        $friendRequest = Friend::where(function($query) use ($userId) {
            $query->where('user_id', auth()->id())
                  ->where('friend_id', $userId);
        })->orWhere(function($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->where('friend_id', auth()->id());
        })->first();

        // Get mentor request status (for students viewing lecturers)
        $mentorRequest = null;
        if ($authUser->student && $roleType === 'lecturer') {
            $mentorRequest = Mentor::where('student_id', auth()->id())
                                  ->where('lecturer_id', $userId)
                                  ->first();
        }

        if (Bouncer::can('view_otherprofile')) {
            return Inertia::render('ViewProfile', [
                'profileUser' => $profileUser,
                'roleType' => $roleType,
                'roles' => $profileUser->roles->map(function($role) {
                    return [
                        'name' => $role->name,
                        'title' => $role->title
                    ];
                }),
                'profilePhotoPath' => $profilePhotoPath, // This should be like 'images/profile-photos/filename.jpg'
                'isStudent' => $roleType === 'student',
                'isLecturer' => $roleType === 'lecturer',
                'isOrganizer' => $roleType === 'organizer',
                'isUniversity' => $roleType === 'university',
                'isDepartmentStaff' => $roleType === 'department_staff',
                'friendStatus' => $friendRequest ? $friendRequest->status : null,
                'friendRequestId' => $friendRequest ? $friendRequest->id : null,
                'mentorStatus' => $mentorRequest ? $mentorRequest->status : null,
                'mentorRequestId' => $mentorRequest ? $mentorRequest->id : null,
                'auth' => [
                    'user' => $authUser // Pass the fully loaded auth user
                ]
            ]);
        }

        abort(403, 'Unauthorized action.');
    }
}
