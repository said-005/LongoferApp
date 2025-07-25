<?php

namespace App\Http\Controllers;

use App\Models\Articles;
use App\Http\Requests\StoreArticalsRequest;
use App\Http\Requests\UpdateArticalsRequest;

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
        return response()->json(['message' => 'article not found.'], 404);
    }

    $article->delete(); // ✅ Use delete() on the model instance

    return response()->json([
        'message' => 'article deleted successfully.',
        'artical' => $article
    ]);
}
}
