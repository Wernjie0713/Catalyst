<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\CertificateTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CertificateTemplateController extends Controller
{
    public function create(Request $request, Event $event)
    {
        // Get selected users from the query parameters for winner certificates
        $selectedUserIds = $request->query('users', []);
        // Get selected teams from the query parameters for team winner certificates
        $selectedTeamIds = $request->query('teams', []);
        
        // Fix for the JSON string issue
        if (is_string($selectedUserIds) && !is_numeric($selectedUserIds) && !empty($selectedUserIds)) {
            // If it's a JSON string, decode it
            $selectedUserIds = json_decode($selectedUserIds, true);
            
            // If decoding failed or result is not an array, make it an empty array
            if (!is_array($selectedUserIds)) {
                $selectedUserIds = [];
            }
        }

        // Same for teams
        if (is_string($selectedTeamIds) && !is_numeric($selectedTeamIds) && !empty($selectedTeamIds)) {
            $selectedTeamIds = json_decode($selectedTeamIds, true);
            if (!is_array($selectedTeamIds)) {
                $selectedTeamIds = [];
            }
        }
        
        // Now use the properly formatted arrays with whereIn
        $selectedUsers = collect([]);
        $selectedTeams = collect([]);

        // For individual events or if user IDs are provided
        if (!$event->is_team_event && !empty($selectedUserIds)) {
            $selectedUsers = $event->enrolledUsers()
                ->whereIn('users.id', $selectedUserIds)
                ->get();
        }
        
        // For team events, get teams data
        if ($event->is_team_event && !empty($selectedTeamIds)) {
            $selectedTeams = $event->enrolledTeams()
                ->whereIn('teams.id', $selectedTeamIds)
                ->with(['members.user'])
                ->get()
                ->map(function ($team) {
                    return [
                        'id' => $team->id,
                        'name' => $team->name,
                        'member_count' => $team->members->count(),
                        'members' => $team->members->map(function ($member) {
                            return [
                                'id' => $member->user->id,
                                'name' => $member->user->name
                            ];
                        })
                    ];
                });
        }
        
        // Check if this is a participation certificate request
        $isParticipationCertificate = $request->has('participationCertificate');
        
        return Inertia::render('Certificates/TemplateBuilder', [
            'event' => $event,
            'selectedUsers' => $selectedUsers,
            'selectedTeams' => $selectedTeams,
            'isParticipationCertificate' => $isParticipationCertificate,
            'isTeamEvent' => $event->is_team_event
        ]);
    }

    public function store(Request $request, Event $event)
    {
        // Determine validation rules based on event type and certificate type
        $validationRules = [
            'title' => 'required|string|max:255',
            'body_text' => 'nullable|string',
            'signature_image' => 'nullable|image|max:2048',
            'is_participant_template' => 'required|boolean',
            'layout_settings' => 'required|array',
        ];
        
        // Add conditional validation for selected users or teams
        if (!$request->boolean('is_participant_template')) {
            if ($event->is_team_event) {
                // For team events, require selected_teams
                $validationRules['selected_teams'] = 'required|array';
            } else {
                // For individual events, require selected_users
                $validationRules['selected_users'] = 'required|array';
            }
        }

        $validated = $request->validate($validationRules);

        // Use the direct public path instead of storage path
        $backgroundImagePath = 'images/Certificate.png';

        // Handle signature image upload
        if ($request->hasFile('signature_image')) {
            $signatureImage = $request->file('signature_image');
            $signatureFileName = 'signature_' . time() . '.' . $signatureImage->getClientOriginalExtension();
            $signatureImage->move(public_path('images/certificate'), $signatureFileName);
            $validated['signature_image'] = 'images/certificate/' . $signatureFileName;
        }

        // Create certificate template
        $template = $event->certificateTemplates()->create([
            'title' => $validated['title'],
            'body_text' => $validated['body_text'],
            'background_image' => $backgroundImagePath,
            'signature_image' => $validated['signature_image'] ?? null,
            'is_participant_template' => $validated['is_participant_template'],
            'layout_settings' => $validated['layout_settings'],
        ]);

        // If it's a team event for winner certificates, pass teams instead of users
        $selectedUserIds = [];
        $selectedTeamIds = [];
        
        if (!$validated['is_participant_template']) {
            if ($event->is_team_event && isset($validated['selected_teams'])) {
                $selectedTeamIds = $validated['selected_teams'];
            } else if (!$event->is_team_event && isset($validated['selected_users'])) {
                $selectedUserIds = $validated['selected_users'];
            }
        }

        // Generate certificates
        app(CertificateController::class)->generateCertificates(
            $event, 
            $template, 
            $selectedUserIds,
            $selectedTeamIds
        );

        return redirect()->route('events.my-events')
            ->with('success', 'Certificates created successfully');
    }

    public function preview(Event $event, CertificateTemplate $template)
    {
        return Inertia::render('Certificates/Preview', [
            'event' => $event,
            'template' => $template,
            'backgroundUrl' => asset($template->background_image),
            'signatureUrl' => asset($template->signature_image),
        ]);
    }
} 