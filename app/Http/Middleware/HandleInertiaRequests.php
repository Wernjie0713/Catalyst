<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\DB;
 

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $user = $request->user();
        $shared = [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles()->get()->map(function($role) {
                        return [
                            'name' => $role->name,
                            'title' => $role->title
                        ];
                    }),
                    'notifications' => $user->notifications()
                        ->latest()
                        ->take(20)
                        ->get()
                        ->map(function($notification) {
                            return [
                                'id' => $notification->id,
                                'data' => $notification->data,
                                'created_at' => $notification->created_at->diffForHumans(),
                                'read_at' => $notification->read_at,
                            ];
                        }),
                    'unread_count' => $user->unreadNotifications()->count(),
                ] : null,
                'url' => $request->path(),
            ],
        ];

        return array_merge(parent::share($request), $shared);
    }
}
