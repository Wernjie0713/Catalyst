<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;

class Organizer extends Model
{
    use HasUuids;

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
        'verified_by',
        'application_document',
        'profile_photo_path'
    ];

    protected $attributes = [
        'status' => 'Pending'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
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
