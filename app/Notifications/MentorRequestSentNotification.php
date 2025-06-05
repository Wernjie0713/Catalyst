<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MentorRequestSentNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $student,
        protected string $message = ''
    ) {
        Log::info('MentorRequestSentNotification constructed', [
            'student_id' => $student->id,
            'student_name' => $student->name,
            'message' => $message
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
        $studentName = $this->student->name;
        $appName = config('app.name');
        $profileUrl = route('profile.view', $this->student->id);
        $dashboardUrl = route('lecturer.dashboard');

        return (new MailMessage)
            ->subject("New Mentorship Request from {$studentName} - {$appName}")
            ->view('emails.mentor-request-sent', [
                'notifiable' => $notifiable,
                'student' => $this->student,
                'studentName' => $studentName,
                'requestMessage' => $this->message,
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
            'student_id' => $this->student->id,
            'student_name' => $this->student->name,
            'message' => "{$this->student->name} requested you as a mentor",
            'request_message' => $this->message,
            'type' => 'mentor_request_sent',
            'action_url' => route('lecturer.dashboard')
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