<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Secretary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SecretaryController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Secretary::all();
        return $this->sendResponse($list, 'List retrieved successfully.');
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
        $list = Secretary::create($request->all());
        return $this->sendResponse($list, 'List created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $unit_id, string $appointement_type_id)
    {
        //
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
    public function update(Request $request, int $unit_id, int $appointment_type_id)
    {
        $secretary = DB::update('update secretaries set days = ? where unit_id = ? and appointment_type_id = ?', [json_encode($request->days), $unit_id, $appointment_type_id]);
        return $this->sendResponse($secretary, 'List updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $unit_id, int $appointment_type_id)
    {
        $list = DB::delete('delete from secretaries where unit_id = ? and appointment_type_id = ?', [$unit_id, $appointment_type_id]);
        return $this->sendResponse($list, 'List deleted successfully.');
    }

    public function search(int $unit_id, int $appointment_type_id)
    {
        $list = Secretary::where('unit_id', $unit_id)
            ->where('appointment_type_id', $appointment_type_id)
            ->first();

        if (is_null($list)) {
            return $this->sendError('List not found.');
        }
        return $this->sendResponse($list, 'List retrieved successfully.');
    }

    public function listAppointmentsFromUnit(int $unit_id)
    {
        $list = Secretary::where('unit_id', $unit_id)
            ->get();

        if (is_null($list)) {
            return $this->sendError('List not found.');
        }
        return $this->sendResponse($list, 'List retrieved successfully.');
    }
}
