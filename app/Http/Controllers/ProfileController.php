<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Silber\Bouncer\BouncerFacade as Bouncer;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Display the user's profile.
     */
    public function show(Request $request): Response
    {
        try {
            $user = $request->user();

            if ($user->isA('student')) {
                $user->load('student');
                $user->profile_photo_url = $user->student?->profile_photo_path 
                    ? Storage::disk('public')->url($user->student->profile_photo_path)
                    : null;
                return Inertia::render('Profile/Student/Profile', [
                    'user' => $user
                ]);
            }

            if ($user->isA('lecturer')) {
                $user->load('lecturer');
                $user->profile_photo_url = $user->lecturer?->profile_photo_path 
                    ? Storage::disk('public')->url($user->lecturer->profile_photo_path)
                    : null;
                return Inertia::render('Profile/Lecturer/Profile', [
                    'user' => $user
                ]);
            }

            if ($user->isA('organizer')) {
                $user->load('organizer');
                return Inertia::render('Profile/Organizer/Profile', [
                    'user' => $user
                ]);
            }

            if ($user->isA('department_staff')) {
                $user->load('departmentStaff');
                return Inertia::render('Profile/DepartmentStaff/Profile', [
                    'user' => $user
                ]);
            }

            if ($user->isA('university')) {
                $user->load('university');
                return Inertia::render('Profile/University/Profile', [
                    'user' => $user
                ]);
            }

            // Fallback for unknown roles
            Log::warning('User with unknown role attempted to access profile', ['user_id' => $user->id]);
            return Inertia::render('Profile/Profile', [
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Error in profile show method', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id
            ]);
            
            throw $e;
        }
    }

    /**
     * Update student profile information.
     */
    public function updateStudentProfile(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            // Add debug logging
            Log::info('Received student profile update request', [
                'user_id' => $user->id,
                'request_data' => $request->all()
            ]);

            if (!$user->isA('student')) {
                Log::warning('Unauthorized access attempt', ['user_id' => $user->id]);
                return back()->withErrors(['error' => 'Unauthorized access.']);
            }

            // Validate request
            $validated = $request->validate([
                'matric_no' => ['required', 'string', 'max:255'],
                'year' => ['required', 'integer', 'min:1', 'max:6'],
                'level' => ['required', 'string'],
                'contact_number' => ['required', 'string', 'max:15'],
                'bio' => ['nullable', 'string'],
                'faculty' => ['required', 'string', 'max:255'],
                'university' => ['required', 'string', 'max:255'],
                'expected_graduate' => ['required', 'integer'],
            ]);

            Log::info('Validated data', ['validated' => $validated]);

            // Find or create student record
            $student = $user->student ?? $user->student()->create([]);

            if (!$student) {
                Log::error('Student record not found and could not be created', ['user_id' => $user->id]);
                return back()->withErrors(['error' => 'Student record not found.']);
            }

            DB::beginTransaction();
            try {
                // Log before update
                Log::info('Current student data', ['before_update' => $student->toArray()]);
                
                $student->fill($validated);
                $student->save();

                // Log after update
                Log::info('Updated student data', ['after_update' => $student->fresh()->toArray()]);

                DB::commit();
                
                return back()->with('message', 'Profile updated successfully.');
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error updating student profile', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return back()->withErrors(['error' => 'Failed to update profile: ' . $e->getMessage()]);
            }
        } catch (\Exception $e) {
            Log::critical('Unexpected error in updateStudentProfile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Something went wrong: ' . $e->getMessage()]);
        }
    }

    /**
     * Update lecturer profile information.
     */
    public function updateLecturerProfile(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            if (!$user->isA('lecturer')) {
                return Redirect::back()->withErrors(['error' => 'Unauthorized access']);
            }

            $validated = $request->validate([
                'department' => ['required', 'string', 'max:255'],
                'specialization' => ['nullable', 'string', 'max:255'],
                'contact_number' => ['required', 'string', 'max:255'],
                'bio' => ['nullable', 'string'],
                'linkedin' => ['nullable', 'string', 'url', 'max:255'],
            ]);

            $user->lecturer->update($validated);
            return Redirect::back()->with('message', 'Profile updated successfully');

        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => 'Failed to update profile. ' . $e->getMessage()]);
        }
    }

    /**
     * Update organizer profile information.
     */
    public function updateOrganizerProfile(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            if (!$user->isA('organizer')) {
                return Redirect::back()->withErrors(['error' => 'Unauthorized access']);
            }

            $validated = $request->validate([
                'contact_number' => ['required', 'string', 'max:255'],
                'bio' => ['nullable', 'string'],
                'linkedin' => ['nullable', 'string', 'url', 'max:255'],
                'website' => ['nullable', 'string', 'url', 'max:255'],
                'organization_name' => ['required', 'string', 'max:255'],
                'official_email' => ['required', 'email', 'max:255'],
            ]);

            $user->organizer->update($validated);
            return Redirect::back()->with('message', 'Profile updated successfully');

        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => 'Failed to update profile. ' . $e->getMessage()]);
        }
    }

    /**
     * Update department staff profile information.
     */
    public function updateDepartmentStaffProfile(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            if (!$user->isA('department_staff')) {
                return Redirect::back()->withErrors(['error' => 'Unauthorized access']);
            }

            $validated = $request->validate([
                'department' => ['required', 'string', 'max:255'],
                'position' => ['required', 'string', 'max:255'],
                'contact_number' => ['required', 'string', 'max:255'],
                'bio' => ['nullable', 'string'],
                'linkedin' => ['nullable', 'string', 'url', 'max:255'],
            ]);

            $user->departmentStaff->update($validated);
            return Redirect::back()->with('message', 'Profile updated successfully');

        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => 'Failed to update profile. ' . $e->getMessage()]);
        }
    }

    /**
     * Update university profile information.
     */
    public function updateUniversityProfile(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            if (!$user->isA('university')) {
                return Redirect::back()->withErrors(['error' => 'Unauthorized access']);
            }

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'location' => ['required', 'string', 'max:255'],
                'contact_email' => ['required', 'email', 'max:255'],
                'website' => ['nullable', 'string', 'url', 'max:255'],
                'contact_number' => ['required', 'string', 'max:255'],
                'bio' => ['nullable', 'string'],
            ]);

            if (!$user->university) {
                $university = new \App\Models\University($validated);
                $university->user_id = $user->id;
                $university->university_id = Str::uuid()->toString();
                $university->save();
            } else {
                $user->university->update($validated);
            }

            return Redirect::back()->with('message', 'Profile updated successfully');

        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => 'Failed to update profile. ' . $e->getMessage()]);
        }
    }

    public function showPhoto(string $path): BinaryFileResponse|StreamedResponse
    {
        // Check if user is authorized to view this photo
        $user = auth()->user();
        $model = null;

        if ($user->isA('student')) {
            $model = $user->student;
        } elseif ($user->isA('lecturer')) {
            $model = $user->lecturer;
        } elseif ($user->isA('organizer')) {
            $model = $user->organizer;
        } elseif ($user->isA('university')) {
            $model = $user->university;
        } elseif ($user->isA('department_staff')) {
            $model = $user->departmentStaff;
        }

        // Check if this photo belongs to the user
        if (!$model || $model->profile_photo_path !== $path) {
            abort(403);
        }

        // Check if file exists
        if (!Storage::disk('local')->exists($path)) {
            abort(404);
        }

        // Return file response
        return response()->file(
            Storage::disk('local')->path($path)
        );
    }

    public function storePhoto(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'],
            ]);

            $user = $request->user();
            $model = null;
            $type = '';

            if ($user->isA('student')) {
                $model = $user->student;
                $type = 'Student';
            } elseif ($user->isA('organizer')) {
                $model = $user->organizer;
                $type = 'Organizer';
            } elseif ($user->isA('university')) {
                $model = $user->university;
                $type = 'University';
            } elseif ($user->isA('lecturer')) {
                $model = $user->lecturer;
                $type = 'Lecturer';
            } elseif ($user->isA('department_staff')) {
                $model = $user->departmentStaff;
                $type = 'DepartmentStaff';
            }

            if (!$model) {
                return response()->json(['error' => 'User type not found'], 400);
            }

            if ($request->hasFile('photo')) {
                // Delete old photo if exists
                if ($model->profile_photo_path && file_exists(public_path($model->profile_photo_path))) {
                    unlink(public_path($model->profile_photo_path));
                }

                $file = $request->file('photo');
                $filename = time() . '_' . $file->getClientOriginalName();
                
                // Store in public directory like events
                $file->move(public_path('images/' . $type . 'Profile'), $filename);
                $path = 'images/' . $type . 'Profile/' . $filename;

                // Save path to database
                $model->profile_photo_path = $path;
                $model->save();

                return response()->json([
                    'message' => 'Photo updated successfully',
                    'path' => $path,
                    'url' => asset($path)
                ]);
            }

            return response()->json(['error' => 'No photo file in request'], 400);

        } catch (\Exception $e) {
            Log::error('Photo upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroyPhoto(Request $request): RedirectResponse
    {
        $user = $request->user();
        $model = null;

        if ($user->isA('student')) {
            $model = $user->student;
        } elseif ($user->isA('organizer')) {
            $model = $user->organizer;
        } elseif ($user->isA('university')) {
            $model = $user->university;
        } elseif ($user->isA('lecturer')) {
            $model = $user->lecturer;
        } elseif ($user->isA('department_staff')) {
            $model = $user->departmentStaff;
        }

        if (!$model) {
            return back()->withErrors(['error' => 'Unable to determine user type']);
        }

        if ($model->profile_photo_path) {
            Storage::disk('local')->delete($model->profile_photo_path);
            $model->profile_photo_path = null;
            $model->save();
        }

        return back()->with('success', 'Photo removed successfully.');
    }
}
