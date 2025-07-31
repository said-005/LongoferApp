<?php

namespace App\Http\Controllers;

use App\Models\Consommation;
use App\Http\Requests\StoreConsommationRequest;
use App\Http\Requests\UpdateConsommationRequest;
use App\Http\Resources\ConsommationResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ConsommationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse|AnonymousResourceCollection
    {
        try {
            $consommations = Consommation::orderBy('created_at', 'desc')->get();
            return ConsommationResource::collection($consommations);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve consommations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsommationRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $consommation = Consommation::create($data);

            return response()->json([
                'message' => 'Consommation created successfully',
                'data' => new ConsommationResource($consommation)
            ], 201);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => 'The consommation could not be created due to data constraints'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Database error while creating consommation',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error creating consommation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $consommation = Consommation::find($id);

            if (!$consommation) {
                return response()->json([
                    'message' => 'Consommation not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Consommation retrieved successfully',
                'data' => new ConsommationResource($consommation)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving consommation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConsommationRequest $request, int $id): JsonResponse
    {
        try {
            $consommation = Consommation::find($id);

            if (!$consommation) {
                return response()->json([
                    'message' => 'Consommation not found'
                ], 404);
            }

            $data = $request->validated();
            $consommation->update($data);

            return response()->json([
                'message' => 'Consommation updated successfully',
                'data' => new ConsommationResource($consommation)
            ]);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => 'The consommation could not be updated due to data constraints'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Database error while updating consommation',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error updating consommation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $consommation = Consommation::find($id);

            if (!$consommation) {
                return response()->json([
                    'message' => 'Consommation not found'
                ], 404);
            }

            $consommation->delete();

            return response()->json([
                'message' => 'Consommation deleted successfully',
                'data' => new ConsommationResource($consommation)
            ]);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete consommation as it is referenced by other resources'
                ], 409);
            }

            return response()->json([
                'message' => 'Database error while deleting consommation',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error deleting consommation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}