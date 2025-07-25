<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use App\Http\Requests\StoreClientsRequest;
use App\Http\Requests\UpdateClientsRequest;
use App\Http\Resources\ClientResource;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $Clients=Clients::all();
        return  ClientResource::collection($Clients);
    }

 

    /**
     * Store a newly created resource in storage.
     */
 public function store(StoreClientsRequest $request)
{
    // Validate the incoming request data
    $formData = $request->validated();
    $client = Clients::create($formData);
    // Return a resource response
    return new ClientResource($client);
}

    /**
     * Display the specified resource.
     * */


public function show($codeClient)
{
    $client = Clients::where('codeClient', $codeClient)->first();

    if (!$client) {
        return response()->json(['message' => 'Client not found.'], 404);
    }

    return new ClientResource($client);
}

    /**
     * Update the specified resource in storage.
     */
  public function update(UpdateClientsRequest $request, $codeClient)
{
    $validatedData = $request->validated();

      $client = Clients::where('codeClient', $codeClient)->first();

    if (!$client) {
        return response()->json(['message' => 'Client not found.'], 404);
    }

    $newData=$client->update($validatedData);

    return response()->json(['message' => 'Client updated successfully.', 'client' => $client]);
}


    /**
     * Remove the specified resource from storage.
     */
public function destroy($codeClient)
{
    try {
        $client = Clients::where('codeClient', $codeClient)->first();

        if (!$client) {
            return response()->json(['message' => 'Client not found.'], 404);
        }

        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully.',
            'client' => $client
        ]);
    } catch (\Exception $e) {
        // Optionally log the error for debugging:
        // \Log::error($e);

        if ($e->getCode() == 23000) {
            return response()->json([
                'message' => 'Impossible de supprimer ce client. Il est utilisé dans un autre endroit.'
            ], 409); // Conflict
        }

        return response()->json([
            'message' => 'Une erreur est survenue lors de la suppression du client.',
         
        ], 500);
    }
}

}

