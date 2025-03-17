<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use App\Http\Resources\AdminResource;

class AdminController extends Controller
{
    public function index()
    {
        $admins = Admin::get();
        if($admins->count() > 0){
            return AdminResource::collection($admins);
        }else{
            return response()->json([
                'message' => 'Data Admin Tidak Ditemukan',
            ], 200);
        }
    }

    public function store()
    {

    }

    public function show()
    {

    }

    public function update()
    {

    }
    

    public function destroy()
    {

    }
}




