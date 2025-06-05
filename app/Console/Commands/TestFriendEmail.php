<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\FriendRequestSentNotification;
use App\Notifications\FriendRequestAcceptedNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class TestFriendEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:friend-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test friend request email notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing friend request email notifications...');

        // Get two test users
        $sender = User::where('email', 'student1@test.com')->first();
        $recipient = User::where('email', 'student2@test.com')->first();

        if (!$sender || !$recipient) {
            $this->error('Test users not found. Please run the seeder first.');
            return;
        }

        $this->info("Sender: {$sender->name} ({$sender->email})");
        $this->info("Recipient: {$recipient->name} ({$recipient->email})");

        try {
            // Test 1: Basic mail configuration
            $this->info('Testing basic mail configuration...');
            Mail::raw('This is a test email from Catalyst', function ($message) use ($recipient) {
                $message->to($recipient->email)
                        ->subject('Test Email from Catalyst');
            });
            $this->info('✅ Basic mail test sent successfully');

            // Test 2: Check if routes exist
            $this->info('Checking required routes...');
            try {
                $profileUrl = route('profile.view', $sender->id);
                $this->info("✅ Profile route works: {$profileUrl}");
            } catch (\Exception $e) {
                $this->error("❌ Profile route error: {$e->getMessage()}");
            }

            try {
                $friendsUrl = route('friends.list');
                $this->info("✅ Friends list route works: {$friendsUrl}");
            } catch (\Exception $e) {
                $this->error("❌ Friends list route error: {$e->getMessage()}");
            }

            // Test 3: FriendRequestSentNotification
            $this->info('Testing FriendRequestSentNotification...');
            $notification = new FriendRequestSentNotification($sender);
            $recipient->notify($notification);
            $this->info('✅ Friend request sent notification dispatched');

            // Test 4: FriendRequestAcceptedNotification  
            $this->info('Testing FriendRequestAcceptedNotification...');
            $acceptNotification = new FriendRequestAcceptedNotification($recipient);
            $sender->notify($acceptNotification);
            $this->info('✅ Friend request accepted notification dispatched');

            $this->info('');
            $this->info('All email tests completed! Check the emails at:');
            $this->info("- {$recipient->email} (should receive friend request)");
            $this->info("- {$sender->email} (should receive acceptance notification)");
            
            // Check mail config
            $this->info('');
            $this->info('Current mail configuration:');
            $this->info('Mailer: ' . config('mail.default'));
            $this->info('Host: ' . config('mail.mailers.smtp.host'));
            $this->info('Port: ' . config('mail.mailers.smtp.port'));
            $this->info('From: ' . config('mail.from.address'));
            
        } catch (\Exception $e) {
            $this->error('Error sending emails: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Email test error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}
