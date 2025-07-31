<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use App\Models\Machine;
use App\Http\Requests\StoreMachineRequest;
use App\Http\Requests\UpdateMachineRequest;
use App\Http\Resources\MachineResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MachineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse | AnonymousResourceCollection
    {
        try {
            $machines = Machine::orderBy('created_at', 'desc')->get();
            return MachineResource::collection($machines);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving machines',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMachineRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $machine = Machine::create($data);
            
            return response()->json([
                'message' => 'Machine created successfully',
                'data' => new MachineResource($machine)
            ], 201);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => 'The machine could not be created due to data constraints'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Error creating machine',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error creating machine',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($codeMachine): JsonResponse
    {
        try {
            $machine = Machine::find($codeMachine);

            if (!$machine) {
                return response()->json([
                    'message' => 'Machine not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Machine retrieved successfully',
                'data' => new MachineResource($machine)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving machine',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMachineRequest $request, $codeMachine): JsonResponse
    {
        try {
            $machine = Machine::where('codeMachine', $codeMachine)->first();

            if (!$machine) {
                return response()->json([
                    'message' => 'Machine not found'
                ], 404);
            }

            $data = $request->validated();
            $machine->update($data);

            return response()->json([
                'message' => 'Machine updated successfully',
                'data' => new MachineResource($machine)
            ], 200);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Database integrity constraint violation',
                    'error' => 'The machine could not be updated due to data constraints'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Error updating machine',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error updating machine',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($machineId): JsonResponse
    {
        try {
            $machine = Machine::find($machineId);

            if (!$machine) {
                return response()->json([
                    'message' => 'Machine not found'
                ], 404);
            }

            $machine->delete();

            return response()->json([
                'message' => 'Machine deleted successfully',
                'data' => new MachineResource($machine)
            ], 200);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cannot delete machine as it is still associated with operators'
                ], 409);
            }

            return response()->json([
                'message' => 'Database error while deleting machine',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unexpected error deleting machine',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}