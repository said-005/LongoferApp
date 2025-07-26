<?php

namespace App\Http\Controllers;

use App\Models\Sablage_Externe;
use App\Http\Requests\StoreSablage_ExterneRequest;
use App\Http\Requests\UpdateSablage_ExterneRequest;
use Illuminate\Http\Response;

class SablageEXTController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sablages = Sablage_Externe::all();
        return response()->json([
            'status' => 'success',
            'data' => $sablages
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSablage_ExterneRequest $request)
    {
        try {
            $validated = $request->validated();
    
            $sablage = Sablage_Externe::create($validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Sablage externe created successfully',
                'data' => $sablage
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create sablage externe',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $sablage = Sablage_Externe::findOrFail($id);
            
            return response()->json([
                'status' => 'success',
                'data' => $sablage
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sablage externe not found',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSablage_ExterneRequest $request, $id)
    {
        try {
            $sablage = Sablage_Externe::findOrFail($id);
            $validated = $request->validated();
            
            $sablage->update($validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Sablage externe updated successfully',
                'data' => $sablage
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update sablage externe',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
public function destroy($id)
{
    try {
        $sablage = Sablage_Externe::findOrFail($id);

        // Check that ref_Production exists
        if (!$sablage->ref_production) {
            return response()->json([
                'status' => 'error',
                'message' => 'Missing ref_Production'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if we can delete this stage based on the stage pipeline
        if (!canDeleteStage('sablage_externes', $sablage->ref_production)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete: later stages already exist for this ref_Production'
            ], Response::HTTP_FORBIDDEN);
        }

        $sablage->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sablage externe deleted successfully'
        ], Response::HTTP_OK);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to delete sablage externe',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
}