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
                        'user_id' => $user->id
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
            
            // Set a session flag to indicate role was just selected
            session()->put('role_selected', true);
            
            // Redirect to profile completion instead of dashboard
            return redirect()->route('profile.completion');
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

    /**
     * Show the profile completion form based on the user's role
     */
    public function showProfileCompletion()
    {
        $user = Auth::user();
        $role = $user->roles()->first()?->name;
        
        if (!$role) {
            return redirect()->route('role.selection');
        }

        return inertia('Auth/ProfileCompletion', [
            'auth' => [
                'user' => $user
            ],
            'role' => $role
        ]);
    }

    /**
     * Save the profile completion data
     */
    public function saveProfileCompletion(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $user = Auth::user();
            $role = $user->roles()->first()?->name;
            
            if (!$role) {
                return redirect()->route('role.selection');
            }

            \Log::info('Saving profile completion data', [
                'user_id' => $user->id,
                'role' => $role,
                'data' => $request->all()
            ]);

            // Update the corresponding model based on role
            switch ($role) {
                case 'student':
                    $user->student()->update($request->only([
                        'matric_no', 'year', 'level', 'contact_number', 
                        'bio', 'faculty', 'university', 'programme', 'expected_graduate'
                    ]));
                    break;
                    
                case 'lecturer':
                    $lecturer = \App\Models\Lecturer::where('user_id', $user->id)->first();
                    if ($lecturer) {
                        $lecturer->update($request->only([
                            'specialization', 'faculty', 'university',
                            'contact_number', 'bio', 'linkedin'
                        ]));
                    }
                    break;
                    
                case 'department_staff':
                    // Enforce required university for new/updated submissions
                    $request->validate([
                        'university' => 'required|string|max:255',
                    ]);
                    $user->department_staff()->update($request->only([
                        'department', 'position', 'faculty', 'university',
                        'contact_number', 'bio', 'linkedin'
                    ]));
                    break;
                    
                case 'organizer':
                    $user->organizer()->update($request->only([
                        'organization_name', 'official_email', 'website',
                        'contact_number', 'bio', 'linkedin'
                    ]));
                    break;
                    
                case 'university':
                    try {
                        // Get the university instance
                        $university = \App\Models\University::where('user_id', $user->id)->first();
                        
                        if (!$university) {
                            \Log::error('University record not found for user', ['user_id' => $user->id]);
                            throw new \Exception('University record not found');
                        }
                        
                        // Update using query builder to bypass any model issues
                        $updated = DB::table('universities')
                            ->where('university_id', $university->university_id)
                            ->update([
                                'name' => $request->name,
                                'location' => $request->location,
                                'contact_email' => $request->contact_email,
                                'website' => $request->website,
                                'contact_number' => $request->contact_number,
                                'bio' => $request->bio,
                                'updated_at' => now()
                            ]);
                    } catch (\Exception $e) {
                        \Log::error('Error updating university profile', [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                        throw $e;
                    }
                    break;
            }

            DB::commit();
            
            \Log::info('Profile completion saved successfully');
            
            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Profile completion failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);
            
            return back()->with('error', 'Failed to save profile: ' . $e->getMessage());
        }
    }
}
