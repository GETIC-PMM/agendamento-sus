<?php

namespace App\Http\Controllers\Messenger;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentType;
use App\Models\Patient;
use App\Models\Secretary;
use App\Models\Unit;
use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Outgoing\Question;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class OngoingConversation extends Conversation
{
    protected $name;
    protected $cpf;
    protected $patient;
    protected $unit;
    protected $day;
    protected $tipo;
    protected $date;
    protected $phone;
    protected $whatsapp;

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
        elseif (is_null($unit))
            $this->say('Não foi possível encontrar a unidade de saúde do seu último atendimento no ESUS. <br> Por favor, procure a unidade de saúde mais próxima para realizar/atualizar seu cadastro.');
        else {
            $this->say('Seu cadastro foi encontrado com sucesso! <br> Seu último atendimento foi realizado na unidade: <br>' . $unit->no_unidade_saude);

            $this->unit = $unit->no_unidade_saude;

            $question = Question::create('Essa informação está correta?')->callbackId('check_unidade')->addButtons([
                Button::create('Sim')->value('sim'),
                Button::create('Não')->value('nao'),
            ]);

            $this->ask($question, function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    if ($answer->getValue() === 'sim') {
                        $this->checkUnit($this->patient, $this->unit);
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
            $this->appointmentType($patient, $unit);
    }

    public function appointmentType($patient, $unit)
    {
        $tipos_consulta = AppointmentType::all();
        $buttons = [];
        foreach ($tipos_consulta as $tipo_consulta) {
            $buttons[] = Button::create($tipo_consulta->name)->value($tipo_consulta->id);
        }
        $question = Question::create('Qual o tipo de atendimento que você deseja?')->callbackId('appointment_type')->addButtons($buttons);

        $this->unit = $unit;
        $this->patient = $patient;
        $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                $this->say('Você escolheu ' . $answer->getValue() . ' na ' . $this->unit->name);
                $this->tipo = $answer->getValue();
            }
            $this->askDate($this->unit, $this->tipo);
        });
    }

    public function askDate($unit, $tipo)
    {
        $secretary = Secretary::where('unit_id', $unit->id)->where('appointment_type_id', $tipo)->first();
        $buttons = [];
        foreach ($secretary->days as $day) {
            if ($day['slots'] > 0)
                $buttons[] = Button::create($day['day'])->value($day['day']);
        }

        $question = Question::create('Qual o dia da semana vc deseja?')->callbackId('appointment_date')->addButtons($buttons);
        if (count($buttons) == 0)
            $this->say('Infelizmente não há mais nenhum dia com vagas disponíveis para esta unidade e este tipo de consulta.');
        else {
            $this->say('Para esta Unidade de Saúde e este tipo de consulta temos os seguintes dias disponíveis:');
            $this->ask($question, function (Answer $answer) {
                if ($answer->isInteractiveMessageReply()) {
                    $this->say('Você escolheu ' . $answer->getValue());
                    $this->day = $answer->getValue();
                    $this->askPhoneNumber();
                }
            });
        }
    }

    public function askPhoneNumber()
    {
        $this->ask('Informe algum número para contato, incluindo DDD?', function (Answer $answer) {
            if (strlen($answer->getText()) < 10 || strlen($answer->getText()) > 11) {
                $this->say('<b>Número inválido, por favor informe um número válido</b>');
                $this->askPhoneNumber();
            } else {
                $this->phone = $answer->getText();
                $this->say('Seu número de telefone é: ' . $this->phone);
                $question = Question::create('Essa informação está correta?')->callbackId('ask_number')->addButtons([
                    Button::create('Sim')->value('sim'),
                    Button::create('Não')->value('nao'),
                ]);

                $this->ask($question, function (Answer $answer) {
                    if ($answer->isInteractiveMessageReply()) {
                        if ($answer->getValue() === 'sim') {
                            $this->isWhatsapp();
                        } else {
                            $this->say('Ok, vamos tentar novamente');
                            $this->askPhoneNumber();
                        }
                    }
                });
            }
        });
    }

    public function isWhatsapp()
    {
        $confirm = Question::create('O número informado é Whatsapp?')->callbackId('confirm_whatsapp')->addButtons([
            Button::create('Sim')->value('Sim'),
            Button::create('Não')->value('Não'),
        ]);
        $this->ask($confirm, function (Answer $resp) {
            if ($resp->isInteractiveMessageReply()) {
                $this->whatsapp = $resp->getText();
                $this->createAppointment();
            }
        });
    }

    public function createAppointment()
    {
        $date = $this->findDate($this->day);
        //$this->date = $date;

        $this->say('
            <b>Confirmação de Agendamento</b>
            <br>
            <br>
            <b>Unidade de Saúde:</b> ' . $this->unit->name . '
            <br>
            <b>Tipo de Consulta:</b> ' . AppointmentType::find($this->tipo)->name . '
            <br>
            <b>Dia da Semana:</b> ' . $this->day . '
            <br>
            <b>Data:</b> ' . $date->format('d/m/Y') . '
            <br>
            <b>Telefone:</b> ' . $this->phone . '
            <br>
            <b>Whatsapp:</b> ' . $this->whatsapp . '
            <br>
            <br>');

        $question = Question::create('Confirma o agendamento?')->callbackId('confirm_appointment')->addButtons([
            Button::create('Sim')->value('sim'),
            Button::create('Não')->value('nao'),
        ]);

        $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                if ($answer->getValue() === 'sim') {
                    $this->say('Só um instante');
                    $this->saveAppointment();
                } else {
                    $this->say('Ok, vamos tentar novamente');
                    $this->askPhoneNumber();
                }
            }
        });
    }

    public function saveAppointment()
    {
        $date = $this->findDate($this->day);
        $is_wpp = $this->whatsapp == 'Sim' ? true : false;

        Appointment::create([
            'name' => $this->name,
            'cpf' => $this->cpf,
            'date' => $date,
            'unit_id' => $this->unit->id,
            'appointment_type_id' => $this->tipo,
            'phone_number' => $this->phone,
            'is_phone_number_whatsapp' => $is_wpp,
            'status' => 'Agendado',
        ]);

        //atualizando a quantidade de vagas disponíveis
        $secretary = Secretary::select('days')::where('unit_id', $this->unit->id)->where('appointment_type_id', $this->tipo)->first();
        $day = $secretary->days->where('day', $this->day)->first();
        $day['slots'] = $day['slots'] - 1;
        //$secretary->days = $secretary->days->where('day', '!=', $this->day)->push($day);
        $secretary->save();


        $this->say('<br><b>Seu agendamento foi realizado com sucesso. <br> Obrigado por utilizar o nosso serviço de agendamento.</b>');
    }

    public function findDate($day)
    {
        $translate = [
            'Segunda' => 'Monday',
            'Terça' => 'Tuesday',
            'Quarta' => 'Wednesday',
            'Quinta' => 'Thursday',
            'Sexta' => 'Friday',
            'Sábado' => 'Saturday',
            'Domingo' => 'Sunday',
        ];

        $translated = $translate[$day];

        $date = Carbon::now();
        $date->next($translated);
        $date->hour = 8;
        $date->minute = 0;
        $date->second = 0;

        return $date;
    }

    public function run()
    {
        $this->askName();
    }
}
