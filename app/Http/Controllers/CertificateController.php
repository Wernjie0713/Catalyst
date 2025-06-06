<?php

namespace App\Http\Controllers;

use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\CertificateTemplate;
use App\Models\User;
use App\Models\Team;
use App\Models\ExternalCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CertificateController extends Controller
{
    public function studentCertificates(Request $request, User $user)
    {
        // Get regular certificates if user has student profile
        $certificates = collect();
        if ($user->student) {
            $certificates = Certificate::with(['template', 'event'])
                ->where('student_id', $user->student->student_id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        // Get external certificates
        $externalCertificates = ExternalCertificate::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform external certificates to match the structure
        $transformedExternals = $externalCertificates->map(function ($cert) {
            return [
                'certificate_id' => 'ext_' . $cert->id,
                'type' => 'external',
                'title' => $cert->title,
                'certificate_type' => $cert->type,
                'issue_date' => $cert->issue_date,
                'certificate_image' => $cert->certificate_image,
                'description' => $cert->description,
                'created_at' => $cert->created_at,
            ];
        });

        // Merge and sort by date
        $allCertificates = $certificates->concat($transformedExternals)
            ->sortByDesc('created_at')
            ->values();

        return response()->json($allCertificates);
    }

    public function storeExternal(Request $request)
    {
        $request->validate([
            'type' => 'required|in:Participant,Winner',
            'title' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'certificate_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string|max:1000',
        ]);

        if (!$request->hasFile('certificate_image')) {
            return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
        }

        $image = $request->file('certificate_image');
        if (!$image->isValid()) {
            return response()->json(['success' => false, 'message' => 'Uploaded file is not valid.'], 400);
        }

        try {
            // Handle file upload
            $imagePath = null;
            if ($request->hasFile('certificate_image')) {
                $image = $request->file('certificate_image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $destination = public_path('images/external_certificates');
                if (!file_exists($destination)) {
                    mkdir($destination, 0777, true);
                }
                $image->move($destination, $imageName);
                $imagePath = 'images/external_certificates/' . $imageName;
            }

            // Create external certificate
            $externalCertificate = ExternalCertificate::create([
                'user_id' => $request->user()->id,
                'type' => $request->type,
                'title' => $request->title,
                'issue_date' => $request->issue_date,
                'certificate_image' => $imagePath,
                'description' => $request->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'External certificate added successfully!',
                'certificate' => $externalCertificate
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add external certificate. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateCertificates(Event $event, CertificateTemplate $template, array $selectedUserIds = [], array $selectedTeamIds = [], array $awardLevels = [])
    {
        try {
            // Handle participation certificates
            if ($template->is_participant_template) {
                if ($event->is_team_event) {
                    // For team events, generate certificates for all enrolled users
                    $users = $event->enrolledUsers;
                } else {
                    // For individual events, generate for all enrolled users
                    $users = $event->enrolledUsers;
                }
            } 
            // Handle winner certificates
            else {
                if ($event->is_team_event && !empty($selectedTeamIds)) {
                    // For team events, get all members of the selected teams
                    $users = collect();
                    $teamAwardLevels = []; // Store team award levels to assign to users
                    
                    foreach ($selectedTeamIds as $teamId) {
                        $team = Team::find($teamId);
                        if ($team) {
                            // Get award level for the team
                            $awardLevel = $awardLevels[$teamId] ?? null;
                            
                            // Get accepted team members
                            $teamMembers = $team->members()
                                ->where('status', 'accepted')
                                ->with('user.student')
                                ->get()
                                ->pluck('user');
                            
                            // Store award level for each team member
                            foreach ($teamMembers as $member) {
                                $teamAwardLevels[$member->id] = $awardLevel;
                            }
                            
                            $users = $users->merge($teamMembers);
                        }
                    }
                    
                    // Remove duplicate users (important for team events where a user might be in multiple teams)
                    $users = $users->unique('id');
                } else {
                    // For individual events, only generate for selected users
                    $users = User::whereIn('id', $selectedUserIds)->get();
                }
            }

            // Keep track of processed student IDs to avoid duplicates
            $processedStudentIds = [];

            foreach ($users as $user) {
                // Check if user has a student record and hasn't been processed yet
                if ($user->student && !in_array($user->student->student_id, $processedStudentIds)) {
                    // Add to processed list
                    $processedStudentIds[] = $user->student->student_id;
                    
                    // Generate unique certificate number
                    $certificateNumber = $this->generateCertificateNumber($event, $user);

                    // Get team information if applicable
                    $teamInfo = null;
                    $teamId = null;
                    $awardLevel = null;
                    
                    if ($event->is_team_event) {
                        // For team-based events, find the user's team
                        if (!empty($selectedTeamIds) && !$template->is_participant_template) {
                            // For winner certificates, use the selected team
                            foreach ($selectedTeamIds as $selectedTeamId) {
                                $team = Team::find($selectedTeamId);
                                if ($team && $team->members()->where('user_id', $user->id)->where('status', 'accepted')->exists()) {
                                    $teamInfo = [
                                        'team_id' => $team->id,
                                        'team_name' => $team->name
                                    ];
                                    $teamId = $team->id;
                                    // Get award level from stored team award levels
                                    $awardLevel = isset($teamAwardLevels) ? $teamAwardLevels[$user->id] : ($awardLevels[$team->id] ?? null);
                                    
                                    
                                    break;
                                }
                            }
                        } else {
                            // For participation certificates or if no team found above
                            $teamData = $event->enrollments()
                                ->where('user_id', $user->id)
                                ->whereNotNull('team_id')
                                ->with('team')
                                ->first();
                            
                            if ($teamData && $teamData->team) {
                                $teamInfo = [
                                    'team_id' => $teamData->team->id,
                                    'team_name' => $teamData->team->name
                                ];
                                $teamId = $teamData->team->id;
                            }
                        }
                    } else if (!$template->is_participant_template) {
                        // For individual winner certificates, get award level from input
                        $awardLevel = $awardLevels[$user->id] ?? null;
                    }
                        
                    
                    // Create certificate record
                    Certificate::create([
                        'certificate_id' => Str::uuid(),
                        'event_id' => $event->event_id,
                        'student_id' => $user->student->student_id,
                        'template_id' => $template->id,
                        'certificate_number' => $certificateNumber,
                        'status' => 'issued',
                        'issue_date' => now(),
                        'team_id' => $teamId,
                        'award_level' => $awardLevel,
                        'certificate_data' => [
                            'student_name' => $user->name,
                            'event_name' => $event->title,
                            'body_text' => $template->body_text,
                            'is_winner' => !$template->is_participant_template,
                            'is_team_event' => $event->is_team_event,
                            'team_info' => $teamInfo,
                            'award_level' => $awardLevel,
                        ],
                    ]);
                }
            }

            return true;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function generateCertificateNumber(Event $event, User $user): string
    {
        $prefix = $event->event_id;
        $timestamp = now()->format('YmdHis');
        $random = Str::random(4);
        return strtoupper("CERT-{$prefix}-{$timestamp}-{$random}");
    }

    public function download(Certificate $certificate)
    {
        // Ensure the user can only download their own certificates
        if ($certificate->student_id !== auth()->user()->student->student_id) {
            abort(403);
        }

        try {
            // Generate and return the certificate PDF
            $pdf = $this->generateCertificatePDF($certificate);
            
            return response()->download(
                $pdf,
                "certificate_{$certificate->certificate_number}.pdf",
                ['Content-Type' => 'application/pdf']
            )->deleteFileAfterSend(true); // This will clean up the temporary file
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to generate certificate. Please try again.');
        }
    }

    public function generateCertificatePDF(Certificate $certificate)
    {
        // Initialize Dompdf with the right configuration
        $dompdf = new \Dompdf\Dompdf();
        $options = new \Dompdf\Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('isRemoteEnabled', true);
        $dompdf->setOptions($options);
        
        // Get the student's name through the relationships
        $student = $certificate->student;
        $user = $student->user;
        $userName = $user->name ?? 'Student Name';
        
        // Get template and layout settings
        $template = $certificate->template;
        $layoutSettings = $template->layout_settings;
        
        // Convert image paths to data URIs - this is more reliable for DOMPDF
        $backgroundImageData = "data:image/png;base64," . base64_encode(file_get_contents(public_path('images/Certificate.png')));
        
        // Check if signature image exists and convert to data URI
        $signatureImageData = null;
        if ($template->signature_image && file_exists(public_path($template->signature_image))) {
            $signatureImageData = "data:image/png;base64," . base64_encode(file_get_contents(public_path($template->signature_image)));
        }
        
        // Get team information if available
        $teamInfo = null;
        if ($certificate->team_id) {
            $team = $certificate->team;
            if ($team) {
                $teamInfo = [
                    'team_id' => $team->id,
                    'team_name' => $team->name,
                ];
            }
        } else if (isset($certificate->certificate_data['team_info'])) {
            $teamInfo = $certificate->certificate_data['team_info'];
        }
        
        // Generate HTML for the certificate
        $html = view('certificates.pdf', [
            'certificate' => $certificate,
            'template' => $template,
            'event' => $certificate->event,
            'studentName' => $userName,
            'certificateNumber' => $certificate->certificate_number,
            'issueDate' => $certificate->issue_date->format('d/m/Y'),
            'layoutSettings' => $layoutSettings,
            'backgroundImageData' => $backgroundImageData,
            'signatureImageData' => $signatureImageData,
            'teamInfo' => $teamInfo,
        ])->render();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        // Save to temporary file
        $tmpPath = storage_path('app/temp/' . Str::uuid() . '.pdf');
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }
        file_put_contents($tmpPath, $dompdf->output());

        return $tmpPath;
    }
} 
