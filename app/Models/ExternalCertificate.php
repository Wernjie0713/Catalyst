<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExternalCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'issue_date',
        'certificate_image',
        'description',
    ];

    protected $casts = [
        'issue_date' => 'date',
    ];

    /**
     * Get the user that owns the external certificate.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
