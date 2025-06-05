<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MentorRequestAcceptedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $mentor
    ) {
        Log::info('MentorRequestAcceptedNotification constructed', [
            'mentor_id' => $mentor->id,
            'mentor_name' => $mentor->name
        ]);
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mentorName = $this->mentor->name;
        $appName = config('app.name');
        $profileUrl = route('profile.view', $this->mentor->id);
        $dashboardUrl = route('dashboard');

        return (new MailMessage)
            ->subject("{$mentorName} accepted your mentorship request - {$appName}")
            ->view('emails.mentor-request-accepted', [
                'notifiable' => $notifiable,
                'mentor' => $this->mentor,
                'mentorName' => $mentorName,
                'appName' => $appName,
                'profileUrl' => $profileUrl,
                'dashboardUrl' => $dashboardUrl
            ]);
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'mentor_id' => $this->mentor->id,
            'mentor_name' => $this->mentor->name,
            'message' => "{$this->mentor->name} accepted your mentorship request",
            'type' => 'mentor_request_accepted',
            'action_url' => route('profile.view', $this->mentor->id)
        ];
    }

    /**
     * Get the notification's ID.
     */
    public function id(): string
    {
        return Str::uuid()->toString();
    }
} 