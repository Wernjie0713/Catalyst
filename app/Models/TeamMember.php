<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

class TeamMember extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'team_id',
        'user_id',
        'status'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });

        // Update member count when status changes to accepted
        static::saved(function ($model) {
            if ($model->isDirty('status') && $model->status === 'accepted') {
                $model->team->updateMemberCount();
            }
        });

        // Update member count when member is removed
        static::deleted(function ($model) {
            $model->team->updateMemberCount();
        });
    }

    // Add scope for accepted members
    public function scopeAccepted(Builder $query)
    {
        return $query->where('status', 'accepted');
    }

    // Add scope for pending members
    public function scopePending(Builder $query)
    {
        return $query->where('status', 'pending');
    }
} 