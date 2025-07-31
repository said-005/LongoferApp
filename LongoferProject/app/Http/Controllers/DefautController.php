<?php

namespace App\Http\Controllers;

use App\Models\Defaut;
use App\Http\Requests\StoreDefautRequest;
use App\Http\Requests\UpdateDefautRequest;
use App\Http\Resources\DefautResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DefautController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse | AnonymousResourceCollection
    {
        try {
            $defauts = Defaut::orderBy('created_at', 'desc')->get();
            return DefautResource::collection($defauts);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve defauts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDefautRequest $request): JsonResponse
    {
        try {
            $formData = $request->validated();
            $defaut = Defaut::create($formData);
            
            return response()->json([
                'message' => 'Defaut created successfully',
                'data' => new DefautResource($defaut)
            ], 201);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => 'The defaut could not be created due to data constraints'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Database error while creating defaut',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error creating defaut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($codeDefaut): JsonResponse
    {
        try {
            $codeDefaut = trim($codeDefaut);
            $defaut = Defaut::where('codeDefaut', $codeDefaut)->first();

            if (!$defaut) {
                return response()->json([
                    'message' => 'Defaut not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Defaut retrieved successfully',
                'data' => new DefautResource($defaut)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving defaut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDefautRequest $request, $codeDefaut): JsonResponse
    {
        try {
            $codeDefaut = trim($codeDefaut);
            $defaut = Defaut::where('codeDefaut', $codeDefaut)->first();

            if (!$defaut) {
                return response()->json([
                    'message' => 'Defaut not found'
                ], 404);
            }

            $validatedData = $request->validated();
            $defaut->update($validatedData);

            return response()->json([
                'message' => 'Defaut updated successfully',
                'data' => new DefautResource($defaut)
            ]);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => 'The defaut could not be updated due to data constraints'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Database error while updating defaut',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error updating defaut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codeDefaut): JsonResponse
    {
        try {
            $codeDefaut = trim($codeDefaut);
            $defaut = Defaut::where('codeDefaut', $codeDefaut)->first();

            if (!$defaut) {
                return response()->json([
                    'message' => 'Defaut not found'
                ], 404);
            }

            $defaut->delete();

            return response()->json([
                'message' => 'Defaut deleted successfully',
                'data' => new DefautResource($defaut)
            ]);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete defaut as it is referenced by another resource'
                ], 409);
            }

            return response()->json([
                'message' => 'Database error while deleting defaut',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error deleting defaut',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}