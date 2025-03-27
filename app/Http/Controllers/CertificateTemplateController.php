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
        // Get selected users from the query parameters
        $selectedUserIds = $request->query('users', []);
        $selectedUsers = $event->enrolledUsers()
            ->whereIn('users.id', $selectedUserIds)
            ->get();

        return Inertia::render('Certificates/TemplateBuilder', [
            'event' => $event,
            'selectedUsers' => $selectedUsers
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body_text' => 'nullable|string',
            'background_image' => 'nullable|image|max:2048',
            'signature_image' => 'nullable|image|max:2048',
            'is_participant_template' => 'required|boolean',
            'layout_settings' => 'required|array',
            'selected_users' => 'required_if:is_participant_template,false|array'
        ]);

        // Handle background image upload
        if ($request->hasFile('background_image')) {
            $backgroundImage = $request->file('background_image');
            $backgroundFileName = 'background_' . time() . '.' . $backgroundImage->getClientOriginalExtension();
            $backgroundImage->move(public_path('images/certificate'), $backgroundFileName);
            $validated['background_image'] = 'images/certificate/' . $backgroundFileName;
        }

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
            'background_image' => $validated['background_image'] ?? null,
            'signature_image' => $validated['signature_image'] ?? null,
            'is_participant_template' => $validated['is_participant_template'],
            'layout_settings' => $validated['layout_settings'],
        ]);

        // Generate certificates
        app(CertificateController::class)->generateCertificates(
            $event, 
            $template, 
            $validated['is_participant_template'] ? [] : $validated['selected_users']
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