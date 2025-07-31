<?php

namespace App\Http\Controllers;

use App\Models\Manchette_ISO;
use App\Http\Requests\StoreManchette_ISORequest;
use App\Http\Requests\UpdateManchette_ISORequest;
use App\Http\Resources\ManchetteResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpFoundation\Response;

class ManchetteController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|JsonResponse
     */
    public function index()
    {
        try {
            $manchettes = Manchette_ISO::orderBy('created_at', 'desc')->get();

            return ManchetteResource::collection($manchettes);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch manchette ISO list: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to retrieve manchette ISO records.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StoreManchette_ISORequest $request
     * @return JsonResponse
     */
    public function store(StoreManchette_ISORequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            
            $manchette = Manchette_ISO::create($validatedData);
            
            return response()->json([
                'message' => 'Manchette ISO created successfully.',
                'data' => new ManchetteResource($manchette)
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            Log::error('Failed to create manchette ISO: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create manchette ISO.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param string $id
     * @return JsonResponse|ManchetteISOResource
     */
    public function show(string $id)
    {
        try {
            $manchette = Manchette_ISO::find($id);

            if (!$manchette) {
                return response()->json([
                    'message' => 'Manchette ISO not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            return new ManchetteResource($manchette);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch manchette ISO: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to retrieve manchette ISO.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdateManchette_ISORequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateManchette_ISORequest $request, string $id): JsonResponse
    {
        try {
            $manchette = Manchette_ISO::find($id);

            if (!$manchette) {
                return response()->json([
                    'message' => 'Manchette ISO not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();
            $manchette->update($validatedData);

            return response()->json([
                'message' => 'Manchette ISO updated successfully.',
                'data' => new ManchetteResource($manchette)
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to update manchette ISO: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update manchette ISO.',
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
        $manchette = Manchette_ISO::find($id);

        if (!$manchette) {
            return response()->json([
                'message' => 'Manchette ISO not found.'
            ], Response::HTTP_NOT_FOUND);
        }

        if (!$manchette->ref_production) {
            return response()->json([
                'message' => 'Missing ref_Production on this record.'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (!canDeleteStage('manchette_isos', $manchette->ref_production)) {
            return response()->json([
                'message' => 'Cannot delete: subsequent stages exist for this ref_Production.'
            ], Response::HTTP_FORBIDDEN);
        }

        $manchette->delete();

        return response()->json([
            'message' => 'Manchette ISO deleted successfully.'
        ], Response::HTTP_OK);

    } catch (\Exception $e) {
        Log::error('Failed to delete manchette ISO: ' . $e->getMessage());

        return response()->json([
            'message' => 'An error occurred while deleting manchette ISO.',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

}