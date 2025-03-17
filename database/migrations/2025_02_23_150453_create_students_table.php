<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('student_id')->primary();
            $table->uuid('user_id');
            $table->string('matric_no')->nullable();
            $table->integer('year');
            $table->enum('level', ['Undergraduate', 'Postgraduate'])->nullable();
            $table->string('contact_number')->nullable();
            $table->text('bio')->nullable();
            $table->enum('faculty', [
                'Faculty of Computing',
                'Faculty of Civil Engineering',
                'Faculty of Electrical Engineering',
                'Faculty of Chemical Engineering',
                'Faculty of Mechanical Engineering',
                'Faculty of Industrial Sciences & Technology',
                'Faculty of Manufacturing Engineering',
                'Faculty of Technology Engineering',
                'Faculty of Business & Communication',
                'Faculty of Industrial Management',
                'Faculty of Applied Sciences',
                'Faculty of Science & Technology',
                'Faculty of Medicine',
                'Faculty of Pharmacy',
                'Faculty of Dentistry',
                'Faculty of Arts & Social Sciences',
                'Faculty of Education',
                'Faculty of Economics & Administration',
                'Faculty of Law',
                'Faculty of Built Environment',
                'Faculty of Agriculture',
                'Faculty of Forestry',
                'Faculty of Veterinary Medicine',
                'Faculty of Islamic Studies',
                'Faculty of Sports Science',
                'Faculty of Creative Technology',
                'Faculty of Music',
                'Faculty of Architecture & Design',
                'Faculty of Hotel & Tourism Management',
                'Faculty of Health Sciences',
                'Faculty of Defence Studies & Management'
            ])->nullable();
            $table->enum('university', [
                'UMP', 'UMS', 'UMT', 'UKM', 'UM', 'USM', 'UPM', 'UTM', 'UUM', 'UIAM',
                'UPSI', 'USIM', 'UiTM', 'UNIMAS', 'UTeM', 'UniMAP', 'UTHM', 'UniSZA',
                'UPNM', 'UMK'
            ])->nullable();
            $table->integer('expected_graduate')->nullable();
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
        Schema::dropIfExists('students');
    }
};