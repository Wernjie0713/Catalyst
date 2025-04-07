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
use App\Http\Controllers\ViewProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\CertificateTemplateController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ReportController;


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
    
// User and Profile routes
Route::middleware(['auth'])->group(function () {
    // Role selection routes
    Route::get('/role-selection', [UserRoleController::class, 'showRoleSelection'])
        ->name('role.selection');
    Route::post('/user/assign-role', [UserRoleController::class, 'assignRole'])
        ->name('user.assign.role')
        ->middleware(['auth', 'web']);

    // Profile routes
    Route::middleware(['auth', 'verified'])->group(function () {
        // Common profile routes
        Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::post('/profile/photo', [ProfileController::class, 'updateProfilePhoto'])->name('profile.photo');

        // Role-specific profile updates
        Route::patch('/profile/department-staff/update', [ProfileController::class, 'updateDepartmentStaff'])
            ->name('profile.department-staff.update');
        
        Route::patch('/profile/student/update', [ProfileController::class, 'updateStudent'])
            ->name('profile.student.update');
        
        Route::patch('/profile/lecturer/update', [ProfileController::class, 'updateLecturer'])
            ->name('profile.lecturer.update');
        
        Route::patch('/profile/organizer/update', [ProfileController::class, 'updateOrganizer'])
            ->name('profile.organizer.update');
        
        Route::patch('/profile/university/update', [ProfileController::class, 'updateUniversity'])
            ->name('profile.university.update');

        Route::patch('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    });

    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.markAsRead');

    // Friend System Routes
    Route::post('/friend/request/{user}', [FriendController::class, 'sendRequest'])
        ->name('friend.request');
    Route::post('/friend/accept/{request}', [FriendController::class, 'acceptRequest'])
        ->name('friend.accept');
    Route::post('/friend/reject/{request}', [FriendController::class, 'rejectRequest'])
        ->name('friend.reject');
    Route::get('/friends', [FriendController::class, 'getFriendsList'])
        ->middleware(['can:team_grouping'])
        ->name('friends.list');
    Route::get('/friend/pending', [FriendController::class, 'getPendingRequests'])
        ->name('friend.pending');

    Route::delete('/friend/remove/{friend}', [FriendController::class, 'removeFriend'])
        ->name('friend.remove');

    Route::middleware(['auth', 'can:report_view'])->group(function () {
        // Reports route - make sure this is inside the auth middleware group
        Route::get('/reports', [ReportController::class, 'index'])
            ->name('reports.index');
    });
});

Route::middleware(['can:team_grouping'])->group(function () {
    Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::post('/teams/add-member', [TeamController::class, 'addMember'])->name('teams.add-member');
    Route::delete('/teams/{teamId}/members/{userId}', [TeamController::class, 'removeMember'])
        ->name('teams.remove-member');
    Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::post('/teams/{teamId}/accept', [TeamController::class, 'acceptTeamInvitation'])
        ->name('teams.accept-invitation');
    Route::post('/teams/{teamId}/reject', [TeamController::class, 'rejectTeamInvitation'])
        ->name('teams.reject-invitation');
    Route::get('/teams/pending', [TeamController::class, 'getPendingInvitations'])
        ->name('teams.pending');
    Route::get('/teams/{teamId}/available-friends', [TeamController::class, 'getAvailableFriends'])
        ->name('teams.available-friends');
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

Route::middleware(['auth','can:event_upload'])->group(function () {
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
});

Route::middleware(['auth','can:event_view'])->group(function () {
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/my-events', [EventController::class, 'myEvents'])->name('events.my-events');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::post('/events/{event}/enroll', [EnrollmentController::class, 'store'])->name('events.enroll');
    Route::delete('/events/{event}/unenroll', [EnrollmentController::class, 'destroy'])->name('events.unenroll');
    Route::get('/events/{event}/enrolled-users', [EventController::class, 'getEnrolledUsers'])
        ->name('events.enrolled-users');
    Route::get('/events/{event}/available-teams', [EnrollmentController::class, 'getAvailableTeams'])
        ->name('events.available-teams');
});

Route::get('/view/{user}',[ViewProfileController::class,'show'])
    ->name('profile.view')
    ->middleware('auth','verified','can:view_otherprofile');

Route::post('/notifications/{id}/read',function(string $id){
    auth()->user()->notifications()->findOrFail($id)->markAsRead();
    return back();
})->middleware(['auth']);

Route::post('/notifications/mark-all-as-read',[NotificationController::class,'markAllAsRead'])
    ->middleware(['auth'])
    ->name('notifications.mark-all-as-read');

// Certificate Template Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/events/{event}/certificates/create', [CertificateTemplateController::class, 'create'])
        ->name('certificates.create');
    Route::post('/events/{event}/certificates', [CertificateTemplateController::class, 'store'])
        ->name('certificates.store');
    Route::get('/events/{event}/certificates/{template}/preview', [CertificateTemplateController::class, 'preview'])
        ->name('certificates.preview');
});

Route::middleware(['auth'])->group(function () {
    // Feedback routes with specific ability checks
    Route::get('/events/{event}/feedback/create', [FeedbackController::class, 'create'])
        ->middleware('can:event_feedback')
        ->name('feedback.create');

    Route::post('/events/{event}/feedback', [FeedbackController::class, 'store'])
        ->middleware('can:event_feedback')
        ->name('feedback.store');

    Route::get('/events/{event}/feedback', [FeedbackController::class, 'index'])
        ->middleware('can:event_feedbackview')
        ->name('feedback.index');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/student/certificates', [CertificateController::class, 'studentCertificates'])
        ->name('student.certificates');
    Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])
        ->name('certificates.download');
});

require __DIR__.'/auth.php';