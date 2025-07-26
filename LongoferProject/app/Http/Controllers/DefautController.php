<?php

namespace App\Http\Controllers;

use App\Models\Defaut;
use App\Http\Requests\StoreDefautRequest;
use App\Http\Requests\UpdateDefautRequest;
use App\Http\Resources\DefautResource;
use Illuminate\Database\QueryException;
class DefautController extends Controller
{
   public function index()
    {
        $defauts=Defaut::all();
        return DefautResource::collection($defauts);

    }

 
   /**
     * Store a newly created resource in storage.
     */
 public function store(StoreDefautRequest $request)
{
    // Validate the incoming request data
    $formData = $request->validated();
   
    $defaut = Defaut::create($formData);
    // Return a resource response
    return new DefautResource($defaut);
}

    /**
     * Display the specified resource.
     * */


public function show($codeDefaut )
{
   
    $defaut = Defaut::where('codeDefaut', $codeDefaut )->first();
    if (!$defaut) {
        return response()->json(['message' => 'Defaut not found.'], 404);
    }

    return new DefautResource($defaut);
}

    /**
     * Update the specified resource in storage.
     */
public function update(UpdateDefautRequest $request, $codeDefaut)
{
    $codeDefaut = trim($codeDefaut);  // trim any accidental spaces

    $validatedData = $request->validated();

    $defaut = Defaut::where('codeDefaut', $codeDefaut)->first();

    if (!$defaut) {
        return response()->json(['message' => 'Defaut not found.'], 404);
    }

    $defaut->update($validatedData);

    return response()->json(['message' => 'Defaut updated successfully.', 'Defaut' => $defaut]);
}



    /**
     * Remove the specified resource from storage.
     */

public function destroy($codeDefaut)
{
    $defaut = Defaut::where('codeDefaut', $codeDefaut)->first();

    if (!$defaut) {
        return response()->json(['message' => 'Defaut not found.'], 404);
    }

    try {
        $defaut->delete();

        return response()->json([
            'message' => 'Defaut deleted successfully.',
            'defaut' => $defaut
        ]);
    } catch (QueryException $e) {
        if ($e->getCode() === '23000') { // Foreign key constraint violation
            return response()->json([
                'message' => 'Cannot delete this defaut because it is referenced by another resource.'
            ], 409);
        }

        return response()->json([
            'message' => 'An error occurred while deleting the defaut.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
