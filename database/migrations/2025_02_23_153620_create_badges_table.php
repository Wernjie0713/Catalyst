<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->uuid('badge_id')->primary();
            $table->uuid('student_id');
            $table->string('name');
            $table->text('criteria');
            $table->timestamps();

            $table->foreign('student_id')
                  ->references('student_id')
                  ->on('students')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('badges');
    }
};