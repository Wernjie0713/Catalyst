<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Organizer extends Model
{
    protected $primaryKey = 'organizer_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'organizer_id',
        'user_id',
        'contact_number',
        'bio',
        'linkedin',
        'website',
        'organization_name',
        'official_email',
        'status',
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
