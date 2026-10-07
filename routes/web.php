<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\TaskReminderMail;
use App\Models\Task;

Route::get('/test-mail', function () {
    $task = Task::first();
    Mail::to('benrhoumamaryem9@gmail.com')
        ->send(new TaskReminderMail($task, false));

    return 'Mail envoyé à Gmail !';
});
