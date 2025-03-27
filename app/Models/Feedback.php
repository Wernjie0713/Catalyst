<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Feedback extends Model
{
    use HasUuids;

    protected $primaryKey = 'feedback_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'event_id',
        'user_id',
        'rating',
        'comment',
    ];

    // Relationship with Event
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
} 