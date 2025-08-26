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
        
        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function edit($role): Response
    {
        $roleModel = \Bouncer::role()->find($role);
        
        if (!$roleModel) {
            abort(404);
        }

        return Inertia::render('Admin/Roles/Edit', [
            'role' => $roleModel
        ]);
    }

    public function update(Request $request, $role): \Illuminate\Http\RedirectResponse
    {
        $roleModel = \Bouncer::role()->find($role);
        
        if (!$roleModel) {
            abort(404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
        ]);

        $roleModel->update([
            'name' => $request->name,
            'title' => $request->title,
        ]);

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