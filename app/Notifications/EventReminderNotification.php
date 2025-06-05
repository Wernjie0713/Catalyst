<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class EventReminderNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Event $event
    ) {
        Log::info('EventReminderNotification constructed', [
            'event_id' => $event->event_id,
            'event_title' => $event->title
        ]);
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        Log::info('Via method called', [
            'notifiable_id' => $notifiable->id,
            'notifiable_type' => get_class($notifiable)
        ]);
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $eventTitle = $this->event->title;
        $appName = config('app.name');
        $eventUrl = route('events.show', $this->event->event_id);
        $eventsUrl = route('events.index');

        return (new MailMessage)
            ->subject("Event Reminder: {$eventTitle} - {$appName}")
            ->view('emails.event-reminder', [
                'notifiable' => $notifiable,
                'event' => $this->event,
                'eventTitle' => $eventTitle,
                'appName' => $appName,
                'eventUrl' => $eventUrl,
                'eventsUrl' => $eventsUrl
            ]);
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        Log::info('toArray method called', [
            'event_id' => $this->event->event_id,
            'notifiable_id' => $notifiable->id
        ]);

        return [
            'event_id' => $this->event->event_id,
            'title' => $this->event->title,
            'message' => "You have enrolled in: {$this->event->title}",
            'start_date' => $this->event->start_date,
            'type' => 'event_reminder',
            'action_url' => route('events.show', $this->event->event_id)
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