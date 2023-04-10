<?php

namespace App\Http\Controllers\Messenger;

use App\Http\Controllers\Controller;
use App\Models\AppointmentType;
use App\Models\Patient;
use App\Models\Unit;
use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Outgoing\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OngoingConversation extends Conversation
{
    protected $name;
    protected $cpf;
    protected $patient;
    protected $unit_name;

    public function askName()
    {
        $intro = 'Olá sou o Bot de Agendamentos do ESUS. <br> Como gostaria de ser chamado(a)?';
        $this->ask($intro, function (Answer $answer) {
            $this->name = $answer->getText();
            $this->say('Bem vindo, ' . $this->name . '! Estou aqui para lhe ajudar a agendar uma consulta no ESUS. <br> Para isso preciso checar se suas informações já constam na base de dados do ESUS.');
            $this->askCPF();
        });
    }

    public function askCPF()
    {
        $talk = 'Poderia me informar seu CPF?';
        $this->ask($talk, function (Answer $answer) {
            $this->cpf = $answer->getText();
            $this->say('Seu cpf é: ' . $this->cpf);

            $question = Question::create('Essa informação está correta?')->callbackId('check_cpf')->addButtons([
                Button::create('Sim')->value('sim'),
                Button::create('Não')->value('nao'),
            ]);

            $this->ask($question, function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    if ($answer->getValue() === 'sim') {
                        $this->checkCPF($this->cpf);
                    } else {
                        $this->say('Ok, vamos tentar novamente');
                        $this->askCPF();
                    }
                }
            });
        });
    }


    public function checkCPF($cpf)
    {
        $this->patient = Patient::where('nu_cpf', $cpf)->first();
        $lastRecord = DB::connection('esus')->table('tb_prontuario')->where('co_cidadao', $this->patient->co_seq_cidadao)->first();
        $lastVisit = DB::connection('esus')->table('tb_atend')->where('co_prontuario', $lastRecord->co_seq_prontuario)->first();
        $unit = DB::connection('esus')->table('tb_unidade_saude')->select('no_unidade_saude')->where('co_seq_unidade_saude', $lastVisit->co_unidade_saude)->first();

        if (is_null($this->patient))
            $this->say('Não foi possível encontrar seu cadastro no ESUS pelo seu CPF. <br> Por favor, procure a unidade de saúde mais próxima para realizar/atualizar seu cadastro.');
        elseif (is_null($lastRecord))
            $this->say('Não foi possível encontrar seu prontuário no ESUS. <br> Por favor, procure a unidade de saúde mais próxima para realizar/atualizar seu cadastro.');
        elseif (is_null($lastVisit))
            $this->say('Não foi possível encontrar seu último atendimento no ESUS. <br> Por favor, procure a unidade de saúde mais próxima para realizar/atualizar seu cadastro.');
        else {
            $this->say('Seu cadastro foi encontrado com sucesso! <br> Seu último atendimento foi realizado na unidade: <br>' . $unit->no_unidade_saude);

            $this->unit_name = $unit->no_unidade_saude;

            $question = Question::create('Essa informação está correta?')->callbackId('check_unidade')->addButtons([
                Button::create('Sim')->value('sim'),
                Button::create('Não')->value('nao'),
            ]);

            $this->ask($question, function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    if ($answer->getValue() === 'sim') {
                        $this->checkUnit($this->patient, $this->unit_name);
                    } else {
                        $this->say('Ok, vamos tentar novamente');
                        $this->askCPF();
                    }
                }
            });
        }
    }

    public function checkUnit($patient, $unit_name)
    {
        //checar se a Unidade de saúde está no banco local
        $unit = Unit::where('name', $unit_name)->first();
        if (is_null($unit))
            $this->say('Não foi possível encontrar a unidade de saúde informada. <br> Por favor, procure a unidade de saúde mais próxima para realizar/atualizar seu cadastro.');
        else
            $this->appointmentType($patient, $unit_name);
    }

    public function appointmentType($patient, $unit)
    {
        $tipos_consulta = AppointmentType::all();
        $buttons = [];
        foreach ($tipos_consulta as $tipo_consulta) {
            $buttons[] = Button::create($tipo_consulta->name)->value($tipo_consulta->name);
        }
        $question = Question::create('Qual o tipo de atendimento que você deseja?')->callbackId('appointment_type')->addButtons($buttons);

        $this->unit_name = $unit;
        $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                $this->say('Você escolheu ' . $answer->getValue() . ' na ' . $this->unit_name);
            }
        });
    }



    public function run()
    {
        $this->askName();
    }
}
