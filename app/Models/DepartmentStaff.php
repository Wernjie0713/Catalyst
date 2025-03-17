<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class DepartmentStaff extends Model
{
    protected $table = 'department_staff';
    protected $primaryKey = 'staff_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'staff_id',
        'user_id',
        'department',
        'position',
        'contact_number',
        'bio',
        'linkedin',
        'profile_photo_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Department Staff can view/manage reports
    public function reports()
    {
        return $this->hasMany(Report::class, 'viewed_by', 'staff_id');
    }

    public function getProfilePhotoUrlAttribute()
    {
        if ($this->profile_photo_path) {
            // Use response()->file() to serve the image securely
            return route('profile.photo', ['path' => $this->profile_photo_path]);
        }
        return null;
    }
}