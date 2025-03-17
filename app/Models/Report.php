<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{

    protected $primaryKey = 'report_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'generated_by',
        'report_type',
        'event_id',
        'data',
        'reviewed_by',    // Admin who reviewed
        'viewed_by'       // Lecturer/Staff who viewed
    ];

    protected $casts = [
        'data' => 'array',
        'report_type' => 'string'
    ];

    // Relationship with Admin (reviewer)
    public function reviewer()
    {
        return $this->belongsTo(Admin::class, 'reviewed_by', 'admin_id');
    }

    // Relationship with Lecturer (viewer)
    public function lecturerViewer()
    {
        return $this->belongsTo(Lecturer::class, 'viewed_by', 'lecturer_id');
    }

    // Relationship with Department Staff (viewer)
    public function staffViewer()
    {
        return $this->belongsTo(DepartmentStaff::class, 'viewed_by', 'staff_id');
    }

}
