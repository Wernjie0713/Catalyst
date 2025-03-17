<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lecturers', function (Blueprint $table) {
            $table->uuid('lecturer_id')->primary();
            $table->uuid('user_id');
            $table->string('department');
            $table->string('specialization')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('bio')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('profile_photo_path')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('lecturers');
    }
};
