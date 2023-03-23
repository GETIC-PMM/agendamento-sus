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

        $botman->hears('{message}', function ($botman, $message) {

            if ($message == 'Oi') {
                $this->askName($botman);
            } else {
                $botman->reply("Não posso ajudar");
            }
        });

        $botman->listen();
    }

    /**
     * Place your BotMan logic here.
     */
    public function askName($botman)
    {
        $botman->ask('Me pergunte sobre alguém, e direi minha opinião:', function (Answer $answer) {

            $name = $answer->getText();
            if ($name == 'Pedro Avelino') {
                $this->say('Burguês safado e sem vergonha');
            } else {
                $this->say('Anjinho');
            }
        });
    }

    public function frame()
    {
        return view('chatbot.frame');
    }
}
