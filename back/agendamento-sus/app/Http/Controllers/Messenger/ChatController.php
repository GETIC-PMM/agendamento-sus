<?php


namespace App\Http\Controllers\Messenger;

use App\Http\Controllers\Controller;
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
        $botman = DriverManager::loadDriver(\BotMan\Drivers\Web\WebDriver::class);
        $botman = BotManFactory::create([
            'config' => [
                'user_cache_time' => 30000,
                'conversation_cache_time' => 30000,
            ],
        ], new LaravelCache());

        $botman->hears('oi', function ($bot) {
            $bot->reply('Olá, como posso ajudar?');
            $bot->startConversation(new InfoConversation());
        });

        $botman->listen();
    }

    // public function startConversation(BotMan $bot)
    // {
    //     $bot->startConversation(new InfoConversation());
    // }

    public function frame()
    {
        return view('chatbot.frame');
    }
}
