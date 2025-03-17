<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade as Bouncer;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Bouncer::role()->all();
        
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles->map(function($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'title' => ucwords(str_replace('_', ' ', $role->name)),
                    'editUrl' => route('admin.roles.edit', $role->id),
                    'deleteUrl' => route('admin.roles.destroy', $role->id)
                ];
            })
        ]);
    }

    public function edit($id)
    {
        $role = Bouncer::role()->find($id);
        $abilities = Bouncer::ability()->all();
        $roleAbilities = $role->getAbilities()->pluck('name')->toArray();

        return Inertia::render('Admin/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'title' => ucwords(str_replace('_', ' ', $role->name))
            ],
            'abilities' => $abilities->map(function($ability) {
                return [
                    'id' => $ability->id,
                    'name' => $ability->name,
                    'title' => $ability->title ?? ucwords(str_replace('_', ' ', $ability->name))
                ];
            }),
            'roleAbilities' => $roleAbilities
        ]);
    }

    public function update(UpdateRoleRequest $request, $id)
    {
        $role = Bouncer::role()->find($id);
        $abilities = $request->validated('abilities');

        // Remove all existing abilities
        foreach ($role->getAbilities() as $ability) {
            Bouncer::disallow($role->name)->to($ability->name);
        }

        // Assign new abilities
        foreach ($abilities as $ability) {
            Bouncer::allow($role->name)->to($ability);
        }

        return redirect()->route('admin.roles.index')
            ->with('message', 'Role updated successfully');
    }

    public function destroy($id)
    {
        $role = Bouncer::role()->find($id);
        
        // Remove all abilities from role before deleting
        foreach ($role->getAbilities() as $ability) {
            Bouncer::disallow($role->name)->to($ability->name);
        }
        
        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('message', 'Role deleted successfully');
    }
} 