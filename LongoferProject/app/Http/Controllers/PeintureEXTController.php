<?php

namespace App\Http\Controllers;

use App\Models\Peinture_Externe;
use App\Http\Requests\StorePeinture_ExterneRequest;
use App\Http\Requests\UpdatePeinture_ExterneRequest;
use App\Http\Resources\PeintureExtResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PeintureEXTController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|JsonResponse
     */
    public function index()
    {
        try {
            $peintures = Peinture_Externe::orderBy('created_at', 'desc')->get();

            return PeintureExtResource::collection($peintures);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch peinture externe list: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to retrieve peinture externe records.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StorePeinture_ExterneRequest $request
     * @return JsonResponse
     */
    public function store(StorePeinture_ExterneRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            
            $peinture = Peinture_Externe::create($validatedData);
            
            return response()->json([
                'message' => 'Peinture externe created successfully.',
                'data' => new PeintureExtResource($peinture)
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            Log::error('Failed to create peinture externe: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create peinture externe.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param string $id
     * @return JsonResponse|PeintureExtResource
     */
    public function show(string $id)
    {
        try {
            $peinture = Peinture_Externe::find($id);

            if (!$peinture) {
                return response()->json([
                    'message' => 'Peinture externe not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            return new PeintureExtResource($peinture);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch peinture externe: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to retrieve peinture externe.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdatePeinture_ExterneRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdatePeinture_ExterneRequest $request, string $id): JsonResponse
    {
        try {
            $peinture = Peinture_Externe::find($id);

            if (!$peinture) {
                return response()->json([
                    'message' => 'Peinture externe not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();
            $peinture->update($validatedData);

            return response()->json([
                'message' => 'Peinture externe updated successfully.',
                'data' => new PeintureExtResource($peinture)
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to update peinture externe: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update peinture externe.',
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
        $peinture = Peinture_Externe::find($id);

        if (!$peinture) {
            return response()->json([
                'message' => 'Peinture externe not found.'
            ], Response::HTTP_NOT_FOUND);
        }

        if (!$peinture->ref_production) {
            return response()->json([
                'message' => 'Missing ref_Production on this record.'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (!canDeleteStage('peinture_externes', $peinture->ref_production)) {
            return response()->json([
                'message' => 'Cannot delete: subsequent stages exist for this ref_Production.'
            ], Response::HTTP_FORBIDDEN);
        }

        $peinture->delete();

        return response()->json([
            'message' => 'Peinture externe deleted successfully.'
        ], Response::HTTP_OK);

    } catch (\Exception $e) {
        Log::error('Failed to delete peinture externe: ' . $e->getMessage());

        return response()->json([
            'message' => 'An error occurred while deleting peinture externe.',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

}