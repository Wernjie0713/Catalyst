<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\ProfileCompletionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Silber\Bouncer\BouncerFacade;
use App\Models\User;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/complete-profile', [ProfileCompletionController::class, 'show'])->name('profile.complete');
    Route::post('/complete-profile', [ProfileCompletionController::class, 'update']);

    Route::get('/dashboard', function (Request $request) {
        if (!Auth::user()->is_profile_complete) {
            return redirect()->route('profile.complete');
        }

        return Inertia::render('Dashboard', [
            'isAdmin' => BouncerFacade::is(Auth::user())->an('admin'),
            'users' => User::where('id', '!=', 1)
                   ->where('is_profile_complete', true)
                   ->orderBy('id', 'asc')
                   ->paginate(10),
        ]);
    })->name('dashboard');
});

Route::middleware('auth', 'can:edit-profile')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
