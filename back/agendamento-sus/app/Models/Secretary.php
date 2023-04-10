<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secretary extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointement_type_id',
        'unit_id',
        'quantity',
        'days'
    ];
}
