<?php

namespace App\Http\Controllers\Messenger;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Outgoing\Question;
use Illuminate\Http\Request;

class OngoingConversation extends Conversation
{
    protected $name;
    protected $cpf;

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
        $patient = Patient::where('nu_cpf', $cpf)->first();
        if (is_null($patient)) {
            $this->say('Não foi possível encontrar seu cadastro no ESUS pelo seu CPF. <br> Por favor, procure a unidade de saúde mais próxima para realizar/atualizar seu cadastro.');
        } else {
            $this->say($patient->no_cidadao);
        }
    }

    public function run()
    {
        $this->askName();
    }
}
