<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Event;
use Illuminate\Console\Command;
use App\Notifications\EventReminderNotification;

class TestNotification extends Command
{
    protected $signature = 'notification:test {user_id?}';
    protected $description = 'Send a test notification to a user';

    public function handle()
    {
        // Get user_id from argument or use the first user
        $userId = $this->argument('user_id') ?? User::first()->id;
        $user = User::findOrFail($userId);
        
        // Get first event or create a test event
        $event = Event::first() ?? Event::factory()->create();

        try {
            $user->notify(new EventReminderNotification($event));
            $this->info("Test notification sent to user: {$user->name} (ID: {$user->id})");
        } catch (\Exception $e) {
            $this->error("Failed to send notification: " . $e->getMessage());
        }
    }
} 