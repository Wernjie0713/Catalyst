<?php

namespace App\Http\Controllers;

use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\CertificateTemplate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function studentCertificates(Request $request)
    {
        $certificates = Certificate::with(['template', 'event'])
            ->where('student_id', $request->user()->student->student_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($certificates);
    }

    public function generateCertificates(Event $event, CertificateTemplate $template, array $selectedUserIds = [])
    {
        try {
            // If it's a participant template, generate for all enrolled users
            if ($template->is_participant_template) {
                $users = $event->enrolledUsers;
            } else {
                // For winner certificates, only generate for selected users
                $users = User::whereIn('id', $selectedUserIds)->get();
            }

            foreach ($users as $user) {
                // Check if user has a student record
                if ($user->student) {
                    // Generate unique certificate number
                    $certificateNumber = $this->generateCertificateNumber($event, $user);

                    // Create certificate record
                    Certificate::create([
                        'certificate_id' => Str::uuid(),
                        'event_id' => $event->event_id,
                        'student_id' => $user->student->student_id,
                        'template_id' => $template->id,
                        'certificate_number' => $certificateNumber,
                        'status' => 'issued',
                        'issue_date' => now(),
                        'certificate_data' => [
                            'student_name' => $user->name,
                            'event_name' => $event->title,
                            'body_text' => $template->body_text,
                            'is_winner' => !$template->is_participant_template
                        ],
                    ]);
                }
            }

            return true;
        } catch (\Exception $e) {
            \Log::error('Certificate generation failed: ' . $e->getMessage());
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
            \Log::error('Certificate download failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to generate certificate. Please try again.');
        }
    }

    public function generateCertificatePDF(Certificate $certificate)
    {
        // Initialize Dompdf
        $dompdf = new \Dompdf\Dompdf();
        $dompdf->set_option('isHtml5ParserEnabled', true);
        $dompdf->set_option('isPhpEnabled', true);
        
        // Get the student's name through the relationships
        $student = $certificate->student;
        $user = $student->user;
        $userName = $user->name ?? 'Student Name';
        
        // Generate HTML for the certificate
        $html = view('certificates.pdf', [
            'certificate' => $certificate,
            'template' => $certificate->template,
            'event' => $certificate->event,
            'studentName' => $userName,
            'certificateNumber' => $certificate->certificate_number,
            'issueDate' => $certificate->issue_date->format('d/m/Y'),
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