<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task;
use App\Mail\TaskReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendTaskReminder extends Command
{
    protected $signature = 'tasks:send-reminder';
    protected $description = 'Envoyer des emails de rappel pour les tâches imminentes ou expirées';

    public function handle()
    {
        $tasks = Task::all();

    
foreach ($tasks as $task) {


    $dueDate = Carbon::parse($task->due_date);

    // 1 jour avant la date d'échéance
    if ($dueDate->copy()->subDay()->isToday() && !$task->reminder_before_sent && $task->user) {
        Mail::to($task->user->email)
            ->send(new TaskReminderMail($task, 'avant échéance'));
        $task->reminder_before_sent = true;
        $task->save();
    }

    // Après la date d'échéance
    if ( $dueDate->copy()->addDay()->isToday() && !$task->reminder_after_sent && $task->user) {
        Mail::to($task->user->email)
            ->send(new TaskReminderMail($task, 'après échéance'));

        $task->reminder_after_sent = true;
        $task->save();
    }
}



        $this->info('Tous les rappels ont été envoyés avec succès.');
    }
}
