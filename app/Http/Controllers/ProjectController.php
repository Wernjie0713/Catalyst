<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectUpdate;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Silber\Bouncer\BouncerFacade as Bouncer;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['team', 'student', 'supervisor'])
            ->when(Auth::user()->isA('student'), function ($query) {
                return $query->where('student_id', Auth::user()->student->student_id)
                    ->orWhereHas('team', function ($q) {
                        $q->whereHas('members', function ($q) {
                            $q->where('user_id', Auth::id());
                        });
                    });
            })
            ->when(Auth::user()->isA('lecturer'), function ($query) {
                return $query->where('supervisor_id', Auth::id());
            })
            ->latest()
            ->get();
            
        // Ensure all projects have proper progress values
        foreach ($projects as $project) {
            // Update projects that might have progress inconsistencies
            if ($project->status === 'completed' && $project->progress_percentage !== 100) {
                $project->progress_percentage = 100;
                $project->save();
            }
            
            if ($project->status === 'completed' && !$project->actual_end_date) {
                $project->actual_end_date = now();
                $project->save();
            }
        }

        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function create()
    {
        try {
            $teams = [];
            if (Auth::user()->isA('student')) {
                // Get teams where the user is the creator (leader)
                $teams = \App\Models\Team::where('creator_id', Auth::id())
                    ->with('members')
                    ->get()
                    ->map(function ($team) {
                        return [
                            'id' => $team->id,
                            'name' => $team->name,
                            'member_count' => $team->member_count
                        ];
                    });

                \Log::info('Retrieved teams for user:', [
                    'user_id' => Auth::id(),
                    'teams_count' => $teams->count(),
                    'teams' => $teams
                ]);
            }

            $supervisors = User::whereHas('roles', function ($query) {
                $query->where('name', 'lecturer');
            })->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name
                ];
            });

            return Inertia::render('Projects/Create', [
                'teams' => $teams,
                'supervisors' => $supervisors,
                'isTeamLeader' => $teams->isNotEmpty() // Add this flag to indicate if user is a team leader
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in create method:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to load project creation form. Please try again.');
        }
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Incoming request data:', $request->all());
            
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'type' => 'required|in:individual,team',
                'priority' => 'required|in:low,medium,high,critical',
                'start_date' => 'required|date',
                'expected_end_date' => 'required|date|after:start_date',
                'team_id' => 'nullable|required_if:type,team|exists:teams,id',
                'supervisor_id' => 'required|exists:users,id',
            ]);

            \Log::info('Validation passed, validated data:', $validated);

            $student = Student::where('user_id', Auth::id())->first();
            \Log::info('Student lookup result:', ['student' => $student ? $student->toArray() : null]);
            
            if (!$student) {
                \Log::error('Student profile not found for user:', ['user_id' => Auth::id()]);
                return back()->with('error', 'Student profile not found. Please contact administrator.');
            }

            \Log::info('About to create project with data:', [
                'title' => $validated['title'],
                'type' => $validated['type'],
                'student_id' => $student->student_id,
                'supervisor_id' => $validated['supervisor_id']
            ]);

            $project = Project::create([
                'id' => Str::uuid(),
                'title' => $validated['title'],
                'description' => $validated['description'],
                'type' => $validated['type'],
                'priority' => $validated['priority'],
                'start_date' => $validated['start_date'],
                'expected_end_date' => $validated['expected_end_date'],
                'team_id' => $validated['type'] === 'team' ? $validated['team_id'] : null,
                'supervisor_id' => $validated['supervisor_id'],
                'student_id' => $student->student_id,
                'status' => 'planning',
                'progress_percentage' => 0,
            ]);

            \Log::info('Project created successfully:', ['project' => $project->toArray()]);

            return redirect()->route('projects.show', $project)
                ->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            \Log::error('Project creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return back()->with('error', 'Failed to create project. Please try again.');
        }
    }

    public function show(Project $project)
    {
        // Load the project with its relationships including team members for team projects
        if ($project->type === 'team' && $project->team) {
            $project->load(['team.members.user', 'student.user', 'supervisor', 'updates.updatedBy']);
        } else {
            $project->load(['team', 'student.user', 'supervisor', 'updates.updatedBy']);
        }
        
        // Fix any missing updatedBy relationships by adding a user_name attribute
        foreach ($project->updates as $update) {
            // Make sure we have a user name for each update
            if (!$update->updatedBy || !$update->updatedBy->name) {
                // Try to find the user directly
                $user = \App\Models\User::find($update->updated_by);
                if ($user) {
                    // Set a dynamic attribute for the name
                    $update->user_name = $user->name;
                    \Log::info('Added missing user name for update:', [
                        'update_id' => $update->id,
                        'updated_by' => $update->updated_by,
                        'user_name' => $update->user_name
                    ]);
                } else {
                    // Set a fallback name if user not found
                    $update->user_name = 'Unknown User';
                    \Log::warning('User not found for update:', [
                        'update_id' => $update->id,
                        'updated_by' => $update->updated_by
                    ]);
                }
            } else {
                // Ensure the user_name attribute is always set
                $update->user_name = $update->updatedBy->name;
            }
        }
        
        // Ensure completed projects always have an actual_end_date
        if (($project->status === 'completed' || $project->progress_percentage === 100) && !$project->actual_end_date) {
            $project->actual_end_date = now();
            $project->status = 'completed';
            $project->save();
            
            \Log::info('Fixed missing actual_end_date for completed project:', [
                'project_id' => $project->id,
                'actual_end_date' => $project->actual_end_date
            ]);
        }
        
        // Fetch unresolved resources
        $unresolvedResources = collect();
        foreach ($project->updates as $update) {
            if ($update->resources_needed) {
                $resources = explode(',', $update->resources_needed);
                $acceptedResources = explode(',', $update->accepted_resources ?? '');
                $unresolvedResources = $unresolvedResources->concat(array_diff($resources, $acceptedResources));
            }
        }
        
        return Inertia::render('Projects/Show', [
            'project' => $project,
            'unresolvedResources' => $unresolvedResources->unique()->values()
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:planning,in_progress,completed,on_hold',
            'priority' => 'sometimes|required|in:low,medium,high,critical',
            'expected_end_date' => 'sometimes|required|date|after:start_date',
            'actual_end_date' => 'nullable|date|after:start_date',
        ]);

        $project->update($validated);

        return back()->with('success', 'Project updated successfully.');
    }

    public function addUpdate(Request $request, $id)
    {
        try {
            // Log incoming request data
            \Log::info('Incoming update request data:', $request->all());
            
            // Validate request
            $request->validate([
                'progress_description' => 'required|string',
                'progress_percentage' => 'required|integer|min:0|max:100',
                'milestones_completed' => 'nullable|string',
                'challenges_faced' => 'nullable|string',
                'resources_needed' => 'nullable|string',
                'accepted_resources' => 'nullable|string',
            ]);
            
            \Log::info('Validation passed, creating project update');
            
            // Get current user
            $user = auth()->user();
            \Log::info('Current authenticated user:', ['user_id' => $user->id, 'user_name' => $user->name]);
            
            // Find project
            $project = Project::findOrFail($id);
            
            // Handle milestones, challenges, and resources
            $milestonesCompleted = $request->input('milestones_completed', '');
            $challengesFaced = $request->input('challenges_faced', '');
            $resourcesNeeded = $request->input('resources_needed', '');
            
            // Handle accepted resources
            $acceptedResources = $request->input('accepted_resources', '');
            
            \Log::info('Accepted resources:', ['accepted_resources' => $acceptedResources]);
            
            // Create the project update record
            $update = new ProjectUpdate([
                'id' => Str::uuid(),
                'updated_by' => $user->id,
                'project_id' => $project->id,
                'progress_description' => $request->progress_description,
                'progress_percentage' => $request->progress_percentage,
                'milestones_completed' => $milestonesCompleted,
                'challenges_faced' => $challengesFaced,
                'resources_needed' => $resourcesNeeded,
                'accepted_resources' => $acceptedResources,
            ]);
            
            $update->save();
            
            \Log::info('Created project update with user:', ['update_id' => $update->id, 'user_id' => $user->id]);
            
            // Update project progress and status
            $previousStatus = $project->status;
            $project->progress_percentage = $request->progress_percentage;
            $project->status = $this->determineProjectStatus($request->progress_percentage, $previousStatus);
            
            \Log::info('Determining project status:', [
                'progress_percentage' => $request->progress_percentage,
                'previous_status' => $previousStatus,
                'new_status' => $project->status
            ]);
            
            // If project is completed, set the actual end date
            if ($project->status === 'completed' && $previousStatus !== 'completed') {
                $project->actual_end_date = now();
            }
            
            $project->save();
            
            \Log::info('Project progress updated:', [
                'progress_percentage' => $project->progress_percentage,
                'status' => $project->status
            ]);
            
            \Log::info('Project update created successfully:', ['update_id' => $update->id]);
            
            return redirect()->back()->with('success', 'Project update added successfully.');
        } catch (\Exception $e) {
            \Log::error('Failed to add project update:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Failed to add project update. ' . $e->getMessage());
        }
    }

    private function determineProjectStatus($progressPercentage, $previousStatus)
    {
        if ($progressPercentage == 0) {
            return 'planning';
        } elseif ($progressPercentage == 100) {
            return 'completed';
        } else {
            return $previousStatus === 'completed' ? 'completed' : 'in_progress';
        }
    }

    public function lecturerDashboard()
    {
        if (!Auth::user()->isA('lecturer')) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access.');
        }

        $supervisedProjects = Project::with(['team', 'student.user', 'updates'])
            ->where('supervisor_id', Auth::id())
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'student_name' => $project->student->user->name ?? 'N/A',
                    'type' => $project->type,
                    'status' => $project->status,
                    'progress' => $project->progress_percentage,
                    'last_update' => $project->updates->last()?->created_at?->diffForHumans() ?? 'No updates',
                    'days_remaining' => now()->diffInDays($project->expected_end_date, false),
                    'is_overdue' => now()->gt($project->expected_end_date) && $project->status !== 'completed',
                    'team_name' => $project->team?->name ?? 'Individual Project'
                ];
            });

        $projectStats = [
            'total' => $supervisedProjects->count(),
            'completed' => $supervisedProjects->where('status', 'completed')->count(),
            'in_progress' => $supervisedProjects->where('status', 'in_progress')->count(),
            'planning' => $supervisedProjects->where('status', 'planning')->count(),
            'on_hold' => $supervisedProjects->where('status', 'on_hold')->count(),
            'overdue' => $supervisedProjects->where('is_overdue', true)->count(),
        ];

        return Inertia::render('Projects/LecturerDashboard', [
            'projects' => $supervisedProjects,
            'stats' => $projectStats
        ]);
    }

    public function projectAnalytics($id)
    {
        if (!Auth::user()->isA('lecturer')) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access.');
        }

        $project = Project::with(['updates', 'student.user', 'team.members.user'])
            ->where('supervisor_id', Auth::id())
            ->findOrFail($id);

        $analytics = [
            'update_frequency' => $this->calculateUpdateFrequency($project),
            'progress_timeline' => $this->getProgressTimeline($project),
            'common_challenges' => $this->analyzeCommonChallenges($project),
            'resource_requests' => $this->analyzeResourceRequests($project),
        ];

        return Inertia::render('Projects/Analytics', [
            'project' => $project,
            'analytics' => $analytics
        ]);
    }

    private function calculateUpdateFrequency($project)
    {
        $updates = $project->updates;
        if ($updates->isEmpty()) {
            return ['average_days' => 0, 'last_update' => null];
        }

        $updateDates = $updates->pluck('created_at')->sort();
        $daysBetweenUpdates = [];

        for ($i = 1; $i < $updateDates->count(); $i++) {
            $daysBetweenUpdates[] = $updateDates[$i]->diffInDays($updateDates[$i-1]);
        }

        return [
            'average_days' => count($daysBetweenUpdates) > 0 ? array_sum($daysBetweenUpdates) / count($daysBetweenUpdates) : 0,
            'last_update' => $updateDates->last()->diffForHumans()
        ];
    }

    private function getProgressTimeline($project)
    {
        return $project->updates()
            ->orderBy('created_at')
            ->get()
            ->map(function ($update) {
                return [
                    'date' => $update->created_at->format('Y-m-d'),
                    'progress' => $update->progress_percentage,
                    'description' => $update->progress_description
                ];
            });
    }

    private function analyzeCommonChallenges($project)
    {
        $allChallenges = collect();
        
        foreach ($project->updates as $update) {
            if ($update->challenges_faced) {
                $challenges = explode(',', $update->challenges_faced);
                $allChallenges = $allChallenges->concat($challenges);
            }
        }

        return $allChallenges
            ->map(fn($challenge) => trim($challenge))
            ->filter()
            ->countBy()
            ->sortDesc()
            ->take(5);
    }

    private function analyzeResourceRequests($project)
    {
        $allResources = collect();
        
        foreach ($project->updates as $update) {
            if ($update->resources_needed) {
                $resources = explode(',', $update->resources_needed);
                $allResources = $allResources->concat($resources);
            }
        }

        return $allResources
            ->map(fn($resource) => trim($resource))
            ->filter()
            ->countBy()
            ->sortDesc();
    }
} 