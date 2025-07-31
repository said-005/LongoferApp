<?php

namespace App\Http\Controllers;

use App\Models\Articles;
use App\Http\Requests\StoreArticalsRequest;
use App\Http\Requests\UpdateArticalsRequest;
use App\Http\Resources\ArticleResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse|AnonymousResourceCollection
    {
        try {
            $articles = Articles::orderBy('created_at', 'desc')->get();
            return ArticleResource::collection($articles);
        } catch (\Exception $e) {
            Log::error('Failed to fetch articles: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve articles',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticalsRequest $request): JsonResponse
    {
        try {
            $formData = $request->validated();
            $article = Articles::create($formData);
            
            return response()->json([
                'message' => 'Article created successfully',
                'data' => new ArticleResource($article)
            ], 201);
        } catch (QueryException $e) {
            Log::error('Article creation failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to create article',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error creating article: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while creating article',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($codeArticle): JsonResponse
    {
        try {
            $article = Articles::where('codeArticle', $codeArticle)->first();

            if (!$article) {
                return response()->json([
                    'message' => 'Article not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Article retrieved successfully',
                'data' => new ArticleResource($article)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch article: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve article',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticalsRequest $request, $codeArticle): JsonResponse
    {
        try {
            $article = Articles::where('codeArticle', $codeArticle)->first();

            if (!$article) {
                return response()->json([
                    'message' => 'Article not found'
                ], 404);
            }

            $validatedData = $request->validated();
            $article->update($validatedData);

            return response()->json([
                'message' => 'Article updated successfully',
                'data' => new ArticleResource($article)
            ]);
        } catch (QueryException $e) {
            Log::error('Article update failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to update article',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error updating article: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while updating article',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codeArticle): JsonResponse
    {
        try {
            $article = Articles::where('codeArticle', $codeArticle)->first();

            if (!$article) {
                return response()->json([
                    'message' => 'Article not found'
                ], 404);
            }

            $article->delete();

            return response()->json([
                'message' => 'Article deleted successfully',
                'data' => new ArticleResource($article)
            ]);
        } catch (QueryException $e) {
            Log::error('Article deletion failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete article as it is referenced by other resources',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 409);
            }
            
            return response()->json([
                'message' => 'Failed to delete article',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error deleting article: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while deleting article',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}