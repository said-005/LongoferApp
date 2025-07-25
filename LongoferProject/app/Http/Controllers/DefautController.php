<?php

namespace App\Http\Controllers;

use App\Models\Defaut;
use App\Http\Requests\StoreDefautRequest;
use App\Http\Requests\UpdateDefautRequest;
use App\Http\Resources\DefautResource;

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
public function destroy($codeDefaut )
{
    $defaut = Defaut::where('codeDefaut', $codeDefaut )->first();

    if (!$defaut) {
        return response()->json(['message' => 'Defaut not found.'], 404);
    }

    $defaut->delete(); // ✅ Use delete() on the model instance

    return response()->json([
        'message' => 'Defaut deleted successfully.',
        'Defaut' => $defaut
    ]);
}
}
