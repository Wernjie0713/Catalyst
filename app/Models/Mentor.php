<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'lecturer_id',
        'status',
        'message'
    ];

    protected $casts = [
        'student_id' => 'string',
        'lecturer_id' => 'string',
    ];

    /**
     * Get the student user (mentee)
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the lecturer user (mentor)
     */
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    /**
     * Scope for pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for accepted relationships
     */
    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    /**
     * Scope for lecturer's mentees
     */
    public function scopeForLecturer($query, $lecturerId)
    {
        return $query->where('lecturer_id', $lecturerId);
    }

    /**
     * Scope for student's mentors
     */
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
} 