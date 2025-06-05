<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $primaryKey = 'event_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'event_id',
        'title',
        'date',
        'time',
        'location',
        'description',
        'max_participants',
        'enrolled_count',
        'status',
        'event_type',
        'creator_id',
        'cover_image',
        'is_external',
        'registration_url',
        'organizer_name',
        'organizer_website',
        'is_team_event',
        'min_team_members',
        'max_team_members',
        'label_tags',
    ];

    protected $appends = ['enrolled_count', 'is_enrolled', 'enrolled_teams_count'];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime',
        'max_participants' => 'integer',
        'status' => 'string',
        'event_type' => 'string',
        'is_external' => 'boolean',
        'is_team_event' => 'boolean',
        'min_team_members' => 'integer',
        'max_team_members' => 'integer',
        'label_tags' => 'array',
    ];

    protected static function booted()
    {
        static::retrieved(function ($event) {
            $event->updateStatus();
        });
    }

    public function updateStatus()
    {
        $eventDate = Carbon::parse($this->date)->startOfDay();
        $today = Carbon::now()->startOfDay();
        $newStatus = null;

        if ($eventDate->equalTo($today)) {
            $newStatus = 'Ongoing';
        } else if ($eventDate->greaterThan($today)) {
            $newStatus = 'Upcoming';
        } else {
            $newStatus = 'Completed';
        }

        // Only update if status has changed
        if ($newStatus !== $this->status) {
            $this->status = $newStatus;
            $this->saveQuietly();
        }
    }

    public function saveQuietly(array $options = [])
    {
        return static::withoutEvents(function () use ($options) {
            return $this->save($options);
        });
    }

    // Add this method to get the enrollment count
    public function getEnrolledCountAttribute()
    {
        if ($this->is_external) return null;
        
        if ($this->is_team_event) {
            // Count individual users enrolled via teams
            return $this->enrollments()->whereNotNull('team_id')->count();
        } else {
            // Standard individual enrollment count
            return $this->enrollments()->whereNull('team_id')->count();
        }
    }

    // Get count of enrolled teams
    public function getEnrolledTeamsCountAttribute()
    {
        if (!$this->is_team_event || $this->is_external) return null;
        
        return $this->enrollments()
            ->whereNotNull('team_id')
            ->distinct('team_id')
            ->count('team_id');
    }

    // Check if current user is enrolled
    public function getIsEnrolledAttribute()
    {
        if (!auth()->check()) return false;
        
        $userId = auth()->id();
        
        // Check for direct enrollment
        $directEnrollment = $this->enrollments()
            ->where('user_id', $userId)
            ->whereNull('team_id')
            ->exists();
            
        if ($directEnrollment) return true;
        
        // If it's a team event, check if user is part of an enrolled team
        if ($this->is_team_event) {
            return $this->enrollments()
                ->whereNotNull('team_id')
                ->whereHas('team.members', function($query) use ($userId) {
                    $query->where('user_id', $userId)
                          ->where('status', 'accepted');
                })
                ->exists();
        }
        
        return false;
    }

    // Get the enrolled team of current user if any
    public function userEnrolledTeam()
    {
        if (!auth()->check() || !$this->is_team_event) return null;
        
        $userId = auth()->id();
        
        return $this->enrollments()
            ->whereNotNull('team_id')
            ->whereHas('team.members', function($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->where('status', 'accepted');
            })
            ->with('team')
            ->first()?->team;
    }

    // Relationship with User (creator)
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    // Relationship with Enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'event_id', 'event_id');
    }

    // Relationship with Students through Enrollments
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments', 'event_id', 'student_id')
                    ->using(Enrollment::class)
                    ->withPivot('status', 'enrollment_id')
                    ->withTimestamps();
    }

    // Relationship with Teams
    public function enrolledTeams()
    {
        return $this->belongsToMany(Team::class, 'enrollments', 'event_id', 'team_id')
                    ->using(Enrollment::class)
                    ->withPivot('enrollment_id')
                    ->distinct()
                    ->withTimestamps();
    }

    // Relationship with Certificates
    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'event_id', 'event_id');
    }

    public function enrolledUsers()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'event_id', 'user_id')
                    ->using(Enrollment::class)
                    ->withPivot('enrollment_id', 'team_id')
                    ->withTimestamps();
    }

    // Add new method to check if event is external
    public function isExternal()
    {
        return $this->is_external;
    }

    // Add new method to check if event is team-based
    public function isTeamEvent()
    {
        return $this->is_team_event;
    }

    // Add this method to the Event model
    public function feedback()
    {
        return $this->hasMany(Feedback::class, 'event_id', 'event_id');
    }

    public function certificateTemplates()
    {
        return $this->hasMany(CertificateTemplate::class, 'event_id', 'event_id');
    }
}
