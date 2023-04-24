<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appointment = Appointment::all();
        return $this->sendResponse($appointment, 'Appointment retrieved successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'cpf' => 'required',
            'date' => 'required',
            'status' => 'required',
            'unit_id' => 'required',
            'appointment_type_id' => 'required',
            'phone_number' => 'required',
            'is_phone_number_whatsapp' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $appointment = Appointment::create($input);

        return $this->sendResponse($appointment, 'Appointment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $appointment = Appointment::find($id);

        if (is_null($appointment)) {
            return $this->sendError('Appointment not found.');
        }
        return $this->sendResponse($appointment, 'Appointment retrieved successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'cpf' => 'required',
            'date' => 'required',
            'status' => 'required',
            'user_id' => 'required',
            'unit_id' => 'required',
            'appointment_type_id' => 'required',

        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $appointment->name = $input['name'];
        $appointment->cpf = $input['cpf'];
        $appointment->date = $input['date'];
        $appointment->status = $input['status'];
        $appointment->user_id = $input['user_id'];
        $appointment->unit_id = $input['unit_id'];
        $appointment->appointment_type_id = $input['appointment_type_id'];
        $appointment->save();

        return $this->sendResponse($appointment, 'Appointment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $appointment = Appointment::find($id);

        if (is_null($appointment)) {
            return $this->sendError('Appointment not found.');
        }

        $appointment->delete();

        return $this->sendResponse($appointment, 'Appointment deleted successfully.');
    }

    public function search(string $id, string $date)
    {
        $appointment = Appointment::where('date', $date)->get();
        $unit = Unit::select('appointment_quantity')->where('id', $id)->first();

        if (is_null($appointment)) {
            return $this->sendError('Appointment not found.');
        }

        if ($appointment->count() >= $unit->appointment_quantity) {
            return $this->sendError('No more appointments available for this date.');
        }

        return $this->sendResponse($appointment->count(), 'Appointments count retrieved successfully.');
    }

    public function searchByUnit(string $id)
    {
        $appointments = Appointment::where('unit_id', $id)->get();

        if (is_null($appointments)) {
            return $this->sendError('Appointment not found.');
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function searchByCPF(string $cpf)
    {
        $appointments = Appointment::where('cpf', $cpf)->get();

        if (is_null($appointments)) {
            return $this->sendError('Appointment not found.');
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function searchByDate(string $date)
    {
        $appointments = Appointment::where('date', $date)->get();

        if (is_null($appointments)) {
            return $this->sendError('Appointment not found.');
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }
}
