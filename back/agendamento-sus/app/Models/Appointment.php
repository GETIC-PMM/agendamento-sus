<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cpf',
        'unit_id',
        'appointment_type_id',
        'date',
        'time',
        'status'
    ];
}
