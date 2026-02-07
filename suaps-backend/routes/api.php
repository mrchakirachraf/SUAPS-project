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

use App\Http\Controllers\MoniteurController;

use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\Admin\UserAdminController;




Route::get('/moniteurs', [MoniteurController::class, 'index']);
Route::middleware('auth:sanctum')->get('/moniteurs/me', [MoniteurController::class, 'me']);
Route::get('/moniteurs/{id}', [MoniteurController::class, 'show']);



Route::post('/auth/register/etudiant', [RegisterEtudiantController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [LogoutController::class, 'logout']);
Route::post('/auth/register/personnel', [RegisterPersonnelController::class, 'register']);

use App\Http\Controllers\Admin\SecretariatAdminController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/secretariats', [SecretariatAdminController::class, 'index']);
    Route::post('/secretariats', [SecretariatAdminController::class, 'store']);
    Route::put('/secretariats/{id}', [SecretariatAdminController::class, 'update']);
    Route::delete('/secretariats/{id}', [SecretariatAdminController::class, 'destroy']);
});


// ✅ ACTIVITES (safe order)
Route::get('/activites/filters', [ActiviteFiltersController::class, 'index']);

// public listing (controller will return only visible)
Route::get('/activites', [ActiviteController::class, 'index']);

// authenticated listing (SUAPS can see hidden)
Route::middleware('auth:sanctum')->get('/activites/manage', [ActiviteController::class, 'index']);

Route::middleware('auth:sanctum')->get('/activites/manage/{id}', [ActiviteController::class, 'show']);


// show MUST be last
Route::get('/activites/{id}', [ActiviteController::class, 'show']);

// auth-only for activity subroutes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/activites/{id}/inscriptions', [InscriptionController::class, 'register']);
    Route::get('/activites/{id}/inscriptions', [InscriptionController::class, 'listInscrits']);

    Route::get('/activites/{id}/preinscrits', [MoniteurController::class, 'preInscrits']);
});




Route::post('/auth/register/moniteur', [RegisterMoniteurController::class, 'register']);

Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/categories/{id}', [CategorieController::class, 'show']);

Route::get('/type-evenements', [TypeEvenementController::class, 'index']);
Route::get('/type-evenements/{id}', [TypeEvenementController::class, 'show']);

Route::get('/sites', [SiteController::class, 'index']);
Route::get('/sites/{id}', [SiteController::class, 'show']);


// 🔄 Routes modifiées pour utiliser user_id au lieu de moniteur id
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/users/{userId}/make-suaps', [MoniteurController::class, 'makeSuaps']);
    Route::post('/users/{userId}/make-moniteur', [MoniteurController::class, 'makeMoniteur']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserAdminController::class, 'index']);
});
