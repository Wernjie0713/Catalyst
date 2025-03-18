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
            'role' => 'required|string|in:student,organizer,university,admin,lecturer,department_staff'
        ]);

        try {
            DB::beginTransaction();
            
            $user = Auth::user();
            \Log::info('Starting role assignment', ['user' => $user->id, 'requested_role' => $request->role]);
            
            // Remove all existing roles and abilities
            Bouncer::sync($user)->roles([]);
            
            // Create the role if it doesn't exist
            $role = Bouncer::role()->firstOrCreate([
                'name' => $request->role,
                'title' => ucwords(str_replace('_', ' ', $request->role))
            ]);
            
            \Log::info('Role created/found', ['role_id' => $role->id]);

            // Assign role to user using Bouncer
            Bouncer::assign($request->role)->to($user);
            
            \Log::info('Role assigned to user');

            // Create the corresponding model instance with minimal required fields
            switch($request->role) {
                case 'student':
                    \App\Models\Student::create([
                        'student_id' => Str::uuid(),
                        'user_id' => $user->id
                    ]);
                    break;
                
                case 'department_staff':
                    \App\Models\DepartmentStaff::create([
                        'staff_id' => Str::uuid(),
                        'user_id' => $user->id,
                        'department' => 'Not Set', // Only if these are required fields
                        'position' => 'Not Set'    // Only if these are required fields
                    ]);
                    break;
                
                case 'lecturer':
                    \App\Models\Lecturer::create([
                        'lecturer_id' => Str::uuid(),
                        'user_id' => $user->id,
                        'department' => 'Not Set'  // Add this default value
                    ]);
                    break;
                
                case 'organizer':
                    \App\Models\Organizer::create([
                        'organizer_id' => Str::uuid(),
                        'user_id' => $user->id
                    ]);
                    break;
                
                case 'university':
                    \App\Models\University::create([
                        'university_id' => Str::uuid(),
                        'user_id' => $user->id
                    ]);
                    break;
            }
            
            \Log::info('Model instance created');

            DB::commit();
            Bouncer::refresh();  // Refresh Bouncer's cache
            
            \Log::info('Role assignment completed successfully');
            
            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Role assignment failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
                'requested_role' => $request->role
            ]);
            
            return back()->with('error', 'Failed to assign role: ' . $e->getMessage());
        }
    }
}
