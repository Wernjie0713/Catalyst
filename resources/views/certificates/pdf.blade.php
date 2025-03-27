<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        .certificate {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            padding: 40px;
        }
        .title {
            font-size: {{ $template->layout_settings['titleFontSize'] ?? '48' }}px;
            color: {{ $template->layout_settings['titleColor'] ?? '#000000' }};
            font-weight: bold;
            margin-bottom: 20px;
        }
        .student-name {
            font-size: {{ $template->layout_settings['nameFontSize'] ?? '32' }}px;
            color: {{ $template->layout_settings['nameColor'] ?? '#333333' }};
            margin-bottom: 20px;
        }
        .body-text {
            font-size: {{ $template->layout_settings['bodyFontSize'] ?? '18' }}px;
            color: {{ $template->layout_settings['bodyColor'] ?? '#444444' }};
            margin-bottom: 30px;
        }
        .certificate-footer {
            position: absolute;
            bottom: 40px;
            width: 100%;
            text-align: center;
        }
        .certificate-number {
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="certificate">
        @if($template->background_image)
            <img src="{{ public_path($template->background_image) }}" 
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;">
        @endif
        
        <div class="title">
            {{ $template->title }}
        </div>
        
        <div class="student-name">
            {{ $studentName }}
        </div>
        
        <div class="body-text">
            {!! $template->body_text !!}
        </div>
        
        @if($template->signature_image)
            <div style="margin-top: 40px;">
                <img src="{{ public_path($template->signature_image) }}" 
                     style="width: {{ $template->layout_settings['signatureWidth'] ?? '150' }}px;">
            </div>
        @endif
        
        <div class="certificate-footer">
            <div class="certificate-number">
                Certificate No: {{ $certificateNumber }}<br>
                Issue Date: {{ $issueDate }}
            </div>
        </div>
    </div>
</body>
</html> 