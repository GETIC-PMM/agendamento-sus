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
        $patient = Patient::where('nu_cpf', $cpf)->first();
        if (is_null($patient))
            return $this->sendError('Patient not found.');
        $lastRecord = DB::connection('esus')->table('tb_prontuario')->where('co_cidadao', $patient->co_seq_cidadao)->first();
        if (is_null($lastRecord))
            return $this->sendError('Not possible to track last record.');
        $lastVisit = DB::connection('esus')->table('tb_atend')->where('co_prontuario', $lastRecord->co_seq_prontuario)->first();
        if (is_null($lastVisit))
            return $this->sendError('Not possible to track last record.');
        $unit = DB::connection('esus')->table('tb_unidade_saude')->select('no_unidade_saude')->where('co_seq_unidade_saude', $lastVisit->co_unidade_saude)->first();

        if (is_null($unit))
            return $this->sendError('Not possible to track last record.');
        else
            return $this->sendResponse($unit, 'Last record retrieved successfully.');
    }
}
