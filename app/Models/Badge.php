<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{

    protected $primaryKey = 'badge_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'student_id',
        'name',
        'criteria'
    ];

    // Relationship with Student
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}