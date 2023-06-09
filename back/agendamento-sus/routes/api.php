<?php

use App\Http\Controllers\API\AppointmentController;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\AppointmentTypeController;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\SecretaryController;
use App\Models\Appointment;
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
    Route::get('units/apointment_type/{id}', 'searchAppointmentByUnit')->name('units.search-appointment-by-unit');
});

Route::controller(AppointmentController::class)->group(function () {
    Route::get('appointments/units/{unit_id}', 'searchByUnit')->name('appointments.search-by-unit');
    Route::get('appointments/check/{unit_id}/{appointment_type_id}/{cpf}/{date}', 'checkSlots')->name('appointments.check-slots');
    Route::get('appointments/checkByPatient/{appointment_type_id}/{cpf}', 'checkSlotsByPatient')->name('appointments.check-slots-by-patient');
    //Route::get('appointments/{unit_id}/{date}', 'search')->name('appointments.search');
    Route::post('appointments', 'store')->name('appointments.store');
});

Route::get('secretaries/appointment_type/{unit_id}', [SecretaryController::class, 'listAppointmentsFromUnit'])->name('secretaries.list-appointments-unit');

Route::middleware('auth:sanctum')->group(function () {
    Route::resource('units', UnitController::class);
    Route::controller(AppointmentTypeController::class)->group(function () {
        Route::post('appointment-types', 'store')->name('appointment-types.store');
        Route::put('appointment-types/{id}', 'update')->name('appointment-types.update');
        Route::delete('appointment-types/{id}', 'destroy')->name('appointment-types.destroy');
    });

    //Route::resource('secretaries', SecretaryController::class);
    Route::controller(SecretaryController::class)->group(function () {
        Route::get('secretaries', 'index')->name('secretaries.index');
        Route::post('secretaries', 'store')->name('secretaries.store');
        Route::put('secretaries/{unit_id}/{appointment_type_id}', 'update')->name('secretaries.update');
        Route::delete('secretaries/{unit_id}/{appointment_type_id}', 'destroy')->name('secretaries.destroy');

        Route::get('secretaries/by-unit/{unit_id}', [SecretaryController::class, 'getAppointmentsByUnit'])->name('secretaries.get-appointments-by-unit');
        Route::get('secretaries/{unit_id}/{appointment_type_id}', [SecretaryController::class, 'search'])->name('secretaries.search');
    });

    Route::controller(AppointmentController::class)->group(function () {
        Route::get('appointments', 'index')->name('appointments.index');
        Route::get('appointments/byCPF/{unit_id}/{cpf}', 'searchByCPF')->name('search.by-cpf');
        Route::get('appointments/byDate/{unit_id}/{date}', 'searchByDate')->name('search.by-date');
        Route::get('appointments/byAppointmentType/{unit_id}/{appointment_type_id}', 'searchByAppointmentType')->name('search.by-appointment-type');
        Route::get('appointments/{id}', 'show')->name('appointments.show');
        Route::put('appointments/{id}', 'cancelAppointment')->name('appointments.cancel-appintment');
        Route::delete('appointments/{id}', 'destroy')->name('appointments.destroy');
    });

    //Route::resource('appointments', AppointmentController::class);
    Route::get('users', [RegisterController::class, 'list'])->name('users.list');
});
