<?php

namespace App\Http\Controllers;

use App\Models\Operateur;
use App\Http\Requests\StoreOperateurRequest;
use App\Http\Requests\UpdateOperateurRequest;
use App\Http\Resources\OperateurResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

class OperateurController extends Controller
{

public function index(): AnonymousResourceCollection | JsonResponse
{
    try {
        $operateurs = Operateur::with('machine')
            ->orderBy('created_at', 'desc')  // Explicitly order by creation date
            ->get();
      
        return OperateurResource::collection($operateurs);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error retrieving operateurs',
            'error' => $e->getMessage()
        ], 500);
    }
}


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOperateurRequest $request): JsonResponse|OperateurResource
    {
        try {
            // Validate the incoming request data
            $formData = $request->validated();
            
            $operateur = Operateur::create($formData);
            // Return a resource response
            return new OperateurResource($operateur);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating operateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($operateur): JsonResponse|OperateurResource
    {
        try {
            $operateur = Operateur::where('operateur', $operateur)->first();
            if (!$operateur) {
                return response()->json(['message' => 'operateur not found.'], 404);
            }

            return new OperateurResource($operateur);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving operateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOperateurRequest $request, $operateur): JsonResponse
    {
        try {
            $operateur = trim($operateur);  // trim any accidental spaces

            $validatedData = $request->validated();

            $operateur = Operateur::where('operateur', $operateur)->first();

            if (!$operateur) {
                return response()->json(['message' => 'operateur not found.'], 404);
            }

            $operateur->update($validatedData);

            return response()->json([
                'message' => 'operateur updated successfully.',
                'operateur' => $operateur
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating operateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($operateur): JsonResponse
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