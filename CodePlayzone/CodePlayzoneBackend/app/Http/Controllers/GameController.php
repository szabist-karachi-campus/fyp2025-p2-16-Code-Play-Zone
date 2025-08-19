<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class GameController extends Controller
{
    /**
     * Add progress for a completed level.
     */
    public function addProgress(Request $request): JsonResponse
    {
        $request->validate([
            'progress_item' => 'required|string',
            'points' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        $progress = $user->progress ?? [];

        // Only add progress_item if it's not already there
        if (!in_array($request->progress_item, $progress)) {
            $progress[] = $request->progress_item;
            $user->progress = $progress;
        }

        // Always add the points
        $user->points += $request->points;

        $user->save();

        return response()->json([
            'message' => 'Progress and points updated successfully!',
            'progress' => $user->progress,
            'total_points' => $user->points,
        ]);
    }

    /**
     * Get progress with optional filters.
     */
    public function getProgress(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'progress_items' => 'nullable|array',
        ]);

        $user = Auth::user();
        $progress = $user->progress ?? [];

        // Filter specific progress items if provided
        if (!empty($validated['progress_items'])) {
            $progress = array_values(array_intersect($progress, $validated['progress_items']));
        }

        return response()->json([
            'progress' => $progress,
            'total_points' => $user->points,
        ]);
    }
}
