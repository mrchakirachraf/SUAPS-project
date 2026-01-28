<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterEtudiantController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterPersonnelController;

use App\Http\Controllers\ActiviteController;
use App\Http\Controllers\ActiviteFiltersController;

use App\Http\Controllers\Auth\RegisterMoniteurController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\TypeEvenementController;
use App\Http\Controllers\SiteController;




Route::post('/auth/register/etudiant', [RegisterEtudiantController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [LogoutController::class, 'logout']);
Route::post('/auth/register/personnel', [RegisterPersonnelController::class, 'register']);

Route::get('/secretariats', function () {
    return \App\Models\Secretariat::select('id', 'nom', 'prenom', 'email', 'telephone')->get();
});

Route::get('/activites', [ActiviteController::class, 'index']);
Route::get('/activites/{id}', [ActiviteController::class, 'show']);
Route::get('/activites/filters', [ActiviteFiltersController::class, 'index']);

Route::post('/auth/register/moniteur', [RegisterMoniteurController::class, 'register']);

Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/categories/{id}', [CategorieController::class, 'show']);

Route::get('/type-evenements', [TypeEvenementController::class, 'index']);
Route::get('/type-evenements/{id}', [TypeEvenementController::class, 'show']);

Route::get('/sites', [SiteController::class, 'index']);
Route::get('/sites/{id}', [SiteController::class, 'show']);
