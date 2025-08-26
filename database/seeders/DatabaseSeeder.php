<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Lecturer;
use App\Models\DepartmentStaff;
use App\Models\Organizer;
use App\Models\University;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Silber\Bouncer\BouncerFacade as Bouncer;
use Illuminate\Support\Str;
use Carbon\Carbon;

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
            
            // Project abilities
            'project_create',
            'project_view',
            'project_edit',
            'project_update',
            'project_delete',
            'view-lecturer-dashboard',
            'view-project-analytics',
            'view-faculty-students',
            
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
            'password' => bcrypt('admin123'),
            'email_verified_at' => Carbon::now(),
        ]);

        // Create related Admin model
        Admin::create([
            'admin_id' => $adminUser->id,
            'name' => $adminUser->name,
            'email' => $adminUser->email,
        ]);

        // Assign admin role to admin user
        Bouncer::assign('admin')->to($adminUser);
    
        // Give all abilities to admin
        foreach ($abilities as $ability) {
            Bouncer::allow('admin')->to($ability);
        }

        // Create 5 Student users
        for ($i = 1; $i <= 5; $i++) {
            $studentUser = User::create([
                'id' => Str::uuid(),
                'name' => "Student User {$i}",
                'email' => "student{$i}@test.com",
                'password' => bcrypt('admin123'),
                'email_verified_at' => Carbon::now(),
            ]);

            // Create related Student model (matching the actual table structure)
            Student::create([
                'student_id' => Str::uuid(),
                'user_id' => $studentUser->id,
                'matric_no' => 'A22EC' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'contact_number' => '012-345-67' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'faculty' => ['Faculty of Computing', 'Faculty of Civil Engineering', 'Faculty of Business & Communication', 'Faculty of Applied Sciences', 'Faculty of Education'][($i - 1) % 5],
                'year' => rand(1, 4),
                'level' => ['Undergraduate', 'Postgraduate'][rand(0, 1)],
                'university' => 'Universiti Malaysia Pahang',
                'expected_graduate' => date('Y') + rand(1, 4),
                'bio' => "Computer Science student passionate about technology and innovation.",
            ]);

            Bouncer::assign('student')->to($studentUser);
        }

        // Create 2 Lecturer users
        for ($i = 1; $i <= 2; $i++) {
            $lecturerUser = User::create([
                'id' => Str::uuid(),
                'name' => "Dr. Lecturer {$i}",
                'email' => "lecturer{$i}@test.com",
                'password' => bcrypt('admin123'),
                'email_verified_at' => Carbon::now(),
            ]);

            // Create related Lecturer model (matching the actual table structure)
            Lecturer::create([
                'lecturer_id' => Str::uuid(),
                'user_id' => $lecturerUser->id,
                'contact_number' => '013-456-78' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'faculty' => ['Faculty of Computing', 'Faculty of Civil Engineering'][($i - 1) % 2],
                'specialization' => ['Artificial Intelligence', 'Software Engineering'][($i - 1) % 2],
                'university' => 'Universiti Malaysia Pahang',
                'bio' => "Experienced lecturer specializing in " . ['Artificial Intelligence', 'Software Engineering'][($i - 1) % 2],
                'linkedin' => "https://linkedin.com/in/lecturer{$i}",
            ]);

            Bouncer::assign('lecturer')->to($lecturerUser);
        }

        // Create 2 Department Staff users
        for ($i = 1; $i <= 2; $i++) {
            $deptUser = User::create([
                'id' => Str::uuid(),
                'name' => "Department Staff {$i}",
                'email' => "dept{$i}@test.com",
                'password' => bcrypt('admin123'),
                'email_verified_at' => Carbon::now(),
            ]);

            // Create related DepartmentStaff model (matching the actual table structure)
            DepartmentStaff::create([
                'staff_id' => Str::uuid(),
                'user_id' => $deptUser->id,
                'contact_number' => '014-567-89' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'department' => ['Computer Science Department', 'Engineering Department'][($i - 1) % 2],
                'faculty' => ['Faculty of Computing', 'Faculty of Civil Engineering'][($i - 1) % 2],
                'position' => ['Academic Coordinator', 'Administrative Officer'][($i - 1) % 2],
                'bio' => "Dedicated department staff member ensuring smooth academic operations.",
                'linkedin' => "https://linkedin.com/in/deptstaff{$i}",
            ]);

            Bouncer::assign('department_staff')->to($deptUser);
        }

        // Create 2 Organizer users
        for ($i = 1; $i <= 2; $i++) {
            $organizerUser = User::create([
                'id' => Str::uuid(),
                'name' => "Event Organizer {$i}",
                'email' => "organizer{$i}@test.com",
                'password' => bcrypt('admin123'),
                'email_verified_at' => Carbon::now(),
            ]);

            // Create related Organizer model (matching the actual table structure)
            Organizer::create([
                'organizer_id' => Str::uuid(),
                'user_id' => $organizerUser->id,
                'contact_number' => '015-678-90' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'organization_name' => ['Tech Events Malaysia', 'University Events Committee'][($i - 1) % 2],
                'bio' => "Professional event organizer specializing in " . ['technology conferences', 'university activities'][($i - 1) % 2],
                'linkedin' => "https://linkedin.com/in/organizer{$i}",
                'website' => "https://events{$i}.com",
                'official_email' => "official.organizer{$i}@events.com",
                'status' => 'Verified',
            ]);

            Bouncer::assign('organizer')->to($organizerUser);
        }

        // Create 2 University users
        for ($i = 1; $i <= 2; $i++) {
            $universityUser = User::create([
                'id' => Str::uuid(),
                'name' => ['Universiti Malaysia Pahang', 'Universiti Teknologi Malaysia'][($i - 1) % 2],
                'email' => "university{$i}@test.com",
                'password' => bcrypt('admin123'),
                'email_verified_at' => Carbon::now(),
            ]);

            // Create related University model (matching the actual table structure)
            University::create([
                'university_id' => Str::uuid(),
                'user_id' => $universityUser->id,
                'name' => ['Universiti Malaysia Pahang', 'Universiti Teknologi Malaysia'][($i - 1) % 2],
                'location' => ['Pahang, Malaysia', 'Johor, Malaysia'][($i - 1) % 2],
                'contact_email' => "info@university{$i}.edu.my",
                'website' => "https://university{$i}.edu.my",
                'contact_number' => '09-424-60' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'bio' => "Leading public university in Malaysia committed to excellence in education and research.",
            ]);

            Bouncer::assign('university')->to($universityUser);
        }

        // After creating roles, assign project abilities
        Bouncer::allow('student')->to([
            'project_create',
            'project_view',
            'project_update',
            'team_grouping',
            'event_view',
            'event_enroll',
            'view_otherprofile'
        ]);

        Bouncer::allow('lecturer')->to([
            'project_view',
            'project_edit',
            'project_update',
            'view-lecturer-dashboard',
            'view-project-analytics',
            'view-faculty-students',
            'event_view',
            'view_otherprofile'
        ]);

        Bouncer::allow('department_staff')->to([
            'event_view',
            'event_edit',
            'report_view',
            'view_otherprofile'
        ]);

        Bouncer::allow('organizer')->to([
            'event_upload',
            'event_edit',
            'event_view',
            'event_participantstatus',
            'event_organizestatus',
            'event_feedback',
            'event_feedbackview',
            'cert_generate',
            'view_otherprofile'
        ]);

        Bouncer::allow('university')->to([
            'event_view',
            'report_view',
            'view_otherprofile',
            'rank_view'
        ]);

        $this->command->info('Created test users:');
        $this->command->info('Admin: admin@admin.com (password: admin123)');
        $this->command->info('Students: student1@test.com to student5@test.com (password: admin123)');
        $this->command->info('Lecturers: lecturer1@test.com to lecturer2@test.com (password: admin123)');
        $this->command->info('Department Staff: dept1@test.com to dept2@test.com (password: admin123)');
        $this->command->info('Organizers: organizer1@test.com to organizer2@test.com (password: admin123)');
        $this->command->info('Universities: university1@test.com to university2@test.com (password: admin123)');
        $this->command->info('All emails are pre-verified!');
    }
}