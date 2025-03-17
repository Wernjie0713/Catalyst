<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{

    protected $primaryKey = 'notification_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'is_read'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'type' => 'string'
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}
