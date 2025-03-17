<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('organizers', function (Blueprint $table) {
            $table->uuid('organizer_id')->primary();
            $table->uuid('user_id');
            $table->string('contact_number')->nullable();
            $table->text('bio')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('website')->nullable();
            $table->string('organization_name');
            $table->string('application_document')->nullable();
            $table->string('official_email');
            $table->enum('status', ['Pending', 'Verified', 'Rejected']);
            $table->uuid('verified_by')->nullable();
            $table->string('profile_photo_path')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
            
            $table->foreign('verified_by')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('organizers');
    }
};
