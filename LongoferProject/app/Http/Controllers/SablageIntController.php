<?php

namespace App\Http\Controllers;

use App\Models\Sablage_Interne;
use App\Http\Requests\StoreSablage_InterneRequest;
use App\Http\Requests\UpdateSablage_InterneRequest;
use App\Http\Resources\SablageIntResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpFoundation\Response;

class SablageIntController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        try {
            $sablages = Sablage_Interne::orderBy('created_at', 'desc')->get();

            return SablageIntResource::collection($sablages);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch sablage interne list: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to retrieve sablage interne records.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StoreSablage_InterneRequest $request
     * @return JsonResponse
     */
    public function store(StoreSablage_InterneRequest $request): JsonResponse
    { 
        try {
            $validatedData = $request->validated();
            
            $sablage = Sablage_Interne::create($validatedData);
            
            return response()->json([
                'message' => 'Sablage interne created successfully.',
                'data' => new SablageIntResource($sablage)
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            Log::error('Failed to create sablage interne: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create sablage interne.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param string $id
     * @return JsonResponse|SablageIntResource
     */
    public function show(string $id)
    {
        try {
            $sablage = Sablage_Interne::find($id);

            if (!$sablage) {
                return response()->json([
                    'message' => 'Sablage interne not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            return new SablageIntResource($sablage);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch sablage interne: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to retrieve sablage interne.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdateSablage_InterneRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateSablage_InterneRequest $request, string $id): JsonResponse
    {
        try {
            $sablage = Sablage_Interne::find($id);

            if (!$sablage) {
                return response()->json([
                    'message' => 'Sablage interne not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();
            $sablage->update($validatedData);

            return response()->json([
                'message' => 'Sablage interne updated successfully.',
                'data' => new SablageIntResource($sablage)
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to update sablage interne: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update sablage interne.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param string $id
     * @return JsonResponse
     */
public function destroy(string $id): JsonResponse
{ 
    try {
        $sablage = Sablage_Interne::find($id);

        if (!$sablage) {
            return response()->json([
                'message' => 'Sablage interne not found.'
            ], Response::HTTP_NOT_FOUND);
        }

        if (!$sablage->ref_production) {
            return response()->json([
                'message' => 'Missing ref_Production for this record.'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Prevent deletion if later stages exist
        if (!canDeleteStage('sablage_internes', $sablage->ref_production)) {
            return response()->json([
                'message' => 'Cannot delete: later stages already exist for this ref_Production.'
            ], Response::HTTP_FORBIDDEN);
        }

        $sablage->delete();

        return response()->json([
            'message' => 'Sablage interne deleted successfully.'
        ], Response::HTTP_OK);
        
    } catch (\Exception $e) {
        Log::error('Failed to delete sablage interne: ' . $e->getMessage());

        return response()->json([
            'message' => 'An error occurred while deleting sablage interne.',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
}