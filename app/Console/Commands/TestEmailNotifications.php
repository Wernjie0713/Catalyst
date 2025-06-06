<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\FriendRequestSentNotification;
use App\Notifications\FriendRequestAcceptedNotification;
use App\Notifications\MentorRequestSentNotification;
use App\Notifications\MentorRequestAcceptedNotification;
use App\Notifications\TeamInvitationSentNotification;
use App\Notifications\TeamInvitationAcceptedNotification;
use App\Notifications\EventReminderNotification;
use App\Models\Event;
use App\Models\Team;

class TestEmailNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email-notifications {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test all email notifications by sending them to a specific email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        // Find or create a test user
        $testUser = User::where('email', $email)->first();
        if (!$testUser) {
            $this->error("User with email {$email} not found. Please provide an existing user email.");
            return 1;
        }

        $this->info("Testing email notifications for: {$email}");

        try {
            // Create a mock sender user
            $sender = User::first(); // Use first user as sender
            if (!$sender || $sender->id === $testUser->id) {
                $sender = User::where('id', '!=', $testUser->id)->first();
            }

            $this->info("Using sender: {$sender->name} ({$sender->email})");

            // Test Friend Request Sent
            $this->line('Sending Friend Request Sent notification...');
            $testUser->notify(new FriendRequestSentNotification($sender));

            // Test Friend Request Accepted  
            $this->line('Sending Friend Request Accepted notification...');
            $testUser->notify(new FriendRequestAcceptedNotification($sender));

            // Test Mentor Request Sent
            $this->line('Sending Mentor Request Sent notification...');
            $testUser->notify(new MentorRequestSentNotification($sender, 'This is a test mentorship request message.'));

            // Test Mentor Request Accepted
            $this->line('Sending Mentor Request Accepted notification...');
            $testUser->notify(new MentorRequestAcceptedNotification($sender));

            // Test Team Invitation Sent
            $team = Team::first();
            if ($team) {
                $this->line('Sending Team Invitation Sent notification...');
                $testUser->notify(new TeamInvitationSentNotification($sender, $team));

                // Test Team Invitation Accepted
                $this->line('Sending Team Invitation Accepted notification...');
                $testUser->notify(new TeamInvitationAcceptedNotification($sender, $team));
            } else {
                $this->warn('No teams found, skipping Team Invitation tests.');
            }

            // Test Event Reminder
            $event = Event::first();
            if ($event) {
                $this->line('Sending Event Reminder notification...');
                $testUser->notify(new EventReminderNotification($event));
            } else {
                $this->warn('No events found, skipping Event Reminder test.');
            }

            $this->success("✅ All email notifications sent successfully to {$email}!");
            $this->info("Check your email inbox (and spam folder) for the notifications.");
            
        } catch (\Exception $e) {
            $this->error("❌ Error sending notifications: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
