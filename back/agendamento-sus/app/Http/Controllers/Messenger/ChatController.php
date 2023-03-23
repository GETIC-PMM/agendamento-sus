<?php

namespace App\Http\Controllers\Messenger;

use App\Http\Controllers\Controller;
use BotMan\BotMan\Messages\Incoming\Answer;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Place your BotMan logic here.
     */
    public function handle()
    {
        $botman = app('botman');
        $botman->hears('Oi', function ($botman) {
            $botman->reply(
                'Olá, bem vindo ao Sistema de Agendamento de Consultas online Do ESUS.
            No momento, você pode agendar consultas com os seguintes profissionais:
            - Clínico Geral;
            - Odontólogo.
            Número de vagas disponíveis podem variar para cada Unidade de Saúde.'
            );
            $this->handleInfo($botman);
            // });
            // $botman->ask('Oi, qual seu nome?', function (Answer $answer) {
            //     $name = $answer->getText();
            //     $this->say('Olá ' . $name . ', como posso ajudar?');
            //     $this->hears('{message}', function ($botman, $message) {
            //         if ($message == 'cpf') {
            //             $this->askInfo($botman);
            //         } else {
            //             $botman->reply("Não posso ajudar");
            //         }
            //     });
            // });
        });

        $botman->listen();
    }

    /**
     * Place your BotMan logic here.
     */
    public function handleInfo($botman)
    {
        $botman->ask('Para começar, digite seu CPF (apenas números):', function (Answer $answer) {
            $cpf = $answer->getText();
            if ($cpf == '123456789') {
                $this->say('Olá Leopoldo, como posso ajudar?');
            } else {
                $this->invalidInfo($this);
            };
        });
    }

    public function invalidInfo($botman)
    {
        $botman->say('CPF inválido, tente novamente.');
        $botman->handleInfo($botman);
    }

    public function frame()
    {
        return view('chatbot.frame');
    }
}
