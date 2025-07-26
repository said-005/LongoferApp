<?php

namespace App\Http\Controllers;

use App\Models\Operateur;
use App\Http\Requests\StoreOperateurRequest;
use App\Http\Requests\UpdateDefautRequest;
use App\Http\Requests\UpdateOperateurRequest;
use App\Http\Resources\OperateurResource;
use Illuminate\Database\QueryException;

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
public function destroy($operateur)
{
    try {
        $operateurModel = Operateur::where('operateur', $operateur)->first();

        if (!$operateurModel) {
            return response()->json(['message' => 'Operateur not found.'], 404);
        }

        $operateurModel->delete();

        return response()->json([
            'message' => 'Operateur deleted successfully.',
            'operateur' => $operateurModel
        ], 200);

    } catch (QueryException $e) {
        if ($e->getCode() === '23000') {
            return response()->json([
                'message' => 'Cannot delete this operateur because it is referenced by another record.'
            ], 409); // Conflict
        }

        return response()->json([
            'message' => 'Database error while deleting operateur.',
            'error' => $e->getMessage()
        ], 500);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Unexpected error occurred.',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
