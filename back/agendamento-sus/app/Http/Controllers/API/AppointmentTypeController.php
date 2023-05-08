<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController as BaseController;
use App\Http\Resources\AppointmentTypeResource;
use App\Models\AppointmentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentTypeController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appoitmentTypes = AppointmentTypeResource::collection(AppointmentType::all());
        return $this->sendResponse($appoitmentTypes, 'Appointment types retrieved successfully.');
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
        if (AppointmentType::where('name', $request->name)->exists()) {
            return $this->sendError('Appointment type name already exists.');
        }
        $appoitmentType = AppointmentType::create($request->all());
        return $this->sendResponse($appoitmentType, 'Appointment type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $appoitmentType = AppointmentType::find($id);

        if (is_null($appoitmentType)) {
            return $this->sendError('Appointment type not found.');
        }
        return $this->sendResponse($appoitmentType, 'Appointment type retrieved successfully.');
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
    public function update(Request $request, AppointmentType $appoitmentType)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'duration' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $appoitmentType->name = $input['name'];
        $appoitmentType->duration = $input['duration'];
        $appoitmentType->save();

        return $this->sendResponse($appoitmentType, 'Appointment type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $appointmentType = AppointmentType::find($id);
        $appointmentType->delete();

        return $this->sendResponse($appointmentType, 'Appointment type deleted successfully.');
    }
}
