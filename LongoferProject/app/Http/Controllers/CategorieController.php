<?php

namespace App\Http\Controllers;

use App\Models\CategorieArticle;
use App\Http\Requests\StoreCategorieArticalRequest;
use App\Http\Requests\UpdateCategorieArticalRequest;
use App\Http\Resources\CategorieResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse|AnonymousResourceCollection
    {
        try {
            $categories = CategorieArticle::orderBy('created_at', 'desc')->get();
            return CategorieResource::collection($categories);
        } catch (\Exception $e) {
            Log::error('Failed to fetch categories: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve categories',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategorieArticalRequest $request): JsonResponse
    {
        try {
            $formData = $request->validated();
            $category = CategorieArticle::create($formData);
            
            return response()->json([
                'message' => 'Category created successfully',
                'data' => new CategorieResource($category)
            ], 201);
        } catch (QueryException $e) {
            Log::error('Category creation failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to create category',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error creating category: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while creating category',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $category = CategorieArticle::find($id);

            if (!$category) {
                return response()->json([
                    'message' => 'Category not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Category retrieved successfully',
                'data' => new CategorieResource($category)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch category: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve category',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategorieArticalRequest $request, $id): JsonResponse
    {
        try {
            $category = CategorieArticle::find($id);

            if (!$category) {
                return response()->json([
                    'message' => 'Category not found'
                ], 404);
            }

            $validatedData = $request->validated();
            $category->update($validatedData);

            return response()->json([
                'message' => 'Category updated successfully',
                'data' => new CategorieResource($category)
            ]);
        } catch (QueryException $e) {
            Log::error('Category update failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to update category',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error updating category: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while updating category',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $category = CategorieArticle::find($id);

            if (!$category) {
                return response()->json([
                    'message' => 'Category not found'
                ], 404);
            }

            $category->delete();

            return response()->json([
                'message' => 'Category deleted successfully',
                'data' => new CategorieResource($category)
            ]);
        } catch (QueryException $e) {
            Log::error('Category deletion failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete category as it is referenced by other resources',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 409);
            }
            
            return response()->json([
                'message' => 'Failed to delete category',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error deleting category: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while deleting category',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}