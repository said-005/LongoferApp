<?php

namespace App\Http\Controllers;

use App\Models\TubeStatut;
use App\Http\Requests\StoreTubeStatutRequest;
use App\Http\Requests\UpdateTubeStatutRequest;
use App\Http\Resources\TubeStatutResource;
use Illuminate\Support\Facades\Log;
use Exception;

class TubeStatutController extends Controller
{
    public function index()
    {
        try {
            $statuts = TubeStatut::orderBy('created_at', 'desc')->get();
            return TubeStatutResource::collection($statuts);
        } catch (Exception $e) {
            Log::error('Failed to fetch tube statuses: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve tube statuses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTubeStatutRequest $request)
    {
        try {
            $formData = $request->validated();
            $statut = TubeStatut::create($formData);
            return new TubeStatutResource($statut);
        } catch (Exception $e) {
            Log::error('Failed to create tube status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create tube status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($statut)
    {
        try {
            $statut = TubeStatut::where('Statut', $statut)->first();
            
            if (!$statut) {
                return response()->json(['message' => 'Statut not found.'], 404);
            }

            return new TubeStatutResource($statut);
        } catch (Exception $e) {
            Log::error('Failed to fetch tube status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve tube status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTubeStatutRequest $request, $statut)
    {
        try {
            $statut = trim($statut);
            $validatedData = $request->validated();

            $statut = TubeStatut::where('Statut', $statut)->first();

            if (!$statut) {
                return response()->json(['message' => 'Statut not found.'], 404);
            }

            $statut->update($validatedData);

            return response()->json([
                'message' => 'Statut updated successfully.',
                'statut' => new TubeStatutResource($statut)
            ]);
        } catch (Exception $e) {
            Log::error('Failed to update tube status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update tube status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($statut)
    {
        try {
            $statut = TubeStatut::where('Statut', $statut)->first();

            if (!$statut) {
                return response()->json(['message' => 'Statut not found.'], 404);
            }

            $statut->delete();

            return response()->json([
                'message' => 'Statut deleted successfully.',
                'statut' => new TubeStatutResource($statut)
            ]);
        } catch (Exception $e) {
            Log::error('Failed to delete tube status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete tube status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}