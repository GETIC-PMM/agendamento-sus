<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rua',
        'numero',
        'bairro',
        'open_time',
        'close_time',
        'appointment_type_id'
    ];

    protected $casts = [
        'appointment_type_id' => 'array'
    ];

    public function appointmentTypes()
    {
        return $this->hasMany(AppointmentType::class);
    }
}
