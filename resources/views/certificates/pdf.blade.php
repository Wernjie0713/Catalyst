<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $certificate->certificate_number }}</title>
    <style>
        @page {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'DejaVu Sans', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            position: relative;
        }
        
        .certificate-container {
            width: 100%;
            height: 100%;
            position: relative;
        }
        
        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        
        .certificate-title {
            position: absolute;
            width: 80%;
            text-align: {{ $layoutSettings['titleTextAlign'] ?? 'center' }};
            font-family: 'DejaVu Serif', 'Times New Roman', Times, serif;
            font-size: {{ $layoutSettings['titleFontSize'] ?? 48 }}px;
            font-weight: {{ $layoutSettings['titleFontWeight'] ?? 'bold' }};
            color: {{ $layoutSettings['titleColor'] ?? '#000000' }};
            left: {{ $layoutSettings['titlePosition']['x'] ?? 50 }}%;
            top: {{ $layoutSettings['titlePosition']['y'] ?? 30 }}%;
            transform: translate(-50%, -50%);
            text-transform: uppercase;
        }
        
        .student-name {
            position: absolute;
            width: 70%;
            text-align: {{ $layoutSettings['nameTextAlign'] ?? 'center' }};
            font-size: {{ $layoutSettings['nameFontSize'] ?? 32 }}px;
            color: {{ $layoutSettings['nameColor'] ?? '#333333' }};
            left: {{ $layoutSettings['namePosition']['x'] ?? 50 }}%;
            top: {{ $layoutSettings['namePosition']['y'] ?? 40 }}%;
            transform: translate(-50%, -50%);
        }
        
        .certificate-body {
            position: absolute;
            width: 80%;
            text-align: {{ $layoutSettings['bodyTextAlign'] ?? 'center' }};
            font-size: {{ $layoutSettings['bodyFontSize'] ?? 18 }}px;
            color: {{ $layoutSettings['bodyColor'] ?? '#444444' }};
            left: {{ $layoutSettings['bodyPosition']['x'] ?? 50 }}%;
            top: {{ $layoutSettings['bodyPosition']['y'] ?? 50 }}%;
            transform: translate(-50%, -50%);
        }
        
        .signature-image {
            position: absolute;
            width: {{ $layoutSettings['signatureWidth'] ?? 150 }}px;
            left: {{ $layoutSettings['signaturePosition']['x'] ?? 80 }}%;
            top: {{ $layoutSettings['signaturePosition']['y'] ?? 85 }}%;
            transform: translate(-50%, -50%);
        }
        
        .team-info {
            position: absolute;
            width: 80%;
            left: 50%;
            top: {{ $layoutSettings['teamInfoPosition']['y'] ?? 65 }}%;
            transform: translateX(-50%);
            text-align: center;
            font-size: 18px;
            color: #333;
        }
        
        .certificate-footer {
            position: absolute;
            bottom: 30px;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <!-- Background Image using Data URI -->
        <img class="background-image" src="{{ $backgroundImageData }}" alt="">
        
        <!-- Certificate Title -->
        <div class="certificate-title">{{ $template->title }}</div>
        
        <!-- Student Name -->
        <div class="student-name">{{ $studentName }}</div>
        
        <!-- Team Information (if available) -->
        @if(isset($teamInfo))
        <div class="team-info">
            Team: {{ $teamInfo['team_name'] }}
        </div>
        @endif
        
        <!-- Body Text -->
        <div class="certificate-body">{{ $template->body_text }}</div>
        
        <!-- Signature Image (if available) -->
        @if($signatureImageData)
            <img class="signature-image" src="{{ $signatureImageData }}" alt="">
        @endif
        
        <!-- Certificate Footer -->
        <div class="certificate-footer">
            Certificate Number: {{ $certificateNumber }}<br>
            Issued Date: {{ $issueDate }}
        </div>
    </div>
</body>
</html> 