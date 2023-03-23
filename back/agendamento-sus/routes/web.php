<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/chatbot', function () {
    return view('chatbot.frame');
});

Route::match(['get', 'post'], '/botman', 'App\Http\Controllers\Messenger\ChatController@handle');

// Route::post('/chatbot', function () {
//     app('botman')->listen();
// });
