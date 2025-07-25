<?php

namespace App\Http\Controllers;

use App\Models\Matiers;
use App\Http\Requests\StoreMatiersRequest;
use App\Http\Requests\UpdateMatiersRequest;
use App\Http\Resources\MatiereResource;
use Illuminate\Http\JsonResponse;

class MatiereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $matieres = Matiers::all();
        return MatiereResource::collection($matieres);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMatiersRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $matiere = Matiers::create($validated);

        return response()->json([
            'message' => 'Matière created successfully.',
            'matiere' => $matiere
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $matiere = Matiers::find($id);

        if (!$matiere) {
            return response()->json(['message' => 'Matière not found.'], 404);
        }

        return response()->json($matiere);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMatiersRequest $request, $id): JsonResponse
    {
        $matiere = Matiers::find($id);

        if (!$matiere) {
            return response()->json(['message' => 'Matière not found.'], 404);
        }

        $matiere->update($request->validated());

        return response()->json([
            'message' => 'Matière updated successfully.',
            'matiere' => $matiere
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $matiere = Matiers::find($id);

        if (!$matiere) {
            return response()->json(['message' => 'Matière not found.'], 404);
        }

        try {
            $matiere->delete();
            return response()->json(['message' => 'Matière deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cannot delete matiere. It may be used in another resource.'
            ], 500);
        }
    }
}
