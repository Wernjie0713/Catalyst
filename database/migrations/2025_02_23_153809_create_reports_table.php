<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('report_id')->primary();
            $table->uuid('generated_by')->nullable(); // User who generated the report
            $table->enum('report_type', ['Participation', 'Achievement', 'Event']);
            $table->uuid('event_id')->nullable();
            $table->json('data'); // Flexible storage for report data
            $table->timestamps();

            $table->foreign('generated_by')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');

            $table->foreign('event_id')
                  ->references('event_id')
                  ->on('events')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reports');
    }
};