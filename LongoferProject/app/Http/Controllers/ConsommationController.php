<?php

namespace App\Http\Controllers;

use App\Models\Consommation;
use App\Http\Requests\StoreConsommationRequest;
use App\Http\Requests\UpdateConsommationRequest;
use App\Http\Resources\ConsommationResource;
use Illuminate\Http\JsonResponse;

class ConsommationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $consommations = Consommation::all();
        return ConsommationResource::collection($consommations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsommationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $consommation = Consommation::create($data);

        return response()->json([
            'message' => 'Consommation created successfully.',
            'data' => new ConsommationResource($consommation)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
public function show($id)
{
    $consommation = Consommation::find($id);

    if (!$consommation) {
        return response()->json(['message' => 'Consommation not found.'], 404);
    }

    return new ConsommationResource($consommation);
}

    /**
     * Update the specified resource in storage.
     */
 public function update(UpdateConsommationRequest $request, int $id): JsonResponse
{
    $consommation = Consommation::find($id);

    if (!$consommation) {
        return response()->json([
            'error' => 'Consommation not found.'
        ], 404);
    }

    $data = $request->validated();
    $consommation->update($data);

    return response()->json([
        'message' => 'Consommation updated successfully.',
        'data' => $consommation
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
{
    $consommation = Consommation::find($id);

    if (!$consommation) {
        return response()->json([
            'error' => 'Consommation not found.'
        ], 404);
    }

    $consommation->delete();

    return response()->json([
        'message' => 'Consommation deleted successfully.'
    ]);
}
}
