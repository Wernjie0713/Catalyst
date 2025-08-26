import React from 'react';
export default function OrangeClover({ className = '' }) {

    // Heart-shaped leaf path pointing upward, centered at (0,0)
    // Tip at y = -90, lobes around -30, sized to ~160x180 box
    const heartD = `M 0 -90
        C 40 -120, 100 -95, 100 -35
        C 100 15, 55 55, 0 85
        C -55 55, -100 15, -100 -35
        C -100 -95, -40 -120, 0 -90 Z`;

    const leafOffset = 60; // increase spacing so leaves don't overlap

    return (
        <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
            <defs>
                <radialGradient id="cloverGrad" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#FFD1B0" />
                    <stop offset="55%" stopColor="#F79C4E" />
                    <stop offset="100%" stopColor="#F37022" />
                </radialGradient>
                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#F37022" floodOpacity="0.22" />
                </filter>
            </defs>

            <g transform="translate(150,150)" filter="url(#softShadow)">
                {/* place four heart leaves with larger offset to prevent overlap */}
                <g transform={`translate(0,${-leafOffset})`}>
                    <path d={heartD} fill="url(#cloverGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
                </g>
                <g transform={`rotate(90) translate(0,${-leafOffset})`}>
                    <path d={heartD} fill="url(#cloverGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
                </g>
                <g transform={`rotate(180) translate(0,${-leafOffset})`}>
                    <path d={heartD} fill="url(#cloverGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
                </g>
                <g transform={`rotate(270) translate(0,${-leafOffset})`}>
                    <path d={heartD} fill="url(#cloverGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
                </g>

                {/* small hub and stem */}
                <circle cx="0" cy="20" r="10" fill="#F79C4E" opacity="0.9" />
                <path d="M 8 70 C 40 104, 60 134, 75 164" stroke="#F08A36" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>
        </svg>
    );
}


