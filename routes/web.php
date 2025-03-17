<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EnrollmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Event;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/setting', [ProfileController::class, 'edit'])->name('setting.edit');
    Route::patch('/setting', [ProfileController::class, 'update'])->name('setting.update');
    Route::delete('/setting', [ProfileController::class, 'destroy'])->name('setting.destroy');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    
    // Profile form submission routes for each role
    Route::patch('/profile/student', [ProfileController::class, 'updateStudentProfile'])->name('profile.student.update');
    Route::patch('/profile/lecturer', [ProfileController::class, 'updateLecturerProfile'])->name('profile.lecturer.update');
    Route::patch('/profile/organizer', [ProfileController::class, 'updateOrganizerProfile'])->name('profile.organizer.update');
    Route::patch('/profile/department-staff', [ProfileController::class, 'updateDepartmentStaffProfile'])->name('profile.department-staff.update');
    Route::patch('/profile/university', [ProfileController::class, 'updateUniversityProfile'])->name('profile.university.update');
    Route::post('/profile/photo', [ProfileController::class, 'storePhoto'])->name('profile.photo');
    Route::delete('/profile/photo', [ProfileController::class, 'destroyPhoto'])->name('profile.photo.destroy');
});

Route::middleware(['auth', 'can:admin'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::controller(RoleController::class)->group(function () {
            Route::get('/roles', 'index')->name('roles.index');
            Route::get('/roles/{role}/edit', 'edit')->name('roles.edit');
            Route::put('/roles/{role}', 'update')->name('roles.update');
            Route::delete('/roles/{role}', 'destroy')->name('roles.destroy');
        });
    });
});


Route::middleware(['auth'])->group(function () {
    Route::get('/role-selection', [UserRoleController::class, 'showRoleSelection'])
        ->name('role.selection');
    Route::post('/assign-role', [UserRoleController::class, 'assignRole'])
        ->name('user.assign.role');
});

Route::middleware(['auth','can:event_upload'])->group(function () {
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
});

Route::middleware(['auth','can:event_view'])->group(function () {
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/my-events', [EventController::class, 'myEvents'])->name('events.my-events');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::post('/events/{event}/enroll', [EnrollmentController::class, 'store'])->name('events.enroll');
    Route::delete('/events/{event}/unenroll', [EnrollmentController::class, 'destroy'])->name('events.unenroll');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/profile/photo', [ProfileController::class, 'storePhoto'])->name('profile.photo');
    Route::delete('/profile/photo', [ProfileController::class, 'destroyPhoto'])->name('profile.photo.destroy');
    Route::get('/profile/photo/{path}', [ProfileController::class, 'showPhoto'])->name('profile.photo');
});

require __DIR__.'/auth.php';