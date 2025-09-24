<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - {{ config('app.name') }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: #ffffff;">
    
    <!-- Email Container -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 20px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background: linear-gradient(135deg, rgba(139, 127, 211, 0.1) 0%, rgba(99, 89, 133, 0.1) 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); border: 1px solid rgba(139, 127, 211, 0.2);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8B7FD3 0%, #635985 100%); padding: 40px 20px; text-align: center;">
                            <a href="{{ url('/') }}" style="font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; color: #000000 !important; text-decoration: none; display: inline-block; padding: 12px 24px; background: rgba(255, 255, 255, 0.9); border-radius: 50px; border: 1px solid rgba(0, 0, 0, 0.1);">
                                {{ config('app.name') }}
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; background: rgba(26, 26, 46, 0.8);">
                            
                            <!-- Greeting -->
                            <h1 style="font-size: 24px; font-weight: 600; color: #ffffff; margin: 0 0 20px 0;">
                                Welcome to KooQ! 🚀
                            </h1>
                            
                            <!-- Message -->
                            <p style="font-size: 16px; color: #e2e8f0; margin: 0 0 30px 0; line-height: 1.7;">
                                Thank you for joining our community! To get started, please verify your email address by clicking the button below.
                            </p>
                            
                            <p style="font-size: 16px; color: #e2e8f0; margin: 0 0 30px 0; line-height: 1.7;">
                                This verification link ensures the security of your account and enables all features of the platform.
                            </p>
                            
                            <!-- Button -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ $url }}" style="display: inline-block; background: linear-gradient(135deg, #8B7FD3 0%, #9D93DD 100%); color: #ffffff !important; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(139, 127, 211, 0.4); border: 1px solid rgba(255, 255, 255, 0.2);">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Features List -->
                            <p style="font-size: 16px; color: #e2e8f0; margin: 30px 0 15px 0; line-height: 1.7;">
                                Once verified, you'll be able to:
                            </p>
                            
                            <ul style="color: #e2e8f0; margin: 0 0 30px 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Select your role and complete your profile</li>
                                <li style="margin-bottom: 8px;">Access the dashboard and explore events</li>
                                <li style="margin-bottom: 8px;">Connect with other members</li>
                                <li style="margin-bottom: 8px;">Join teams and collaborations</li>
                            </ul>
                            
                            <p style="font-size: 16px; color: #e2e8f0; margin: 30px 0; line-height: 1.7;">
                                If you did not create an account with us, please ignore this email. No further action is required.
                            </p>
                            
                            <!-- Subcopy -->
                            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(139, 127, 211, 0.2); font-size: 14px; color: #94a3b8; line-height: 1.6;">
                                <p style="margin: 0 0 10px 0;">
                                    <strong>Having trouble clicking the button?</strong><br>
                                    Copy and paste the URL below into your web browser:
                                </p>
                                <p style="margin: 0; word-break: break-all;">
                                    <a href="{{ $url }}" style="color: #8B7FD3;">{{ $url }}</a>
                                </p>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: rgba(15, 15, 25, 0.9); padding: 30px; text-align: center; border-top: 1px solid rgba(139, 127, 211, 0.1);">
                            <p style="font-size: 12px; color: #64748b; margin: 0 0 15px 0;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                            <div>
                                <a href="{{ url('/') }}" style="color: #8B7FD3; text-decoration: none; margin: 0 10px; font-size: 12px;">Website</a>
                                <a href="#" style="color: #8B7FD3; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
                                <a href="#" style="color: #8B7FD3; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
    
</body>
</html> 