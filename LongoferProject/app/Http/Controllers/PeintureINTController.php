<?php

namespace App\Http\Controllers;

use App\Models\Peinture_Interne;
use App\Http\Requests\StorePeinture_InterneRequest;
use App\Http\Requests\UpdatePeinture_InterneRequest;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class PeintureINTController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $peintures = Peinture_Interne::all();
        return response()->json([
            'status' => 'success',
            'data' => $peintures
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeinture_InterneRequest $request)
    {
        try {
            $validated = $request->validated();
            
            $peinture = Peinture_Interne::create($validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Peinture interne created successfully',
                'data' => $peinture
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create peinture interne',
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
            $peinture = Peinture_Interne::findOrFail($id);
            
            return response()->json([
                'status' => 'success',
                'data' => $peinture
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Peinture interne not found',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeinture_InterneRequest $request, $id)
    {
        try {
            $peinture = Peinture_Interne::findOrFail($id);
            $validated = $request->validated();
            
            $peinture->update($validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Peinture interne updated successfully',
                'data' => $peinture
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update peinture interne',
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
            $peinture = Peinture_Interne::findOrFail($id);
            $peinture->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Peinture interne deleted successfully'
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete peinture interne',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}