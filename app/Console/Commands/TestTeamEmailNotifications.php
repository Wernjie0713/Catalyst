<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Team;
use App\Notifications\TeamInvitationSentNotification;
use App\Notifications\TeamInvitationAcceptedNotification;

class TestTeamEmailNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:team-notifications {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test team email notifications by sending them to a specific email';

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

        $this->info("Testing team email notifications for: {$email}");

        try {
            // Create a mock team creator
            $teamCreator = User::where('id', '!=', $testUser->id)->first();
            if (!$teamCreator) {
                $this->error("No other users found to act as team creator.");
                return 1;
            }

            // Create or get a test team
            $team = Team::first();
            if (!$team) {
                $team = Team::create([
                    'id' => \Str::uuid(),
                    'name' => 'Test Team for Email Notifications',
                    'creator_id' => $teamCreator->id,
                    'member_count' => 1
                ]);
                $this->info("Created test team: {$team->name}");
            }

            $this->info("Using team creator: {$teamCreator->name} ({$teamCreator->email})");
            $this->info("Using team: {$team->name}");

            // Test Team Invitation Sent
            $this->line('Sending Team Invitation Sent notification...');
            $testUser->notify(new TeamInvitationSentNotification($teamCreator, $team));
            $this->info('✅ Team invitation sent notification dispatched');

            // Test Team Invitation Accepted  
            $this->line('Sending Team Invitation Accepted notification...');
            $teamCreator->notify(new TeamInvitationAcceptedNotification($testUser, $team));
            $this->info('✅ Team invitation accepted notification dispatched');

            $this->info('');
            $this->info('All team email tests completed! Check the emails at:');
            $this->info("- {$testUser->email} (should receive team invitation)");
            $this->info("- {$teamCreator->email} (should receive team invitation accepted)");

            $this->info('');
            $this->info('Also check the notifications table in the database for in-app notifications.');

        } catch (\Exception $e) {
            $this->error('Error testing team notifications: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
