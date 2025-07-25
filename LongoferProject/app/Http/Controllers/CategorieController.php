<?php

namespace App\Http\Controllers;

use App\Models\CategorieArticle;
use App\Http\Requests\StoreCategorieArticalRequest;
use App\Http\Requests\UpdateCategorieArticalRequest;
use App\Http\Resources\CategorieResource;

class CategorieController extends Controller
{
    public function index()
    {
        $cat = CategorieArticle::all();
        return CategorieResource::collection($cat);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategorieArticalRequest $request)
    {
        $formData = $request->validated();
        $cat = CategorieArticle::create($formData);
        return new CategorieResource($cat);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cat = CategorieArticle::find($id); // Uses custom primary key

        if (!$cat) {
            return response()->json(['message' => 'Categorie not found.'], 404);
        }

        return new CategorieResource($cat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategorieArticalRequest $request, $id)
    {
        $validatedData = $request->validated();
        $cat = CategorieArticle::find($id);

        if (!$cat) {
            return response()->json(['message' => 'Categorie not found.'], 404);
        }

        $cat->update($validatedData);

        return response()->json(['message' => 'Categorie updated successfully.', 'Categorie' => $cat]);
    }

    /**
     * Remove the specified resource from storage.
     */
public function destroy($id)
{
    try {
        $cat = CategorieArticle::find($id);

        if (!$cat) {
            return response()->json(['message' => 'Categorie not found.'], 404);
        }

        $cat->delete();

        return response()->json([
            'message' => 'Categorie deleted successfully.',
            'Categorie' => $cat
        ]);
    } catch (\Exception $e) {
        // Optionally log the error for debugging:
        // \Log::error($e);

        if ($e->getCode() == 23000) {
            return response()->json([
                'message' => 'Impossible de supprimer ce Categorie. Il est utilisé dans un autre endroit.'
            ], 409); // Conflict
        }

        return response()->json([
            'message' => 'Une erreur est survenue lors de la suppression du Categorie.',
         
        ], 500);
    }
}

}
