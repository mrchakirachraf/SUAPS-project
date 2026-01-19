<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterEtudiantController;
use App\Http\Controllers\Auth\RegisterMoniteurController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;



Route::post('/auth/register/etudiant', [RegisterEtudiantController::class, 'register']);
Route::post('/auth/register/moniteur', [RegisterMoniteurController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [LogoutController::class, 'logout']);
