<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use App\Models\User;
use App\Notifications\MentorRequestSentNotification;
use App\Notifications\MentorRequestAcceptedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MentorController extends Controller
{
    public function sendRequest(Request $request, $lecturerId)
    {
        try {
            // Add validation for the request
            $validated = $request->validate([
                'message' => 'nullable|string|max:500'
            ]);

            \Log::info('Mentor request attempt:', [
                'student_id' => auth()->id(),
                'lecturer_id' => $lecturerId,
                'message' => $request->message,
                'validated_message' => $validated['message'] ?? null,
                'request_all' => $request->all(),
                'user_role' => auth()->user()->roles->pluck('name'),
                'has_student_profile' => auth()->user()->student ? 'yes' : 'no'
            ]);

            // Check if user is a student
            if (!auth()->user()->student) {
                \Log::warning('Non-student tried to request mentor:', [
                    'user_id' => auth()->id(),
                    'roles' => auth()->user()->roles->pluck('name')
                ]);
                return back()->with('error', 'Only students can request mentors.');
            }

            // Check if there's an existing request
            $existingRequest = Mentor::where('student_id', auth()->id())
                                   ->where('lecturer_id', $lecturerId)
                                   ->first();

            \Log::info('Existing request check:', [
                'found_existing' => $existingRequest ? 'yes' : 'no',
                'existing_status' => $existingRequest?->status,
                'existing_id' => $existingRequest?->id
            ]);

            if ($existingRequest) {
                if ($existingRequest->status === 'rejected') {
                    // If rejected, allow new request
                    $existingRequest->update([
                        'status' => 'pending',
                        'message' => $validated['message']
                    ]);
                    \Log::info('Updated rejected request to pending:', [
                        'request_id' => $existingRequest->id,
                        'updated_message' => $validated['message']
                    ]);
                    
                    // Send notification to lecturer
                    $lecturer = User::find($lecturerId);
                    if ($lecturer) {
                        $lecturer->notify(new MentorRequestSentNotification(auth()->user(), $validated['message'] ?? ''));
                    }
                    
                    return back()->with('success', 'Mentor request sent!');
                } elseif ($existingRequest->status === 'pending') {
                    \Log::info('Request already pending:', [
                        'request_id' => $existingRequest->id
                    ]);
                    return back()->with('info', 'Mentor request already pending.');
                } elseif ($existingRequest->status === 'accepted') {
                    \Log::info('Already accepted mentor relationship:', [
                        'request_id' => $existingRequest->id
                    ]);
                    return back()->with('info', 'You are already mentored by this lecturer.');
                }
            }

            // Create new request if none exists
            $newRequest = Mentor::create([
                'student_id' => auth()->id(),
                'lecturer_id' => $lecturerId,
                'status' => 'pending',
                'message' => $validated['message']
            ]);

            \Log::info('New mentor request created:', [
                'request_id' => $newRequest->id,
                'student_id' => $newRequest->student_id,
                'lecturer_id' => $newRequest->lecturer_id,
                'status' => $newRequest->status,
                'message' => $newRequest->message,
                'message_length' => strlen($newRequest->message ?? ''),
                'created_at' => $newRequest->created_at
            ]);

            // Verify the request was saved correctly
            $verifyRequest = Mentor::find($newRequest->id);
            \Log::info('Verification of saved request:', [
                'found' => $verifyRequest ? 'yes' : 'no',
                'data' => $verifyRequest ? $verifyRequest->toArray() : null
            ]);

            // Send notification to lecturer
            $lecturer = User::find($lecturerId);
            if ($lecturer) {
                $lecturer->notify(new MentorRequestSentNotification(auth()->user(), $validated['message'] ?? ''));
            }

            return back()->with('success', 'Mentor request sent!');
        } catch (\Exception $e) {
            \Log::error('Mentor request failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'student_id' => auth()->id(),
                'lecturer_id' => $lecturerId,
                'request_data' => $request->all()
            ]);
            return back()->with('error', 'Unable to send mentor request.');
        }
    }

    public function acceptRequest($requestId)
    {
        try {
            $mentorRequest = Mentor::findOrFail($requestId);
            
            // Verify the current user is the lecturer
            if ($mentorRequest->lecturer_id !== auth()->id()) {
                return back()->with('error', 'Unauthorized action.');
            }

            $mentorRequest->update(['status' => 'accepted']);

            // Send notification to student
            $student = User::find($mentorRequest->student_id);
            if ($student) {
                $student->notify(new MentorRequestAcceptedNotification(auth()->user()));
            }

            return back()->with('success', 'Mentor request accepted!');
        } catch (\Exception $e) {
            return back()->with('error', 'Unable to accept mentor request.');
        }
    }

    public function rejectRequest($requestId)
    {
        try {
            $mentorRequest = Mentor::findOrFail($requestId);
            
            // Verify the current user is the lecturer
            if ($mentorRequest->lecturer_id !== auth()->id()) {
                return back()->with('error', 'Unauthorized action.');
            }

            $mentorRequest->update(['status' => 'rejected']);

            return back()->with('success', 'Mentor request rejected.');
        } catch (\Exception $e) {
            return back()->with('error', 'Unable to reject mentor request.');
        }
    }

    public function getPendingRequests()
    {
        \Log::info('Getting pending requests for lecturer:', [
            'lecturer_id' => auth()->id(),
            'user_role' => auth()->user()->roles->pluck('name'),
            'has_lecturer_profile' => auth()->user()->lecturer ? 'yes' : 'no'
        ]);

        // Get requests where current user is the lecturer
        $pendingRequests = Mentor::where('lecturer_id', auth()->id())
            ->where('status', 'pending')
            ->with(['student.student', 'lecturer.lecturer'])
            ->get();

        \Log::info('Retrieved pending requests:', [
            'count' => $pendingRequests->count(),
            'requests' => $pendingRequests->map(function($request) {
                return [
                    'id' => $request->id,
                    'student_id' => $request->student_id,
                    'lecturer_id' => $request->lecturer_id,
                    'status' => $request->status,
                    'message' => $request->message,
                    'created_at' => $request->created_at,
                    'student_name' => $request->student?->name,
                    'student_profile_loaded' => $request->student?->student ? 'yes' : 'no'
                ];
            })
        ]);

        // Also check all mentor records for this lecturer (for debugging)
        $allRequests = Mentor::where('lecturer_id', auth()->id())->get();
        \Log::info('All mentor records for this lecturer:', [
            'total_count' => $allRequests->count(),
            'by_status' => $allRequests->groupBy('status')->map->count(),
            'all_requests' => $allRequests->map(function($request) {
                return [
                    'id' => $request->id,
                    'student_id' => $request->student_id,
                    'status' => $request->status,
                    'created_at' => $request->created_at
                ];
            })
        ]);

        return response()->json($pendingRequests);
    }

    public function getMenteesDashboard()
    {
        if (!auth()->user()->lecturer) {
            return redirect()->route('dashboard')->with('error', 'Access denied.');
        }

        // Get accepted mentees
        $mentees = Mentor::where('lecturer_id', auth()->id())
            ->where('status', 'accepted')
            ->with(['student.student'])
            ->get();

        // Calculate stats
        $stats = [
            'total_mentees' => $mentees->count(),
            'active_mentees' => $mentees->count(), // For now, all accepted are considered active
            'total_requests' => Mentor::where('lecturer_id', auth()->id())->count(),
            'pending_requests' => Mentor::where('lecturer_id', auth()->id())->where('status', 'pending')->count(),
        ];

        // Get mentee details with additional info
        $menteeDetails = $mentees->map(function ($mentor) {
            $student = $mentor->student;
            
            // Count completed enrolled events for this student
            $completedEventsCount = DB::table('enrollments')
                ->join('events', 'enrollments.event_id', '=', 'events.event_id')
                ->where('enrollments.user_id', $student->id)
                ->where('events.status', 'Completed')
                ->count();
            
            // Count all projects for this student (as individual or team member)
            $projectsCount = DB::table('projects')
                ->where(function($query) use ($student) {
                    $query->where('student_id', $student->student->student_id ?? '')
                          ->orWhereExists(function($subQuery) use ($student) {
                              $subQuery->select(DB::raw(1))
                                       ->from('team_members')
                                       ->join('teams', 'team_members.team_id', '=', 'teams.id')
                                       ->whereColumn('teams.id', 'projects.team_id')
                                       ->where('team_members.user_id', $student->id)
                                       ->where('team_members.status', 'accepted');
                          });
                })
                ->count();
            
            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'student_id' => $student->student->matric_no ?? 'N/A',
                'contact' => $student->student->contact_number ?? 'N/A',
                'year' => $student->student->year ?? 'N/A',
                'faculty' => $student->student->faculty ?? 'N/A',
                'mentorship_started' => $mentor->updated_at->format('M d, Y'),
                'mentorship_duration' => $mentor->updated_at->diffForHumans(),
                'total_events_joined' => $completedEventsCount,
                'active_projects' => $projectsCount,
                'profile_url' => route('profile.view', $student->id),
            ];
        });

        return Inertia::render('Mentors/Dashboard', [
            'mentees' => $menteeDetails,
            'stats' => $stats,
        ]);
    }

    public function getLecturersList()
    {
        try {
            \Log::info('getLecturersList called by:', [
                'user_id' => auth()->id(),
                'user_role' => auth()->user()->roles->pluck('name'),
                'is_student' => auth()->user()->student ? 'yes' : 'no'
            ]);

            // Check if user is a student (using Bouncer)
            if (!auth()->user()->student) {
                \Log::warning('Non-student tried to access lecturers list:', [
                    'user_id' => auth()->id(),
                    'roles' => auth()->user()->roles->pluck('name'),
                    'has_student_profile' => auth()->user()->student ? 'yes' : 'no'
                ]);
                return response()->json(['error' => 'Only students can view lecturers list'], 403);
            }

            // Get all users who have the 'lecturer' role using Bouncer
            $lecturerUsers = User::whereHas('roles', function($query) {
                $query->where('name', 'lecturer');
            })->with(['lecturer'])->get();

            \Log::info('Found lecturer users:', [
                'count' => $lecturerUsers->count(),
                'user_ids' => $lecturerUsers->pluck('id'),
                'names' => $lecturerUsers->pluck('name')
            ]);

            $lecturers = $lecturerUsers->map(function ($user) {
                $lecturerProfile = $user->lecturer;
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'department' => $lecturerProfile->faculty ?? 'N/A', // Use faculty as department for display
                    'specialization' => $lecturerProfile->specialization ?? 'N/A',
                    'profile_photo_path' => $lecturerProfile->profile_photo_path ?? null,
                    'experience_years' => 0, // Not in database schema, set to 0
                    'university' => $lecturerProfile->university ?? 'N/A',
                    'bio' => $lecturerProfile->bio ?? '',
                    'linkedin' => $lecturerProfile->linkedin ?? '',
                    // Check if current student already has a request with this lecturer
                    'request_status' => $this->getRequestStatus(auth()->id(), $user->id),
                ];
            });

            \Log::info('Mapped lecturers data:', [
                'count' => $lecturers->count(),
                'sample_data' => $lecturers->take(2)->toArray()
            ]);

            return response()->json($lecturers);
        } catch (\Exception $e) {
            \Log::error('Error in getLecturersList:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Unable to fetch lecturers list'], 500);
        }
    }

    private function getRequestStatus($studentId, $lecturerId)
    {
        $mentor = Mentor::where('student_id', $studentId)
                       ->where('lecturer_id', $lecturerId)
                       ->first();

        return $mentor ? $mentor->status : null;
    }
} 