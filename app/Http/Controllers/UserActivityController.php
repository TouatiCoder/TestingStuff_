<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class UserActivityController extends Controller
{
    /**
     * Record user logout activity
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function recordLogout(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $today = Carbon::now()->toDateString();
            
            // Find the latest activity record for today
            $activity = UserActivity::where('user_id', $user->id)
                ->whereDate('date', $today)
                ->whereNull('logout_time')
                ->latest()
                ->first();
            
            if ($activity) {
                // Calculate duration in minutes
                $loginTime = Carbon::parse($activity->login_time);
                $logoutTime = Carbon::now();
                $durationMinutes = $loginTime->diffInMinutes($logoutTime);
                
                // Update the activity record
                $activity->update([
                    'logout_time' => $logoutTime->toTimeString(),
                    'duration_minutes' => $durationMinutes
                ]);
            }
            
            // Clear session tracking
            Session::forget('activity_tracked');
            Session::forget('activity_session_start');
        }
        
        return response()->json(['success' => true]);
    }
    
    /**
     * Get user activity statistics for the dashboard
     *
     * @return \Illuminate\Http\Response
     */
    public function getActivityStats()
    {
        $user = Auth::user();
        $now = Carbon::now();
        $weekStart = $now->copy()->startOfWeek();
        
        // Get daily activity for the current week
        $dailyActivity = [];
        $dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Initialize with zero hours for each day
        foreach ($dayNames as $index => $day) {
            $date = $weekStart->copy()->addDays($index);
            $dailyActivity[$day] = [
                'day' => $day,
                'date' => $date->toDateString(),
                'hours' => 0
            ];
        }
        
        // Get activity records for the current week
        $weeklyRecords = UserActivity::where('user_id', $user->id)
            ->whereBetween('date', [$weekStart->toDateString(), $now->copy()->endOfWeek()->toDateString()])
            ->get();
        
        // Calculate hours for each day
        foreach ($weeklyRecords as $record) {
            $dayOfWeek = Carbon::parse($record->date)->format('D');
            $hours = $record->duration_minutes / 60;
            $dailyActivity[$dayOfWeek]['hours'] += $hours;
        }
        
        // Calculate streak (consecutive days with activity)
        $streak = 0;
        $checkDate = $now->copy();
        
        while (true) {
            $hasActivity = UserActivity::where('user_id', $user->id)
                ->whereDate('date', $checkDate->toDateString())
                ->exists();
                
            if ($hasActivity) {
                $streak++;
                $checkDate->subDay();
            } else {
                break;
            }
        }
        
        // Calculate total hours this week
        $totalHours = $weeklyRecords->sum('duration_minutes') / 60;
        
        return response()->json([
            'dailyActivity' => array_values($dailyActivity),
            'streak' => $streak,
            'totalHours' => round($totalHours, 1)
        ]);
    }
}
