<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class SupervisorRequestSentNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $student,
        protected Project $project
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Supervisor Request')
            ->line("{$this->student->name} requested you to supervise the project '{$this->project->title}'.")
            ->action('Open Lecturer Dashboard', route('lecturer.dashboard'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'supervisor_request_sent',
            'message' => "{$this->student->name} requested you to supervise '{$this->project->title}'",
            'student_id' => $this->student->id,
            'project_id' => $this->project->id,
            'action_url' => route('lecturer.dashboard'),
        ];
    }

    public function id(): string
    {
        return Str::uuid()->toString();
    }
}


