<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Secretary;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $appointments = DB::table('appointments as a')
            ->where('a.unit_id', $id)
            ->leftJoin('appointment_types as at', 'at.id', '=', 'a.appointment_type_id')
            ->select('a.id', 'a.name', 'a.cpf', 'at.name as atendimento', 'a.date', 'a.status', 'a.phone_number', 'a.is_phone_number_whatsapp')
            ->get();

        if (is_null($appointments)) {
            return $this->sendError('Appointment not found.');
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function searchByCPF(int $unit_id, string $cpf)
    {
        $appointments = Appointment::where('unit_id', $unit_id)->where('cpf', $cpf)->get();

        if (is_null($appointments)) {
            return $this->sendError('Appointment not found.');
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function searchByDate(int $unit_id, string $date)
    {
        $appointments = Appointment::where('unit_id', $unit_id)->where('date', $date)->get();

        if (is_null($appointments)) {
            return $this->sendError('Appointment not found.');
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function searchByAppointmentType(int $unit_id, int $appointment_type_id)
    {
        $appointments = Appointment::where('unit_id', $unit_id)->where('appointment_type_id', $appointment_type_id)->get();

        if (is_null($appointments)) {
            return $this->sendError('Appointment not found.');
        }

        return $this->sendResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function checkSlots(string $unit, string $appointment, string $cpf, string $date)
    {
        $dotw = Carbon::parse($date)->dayOfWeek;
        $day = $this->translateDate($dotw);
        $slots = 0;
        $appointments = Appointment::where('date', $date)->count();
        $sec = Secretary::where('unit_id', $unit)->where('appointment_type_id', $appointment)->first();

        foreach ($sec->days as $value) {
            if ($value['day'] == $day)
                $slots = $value['slots'];
        }

        $appointmentsPacient = Appointment::where('cpf', $cpf)->where('appointment_type_id', $appointment)->count();

        if ($appointments >= $slots)
            return $this->sendResponse(false, 'Não há mais vagas disponíveis para esse dia.');
        else if ($appointmentsPacient >= 1)
            return $this->sendResponse(false, 'Já existe um agendamento para esse CPF e tipo de consulta.');
        else
            return $this->sendResponse(true, 'Agendamento disponível.');
    }

    // public function checkSlotsByPatient(string $appointment_id, string $cpf)
    // {


    //     if ($appointments >= 1)
    //         return $this->sendResponse(false, 'Appointments verified successfully.');
    //     else
    //         return $this->sendResponse(true, 'Appointments verified successfully.');
    // }

    public function translateDate($day)
    {
        $translate = [
            '1' => 'Segunda',
            '2' => 'Terça',
            '3' => 'Quarta',
            '4' => 'Quinta',
            '5' => 'Sexta',
            '6' => 'Sábado',
            '0' => 'Domingo',
        ];

        $translated = $translate[$day];

        return $translated;
    }

    public function cancelAppointment(string $id)
    {
        $appointment = Appointment::find($id);

        if (is_null($appointment)) {
            return $this->sendError('Appointment not found.');
        }

        $appointment->status = 'Cancelado';
        $appointment->save();

        return $this->sendResponse($appointment, 'Appointment canceled successfully.');
    }
}
