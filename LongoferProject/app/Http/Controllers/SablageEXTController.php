<?php

namespace App\Http\Controllers;

use App\Models\Sablage_Externe;
use App\Http\Requests\StoreSablage_ExterneRequest;
use App\Http\Requests\UpdateSablage_ExterneRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Exception;

class SablageEXTController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $sablages = Sablage_Externe::orderBy('created_at', 'desc')->get();
            
            Log::info('Retrieved all external sandblasting records', ['count' => $sablages->count()]);
            
            return response()->json([
                'status' => 'success',
                'data' => $sablages
            ], Response::HTTP_OK);
            
        } catch (Exception $e) {
            Log::error('Failed to retrieve external sandblasting records: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve external sandblasting records',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StoreSablage_ExterneRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreSablage_ExterneRequest $request)
    {
        try {
            $validated = $request->validated();
            $sablage = Sablage_Externe::create($validated);
            
            Log::info('External sandblasting record created', ['id' => $sablage->id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'External sandblasting record created successfully',
                'data' => $sablage
            ], Response::HTTP_CREATED);
            
        } catch (QueryException $e) {
            Log::error('Database error while creating external sandblasting record: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Database error occurred',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to create external sandblasting record: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create external sandblasting record',
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
    public function show($id)
    {
        try {
            $sablage = Sablage_Externe::findOrFail($id);
            
            Log::info('Retrieved external sandblasting record', ['id' => $id]);
            
            return response()->json([
                'status' => 'success',
                'data' => $sablage
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            Log::warning('External sandblasting record not found', ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'External sandblasting record not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (Exception $e) {
            Log::error('Failed to retrieve external sandblasting record: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve external sandblasting record',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdateSablage_ExterneRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateSablage_ExterneRequest $request, $id)
    {
        try {
            $sablage = Sablage_Externe::findOrFail($id);
            $validated = $request->validated();
            
            $sablage->update($validated);
            
            Log::info('External sandblasting record updated', ['id' => $id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'External sandblasting record updated successfully',
                'data' => $sablage
            ], Response::HTTP_OK);
            
        } catch (ModelNotFoundException $e) {
            Log::warning('External sandblasting record not found for update', ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'External sandblasting record not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (QueryException $e) {
            Log::error('Database error while updating external sandblasting record: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Database error occurred',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to update external sandblasting record: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update external sandblasting record',
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
    public function destroy($id)
    {
        try {
            $sablage = Sablage_Externe::findOrFail($id);

            // Check that ref_Production exists
            if (!$sablage->ref_production) {
                Log::warning('Attempt to delete external sandblasting record with missing ref_production', ['id' => $id]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'Missing ref_production'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Check if we can delete this stage based on the stage pipeline
            if (!canDeleteStage('sablage_externes', $sablage->ref_production)) {
                Log::warning('Attempt to delete external sandblasting record with existing later stages', [
                    'id' => $id,
                    'ref_production' => $sablage->ref_production
                ]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete: later stages already exist for this ref_production'
                ], Response::HTTP_FORBIDDEN);
            }

            $sablage->delete();
            
            Log::info('External sandblasting record deleted', ['id' => $id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'External sandblasting record deleted successfully'
            ], Response::HTTP_OK);

        } catch (ModelNotFoundException $e) {
            Log::warning('External sandblasting record not found for deletion', ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'External sandblasting record not found'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (QueryException $e) {
            Log::error('Database error while deleting external sandblasting record: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Database error occurred',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
        } catch (Exception $e) {
            Log::error('Failed to delete external sandblasting record: ' . $e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete external sandblasting record',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}