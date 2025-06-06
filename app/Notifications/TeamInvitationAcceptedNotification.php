<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Team;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TeamInvitationAcceptedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $accepter,
        protected Team $team
    ) {
        Log::info('TeamInvitationAcceptedNotification constructed', [
            'accepter_id' => $accepter->id,
            'accepter_name' => $accepter->name,
            'team_id' => $team->id,
            'team_name' => $team->name
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
        $accepterName = $this->accepter->name;
        $teamName = $this->team->name;
        $appName = config('app.name');
        $profileUrl = route('profile.view', $this->accepter->id);
        $teamsUrl = route('friends.list', ['tab' => 'teams']);

        return (new MailMessage)
            ->subject("{$accepterName} joined your team '{$teamName}' - {$appName}")
            ->view('emails.team-invitation-accepted', [
                'notifiable' => $notifiable,
                'accepter' => $this->accepter,
                'team' => $this->team,
                'accepterName' => $accepterName,
                'teamName' => $teamName,
                'appName' => $appName,
                'profileUrl' => $profileUrl,
                'teamsUrl' => $teamsUrl
            ]);
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'accepter_id' => $this->accepter->id,
            'accepter_name' => $this->accepter->name,
            'team_id' => $this->team->id,
            'team_name' => $this->team->name,
            'message' => "{$this->accepter->name} joined your team '{$this->team->name}'",
            'type' => 'team_invitation_accepted',
            'action_url' => route('friends.list', ['tab' => 'teams'])
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