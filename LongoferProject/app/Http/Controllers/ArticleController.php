<?php

namespace App\Http\Controllers;

use App\Models\Articles;
use App\Http\Requests\StoreArticalsRequest;
use App\Http\Requests\UpdateArticalsRequest;
use Illuminate\Database\QueryException;

use App\Http\Resources\ArticleResource;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $Articles=Articles::all();
        return ArticleResource::collection($Articles);

    }

 
   /**
     * Store a newly created resource in storage.
     */
 public function store(StoreArticalsRequest $request)
{
    // Validate the incoming request data
    $formData = $request->validated();
    $article = Articles::create($formData);
    // Return a resource response
    return new ArticleResource($article);
}

    /**
     * Display the specified resource.
     * */


public function show($codeArticle)
{
    $article = Articles::where('codeArticle', $codeArticle)->first();

    if (!$article) {
        return response()->json(['message' => 'article not found.'], 404);
    }

    return new ArticleResource($article);
}

    /**
     * Update the specified resource in storage.
     */
  public function update(UpdateArticalsRequest $request, $codeArticle)
{
    $validatedData = $request->validated();

      $article = Articles::where('codeArticle', $codeArticle)->first();

    if (!$article) {
        return response()->json(['message' => 'article not found.'], 404);
    }

    $article->update($validatedData);

    return response()->json(['message' => 'article updated successfully.', 'article' => $article]);
}


    /**
     * Remove the specified resource from storage.
     */
public function destroy($codeArticle)
{
    $article = Articles::where('codeArticle', $codeArticle)->first();

    if (!$article) {
        return response()->json(['message' => 'Article not found.'], 404);
    }

    try {
        $article->delete();

        return response()->json([
            'message' => 'Article deleted successfully.',
            'article' => $article
        ]);
    } catch (QueryException $e) {
        // Check if it's a foreign key constraint violation
        if ($e->getCode() == '23000') { // SQLSTATE code for integrity constraint violation
            return response()->json([
                'message' => 'Cannot delete this article because it is referenced by another resource.'
            ], 409);
        }

        // For any other query-related exception
        return response()->json([
            'message' => 'An error occurred while deleting the article.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
