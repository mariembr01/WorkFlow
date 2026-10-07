<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title','description','category','priority','statut','due_date','user_id','reminder_before_sent','reminder_after_sent'];

     public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
