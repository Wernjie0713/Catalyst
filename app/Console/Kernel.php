<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\SendEventReminders;
use App\Console\Commands\TestNotification;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        SendEventReminders::class,
        TestNotification::class
    ];

    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('events:send-reminders')->dailyAt('19:10');
    }
} 