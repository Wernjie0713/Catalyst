<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use App\Notifications\TeamInvitationSentNotification;
use App\Notifications\TeamInvitationAcceptedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TeamController extends Controller
{
    /**
     * Get teams for a specific user (creator or accepted member).
     */
    public function userTeams(string $userId)
    {
        $teams = Team::with([
                'creator',
                'members' => function ($query) {
                    $query->where('status', 'accepted');
                },
                'members.user'
            ])
            ->where(function ($query) use ($userId) {
                $query->where('creator_id', $userId)
                      ->orWhereHas('members', function ($q) use ($userId) {
                          $q->where('user_id', $userId)
                            ->where('status', 'accepted');
                      });
            })
            ->get();

        return response()->json([
            'teams' => $teams
        ]);
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'members' => 'required|array|min:1',
                'members.*' => 'required|string|exists:users,id'
            ]);

            \Log::info('Validated data:', $validated);

            // Create team with initial member count of 1 (creator)
            $team = Team::create([
                'name' => $validated['name'],
                'creator_id' => auth()->id(),
                'member_count' => 1  // Start with creator
            ]);

            \Log::info('Team created:', ['team_id' => $team->id]);

            // Add creator as an accepted member first
            TeamMember::create([
                'team_id' => $team->id,
                'user_id' => auth()->id(),
                'status' => 'accepted'  // Creator is automatically accepted
            ]);

            // Add other members with pending status and send notifications
            foreach ($validated['members'] as $memberId) {
                // Skip if the member is the creator (since we already added them)
                if ($memberId != auth()->id()) {
                    TeamMember::create([
                        'team_id' => $team->id,
                        'user_id' => $memberId,
                        'status' => 'pending'
                    ]);

                    // Send notification to the invited member
                    $invitedUser = User::find($memberId);
                    if ($invitedUser) {
                        $invitedUser->notify(new TeamInvitationSentNotification(auth()->user(), $team));
                    }
                }
            }

            // Refresh team data with relationships
            $team->load(['creator', 'members.user']);
            
            // Update the member count to ensure accuracy
            $team->updateMemberCount();

            return response()->json([
                'success' => true,
                'team' => $team,
                'message' => 'Team created successfully!'
            ]);

        } catch (ValidationException $e) {
            \Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Team creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create team: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        // Get teams where user is creator or accepted member
        $teams = Team::with([
            'creator',
            'members' => function($query) {
                $query->where('status', 'accepted');
            },
            'members.user'
        ])
        ->where(function($query) {
            $query->where('creator_id', auth()->id())
                  ->orWhereHas('members', function($q) {
                      $q->where('user_id', auth()->id())
                        ->where('status', 'accepted');
                  });
        })
        ->get();

        // Get pending team invitations
        $pendingInvitations = TeamMember::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->with(['team.creator', 'team.members.user'])
            ->get();

        return response()->json([
            'teams' => $teams,
            'pendingInvitations' => $pendingInvitations
        ]);
    }

    public function getTeams()
    {
        // Get teams where user is creator or accepted member
        $teams = Team::where(function($query) {
            $query->where('creator_id', auth()->id())
            ->orWhereHas('members', function($q) {
                $q->where('user_id', auth()->id())
                  ->where('status', 'accepted');
            });
        })
        ->with(['creator', 'members.user'])
        ->get();

        // Get pending invitations
        $pendingInvitations = TeamMember::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->with(['team.creator', 'team.members.user'])
            ->get();

        // Add debug logging
        \Log::info('Team data:', [
            'teams_count' => $teams->count(),
            'pending_invitations_count' => $pendingInvitations->count(),
            'user_id' => auth()->id()
        ]);

        return Inertia::render('Friend/List', [
            'teams' => $teams,
            'pendingInvitations' => $pendingInvitations,
            'activeTab' => request()->get('tab', 'teams'),
            'can' => [
                'team_grouping' => auth()->user()->can('team_grouping')
            ]
        ]);
    }

    public function getFriendsList()
    {
        $friends = auth()->user()->getAllFriends()
            ->where('status', 'accepted')
            ->with(['user', 'friend'])
            ->get();

        // Return data using Inertia
        return Inertia::render('Friend/List', [
            'friends' => $friends
        ]);
    }

    public function addMember(Request $request)
    {
        try {
            $validated = $request->validate([
                'team_id' => 'required|exists:teams,id',
                'user_id' => 'required|exists:users,id'
            ]);

            $team = Team::findOrFail($validated['team_id']);
            
            // Check if user is already a member
            if ($team->members()->where('user_id', $validated['user_id'])->exists()) {
                return response()->json([
                    'message' => 'User is already a member of this team'
                ], 422);
            }

            // Check if current user is the team creator
            if ($team->creator_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Only team creator can add members'
                ], 403);
            }

            // Add member to team
            $team->members()->create([
                'user_id' => $validated['user_id'],
                'status' => 'pending'
            ]);

            // Send notification to the invited member
            $invitedUser = User::find($validated['user_id']);
            if ($invitedUser) {
                $invitedUser->notify(new TeamInvitationSentNotification(auth()->user(), $team));
            }

            // Update member count
            $team->updateMemberCount();

            return response()->json([
                'success' => true,
                'message' => 'Team invitation sent successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add member to team'
            ], 500);
        }
    }

    public function getAvailableTeams($userId)
    {
        \Log::info('Getting available teams', [
            'auth_user' => auth()->id(),
            'friend_id' => $userId
        ]);

        $teams = Team::where('creator_id', auth()->id())
            ->whereDoesntHave('members', function($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->get();

        \Log::info('Available teams found:', [
            'count' => $teams->count(),
            'teams' => $teams->toArray()
        ]);

        return response()->json($teams);
    }

    public function removeMember($teamId, $userId)
    {
        try {
            $team = Team::findOrFail($teamId);
            
            // Check if the authenticated user is the team creator
            if ($team->creator_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to remove team members'
                ], 403);
            }

            // Don't allow removing the team creator
            if ($userId === $team->creator_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot remove the team creator'
                ], 422);
            }

            // Remove the member
            $team->members()->where('user_id', $userId)->delete();
            
            // Update member count
            $team->updateMemberCount();

            return response()->json([
                'success' => true,
                'message' => 'Member removed successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove member: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Team $team)
    {
        // Check if the authenticated user is the team creator
        if ($team->creator_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized to delete this team'
            ], 403);
        }

        // Delete all team members first
        $team->members()->delete();
        
        // Delete the team
        $team->delete();

        return response()->json([
            'message' => 'Team deleted successfully'
        ]);
    }

    // Add new methods for handling team invitations
    public function acceptTeamInvitation($teamId)
    {
        try {
            $teamMember = TeamMember::where('team_id', $teamId)
                ->where('user_id', auth()->id())
                ->where('status', 'pending')
                ->firstOrFail();

            $teamMember->update(['status' => 'accepted']);
            
            // Get team and send notification to team creator
            $team = $teamMember->team;
            $teamCreator = $team->creator;
            if ($teamCreator) {
                $teamCreator->notify(new TeamInvitationAcceptedNotification(auth()->user(), $team));
            }
            
            // Update member count
            $team->updateMemberCount();

            return response()->json([
                'success' => true,
                'message' => 'Team invitation accepted'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept invitation'
            ], 500);
        }
    }

    public function rejectTeamInvitation($teamId)
    {
        try {
            $teamMember = TeamMember::where('team_id', $teamId)
                ->where('user_id', auth()->id())
                ->where('status', 'pending')
                ->firstOrFail();

            $teamMember->delete();

            return response()->json([
                'success' => true,
                'message' => 'Team invitation rejected'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject invitation'
            ], 500);
        }
    }

    public function getPendingInvitations()
    {
        $pendingInvitations = TeamMember::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->with(['team.creator', 'team.members.user'])
            ->get();

        return Inertia::render('Friend/List', [
            'teams' => [], // Empty array since we're showing invitations
            'pendingInvitations' => $pendingInvitations,
            'activeTab' => 'teams', // Keep teams tab active
            'can' => [
                'team_grouping' => auth()->user()->can('team_grouping')
            ]
        ]);
    }

    // Add this method to get available friends for a team
    public function getAvailableFriends($teamId)
    {
        try {
            $team = Team::findOrFail($teamId);
            
            // Get IDs of users already in the team
            $existingMemberIds = $team->members()->pluck('user_id')->toArray();
            
            // Get current user's accepted friends
            $friends = auth()->user()->getAllFriends()->get();
            
            \Log::info('Found friends:', ['count' => $friends->count()]);

            $availableFriends = collect();

            foreach ($friends as $friendship) {
                // Determine which user is the friend
                $friendUser = $friendship->user_id === auth()->id() 
                    ? $friendship->friend 
                    : $friendship->user;
                
                // Only add if not already in team
                if (!in_array($friendUser->id, $existingMemberIds)) {
                    $availableFriends->push([
                        'id' => $friendUser->id,
                        'name' => $friendUser->name,
                        'email' => $friendUser->email
                    ]);
                }
            }

            \Log::info('Available friends:', [
                'count' => $availableFriends->count(),
                'friends' => $availableFriends->toArray()
            ]);

            return response()->json($availableFriends);
            
        } catch (\Exception $e) {
            \Log::error('Error in getAvailableFriends:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to get available friends: ' . $e->getMessage()
            ], 500);
        }
    }
} 