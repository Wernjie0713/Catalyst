<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Silber\Bouncer\BouncerFacade as Bouncer;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Define all possible abilities
        $abilities = [
            // Add 'admin' ability to the list
            'admin',
            // Event abilities
            'event_upload',
            'event_edit',
            'event_view',
            'event_enroll',
            'event_participantstatus',
            'event_organizestatus',
            'event_feedback',
            'event_feedbackview',
            
            // Team abilities
            'team_grouping',
            
            // Certificate abilities
            'cert_generate',
            'cert_view',
            
            // Other abilities
            'view_otherprofile',
            'report_view',
            'rank_view',
            'reward_management'
        ];

        // Create abilities
        foreach ($abilities as $ability) {
            Bouncer::ability()->create([
                'name' => $ability,
                'title' => ucwords(str_replace('_', ' ', $ability))
            ]);
        }

        // Create basic roles with their corresponding models
        Bouncer::role()->create([
            'name' => 'student',
            'title' => 'Student',
            'entity_type' => 'App\Models\Student'
        ]);
        
        Bouncer::role()->create([
            'name' => 'admin',
            'title' => 'Admin',
            'entity_type' => 'App\Models\Admin'
        ]);
        
        Bouncer::role()->create([
            'name' => 'lecturer',
            'title' => 'Lecturer',
            'entity_type' => 'App\Models\Lecturer'
        ]);
        
        Bouncer::role()->create([
            'name' => 'university',
            'title' => 'University',
            'entity_type' => 'App\Models\University'
        ]);
        
        Bouncer::role()->create([
            'name' => 'department_staff',
            'title' => 'Department Staff',
            'entity_type' => 'App\Models\DepartmentStaff'
        ]);
        
        Bouncer::role()->create([
            'name' => 'organizer',
            'title' => 'Organizer',
            'entity_type' => 'App\Models\Organizer'
        ]);

        // Create initial admin user and its related Admin model
        $adminUser = User::create([
            'id' => Str::uuid(),
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'role' => 'Admin',
        ]);

        // Create related Admin model
        Admin::create([
            'admin_id' => $adminUser->id,
            'name' => $adminUser->name,
            'email' => $adminUser->email,
            'role' => 'Admin'
        ]);

        // Assign admin role to first user
        Bouncer::assign('admin')->to($adminUser);
        
        // Give admin ability to admin role
        Bouncer::allow('admin')->to('admin');
        
        // Give all abilities to admin
        foreach ($abilities as $ability) {
            Bouncer::allow('admin')->to($ability);
        }
    }
}