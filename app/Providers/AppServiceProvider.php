<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Facades\Config;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Fix SSL issues for development
        if (app()->environment('local')) {
            $this->configureSslForDevelopment();
        }
    }
    
    /**
     * Configure SSL settings for development environment
     */
    private function configureSslForDevelopment(): void
    {
        // Set mail configuration with SSL stream context
        Config::set('mail.mailers.smtp.stream', [
            'ssl' => [
                'allow_self_signed' => true,
                'verify_peer' => false,
                'verify_peer_name' => false,
                'peer_name' => 'in-v3.mailjet.com',
                'disable_compression' => true,
            ],
        ]);
    }
}
