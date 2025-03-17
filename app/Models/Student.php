<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;

class Student extends Model
{
    use HasUuids;

    protected $primaryKey = 'student_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'student_id',
        'user_id',
        'matric_no',
        'year',
        'level',
        'contact_number',
        'bio',
        'faculty',
        'university',
        'expected_graduate',
        'profile_photo_path'
    ];

    protected $casts = [
        'year' => 'integer',
        'expected_graduate' => 'integer',
        'level' => 'string',
        'faculty' => 'string',
        'university' => 'string',
    ];

    // Ensure timestamps are enabled
    public $timestamps = true;

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Relationship with Enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id', 'student_id');
    }

    // Relationship with Events through Enrollments
    public function events()
    {
        return $this->belongsToMany(Event::class, 'enrollments', 'student_id', 'event_id')
                    ->using(Enrollment::class)
                    ->withPivot('status', 'enrollment_id')
                    ->withTimestamps();
    }

    // Relationship with Events (as creator)
    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'creator_id', 'student_id');
    }

    // Relationship with Certificates
    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'student_id', 'student_id');
    }

    // Relationship with Badges
    public function badges()
    {
        return $this->hasMany(Badge::class, 'student_id', 'student_id');
    }

    // Get full university name
    public function getUniversityNameAttribute()
    {
        $universities = [
            'UMP' => 'Universiti Malaysia Pahang',
            'UMS' => 'Universiti Malaysia Sabah',
            'UMT' => 'Universiti Malaysia Terengganu',
            'UKM' => 'Universiti Kebangsaan Malaysia',
            'UM' => 'Universiti Malaya',
            'USM' => 'Universiti Sains Malaysia',
            'UPM' => 'Universiti Putra Malaysia',
            'UTM' => 'Universiti Teknologi Malaysia',
            'UUM' => 'Universiti Utara Malaysia',
            'UIAM' => 'Universiti Islam Antarabangsa Malaysia',
            'UPSI' => 'Universiti Pendidikan Sultan Idris',
            'USIM' => 'Universiti Sains Islam Malaysia',
            'UiTM' => 'Universiti Teknologi MARA',
            'UNIMAS' => 'Universiti Malaysia Sarawak',
            'UTeM' => 'Universiti Teknikal Malaysia Melaka',
            'UniMAP' => 'Universiti Malaysia Perlis',
            'UTHM' => 'Universiti Tun Hussein Onn Malaysia',
            'UniSZA' => 'Universiti Sultan Zainal Abidin',
            'UPNM' => 'Universiti Pertahanan Nasional Malaysia',
            'UMK' => 'Universiti Malaysia Kelantan'
        ];

        return $universities[$this->university] ?? $this->university;
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
