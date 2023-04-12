<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'name',
        'cpf',
        'date',
        'unit_id',
        'appointment_type_id',
        'status',
        'phone_number',
        'is_phone_number_whatsapp',
    ];
}
