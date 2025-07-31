<?php

namespace App\Http\Controllers;

use App\Models\Reparation;
use App\Http\Requests\StoreReparationRequest;
use App\Http\Requests\UpdateReparationRequest;
use App\Http\Resources\ReparationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class ReparationController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|JsonResponse
     */
    public function index()
    {
        try {
            $reparations = Reparation::orderBy('created_at', 'desc')->get();
            Log::info('Retrieved all reparations', ['count' => $reparations->count()]);
            return ReparationResource::collection($reparations);
        } catch (Exception $e) {
            Log::error('Failed to retrieve reparations: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve reparations',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StoreReparationRequest $request
     * @return ReparationResource|JsonResponse
     */
    public function store(StoreReparationRequest $request)
    {
        try {
            $validated = $request->validated();
            $reparation = Reparation::create($validated);
            
            Log::info('Reparation created successfully', ['code' => $reparation->code_Reparation]);
            return new ReparationResource($reparation);
            
        } catch (QueryException $e) {
            Log::error('Database error while creating reparation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create reparation: database error',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to create reparation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create reparation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param string $reparation_code
     * @return ReparationResource|JsonResponse
     */
    public function show(string $reparation_code)
    {
        try {
            $reparation = Reparation::where('code_Reparation', $reparation_code)->firstOrFail();
            Log::info('Retrieved reparation', ['code' => $reparation_code]);
            return new ReparationResource($reparation);
            
        } catch (ModelNotFoundException $e) {
            Log::warning('Reparation not found', ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Reparation not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (Exception $e) {
            Log::error('Failed to retrieve reparation: ' . $e->getMessage(), ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Failed to retrieve reparation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdateReparationRequest $request
     * @param string $reparation_code
     * @return ReparationResource|JsonResponse
     */
    public function update(UpdateReparationRequest $request, string $reparation_code)
    {
        try {
            $reparation = Reparation::where('code_Reparation', $reparation_code)->firstOrFail();
            $validated = $request->validated();
            
            $reparation->update($validated);
            
            Log::info('Reparation updated successfully', ['code' => $reparation_code]);
            return new ReparationResource($reparation);
            
        } catch (ModelNotFoundException $e) {
            Log::warning('Reparation not found for update', ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Reparation not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (QueryException $e) {
            Log::error('Database error while updating reparation: ' . $e->getMessage(), ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Failed to update reparation: database error',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to update reparation: ' . $e->getMessage(), ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Failed to update reparation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param string $reparation_code
     * @return JsonResponse
     */
    public function destroy(string $reparation_code): JsonResponse
    {
        try {
            $reparation = Reparation::where('code_Reparation', $reparation_code)->firstOrFail();

            if (!$reparation->ref_production) {
                Log::warning('Attempt to delete reparation with missing ref_production', ['code' => $reparation_code]);
                return response()->json([
                    'message' => 'Missing ref_production'
                ], Response::HTTP_BAD_REQUEST);
            }

            if (!canDeleteStage('reparations', $reparation->ref_production)) {
                Log::warning('Attempt to delete reparation with existing later stages', [
                    'code' => $reparation_code,
                    'ref_production' => $reparation->ref_production
                ]);
                return response()->json([
                    'message' => 'Cannot delete: later stages exist'
                ], Response::HTTP_FORBIDDEN);
            }

            $reparation->delete();
            
            Log::info('Reparation deleted successfully', ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Reparation deleted successfully'
            ], Response::HTTP_OK);

        } catch (ModelNotFoundException $e) {
            Log::warning('Reparation not found for deletion', ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Reparation not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (QueryException $e) {
            Log::error('Database error while deleting reparation: ' . $e->getMessage(), ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Failed to delete reparation: database error',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to delete reparation: ' . $e->getMessage(), ['code' => $reparation_code]);
            return response()->json([
                'message' => 'Failed to delete reparation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}