<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Mentorship Request - {{ $appName }}</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #8B7FD3 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-height: 100vh;">
    
    <!-- Aurora Background Effects -->
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.3;">
        <div style="position: absolute; top: 20%; left: 10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(139, 127, 211, 0.4) 0%, transparent 70%); border-radius: 50%; filter: blur(60px); animation: aurora1 8s ease-in-out infinite alternate;"></div>
        <div style="position: absolute; top: 60%; right: 10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(99, 89, 133, 0.3) 0%, transparent 70%); border-radius: 50%; filter: blur(80px); animation: aurora2 10s ease-in-out infinite alternate-reverse;"></div>
        <div style="position: absolute; bottom: 20%; left: 30%; width: 250px; height: 250px; background: radial-gradient(circle, rgba(139, 127, 211, 0.2) 0%, transparent 70%); border-radius: 50%; filter: blur(70px); animation: aurora3 12s ease-in-out infinite alternate;"></div>
    </div>

    <!-- Main Container -->
    <div style="position: relative; z-index: 1; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header Card -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; margin-bottom: 30px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
            
            <!-- Logo Section -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2);">
                    <svg width="48" height="48" viewBox="0 0 100 100" style="filter: brightness(0);">
                        <circle cx="50" cy="50" r="45" fill="#000" stroke="#333" stroke-width="2"/>
                        <circle cx="35" cy="40" r="8" fill="#fff"/>
                        <circle cx="65" cy="40" r="8" fill="#fff"/>
                        <path d="M30 65 Q50 80 70 65" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
                        <text x="50" y="25" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">C</text>
                    </svg>
                </div>
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 20px 0 10px 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">{{ $appName }}</h1>
                <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; margin: 0;">You have a new mentorship request!</p>
            </div>

            <!-- Mentorship Request Section -->
            <div style="background: rgba(255, 255, 255, 0.03); border-radius: 16px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 30px;">
                
                <!-- Mentor Icon -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #8B7FD3 0%, #635985 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; box-shadow: 0 10px 30px rgba(139, 127, 211, 0.3);">
                        <svg width="40" height="40" fill="#ffffff" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.4 7 14 6.6 14 6V4C14 2.9 13.1 2 12 2S10 2.9 10 4V6C10 6.6 9.6 7 9 7H3V9H9C10.1 9 11 8.1 11 7V4C11 3.4 11.4 3 12 3S13 3.4 13 4V7C13 8.1 13.9 9 15 9H21ZM12 12L16 16H13V22H11V16H8L12 12Z"/>
                        </svg>
                    </div>
                </div>

                <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 15px 0;">New Mentorship Request</h2>
                
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; text-align: center; margin: 0 0 20px 0; line-height: 1.6;">
                    <strong style="color: #8B7FD3;">{{ $studentName }}</strong> has requested you as a mentor on {{ $appName }}.
                </p>

                @if($requestMessage)
                <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #8B7FD3;">
                    <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 0 0 5px 0; font-weight: 600;">Message from {{ $studentName }}:</p>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0; line-height: 1.5; font-style: italic;">
                        "{{ $requestMessage }}"
                    </p>
                </div>
                @endif

                <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; text-align: center; margin: 0; line-height: 1.5;">
                    Guide {{ $studentName }} on their academic journey and help shape their future.
                </p>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 30px;">
                <a href="{{ $dashboardUrl }}" style="display: inline-block; background: linear-gradient(135deg, #8B7FD3 0%, #635985 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 24px rgba(139, 127, 211, 0.4); transition: all 0.3s ease; margin: 0 10px 10px 0;">
                    View Mentorship Requests
                </a>
                <a href="{{ $profileUrl }}" style="display: inline-block; background: rgba(255, 255, 255, 0.1); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease; margin: 0 0 10px 0;">
                    View {{ $studentName }}'s Profile
                </a>
            </div>

            <!-- Divider -->
            <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%); margin: 30px 0;"></div>

            <!-- Footer -->
            <div style="text-align: center;">
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; margin: 0 0 10px 0;">
                    This notification was sent to {{ $notifiable->email }}
                </p>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 12px; margin: 0;">
                    © {{ date('Y') }} {{ $appName }}. Building connections in education.
                </p>
            </div>
        </div>
    </div>

    <!-- CSS Animations -->
    <style>
        @keyframes aurora1 {
            0% { transform: translateX(0px) translateY(0px) scale(1); }
            100% { transform: translateX(30px) translateY(-20px) scale(1.1); }
        }
        @keyframes aurora2 {
            0% { transform: translateX(0px) translateY(0px) scale(1); }
            100% { transform: translateX(-40px) translateY(30px) scale(0.9); }
        }
        @keyframes aurora3 {
            0% { transform: translateX(0px) translateY(0px) scale(1); }
            100% { transform: translateX(20px) translateY(-15px) scale(1.05); }
        }
    </style>
</body>
</html> 