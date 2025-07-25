<?php

namespace App\Http\Controllers;

use App\Models\Causses;
use App\Http\Requests\StoreCaussesRequest;
use App\Http\Requests\UpdateCaussesRequest;
use App\Http\Resources\CausseResource;
use Illuminate\Http\JsonResponse;

class CausseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $causses = Causses::all();
        return CausseResource::collection($causses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCaussesRequest $request): JsonResponse
    {
        $data = $request->validated();
        $causse = Causses::create($data);

        return response()->json([
            'message' => 'Causse created successfully',
            'causse' => new CausseResource($causse),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code_causse)
    {
        $causse = Causses::where('code_causse', $code_causse)->first();

        if (!$causse) {
            return response()->json(['message' => 'Causse not found'], 404);
        }

        return new CausseResource($causse);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCaussesRequest $request, string $code_causse): JsonResponse
    {
        $causse = Causses::where('code_causse', $code_causse)->first();

        if (!$causse) {
            return response()->json(['message' => 'Causse not found'], 404);
        }

        $data = $request->validated();

        if ($causse->update($data)) {
            return response()->json([
                'message' => 'Causse updated successfully',
                'causse' => new CausseResource($causse->fresh()),
            ], 200);
        }

        return response()->json(['message' => 'Error updating causse'], 500);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code_causse): JsonResponse
    {
        $causse = Causses::where('code_causse', $code_causse)->first();

        if (!$causse) {
            return response()->json(['message' => 'Causse not found'], 404);
        }

        if ($causse->delete()) {
            return response()->json(['message' => 'Causse deleted successfully'], 200);
        }

        return response()->json(['message' => 'Error deleting causse'], 500);
    }
}
