<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Silber\Bouncer\BouncerFacade as Bouncer;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\University;
use Illuminate\Support\Str;

class UserRoleController extends Controller
{
    public function showRoleSelection()
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        return inertia('Auth/RoleSelection');
    }

    public function assignRole(Request $request)
    {
        $request->validate([
            'role' => 'required|string|in:Student,Organizer,University,Admin,Lecturer,Department Staff'
        ]);

        try {
            DB::beginTransaction();
            
            $user = Auth::user();
            
            // Remove all existing roles and abilities
            Bouncer::sync($user)->roles([]);
            
            // Map roles to their entity types
            $roleEntityMap = [
                'Student' => 'App\\Models\\Student',
                'Lecturer' => 'App\\Models\\Lecturer',
                'Department Staff' => 'App\\Models\\DepartmentStaff',
                'Organizer' => 'App\\Models\\Organizer',
                'University' => 'App\\Models\\University',
                'Admin' => 'App\\Models\\Admin'
            ];

            // Convert role name to Bouncer format (lowercase and underscored)
            $bouncerRole = strtolower(str_replace(' ', '_', $request->role));
            
            // Create the role if it doesn't exist
            $role = Bouncer::role()->firstOrCreate([
                'name' => $bouncerRole,
                'title' => $request->role,
                'entity_type' => $roleEntityMap[$request->role]
            ]);
            
            // Assign the role directly using DB to ensure entity_type is set
            DB::table('assigned_roles')->insert([
                'role_id' => $role->id,
                'entity_id' => $user->id,
                'entity_type' => 'App\\Models\\User',
                'restricted_to_id' => null,
                'restricted_to_type' => null,
                'scope' => null
            ]);
            
            // Update user role field in users table
            DB::table('users')->where('id', $user->id)->update(['role' => $request->role]);

            // Create role-specific profile
            switch ($request->role) {
                case 'Student':
                    \App\Models\Student::create([
                        'student_id' => Str::uuid()->toString(),
                        'user_id' => $user->id,
                        'year' => 1 // Default value
                    ]);
                    break;

                case 'Lecturer':
                    \App\Models\Lecturer::create([
                        'lecturer_id' => Str::uuid()->toString(),
                        'user_id' => $user->id,
                        'department' => '' // Will be updated in profile
                    ]);
                    break;

                case 'Department Staff':
                    \App\Models\DepartmentStaff::create([
                        'staff_id' => Str::uuid()->toString(),
                        'user_id' => $user->id,
                        'department' => '', // Will be updated in profile
                        'position' => ''    // Will be updated in profile
                    ]);
                    break;

                case 'Organizer':
                    \App\Models\Organizer::create([
                        'organizer_id' => Str::uuid()->toString(),
                        'user_id' => $user->id,
                        'organization_name' => '', // Will be updated in profile
                        'official_email' => $user->email,
                        'status' => 'Pending'
                    ]);
                    break;

                case 'University':
                    \App\Models\University::create([
                        'university_id' => Str::uuid()->toString(),
                        'user_id' => $user->id,
                        'name' => $user->name,
                        'contact_email' => $user->email
                    ]);
                    break;
            }

            // Clear any cached abilities
            Bouncer::refresh();
            
            DB::commit();
            
            return redirect()->route('dashboard');
            
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Failed to assign role. Please try again. Error: ' . $e->getMessage());
        }
    }
}
