<?php

namespace App\Http\Controllers;
use Illuminate\Database\QueryException;
use App\Models\Machine;
use App\Http\Requests\StoreMachineRequest;
use App\Http\Requests\UpdateMachineRequest;
use App\Http\Resources\MachineResource;
use Illuminate\Database\Eloquent\Model;

class MachineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $machines=Machine::all();
        return MachineResource::collection($machines);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMachineRequest $request)
    {
        $data=$request->validated();
        Machine::create($data);
        
        return response()->json([
          'message'=>'machine created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
 public function show( $codeMachine)
{
      $machine = Machine::find($codeMachine);

    if (!$machine) {
        return response()->json(['message' => 'Machine not found'], 404);
    }

    return response()->json($machine);
}

    /**
     * Update the specified resource in storage.
     */
public function update(UpdateMachineRequest $request, $codeMachine)
{
    // Find the machine by primary key (codeMachine)
    $machine = Machine::where('codeMachine', $codeMachine)->first();

    if (!$machine) {
        return response()->json([
            'message' => 'Machine not found',
        ], 404);
    }

    $data = $request->validated();

    if ($machine->update($data)) {
        return response()->json([
            'message' => 'Machine updated successfully',
        ], 200);
    }

    return response()->json([
        'message' => 'There was an error updating the machine',
    ], 500);
}


    /**
     * Remove the specified resource from storage.
     */
public function destroy($machineId)
{
    $machine = Machine::find($machineId);

    if (!$machine) {
        return response()->json([
            'message' => 'Machine introuvable.'
        ], 404);
    }

    try {
        $machine->delete();

        return response()->json([
            'message' => 'Machine supprimée avec succès.'
        ], 200);
      
    } catch (QueryException $e) {
        // 23000 = Integrity constraint violation
        if ($e->getCode() === '23000') {
            return response()->json([
                'message' => 'Impossible de supprimer cette machine car elle est encore associée à des opérateurs.'
            ], 409);
        }

        return response()->json([
            'message' => 'Une erreur est survenue lors de la suppression de la machine.'
        ], 500);
    }
}
}
