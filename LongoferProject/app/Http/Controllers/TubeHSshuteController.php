<?php

namespace App\Http\Controllers;

use App\Models\Tube_HS_Shute;
use App\Http\Requests\StoreTube_HS_ShuteRequest;
use App\Http\Requests\UpdateTube_HS_ShuteRequest;
use App\Http\Resources\TubeHSshuteResource;
use Illuminate\Http\JsonResponse;

class TubeHSshuteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tube_HS = Tube_HS_Shute::all();
        return TubeHSshuteResource::collection($tube_HS);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTube_HS_ShuteRequest $request)
    {
         
        $formData = $request->validated();
        $tube_HS = Tube_HS_Shute::create($formData);

        return new TubeHSshuteResource($tube_HS);
    }

    /**
     * Display the specified resource.
     */
    public function show($code_tube_HS): JsonResponse|TubeHSshuteResource
    {
        $tube_HS = Tube_HS_Shute::where('code_tube_HS', $code_tube_HS)->first();
           
        if (!$tube_HS) {
            return response()->json(['message' => 'Tube HS/shute not found.'], 404);
        }

        return new TubeHSshuteResource($tube_HS);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTube_HS_ShuteRequest $request, $code_tube_HS): JsonResponse
    {
      
        $tube_HS = Tube_HS_Shute::where('code_tube_HS', $code_tube_HS)->first();
        if (!$tube_HS) {
            return response()->json(['message' => 'Tube HS/shute not found.'], 404);
        }

        $validatedData = $request->validated();
        $tube_HS->update($validatedData);

        return response()->json([
            'message' => 'Tube HS/shute updated successfully.',
            'tube_HS' => new TubeHSshuteResource($tube_HS)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($code_tube_HS): JsonResponse
    {
        $tube_HS = Tube_HS_Shute::where('code_tube_HS', $code_tube_HS)->first();

        if (!$tube_HS) {
            return response()->json(['message' => 'Tube HS/shute not found.'], 404);
        }

        try {
            $tube_HS->delete();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cannot delete Tube HS/shute: It is used in another place.',
                'error' => $e->getMessage()
            ], 409);
        }

        return response()->json([
            'message' => 'Tube HS/shute deleted successfully.',
            'tube_HS' => new TubeHSshuteResource($tube_HS)
        ]);
    }
}
