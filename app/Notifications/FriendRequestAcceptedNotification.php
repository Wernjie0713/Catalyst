<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FriendRequestAcceptedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $accepter
    ) {
        Log::info('FriendRequestAcceptedNotification constructed', [
            'accepter_id' => $accepter->id,
            'accepter_name' => $accepter->name
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
        $appName = config('app.name');
        $profileUrl = route('profile.view', $this->accepter->id);
        $friendsUrl = route('friends.list');

        return (new MailMessage)
            ->subject("{$accepterName} accepted your friend request - {$appName}")
            ->view('emails.friend-request-accepted', [
                'notifiable' => $notifiable,
                'accepter' => $this->accepter,
                'accepterName' => $accepterName,
                'appName' => $appName,
                'profileUrl' => $profileUrl,
                'friendsUrl' => $friendsUrl
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
            'message' => "{$this->accepter->name} accepted your friend request",
            'type' => 'friend_request_accepted',
            'action_url' => route('profile.view', $this->accepter->id)
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