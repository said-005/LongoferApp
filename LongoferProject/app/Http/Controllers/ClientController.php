<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use App\Http\Requests\StoreClientsRequest;
use App\Http\Requests\UpdateClientsRequest;
use App\Http\Resources\ClientResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse|AnonymousResourceCollection
    {
        try {
            $clients = Clients::orderBy('created_at', 'desc')->get();
            return ClientResource::collection($clients);
        } catch (\Exception $e) {
            Log::error('Failed to fetch clients: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve clients',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientsRequest $request): JsonResponse
    {
        try {
            $formData = $request->validated();
            $client = Clients::create($formData);
            
            return response()->json([
                'message' => 'Client created successfully',
                'data' => new ClientResource($client)
            ], 201);
        } catch (QueryException $e) {
            Log::error('Client creation failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to create client',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error creating client: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while creating client',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($codeClient): JsonResponse
    {
        try {
            $client = Clients::where('codeClient', $codeClient)->first();

            if (!$client) {
                return response()->json([
                    'message' => 'Client not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Client retrieved successfully',
                'data' => new ClientResource($client)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch client: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve client',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientsRequest $request, $codeClient): JsonResponse
    {
        try {
            $client = Clients::where('codeClient', $codeClient)->first();

            if (!$client) {
                return response()->json([
                    'message' => 'Client not found'
                ], 404);
            }

            $validatedData = $request->validated();
            $client->update($validatedData);

            return response()->json([
                'message' => 'Client updated successfully',
                'data' => new ClientResource($client)
            ]);
        } catch (QueryException $e) {
            Log::error('Client update failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 422);
            }
            
            return response()->json([
                'message' => 'Failed to update client',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error updating client: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while updating client',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codeClient): JsonResponse
    {
        try {
            $client = Clients::where('codeClient', $codeClient)->first();

            if (!$client) {
                return response()->json([
                    'message' => 'Client not found'
                ], 404);
            }

            $client->delete();

            return response()->json([
                'message' => 'Client deleted successfully',
                'data' => new ClientResource($client)
            ]);
        } catch (QueryException $e) {
            Log::error('Client deletion failed: ' . $e->getMessage());
            
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete client as it is referenced by other resources',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 409);
            }
            
            return response()->json([
                'message' => 'Failed to delete client',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } catch (\Exception $e) {
            Log::error('Unexpected error deleting client: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred while deleting client',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}