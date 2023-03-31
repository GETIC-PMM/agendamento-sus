<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'duration'
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
