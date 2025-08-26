import React, { useEffect } from 'react';

export default function LottieAnimation({ src, loop = true, autoplay = true, className = '', style }) {
    useEffect(() => {
        if (typeof window !== 'undefined' && (!window.customElements || !customElements.get('lottie-player'))) {
            const existing = document.querySelector('script[data-lottie-player]');
            if (!existing) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
                script.defer = true;
                script.setAttribute('data-lottie-player', 'true');
                document.head.appendChild(script);
            }
        }
    }, []);

    return (
        <lottie-player
            src={src}
            background="transparent"
            speed="1"
            className={className}
            style={style}
            {...(loop ? { loop: '' } : {})}
            {...(autoplay ? { autoplay: '' } : {})}
        />
    );
}


