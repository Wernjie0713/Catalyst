<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Silber\Bouncer\BouncerFacade;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'is_profile_complete' => true,
        ]);

        $admin->assign(['admin']);

        // // // Create 100 users and assign them the 'user' role
        // $users = User::factory(100)->create()->each(function ($user) {
        //     $user->update([
        //     'name' => 'John Doe',
        //     'email' => 'user' . $user->id . '@example.com',
        //     'email_verified_at' => now(),
        //     'matric_no' => 'MATRIC' . $user->id,
        //     'password' => bcrypt('password'),
        //     'faculty' => 'Engineering',
        //     'university' => 'Example University',
        //     'phone_no' => '123456789' . $user->id,
        //     'is_profile_complete' => true,
        //     ]);
        // });

        // foreach ($users as $user) {
        //     $user->assign('user');
        // }

        // Define abilities
        BouncerFacade::ability()->firstOrCreate([
            'name' => 'edit-profile',
            'title' => 'Edit Profile',
        ]);

        // Assign ability to user role only
        BouncerFacade::allow('user')->to('edit-profile');
        BouncerFacade::disallow('admin')->to('edit-profile');
    }
}
