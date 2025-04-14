<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Team;
use App\Models\Enrollment;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use App\Notifications\EventReminderNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class EnrollmentController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if (!Gate::allows('event_enroll')) {
            abort(403);
        }

        $user = auth()->user();

        // Check if this is a team enrollment
        if ($event->is_team_event) {
            return $this->handleTeamEnrollment($request, $event, $user);
        } else {
            return $this->handleIndividualEnrollment($event, $user);
        }
    }

    private function handleIndividualEnrollment(Event $event, $user)
    {
        // Check if user is already enrolled
        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('event_id', $event->event_id)
            ->whereNull('team_id')
            ->first();

        if ($existingEnrollment) {
            return back()->with('error', 'You are already enrolled in this event.');
        }

        // Check if user is already part of a team enrolled in this event
        $teamEnrollment = Enrollment::where('event_id', $event->event_id)
            ->whereNotNull('team_id')
            ->whereHas('team.members', function($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('status', 'accepted');
            })
            ->first();

        if ($teamEnrollment) {
            return back()->with('error', 'You are already enrolled in this event as part of a team.');
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

        // Send notification
        $this->sendEnrollmentNotification($user, $event);

        return back()->with('success', 'Successfully enrolled in the event.');
    }

    private function handleTeamEnrollment(Request $request, Event $event, $user)
    {
        // Validate request to get team_id
        $request->validate([
            'team_id' => 'required|exists:teams,id',
        ]);

        $teamId = $request->team_id;
        $team = Team::findOrFail($teamId);

        // Check if user is the team creator/leader
        if ($team->creator_id !== $user->id) {
            return back()->with('error', 'Only team leaders can enroll their team in events.');
        }

        // Check if team is already enrolled
        $existingTeamEnrollment = Enrollment::where('team_id', $teamId)
            ->where('event_id', $event->event_id)
            ->first();

        if ($existingTeamEnrollment) {
            return back()->with('error', 'This team is already enrolled in the event.');
        }

        // Get accepted team members
        $teamMembers = TeamMember::where('team_id', $teamId)
            ->where('status', 'accepted')
            ->get();

        // Check team size requirements
        $teamSize = $teamMembers->count();
        if ($event->min_team_members && $teamSize < $event->min_team_members) {
            return back()->with('error', "Your team needs at least {$event->min_team_members} members to enroll.");
        }

        if ($event->max_team_members && $teamSize > $event->max_team_members) {
            return back()->with('error', "Your team exceeds the maximum of {$event->max_team_members} members for this event.");
        }

        // Check if event is full (for team events, count teams not individuals)
        $enrolledTeamsCount = $event->enrolledTeams()->count();
        if ($event->max_participants && $enrolledTeamsCount >= $event->max_participants) {
            return back()->with('error', 'This event has reached the maximum number of teams.');
        }

        // Create team enrollment (one entry for each team member)
        DB::beginTransaction();
        try {
            foreach ($teamMembers as $member) {
                $enrollment = new Enrollment();
                $enrollment->enrollment_id = Str::uuid();
                $enrollment->user_id = $member->user_id;
                $enrollment->event_id = $event->event_id;
                $enrollment->team_id = $teamId;
                $enrollment->save();

                // Send notification to each team member
                $this->sendEnrollmentNotification($member->user, $event, $team);
            }
            DB::commit();
            return back()->with('success', 'Successfully enrolled your team in the event.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to enroll team. Please try again.');
        }
    }

    private function sendEnrollmentNotification($user, $event, $team = null)
    {
        try {  
            $notification = new EventReminderNotification($event, $team);
            $user->notify($notification);
        } catch (\Exception $e) {
            report($e);
        }
    }

    public function destroy(Event $event)
    {
        if (!Gate::allows('event_enroll')) {
            abort(403);
        }

        $user = auth()->user();

        // Check if the event is a team event and user is enrolled as part of a team
        if ($event->is_team_event) {
            return $this->handleTeamUnenrollment($event, $user);
        } else {
            return $this->handleIndividualUnenrollment($event, $user);
        }
    }

    private function handleIndividualUnenrollment(Event $event, $user)
    {
        // Find the enrollment
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('event_id', $event->event_id)
            ->whereNull('team_id')
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

    private function handleTeamUnenrollment(Event $event, $user)
    {
        // Check if the user is enrolled as part of a team
        $enrollment = Enrollment::where('event_id', $event->event_id)
            ->whereNotNull('team_id')
            ->where('user_id', $user->id)
            ->first();

        if (!$enrollment) {
            return back()->with('error', 'You are not enrolled in this event as part of a team.');
        }

        $teamId = $enrollment->team_id;
        $team = Team::find($teamId);

        // Check if the user is the team leader - only team leader can unenroll the team
        if ($team->creator_id !== $user->id) {
            // Get team leader info
            $teamLeader = User::find($team->creator_id);
            $leaderName = $teamLeader ? $teamLeader->name : 'team leader';
            
            return back()->with('error', "Only the team leader can unenroll the team from this event. Please contact {$leaderName} to unenroll your team.");
        }

        // Check if the event is already ongoing or completed
        if ($event->status !== 'Upcoming') {
            return back()->with('error', 'Cannot unenroll from an ongoing or completed event.');
        }

        // Delete all enrollments for this team and event
        Enrollment::where('team_id', $teamId)
            ->where('event_id', $event->event_id)
            ->delete();

        return back()->with('success', 'Successfully unenrolled your team from the event.');
    }

    // Method to get available teams for event enrollment
    public function getAvailableTeams(Event $event)
    {
        $user = auth()->user();
        
        // Get teams where user is the leader/creator
        $teams = Team::where('creator_id', $user->id)
            ->withCount(['members' => function($query) {
                $query->where('status', 'accepted');
            }])
            ->with('members.user')
            ->whereDoesntHave('enrollments', function($query) use ($event) {
                $query->where('event_id', $event->event_id);
            })
            ->get()
            ->filter(function($team) use ($event) {
                // Only return teams that meet size requirements
                $teamSize = $team->members_count;
                $meetsMinRequirement = !$event->min_team_members || $teamSize >= $event->min_team_members;
                $meetsMaxRequirement = !$event->max_team_members || $teamSize <= $event->max_team_members;
                
                return $meetsMinRequirement && $meetsMaxRequirement;
            })
            ->values();
            
        return response()->json($teams);
    }
} 