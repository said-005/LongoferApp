<?php
use Illuminate\Support\Facades\DB;

if (!function_exists('canDeleteStage')) {
    function canDeleteStage(string $stageToDelete, string $refProduction): bool
    {
        $stages = config('stages'); // this is an ordered list of all stage table names
        $index = array_search($stageToDelete, $stages);

        if ($index === false) {
            throw new \Exception("Stage '{$stageToDelete}' not found in stages config.");
        }

        $laterStages = array_slice($stages, $index + 1);

        foreach ($laterStages as $laterStage) {
            if (DB::table($laterStage)->where('ref_Production', $refProduction)->exists()) {
                return false;
            }
        }

        return true;
    }
}

