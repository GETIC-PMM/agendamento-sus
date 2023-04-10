<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Secretary;
use Illuminate\Http\Request;

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
        $list = Secretary::find($unit_id, $appointement_type_id);

        if (is_null($list)) {
            return $this->sendError('List not found.');
        }
        return $this->sendResponse($list, 'List retrieved successfully.');
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
    public function update(Request $request, string $id)
    {
        $list = Secretary::find($id);
        $list->update($request->all());
        return $this->sendResponse($list, 'List updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $list = Secretary::find($id);
        $list->delete();
        return $this->sendResponse($list, 'List deleted successfully.');
    }
}
