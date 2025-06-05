<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Project extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'type',
        'status',
        'priority',
        'start_date',
        'expected_end_date',
        'actual_end_date',
        'team_id',
        'student_id',
        'supervisor_id',
        'progress_percentage',
        'supervisor_request_status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'expected_end_date' => 'date',
        'actual_end_date' => 'date',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function updates()
    {
        return $this->hasMany(ProjectUpdate::class);
    }

    public function getLatestUpdate()
    {
        return $this->updates()->latest()->first();
    }

    // Helper methods for supervisor request handling
    public function acceptSupervisorRequest()
    {
        $this->update([
            'supervisor_request_status' => 'accepted'
        ]);
    }

    public function rejectSupervisorRequest()
    {
        $this->update([
            'supervisor_request_status' => 'rejected',
            'supervisor_id' => null
        ]);
    }

    public function isSupervisorRequestPending()
    {
        return $this->supervisor_request_status === 'pending';
    }

    public function isSupervisorRequestAccepted()
    {
        return $this->supervisor_request_status === 'accepted';
    }

    public function isSupervisorRequestRejected()
    {
        return $this->supervisor_request_status === 'rejected';
    }
} 