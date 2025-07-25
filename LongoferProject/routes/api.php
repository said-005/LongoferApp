<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CausseController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConsommationController;
use App\Http\Controllers\DefautController;
use App\Http\Controllers\EmmanchementController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\ManchetteController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\OfController;
use App\Http\Controllers\OperateurController;
use App\Http\Controllers\PeintureEXTController;
use App\Http\Controllers\PeintureINTController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\ReparationController;
use App\Http\Controllers\SablageEXTController;
use App\Http\Controllers\SablageIntController;
use App\Http\Controllers\TubeHSshuteController;
use App\Http\Controllers\TubeStatutController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResources([
 'Client'=>ClientController::class,
 'Article'=>ArticleController::class,
 'Defaut'=>DefautController::class,
 'Categorie'=>CategorieController::class,
 'Operateur'=>OperateurController::class,
 'Statut'=>TubeStatutController::class,
 'Machine'=>MachineController::class,
 'Causse'=>CausseController::class,
 'OF'=>OfController::class,
 'Tube_HS'=>TubeHSshuteController::class,
 'Matiere'=>MatiereController::class,
 'Consommation'=>ConsommationController::class,
 'Production'=>ProductionController::class,
 'Reparation'=>ReparationController::class,
 'Sablage_int'=>SablageIntController::class,
 'Sablage_ext'=>SablageEXTController::class,
 'Peinture_int'=>PeintureINTController::class,
 'Peinture_ext'=>PeintureEXTController::class,
 'Manchette'=>ManchetteController::class,
 'Emmanchement'=>EmmanchementController::class
]);
