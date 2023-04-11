<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secretary extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_type_id',
        'unit_id',
        'days'
    ];

    protected $casts = [
        'days' => 'array'
    ];

    protected $primaryKey = null;
    public $incrementing = false;
}
