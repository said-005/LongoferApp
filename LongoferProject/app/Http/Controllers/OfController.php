<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use App\Models\Of;
use App\Http\Requests\StoreOfRequest;
use App\Http\Requests\UpdateOfRequest;
use App\Http\Resources\OfResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;


class OfController extends Controller
{
    /**
     * Display a listing of the resource.
     */

public function index(): AnonymousResourceCollection | JsonResponse
{
    try {
        $ofs = Of::orderBy('created_at', 'desc')->get();
        return OfResource::collection($ofs);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error retrieving OFs',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOfRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $of = Of::create($validated);

            return response()->json([
                'message' => 'OF created successfully.',
                'data' => new OfResource($of)
            ], 201);
            
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Failed to create OF. You must add the article in articles first.',
                ], 422);
            }

            return response()->json([
                'message' => 'Database error while creating OF.',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error while creating OF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($codeOf): JsonResponse
    {
        try {
            $of = Of::find($codeOf);

            if (!$of) {
                return response()->json(['message' => 'OF not found.'], 404);
            }

            return response()->json([
                'message' => 'OF retrieved successfully.',
                'data' => new OfResource($of)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving OF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOfRequest $request, $codeOf): JsonResponse
    {
        try {
            $of = Of::find($codeOf);

            if (!$of) {
                return response()->json(['message' => 'OF not found.'], 404);
            }

            $validated = $request->validated();
            $of->update($validated);

            return response()->json([
                'message' => 'OF updated successfully.',
                'data' => new OfResource($of)
            ]);
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Failed to update OF due to data integrity constraints.',
                ], 422);
            }

            return response()->json([
                'message' => 'Database error while updating OF.',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error while updating OF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codeOf): JsonResponse
    {
        try {
            $of = Of::find($codeOf);

            if (!$of) {
                return response()->json(['message' => 'OF not found.'], 404);
            }

            $of->delete();

            return response()->json([
                'message' => 'OF deleted successfully.',
                'data' => new OfResource($of)
            ], 200);

        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete this OF because it is referenced by another record.'
                ], 409);
            }

            return response()->json([
                'message' => 'Database error while deleting OF.',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error while deleting OF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}