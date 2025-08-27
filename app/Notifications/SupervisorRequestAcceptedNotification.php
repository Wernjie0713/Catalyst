<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class SupervisorRequestAcceptedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $lecturer,
        protected Project $project
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Supervisor Request Accepted')
            ->line("{$this->lecturer->name} accepted to supervise your project '{$this->project->title}'.")
            ->action('View Project', route('projects.show', $this->project));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'supervisor_request_accepted',
            'message' => "{$this->lecturer->name} accepted to supervise '{$this->project->title}'",
            'lecturer_id' => $this->lecturer->id,
            'project_id' => $this->project->id,
            'action_url' => route('projects.show', $this->project),
        ];
    }

    public function id(): string
    {
        return Str::uuid()->toString();
    }
}


