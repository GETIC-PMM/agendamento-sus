<?php

use App\Http\Controllers\API\AppointmentController;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\AppointmentTypeController;
use App\Http\Controllers\API\PatientController;
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

Route::controller(PatientController::class)->group(function () {
    Route::get('patients/{cpf}', 'show')->name('patients.show');
    Route::get('patients/cns/{cns}', 'search')->name('patients.search');
    Route::get('patients/lastRecord/{cpf}', 'lastRecord')->name('patients.lastRecord');
});

Route::controller(AppointmentTypeController::class)->group(function () {
    Route::get('appointment-types', 'index')->name('appointment-types.index');
    Route::get('appointment-types/{id}', 'show')->name('appointment-types.show');
});

Route::controller(UnitController::class)->group(function () {
    Route::get('units/esus', 'search')->name('units.search');
    Route::get('units/{name}', 'searchUnitByName')->name('units.searchByName');
});

Route::controller(AppointmentController::class)->group(function () {
    Route::get('appointments/{unit_id}/{date}', 'search')->name('appointments.search');
    Route::post('appointments', 'store')->name('appointments.store');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::resource('units', UnitController::class);
    Route::controller(AppointmentTypeController::class)->group(function () {
        Route::post('appointment-types', 'store')->name('appointment-types.store');
        Route::put('appointment-types/{id}', 'update')->name('appointment-types.update');
        Route::delete('appointment-types/{id}', 'destroy')->name('appointment-types.destroy');
    });

    Route::resource('appointments', AppointmentController::class);
    Route::get('users', [RegisterController::class, 'list'])->name('users.list');
});
