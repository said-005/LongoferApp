<?php

namespace App\Http\Controllers;

use App\Models\Causses;
use App\Http\Requests\StoreCaussesRequest;
use App\Http\Requests\UpdateCaussesRequest;
use App\Http\Resources\CausseResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class CausseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(): JsonResponse|AnonymousResourceCollection
{
    try {
        $causses = Causses::orderBy('created_at', 'desc')->get();
        return CausseResource::collection($causses);
    } catch (\Exception $e) {
        Log::error('Failed to fetch causses: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to retrieve causses',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCaussesRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $causse = Causses::create($data);

            return response()->json([
                'message' => 'Causse created successfully',
                'data' => new CausseResource($causse),
            ], 201);
        } catch (QueryException $e) {
            Log::error('Causse creation failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to create causse',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error creating causse: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while creating causse',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code_causse): JsonResponse
    {
        try {
            $causse = Causses::where('code_causse', $code_causse)->first();

            if (!$causse) {
                return response()->json([
                    'message' => 'Causse not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Causse retrieved successfully',
                'data' => new CausseResource($causse)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch causse: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve causse',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCaussesRequest $request, string $code_causse): JsonResponse
    {
        try {
            $causse = Causses::where('code_causse', $code_causse)->first();

            if (!$causse) {
                return response()->json([
                    'message' => 'Causse not found'
                ], 404);
            }

            $data = $request->validated();
            $causse->update($data);

            return response()->json([
                'message' => 'Causse updated successfully',
                'data' => new CausseResource($causse->fresh())
            ]);
        } catch (QueryException $e) {
            Log::error('Causse update failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to update causse',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error updating causse: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while updating causse',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code_causse): JsonResponse
    {
        try {
            $causse = Causses::where('code_causse', $code_causse)->first();

            if (!$causse) {
                return response()->json([
                    'message' => 'Causse not found'
                ], 404);
            }

            $causse->delete();

            return response()->json([
                'message' => 'Causse deleted successfully',
                'data' => new CausseResource($causse)
            ]);
        } catch (QueryException $e) {
            Log::error('Causse deletion failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete causse as it is referenced by other resources',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 409);
            }
            
            return response()->json([
                'message' => 'Failed to delete causse',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error deleting causse: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while deleting causse',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}