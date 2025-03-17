<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $primaryKey = 'event_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'event_id',
        'title',
        'description',
        'date',
        'time',
        'location',
        'max_participants',
        'event_type',
        'creator_id',
        'cover_image',
        'status'
    ];

    protected $appends = ['enrolled_count', 'is_enrolled'];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime',
        'max_participants' => 'integer',
        'status' => 'string',
        'event_type' => 'string'
    ];

    // Add this method to get the enrollment count
    public function getEnrolledCountAttribute()
    {
        return $this->enrollments()->count();
    }

    // Check if current user is enrolled
    public function getIsEnrolledAttribute()
    {
        if (!auth()->check()) return false;
        return $this->enrollments()->where('user_id', auth()->id())->exists();
    }

    // Relationship with User (creator)
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    // Relationship with Enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'event_id', 'event_id');
    }

    // Relationship with Students through Enrollments
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments', 'event_id', 'student_id')
                    ->using(Enrollment::class)
                    ->withPivot('status', 'enrollment_id')
                    ->withTimestamps();
    }

    // Relationship with Certificates
    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'event_id', 'event_id');
    }

    public function enrolledUsers()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'event_id', 'user_id')
                    ->using(Enrollment::class)
                    ->withPivot('enrollment_id')
                    ->withTimestamps();
    }
}
