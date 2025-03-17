<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Lecturer extends Model
{
    protected $primaryKey = 'lecturer_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'lecturer_id',
        'user_id',
        'department',
        'specialization',
        'contact_number',
        'bio',
        'linkedin',
        'profile_photo_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Lecturer can view/manage reports
    public function reports()
    {
        return $this->hasMany(Report::class, 'viewed_by', 'lecturer_id');
    }

    public function getProfilePhotoUrlAttribute()
    {
        return $this->profile_photo_path
            ? Storage::disk('public')->url($this->profile_photo_path)
            : null;
    }
}