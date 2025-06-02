<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckOnboardingStatus
{
    public function handle(Request $request, Closure $next)
    {
        // Skip if user is not authenticated or is on the onboarding page
        if (!auth()->check() || $request->routeIs('onboarding') ||
            $request->routeIs('user.courses.store') || $request->routeIs('logout')) {
            return $next($request);
        }

        // Check if user needs onboarding
        if (auth()->user()->needs_onboarding) {
            return redirect()->route('onboarding');
        }

        return $next($request);
    }
}
