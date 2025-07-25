<?php

namespace App\Http\Controllers;

use App\Models\Operateur;
use App\Http\Requests\StoreOperateurRequest;
use App\Http\Requests\UpdateDefautRequest;
use App\Http\Requests\UpdateOperateurRequest;
use App\Http\Resources\OperateurResource;

class OperateurController extends Controller
{
  public function index()
    {
        $operateurs=Operateur::all();
        return OperateurResource::collection($operateurs);

    }

 
   /**
     * Store a newly created resource in storage.
     */
 public function store(StoreOperateurRequest $request)
{

    // Validate the incoming request data
    $formData = $request->validated();
    
    $operateur = Operateur::create($formData);
    // Return a resource response
    return new OperateurResource($operateur);
}

    /**
     * Display the specified resource.
     * */


public function show($operateur  )
{
   
    $operateur  = Operateur::where('operateur', $operateur  )->first();
    if (!$operateur ) {
        return response()->json(['message' => 'operateur  not found.'], 404);
    }

    return new OperateurResource($operateur );
}

    /**
     * Update the specified resource in storage.
     */
public function update(UpdateOperateurRequest $request, $operateur )
{
    $operateur  = trim($operateur );  // trim any accidental spaces

    $validatedData = $request->validated();

    $operateur  = Operateur::where('operateur', $operateur )->first();

    if (!$operateur ) {
        return response()->json(['message' => 'operateur  not found.'], 404);
    }

    $operateur ->update($validatedData);

    return response()->json(['message' => 'operateur  updated successfully.', 'operateur ' => $operateur ]);
}



    /**
     * Remove the specified resource from storage.
     */
public function destroy($operateur  )
{
    $operateur  = Operateur::where('operateur', $operateur  )->first();

    if (!$operateur ) {
        return response()->json(['message' => 'operateur  not found.'], 404);
    }

    $operateur ->delete(); // ✅ Use delete() on the model instance

    return response()->json([
        'message' => 'operateur  deleted successfully.',
        'operateur ' => $operateur 
    ]);
}
}
