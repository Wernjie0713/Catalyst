<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('department_staff', function (Blueprint $table) {
            $table->uuid('staff_id')->primary();
            $table->uuid('user_id');
            $table->string('department');
            $table->string('position');
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
        Schema::dropIfExists('department_staff');
    }
};
