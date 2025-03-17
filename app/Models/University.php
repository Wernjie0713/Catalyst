<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;

class University extends Model
{
    use HasUuids;

    protected $primaryKey = 'university_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'university_id',
        'user_id',
        'name',
        'location',
        'contact_email',
        'website',
        'contact_number',
        'bio',
        'profile_photo_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function getProfilePhotoUrlAttribute()
    {
        return $this->profile_photo_path
            ? Storage::disk('public')->url($this->profile_photo_path)
            : null;
    }
}