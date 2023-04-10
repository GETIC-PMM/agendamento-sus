<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Unit;
use App\Http\Resources\UnitResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UnitController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $units = Unit::all();
        return $this->sendResponse($units, 'Units retrieved successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'rua' => 'required',
            'numero' => 'required',
            'bairro' => 'required',
            'open_time' => 'required',
            'close_time' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $unit = Unit::create($input);

        return $this->sendResponse($unit, 'Unit created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $unit = Unit::find($id);

        if (is_null($unit)) {
            return $this->sendError('Unit not found.');
        }

        return $this->sendResponse($unit, 'Unit retrieved successfully.')->object();
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
    public function update(Request $request, Unit $unit)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required',
            'rua' => 'required',
            'numero' => 'required',
            'bairro' => 'required',
            'open_time' => 'required',
            'close_time' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $unit->name = $input['name'];
        $unit->rua = $input['rua'];
        $unit->numero = $input['numero'];
        $unit->bairro = $input['bairro'];
        $unit->open_time = $input['open_time'];
        $unit->close_time = $input['close_time'];
        $unit->save();

        return $this->sendResponse($unit, 'Unit updated successfully.')->object();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        $unit->delete();

        return $this->sendResponse([], 'Unit deleted successfully.')->object();
    }

    public function search()
    {
        $units = DB::connection('esus')->table('tb_unidade_saude')->select('no_unidade_saude', 'ds_logradouro', 'nu_numero', 'no_bairro')->get();
        return $this->sendResponse($units, 'Units retrieved successfully.');
    }

    public function searchUnitByName(string $name)
    {
        $units = Unit::where('name', 'like', '%' . $name . '%')->get();
        return $this->sendResponse($units, 'Unit retrieved successfully.');
    }
}
