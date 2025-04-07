<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Team extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'creator_id',
        'member_count',
    ];

    protected $casts = [
        'member_count' => 'integer',
    ];

    protected $appends = ['available_slots'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->hasMany(TeamMember::class, 'team_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'team_id');
    }

    public function enrolledEvents()
    {
        return $this->belongsToMany(Event::class, 'enrollments', 'team_id', 'event_id')
                    ->using(Enrollment::class)
                    ->withPivot('enrollment_id')
                    ->withTimestamps();
    }

    public function getAvailableSlotsAttribute()
    {
        return max(0, $this->member_limit - $this->member_count);
    }

    public function updateMemberCount()
    {
        $count = $this->members()->where('status', 'accepted')->count();
        $this->update(['member_count' => $count]);
        return $this;
    }

    public function meetsEventRequirements(Event $event)
    {
        if (!$event->is_team_event) {
            return false;
        }

        $acceptedMembersCount = $this->members()->where('status', 'accepted')->count();
        
        $meetsMin = !$event->min_team_members || $acceptedMembersCount >= $event->min_team_members;
        $meetsMax = !$event->max_team_members || $acceptedMembersCount <= $event->max_team_members;
        
        return $meetsMin && $meetsMax;
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