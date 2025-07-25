<?php

namespace App\Http\Controllers;

use App\Models\Reparation;
use App\Http\Requests\StoreReparationRequest;
use App\Http\Requests\UpdateReparationRequest;
use App\Http\Resources\ReparationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ReparationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reparations = Reparation::all();
   return ReparationResource::collection($reparations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReparationRequest $request)
    {
        $validated = $request->validated();
        $reparation = Reparation::create($validated);
         return new ReparationResource($reparation);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $reparation_code)
    {
        $reparation = Reparation::where('code_Reparation', $reparation_code)->first();

        if (!$reparation) {
            return response()->json(['message' => 'Reparation not found'], 404);
        }

        return new ReparationResource($reparation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReparationRequest $request, string $reparation_code)
    {
        $reparation = Reparation::where('code_Reparation', $reparation_code)->first();

        if (!$reparation) {
            return response()->json(['message' => 'Reparation not found'], 404);
        }

        $reparation->update($request->validated());

        return new ReparationResource($reparation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $reparation_code): JsonResponse
    {
        try {
            $reparation = Reparation::where('code_Reparation', $reparation_code)->first();

            if (!$reparation) {
                return response()->json(['message' => 'Reparation not found'], 404);
            }

            $reparation->delete();

            return response()->json(['message' => 'Reparation deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Reparation delete error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete reparation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
