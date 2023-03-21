<?php

use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\AppointmentTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::controller(RegisterController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login');
});


Route::middleware('auth:sanctum')->group(function () {
    Route::resource('units', UnitController::class);
    Route::resource('appointment-types', AppointmentTypeController::class);
});
