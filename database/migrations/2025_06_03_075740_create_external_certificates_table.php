<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('external_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['Participant', 'Winner']); // e.g., Participant, Winner, etc.
            $table->string('title'); // Certificate title
            $table->date('issue_date'); // Date of issue
            $table->string('certificate_image'); // Path to uploaded image
            $table->text('description')->nullable(); // Optional extra info
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('external_certificates');
    }
};