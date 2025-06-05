<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FriendRequestSentNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected User $sender
    ) {
        Log::info('FriendRequestSentNotification constructed', [
            'sender_id' => $sender->id,
            'sender_name' => $sender->name
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
        $senderName = $this->sender->name;
        $appName = config('app.name');
        $profileUrl = route('profile.view', $this->sender->id);
        $friendsUrl = route('friends.list');

        return (new MailMessage)
            ->subject("New Friend Request from {$senderName} - {$appName}")
            ->view('emails.friend-request-sent', [
                'notifiable' => $notifiable,
                'sender' => $this->sender,
                'senderName' => $senderName,
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
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'message' => "{$this->sender->name} sent you a friend request",
            'type' => 'friend_request_sent',
            'action_url' => route('friends.list')
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