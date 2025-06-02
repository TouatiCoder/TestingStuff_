<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class TrackUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if this is a logout request
        $isLogout = $request->is('logout') || $request->is('auth/logout');
        
        // If it's logout, process before the request is handled
        if ($isLogout && Auth::check()) {
            $this->processLogout(Auth::user());
        }
        
        $response = $next($request);
        
        // Only track for authenticated users (and not on logout)
        if (Auth::check() && !$isLogout) {
            $user = Auth::user();
            $today = Carbon::now()->toDateString();
            
            // Check if we already have a session activity record
            if (!Session::has('activity_tracked')) {
                // Get or create a record for today
                $activity = UserActivity::firstOrCreate([
                    'user_id' => $user->id,
                    'date' => $today,
                    'logout_time' => null, // Ensure logout_time is null for new sessions
                ], [
                    'login_time' => Carbon::now()->toTimeString(),
                    'duration_minutes' => 0
                ]);
                
                // Mark that we've tracked this session
                Session::put('activity_tracked', true);
                Session::put('activity_session_start', Carbon::now());
                Session::put('activity_record_id', $activity->id);
            } else {
                // Update duration for existing session periodically
                $this->updateDuration();
            }
        }
        
        return $response;
    }
    
    /**
     * Process user logout
     * 
     * @param \App\Models\User $user
     * @return void
     */
    protected function processLogout($user)
    {
        $now = Carbon::now();
        $today = $now->toDateString();
        
        // Get the current activity record
        $activity = UserActivity::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->whereNull('logout_time')
            ->latest()
            ->first();
            
        if ($activity) {
            // Calculate duration
            $startTime = Session::has('activity_session_start') 
                ? Carbon::parse(Session::get('activity_session_start')) 
                : Carbon::parse($activity->login_time);
            
            $durationMinutes = $now->diffInMinutes($startTime);
            
            // Update the record
            $activity->update([
                'logout_time' => $now->toTimeString(),
                'duration_minutes' => $durationMinutes
            ]);
        }
        
        // Clear session variables
        Session::forget('activity_tracked');
        Session::forget('activity_session_start');
        Session::forget('activity_record_id');
    }
    
    /**
     * Update duration for current session
     *
     * @return void
     */
    protected function updateDuration()
    {
        if (Session::has('activity_session_start') && Session::has('activity_record_id')) {
            $now = Carbon::now();
            $startTime = Carbon::parse(Session::get('activity_session_start'));
            $durationMinutes = $now->diffInMinutes($startTime);
            
            // Only update every 5 minutes to reduce database load
            if ($durationMinutes % 5 === 0 && $durationMinutes > 0) {
                $activityId = Session::get('activity_record_id');
                $activity = UserActivity::find($activityId);
                
                if ($activity) {
                    $activity->update([
                        'duration_minutes' => $durationMinutes
                    ]);
                }
            }
        }
    }
}
