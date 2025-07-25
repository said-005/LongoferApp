<?php

namespace App\Http\Controllers;
use Illuminate\Database\QueryException;
use App\Models\Of;
use App\Http\Requests\StoreOfRequest;
use App\Http\Requests\UpdateOfRequest;
use App\Http\Resources\OfResource;
class OfController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ofs = Of::all();
        return OfResource::collection($ofs);
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(StoreOfRequest $request)
{
    try {
        $validated = $request->validated();
        $of = Of::create($validated);

        return response()->json([
            'message' => 'OF created successfully.',
            'data' => $of
        ], 201);
        
    } catch (QueryException $e) {
        if ($e->getCode() == '23000') { // Integrity constraint violation
            return response()->json([
                'message' => 'Failed to create OF. you have to add article in articles.',
             
            ], 422); // 422 Unprocessable Entity
        }

        return response()->json([
            'message' => 'Database error.',
            'error' => $e->getMessage()
        ], 500); // Generic server error
    }
}
    /**
     * Display the specified resource.
     */
    public function show($codeOf)
    {
        $of = Of::find($codeOf);

        if (!$of) {
            return response()->json(['message' => 'OF not found.'], 404);
        }

        return response()->json($of);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOfRequest $request, $codeOf)
    {
        $of = Of::find($codeOf);

        if (!$of) {
            return response()->json(['message' => 'OF not found.'], 404);
        }

        $validated = $request->validated();
        $of->update($validated);

        return response()->json(['message' => 'OF updated successfully.', 'data' => $of]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codeOf)
    {
        $of = Of::find($codeOf);

        if (!$of) {
            return response()->json(['message' => 'OF not found.'], 404);
        }

        $of->delete();

        return response()->json(['message' => 'OF deleted successfully.', 'data' => $of]);
    }
}
