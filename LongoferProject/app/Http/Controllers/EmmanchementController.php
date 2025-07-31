<?php

namespace App\Http\Controllers;

use App\Models\Emmanchement;
use App\Http\Requests\StoreEmmanchementRequest;
use App\Http\Requests\UpdateEmmanchementRequest;
use App\Http\Resources\EmmanchementResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;


class EmmanchementController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|JsonResponse
     */
    public function index()
    {
        try {
            $emmanchements = Emmanchement::orderBy('created_at', 'desc')->get();

            return EmmanchementResource::collection($emmanchements);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch emmanchement list: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve emmanchement records.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StoreEmmanchementRequest $request
     * @return JsonResponse
     */
    public function store(StoreEmmanchementRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            
            $emmanchement = Emmanchement::create($validatedData);
            
       
            return response()->json([
                'status' => 'success',
                'message' => 'Emmanchement created successfully.',
                'data' => new EmmanchementResource($emmanchement)
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            Log::error('Failed to create emmanchement: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create emmanchement.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param string $id
     * @return JsonResponse|EmmanchementResource
     */
    public function show(string $id)
    {
        try {
            $emmanchement = Emmanchement::find($id);

            if (!$emmanchement) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Emmanchement not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            return new EmmanchementResource($emmanchement);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch emmanchement: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve emmanchement.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdateEmmanchementRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateEmmanchementRequest $request, string $id): JsonResponse
    {
        try {
            $emmanchement = Emmanchement::find($id);

            if (!$emmanchement) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Emmanchement not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            $validatedData = $request->validated();
            $emmanchement->update($validatedData);
            
         
            return response()->json([
                'status' => 'success',
                'message' => 'Emmanchement updated successfully.',
                'data' => new EmmanchementResource($emmanchement)
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to update emmanchement: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update emmanchement.',
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
        $emmanchement = Emmanchement::find($id);

        if (!$emmanchement) {
            return response()->json([
                'status' => 'error',
                'message' => 'Emmanchement not found.'
            ], Response::HTTP_NOT_FOUND);
        }

        if (!$emmanchement->ref_production) {
            return response()->json([
                'status' => 'error',
                'message' => 'Missing ref_Production on this record.'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (!canDeleteStage('emmanchements', $emmanchement->ref_production)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete: subsequent stages exist for this ref_Production.'
            ], Response::HTTP_FORBIDDEN);
        }

        $emmanchement->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Emmanchement deleted successfully.'
        ], Response::HTTP_OK);

    } catch (\Exception $e) {
        Log::error('Failed to delete emmanchement: ' . $e->getMessage());

        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred while deleting emmanchement.',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
}