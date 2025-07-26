<?php

namespace App\Http\Controllers;

use App\Models\Production;
use App\Http\Requests\StoreProductionRequest;
use App\Http\Requests\UpdateProductionRequest;
use App\Http\Resources\ProductionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class ProductionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productions = Production::all();
        return ProductionResource::collection($productions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductionRequest $request): JsonResponse
    {
        try {
            $production = Production::create($request->validated());
            return response()->json([
                'message' => 'Production created successfully',
                'data' => new ProductionResource($production)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create production',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code_production): JsonResponse
    {
        $production = Production::where('production_code', $code_production)->first();

        if (!$production) {
            return response()->json([
                'message' => 'Production not found'
            ], 404);
        }

        return response()->json(new ProductionResource($production));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductionRequest $request, string $code_production): JsonResponse
    {
        $production = Production::where('production_code', $code_production)->first();

        if (!$production) {
            return response()->json([
                'message' => 'Production not found'
            ], 404);
        }

        try {
            $production->update($request->validated());

            return response()->json([
                'message' => 'Production updated successfully',
                'data' => new ProductionResource($production)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update production',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
public function destroy(string $production_code): JsonResponse
{
    try {
        $production = Production::where('production_code', $production_code)->first();

        if (!$production) {
            return response()->json([
                'message' => 'Production not found'
            ], 404);
        }

        $production->delete();

        return response()->json([
            'message' => 'Production deleted successfully'
        ], 200);

    } catch (QueryException $e) {
        if ($e->getCode() === '23000') {
            // SQLSTATE[23000] = Integrity constraint violation (e.g., foreign key)
            return response()->json([
                'message' => 'Cannot delete this production because it is referenced by another record.'
            ], 409); // Conflict
        }

        return response()->json([
            'message' => 'Database error while deleting production',
            'error' => $e->getMessage()
        ], 500);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Unexpected error occurred',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
