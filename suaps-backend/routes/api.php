<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterEtudiantController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterPersonnelController;
use App\Http\Controllers\ActiviteController;
use App\Http\Controllers\Auth\RegisterMoniteurController;







Route::post('/auth/register/etudiant', [RegisterEtudiantController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [LogoutController::class, 'logout']);
Route::post('/auth/register/personnel', [RegisterPersonnelController::class, 'register']);

Route::get('/secretariats', function () {
    return \App\Models\Secretariat::select('id', 'nom', 'prenom', 'email', 'telephone')->get();
});

Route::get('/activites', [ActiviteController::class, 'index']);
Route::get('/activites/{id}', [ActiviteController::class, 'show']);
Route::post('/auth/register/moniteur', [RegisterMoniteurController::class, 'register']);
