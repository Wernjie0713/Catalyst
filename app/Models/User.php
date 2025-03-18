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

    // Relationship with Notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'id');
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

}
