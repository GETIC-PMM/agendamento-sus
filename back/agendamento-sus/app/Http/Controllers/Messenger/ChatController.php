<?php


namespace App\Http\Controllers\Messenger;

use App\Http\Controllers\Controller;
use App\Models\User;
use BotMan\BotMan\BotMan;
use BotMan\BotMan\Messages\Incoming\Answer;
use Illuminate\Http\Request;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Cache\LaravelCache;
use BotMan\BotMan\Drivers\DriverManager;
use InfoConversation;

class ChatController extends Controller
{
    /**
     * Place your BotMan logic here.
     */
    public function handle()
    {
        $botman = app('botman');
        $botman->listen();
    }

    public function startConversation(BotMan $bot)
    {
        $bot->startConversation(new InfoConversation());
    }
    public function frame()
    {
        return view('chatbot.frame');
    }
}
