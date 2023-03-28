<?php

use App\Models\User;
use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Incoming\Answer;

class InfoConversation extends Conversation
{
    protected $cpf;

    public function askCPF()
    {
        $this->ask('Seu cpf:', function (Answer $answer) {
            $this->cpf = $answer->getText();
            $this->say('Seu cpf é: ' . $this->cpf);
            // $end = $this->checkName($this->cpf);
            // $this->say($end);
        });
    }

    public function checkName($email)
    {
        $user = User::where('email', $email)->first();
        if ($user) {
            return 'Olá ' . $user->name . ', como posso ajudar?';
        } else {
            return 'Usuário não encontrado';
        }
    }

    public function run()
    {
        $this->askCPF();
    }
}
