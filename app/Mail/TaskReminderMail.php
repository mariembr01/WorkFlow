<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Task;

class TaskReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $task;
    public $type;

    public function __construct(Task $task, $type)
    {
        $this->task = $task;
        $this->type = $type;
    }

    public function build()
    {
        $subject = $this->type === 'avant échéance' ? 'Rappel : La tâche expire demain' : 'Alerte : La tâche est expirée';
        return $this->subject($subject)
                    ->view('emails.task_reminder')
                    ->with([
                        'task' => $this->task,
                        'type' => $this->type
                    ]);
    }
}
