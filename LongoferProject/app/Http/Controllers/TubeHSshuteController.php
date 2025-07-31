<?php

namespace App\Http\Controllers;

use App\Models\Tube_HS_Shute;
use App\Http\Requests\StoreTube_HS_ShuteRequest;
use App\Http\Requests\UpdateTube_HS_ShuteRequest;
use App\Http\Resources\TubeHSshuteResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Database\QueryException;

class TubeHSshuteController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|JsonResponse
     */
    public function index()
    {
        try {
            $tubeHS = Tube_HS_Shute::orderBy('created_at', 'desc')->get();
            return TubeHSshuteResource::collection($tubeHS);
        } catch (Exception $e) {
            Log::error('Failed to fetch HS/Shute tubes: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve HS/Shute tubes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param StoreTube_HS_ShuteRequest $request
     * @return TubeHSshuteResource|JsonResponse
     */
    public function store(StoreTube_HS_ShuteRequest $request)
    {
        try {
            $formData = $request->validated();
            $tubeHS = Tube_HS_Shute::create($formData);
            
            Log::info('HS/Shute tube created successfully', ['id' => $tubeHS->id]);
            return new TubeHSshuteResource($tubeHS);
            
        } catch (QueryException $e) {
            Log::error('Database error while creating HS/Shute tube: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create HS/Shute tube: database error',
                'error' => $e->getMessage()
            ], 500);
        } catch (Exception $e) {
            Log::error('Failed to create HS/Shute tube: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create HS/Shute tube',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param string $code_tube_HS
     * @return TubeHSshuteResource|JsonResponse
     */
    public function show( $id)
    {
        try {
            $tubeHS = Tube_HS_Shute::where('id', $id)->first();
            
            if (!$tubeHS) {
                Log::warning('HS/Shute tube not found', ['code' => $id]);
                return response()->json([
                    'message' => 'HS/Shute tube not found'
                ], 404);
            }

            return new TubeHSshuteResource($tubeHS);
        } catch (Exception $e) {
            Log::error('Failed to fetch HS/Shute tube: ' . $e->getMessage(), ['code' => $id]);
            return response()->json([
                'message' => 'Failed to retrieve HS/Shute tube',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UpdateTube_HS_ShuteRequest $request
     * @param string $code_tube_HS
     * @return JsonResponse
     */
    public function update(UpdateTube_HS_ShuteRequest $request, $code_tube_HS): JsonResponse
    {
        try {
            $tubeHS = Tube_HS_Shute::where('id', $code_tube_HS)->first();
            
            if (!$tubeHS) {
                Log::warning('HS/Shute tube not found for update', ['code' => $code_tube_HS]);
                return response()->json([
                    'message' => 'HS/Shute tube not found'
                ], 404);
            }

            $validatedData = $request->validated();
            $tubeHS->update($validatedData);
            
            Log::info('HS/Shute tube updated successfully', ['code' => $code_tube_HS]);
            return response()->json([
                'message' => 'HS/Shute tube updated successfully',
                'data' => new TubeHSshuteResource($tubeHS)
            ]);

        } catch (Exception $e) {
            Log::error('Failed to update HS/Shute tube: ' . $e->getMessage(), ['code' => $code_tube_HS]);
            return response()->json([
                'message' => 'Failed to update HS/Shute tube',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param string $code_tube_HS
     * @return JsonResponse
     */
    public function destroy(string $code_tube_HS): JsonResponse
    {
        try {
            $tubeHS = Tube_HS_Shute::where('id', $code_tube_HS)->first();

            if (!$tubeHS) {
                Log::warning('HS/Shute tube not found for deletion', ['code' => $code_tube_HS]);
                return response()->json([
                    'message' => 'HS/Shute tube not found'
                ], 404);
            }

            $tubeHS->delete();
            
            Log::info('HS/Shute tube deleted successfully', ['code' => $code_tube_HS]);
            return response()->json([
                'message' => 'HS/Shute tube deleted successfully',
                'data' => new TubeHSshuteResource($tubeHS)
            ]);

        } catch (QueryException $e) {
            Log::error('Database error while deleting HS/Shute tube: ' . $e->getMessage(), ['code' => $code_tube_HS]);
            return response()->json([
                'message' => 'Cannot delete HS/Shute tube: It is referenced elsewhere',
                'error' => $e->getMessage()
            ], 409);
        } catch (Exception $e) {
            Log::error('Failed to delete HS/Shute tube: ' . $e->getMessage(), ['code' => $code_tube_HS]);
            return response()->json([
                'message' => 'Failed to delete HS/Shute tube',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}