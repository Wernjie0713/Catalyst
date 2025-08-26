<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Event;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all events that don't have a share_token
        $eventsWithoutToken = Event::whereNull('share_token')->get();
        
        foreach ($eventsWithoutToken as $event) {
            $event->share_token = Str::random(32);
            $event->saveQuietly(); // Use saveQuietly to avoid triggering model events
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse this migration as it only populates data
    }
};
