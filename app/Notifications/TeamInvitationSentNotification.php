<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Team;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TeamInvitationSentNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $inviter,
        protected Team $team
    ) {
        Log::info('TeamInvitationSentNotification constructed', [
            'inviter_id' => $inviter->id,
            'inviter_name' => $inviter->name,
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
        $inviterName = $this->inviter->name;
        $teamName = $this->team->name;
        $appName = config('app.name');
        $profileUrl = route('profile.view', $this->inviter->id);
        $teamsUrl = route('friends.list', ['tab' => 'teams']);

        return (new MailMessage)
            ->subject("Team Invitation: {$teamName} from {$inviterName} - {$appName}")
            ->view('emails.team-invitation-sent', [
                'notifiable' => $notifiable,
                'inviter' => $this->inviter,
                'team' => $this->team,
                'inviterName' => $inviterName,
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
            'inviter_id' => $this->inviter->id,
            'inviter_name' => $this->inviter->name,
            'team_id' => $this->team->id,
            'team_name' => $this->team->name,
            'message' => "{$this->inviter->name} invited you to join team '{$this->team->name}'",
            'type' => 'team_invitation_sent',
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