<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


Route::post('/registre',[UsersController::class,'registre']);
Route::post('/login',[UsersController::class,'login']);
Route::middleware('auth:api')->group(function () 
{

    Route::post('/logout', [UsersController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Email Verification
    |--------------------------------------------------------------------------
    */
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Email de vérification envoyé']);
    });

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        return response()->json(['message' => 'Email vérifié avec succès']);
    })->name('verification.verify');

    
Route::post('/tasks/filter', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::put('/tasks/{id}', [TaskController::class, 'update']);
Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
});