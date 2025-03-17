<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->uuid('certificate_id')->primary();
            $table->uuid('event_id');
            $table->uuid('student_id');
            $table->string('template');
            $table->string('issue_date');
            $table->timestamps();

            $table->foreign('event_id')
                  ->references('event_id')
                  ->on('events')
                  ->onDelete('cascade');

            $table->foreign('student_id')
                  ->references('student_id')
                  ->on('students')
                  ->onDelete('cascade');

            // Prevent duplicate certificates
            $table->unique(['event_id', 'student_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('certificates');
    }
};