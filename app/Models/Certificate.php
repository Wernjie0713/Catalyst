<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{

    protected $primaryKey = 'certificate_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'event_id',
        'student_id',
        'template',
        'issue_date'
    ];

    protected $casts = [
        'issue_date' => 'datetime'
    ];

    // Relationship with Event
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    // Relationship with Student
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}
