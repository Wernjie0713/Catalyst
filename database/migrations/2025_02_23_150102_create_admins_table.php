<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->uuid('admin_id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('role')->default('Admin');
            $table->timestamps();

            $table->foreign('admin_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('admins');
    }
};