<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->uuid('university_id')->primary();
            $table->uuid('user_id');
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('contact_email');
            $table->string('website')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('bio')->nullable();
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
        Schema::dropIfExists('universities');
    }
};