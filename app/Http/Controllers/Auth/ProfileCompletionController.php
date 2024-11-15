<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ProfileCompletionController extends Controller
{
    /**
     * Display the registration view.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/CompleteProfile');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'matric_no' => 'required|string|unique:'.User::class,
            'university' => 'required|string',
            'faculty' => 'required|string',
            'phone_no' => 'required|string|max:15|unique:'.User::class,
        ]);

        $user = Auth::user();
        $user->update([
            'name' => strtoupper($request->name),
            'matric_no' => strtoupper($request->matric_no),
            'university' => $request->university,
            'faculty' => $request->faculty,
            'phone_no' => $request->phone_no,
            'is_profile_complete' => true,
        ]);

        return redirect()->route('dashboard');
    }
}
