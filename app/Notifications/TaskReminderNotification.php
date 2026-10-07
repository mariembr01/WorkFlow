<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Task;

class TaskReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $task;      // public pour la vue
    public $expired;   // true = tâche expirée, false = rappel

    public function __construct(Task $task, bool $expired)
    {
        $this->task = $task;
        $this->expired = $expired;
    }

    public function build()
    {
        return $this->subject($this->expired ? 'Tâche expirée' : 'Rappel de tâche')
                    ->view('emails.task_reminder');  // Blade view
    }
}
