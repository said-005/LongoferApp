<?php

namespace App\Http\Controllers;

use App\Models\TubeStatut;
use App\Http\Requests\StoreTubeStatutRequest;
use App\Http\Requests\UpdateTubeStatutRequest;
use App\Http\Resources\TubeStatutResource;

class TubeStatutController extends Controller
{
    public function index()
    {
        $Statut=TubeStatut::all();
        return TubeStatutResource::collection($Statut);

    }

 
   /**
     * Store a newly created resource in storage.
     */
 public function store(StoreTubeStatutRequest $request)
{

    // Validate the incoming request data
    $formData = $request->validated();
    
    $Statut = TubeStatut::create($formData);
    // Return a resource response
    return new TubeStatutResource($Statut);
}

    /**
     * Display the specified resource.
     * */


public function show($Statut  )
{
   
    $Statut  = TubeStatut::where('Statut', $Statut  )->first();
    if (!$Statut ) {
        return response()->json(['message' => 'Statut  not found.'], 404);
    }

    return new TubeStatutResource($Statut );
}

    /**
     * Update the specified resource in storage.
     */
public function update(UpdateTubeStatutRequest $request, $Statut )
{
    $Statut  = trim($Statut );  // trim any accidental spaces

    $validatedData = $request->validated();

    $Statut  = TubeStatut::where('Statut', $Statut )->first();

    if (!$Statut ) {
        return response()->json(['message' => 'Statut  not found.'], 404);
    }

    $Statut ->update($validatedData);

    return response()->json(['message' => 'Statut  updated successfully.', 'Statut ' => $Statut ]);
}



    /**
     * Remove the specified resource from storage.
     */
public function destroy($Statut  )
{
    $Statut  = TubeStatut::where('Statut', $Statut  )->first();

    if (!$Statut ) {
        return response()->json(['message' => 'Statut  not found.'], 404);
    }

    $Statut ->delete(); // ✅ Use delete() on the model instance

    return response()->json([
        'message' => 'Statut  deleted successfully.',
        'Statut ' => $Statut 
    ]);
}
}
