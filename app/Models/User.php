<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Silber\Bouncer\Database\HasRolesAndAbilities;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Organizer;
use App\Models\DepartmentStaff;
use App\Models\Lecturer;
use App\Models\University;
use App\Models\Admin;
use App\Models\Event;
use App\Models\Notification;
use Illuminate\Support\Str;
use App\Models\Enrollment;
use App\Models\Friend;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRolesAndAbilities, HasApiTokens;

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function organizer()
    {
        return $this->hasOne(Organizer::class, 'user_id', 'id');
    }

    public function department_staff()
    {
        return $this->hasOne(DepartmentStaff::class, 'user_id', 'id');
    }

    public function lecturer()
    {
        return $this->hasOne(Lecturer::class, 'user_id', 'id');
    }

    public function university()
    {
        return $this->hasOne(University::class, 'user_id', 'id');
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'admin_id', 'id');
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id', 'id');
    }

    // Relationship with Created Events
    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'creator_id', 'id');
    }

    public function enrolledEvents()
    {
        return $this->belongsToMany(Event::class, 'enrollments', 'user_id', 'event_id')
                    ->using(Enrollment::class)
                    ->withPivot(['enrollment_id'])
                    ->withTimestamps();
    }

    // Add this method to get role name
    public function getRoleAttribute()
    {
        return $this->roles()->first()?->name ?? null;
    }

    public function friends()
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    public function friendsTo()
    {
        return $this->hasMany(Friend::class, 'user_id');
    }

    public function friendsFrom()
    {
        return $this->hasMany(Friend::class, 'friend_id');
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_members', 'user_id', 'team_id')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'user_id');
    }

    // Add this method to your User model
    public function getAllFriends()
    {
        return Friend::where(function($query) {
                $query->where('user_id', $this->id)
                      ->orWhere('friend_id', $this->id);
            })
            ->where('status', 'accepted');
    }
}
