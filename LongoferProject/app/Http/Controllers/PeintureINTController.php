<?php

namespace App\Http\Controllers;

use App\Models\Peinture_Interne;
use App\Http\Requests\StorePeinture_InterneRequest;
use App\Http\Requests\UpdatePeinture_InterneRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class PeintureINTController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $peintures = Peinture_Interne::orderBy('created_at', 'desc')->get();
            
            Log::info('Retrieved all internal paintings', ['count' => $peintures->count()]);
            
            return response()->json([
                'status' => 'success',
                'data' => $peintures
            ], Response::HTTP_OK);
            
        } catch (Exception $e) {
            Log::error('Failed to retrieve internal paintings: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve internal paintings',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StorePeinture_InterneRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StorePeinture_InterneRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $peinture = Peinture_Interne::create($validated);
            
            Log::info('Internal painting created successfully', ['id' => $peinture->id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Internal painting created successfully',
                'data' => $peinture
            ], Response::HTTP_CREATED);
            
        } catch (QueryException $e) {
            Log::error('Database error while creating internal painting: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Database error while creating internal painting',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to create internal painting: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create internal painting',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $peinture = Peinture_Interne::findOrFail($id);
            
            Log::info('Retrieved internal painting', ['id' => $id]);
            
            return response()->json([
                'status' => 'success',
                'data' => $peinture
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            Log::warning('Internal painting not found', ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Internal painting not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (Exception $e) {
            Log::error('Failed to retrieve internal painting: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve internal painting',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdatePeinture_InterneRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdatePeinture_InterneRequest $request,  $id): JsonResponse
    {
        try {
            $peinture = Peinture_Interne::findOrFail($id);
            $validated = $request->validated();
            
            $peinture->update($validated);
            
            Log::info('Internal painting updated successfully', ['id' => $id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Internal painting updated successfully',
                'data' => $peinture
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            Log::warning('Internal painting not found for update', ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Internal painting not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (QueryException $e) {
            Log::error('Database error while updating internal painting: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Database error while updating internal painting',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to update internal painting: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update internal painting',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $peinture = Peinture_Interne::findOrFail($id);

            if (!$peinture->ref_production) {
                Log::warning('Attempt to delete internal painting with missing ref_production', ['id' => $id]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'Missing ref_production for this record.'
                ], Response::HTTP_BAD_REQUEST);
            }

            if (!canDeleteStage('peinture_internes', $peinture->ref_production)) {
                Log::warning('Attempt to delete internal painting with existing later stages', [
                    'id' => $id,
                    'ref_production' => $peinture->ref_production
                ]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete: later stages already exist for this ref_production.'
                ], Response::HTTP_FORBIDDEN);
            }

            $peinture->delete();
            
            Log::info('Internal painting deleted successfully', ['id' => $id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Internal painting deleted successfully'
            ], Response::HTTP_OK);

        } catch (ModelNotFoundException $e) {
            Log::warning('Internal painting not found for deletion', ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Internal painting not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (QueryException $e) {
            Log::error('Database error while deleting internal painting: ' . $e->getMessage(), ['id' => $id]);
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete: this record is referenced by other data.'
                ], Response::HTTP_CONFLICT);
            }
            
            return response()->json([
                'status' => 'error',
                'message' => 'Database error while deleting internal painting',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to delete internal painting: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete internal painting',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}