<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Silber\Bouncer\Bouncer;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = \Bouncer::role()->all();
        
        // Ensure roles is always an array and has the required properties
        $formattedRoles = $roles->map(function($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'title' => $role->title,
                'entity_type' => $role->entity_type,
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
            ];
        });
        
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $formattedRoles
        ]);
    }

    public function edit($role): Response
    {
        $roleModel = \Bouncer::role()->find($role);
        
        if (!$roleModel) {
            abort(404);
        }

        // Get all abilities
        $abilities = \Bouncer::ability()->all()->map(function($ability) {
            return [
                'id' => $ability->id,
                'name' => $ability->name,
                'title' => $ability->title,
            ];
        });

        // Get abilities assigned to this role by querying the permissions table directly
        // First, let's debug what we're looking for
        \Log::info('Role Debug Info', [
            'role_id' => $roleModel->id,
            'role_name' => $roleModel->name,
            'entity_type_from_class' => get_class($roleModel),
        ]);

        // Let's check what's actually in the permissions table for this role
        $permissionsDebug = \DB::table('permissions')
            ->where('permissions.entity_id', $roleModel->id)
            ->get();
        
        \Log::info('Permissions Debug', [
            'permissions_found' => $permissionsDebug->toArray(),
        ]);

        // Try different approaches to get the abilities
        // Method 1: Direct database query without entity_type filter
        $roleAbilities = \DB::table('permissions')
            ->join('abilities', 'permissions.ability_id', '=', 'abilities.id')
            ->where('permissions.entity_id', $roleModel->id)
            ->where('permissions.forbidden', false)
            ->pluck('abilities.name')
            ->toArray();

        // Method 2: Try using Bouncer's built-in method
        try {
            $bouncerAbilities = \Bouncer::ability()->getForRole($roleModel)->pluck('name')->toArray();
            \Log::info('Bouncer Method Abilities', [
                'bouncer_abilities' => $bouncerAbilities,
            ]);
        } catch (\Exception $e) {
            \Log::info('Bouncer method failed', [
                'error' => $e->getMessage(),
            ]);
        }

        // Method 3: Try getting abilities through the role model directly
        try {
            $roleModelAbilities = $roleModel->getAbilities()->pluck('name')->toArray();
            \Log::info('Role Model Method Abilities', [
                'role_model_abilities' => $roleModelAbilities,
            ]);
        } catch (\Exception $e) {
            \Log::info('Role model method failed', [
                'error' => $e->getMessage(),
            ]);
        }

        \Log::info('Role Abilities Found', [
            'abilities' => $roleAbilities,
        ]);

        return Inertia::render('Admin/Roles/Edit', [
            'role' => [
                'id' => $roleModel->id,
                'name' => $roleModel->name,
                'title' => $roleModel->title,
                'entity_type' => $roleModel->entity_type,
            ],
            'abilities' => $abilities,
            'roleAbilities' => $roleAbilities
        ]);
    }

    public function update(Request $request, $role): \Illuminate\Http\RedirectResponse
    {
        $roleModel = \Bouncer::role()->find($role);
        
        if (!$roleModel) {
            abort(404);
        }

        $request->validate([
            'abilities' => 'required|array',
            'abilities.*' => 'string|exists:abilities,name',
        ]);

        // Update role abilities using Bouncer
        \Bouncer::sync($roleModel)->abilities($request->abilities);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy($role): \Illuminate\Http\RedirectResponse
    {
        $roleModel = \Bouncer::role()->find($role);
        
        if (!$roleModel) {
            abort(404);
        }

        // Check if role is assigned to any users
        $usersWithRole = \Bouncer::role($roleModel)->getUsers();
        
        if ($usersWithRole->count() > 0) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'Cannot delete role that is assigned to users.');
        }

        $roleModel->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
