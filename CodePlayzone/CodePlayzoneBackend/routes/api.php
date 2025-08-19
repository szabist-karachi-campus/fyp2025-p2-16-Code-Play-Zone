<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController; // Updated to GameController


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Get the authenticated user's information
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// routes/api.php
Route::middleware('auth:sanctum')->get('/users', function () {
    return \App\Models\User::select('id', 'username', 'points')->get();
});

// Grouped routes for authenticated users
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/game/progress/add', [GameController::class, 'addProgress']); // Add game progress
    Route::get('/game/progress', [GameController::class, 'getProgress']);     // Get game progress
});

// Authentication routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/signin', [AuthController::class, 'signin']);

