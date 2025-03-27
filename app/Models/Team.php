<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Team extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'creator_id',
        'member_count'
    ];

    protected $appends = ['available_slots'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->hasMany(TeamMember::class, 'team_id')->with('user');
    }

    public function getAvailableSlotsAttribute()
    {
        return max(0, $this->member_limit - $this->member_count);
    }

    public function updateMemberCount()
    {
        // Count accepted members including the creator
        $count = $this->members()
            ->where('status', 'accepted')
            ->count();
        
        // Update the member count
        $this->update(['member_count' => $count]);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }
} 