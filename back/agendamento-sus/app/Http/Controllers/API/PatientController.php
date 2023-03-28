<?php



namespace App\Http\Controllers\API;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $cpf)
    {
        $patient = Patient::select('co_seq_tacidadao', 'nu_cpf', 'no_cidadao')->where('nu_cpf', $cpf)->first();
        if (is_null($patient))
            return $this->sendError('Patient not found.');
        else
            return $this->sendResponse($patient, 'Patient retrieved successfully.');
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Search for a cns
     */
    public function search(string $cns)
    {
        $patient = Patient::select('nu_cpf', 'no_cidadao')->where('nu_cns', $cns)->first();
        if (is_null($patient)) {
            return $this->sendError('Patient not found.');
        } else {
            return $this->sendResponse($patient, 'Patient retrieved successfully.');
        }
    }

    public function lastRecord(string $cpf)
    {
        $patient = Patient::where('nu_cpf', $cpf)->get('co_seq_tacidadao');
        $connection = DB::connection('esus')->table('ta_prontuario');
        $lastRecord = $connection->select('select co_seq_taprontuario from ta_prontuario where co_cidadao = ? order by ASC limit 1', [$patient]);
        if (is_null($lastRecord))
            return $this->sendError('Last record not found.');
        else
            return $this->sendResponse($lastRecord, 'Last record retrieved successfully.');
    }
}
