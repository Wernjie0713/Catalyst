import React from 'react';

export default function ScrollingRainbow({
    // visual container width (area the string can wave in)
    width = 48,
    thickness = undefined, // backward compat; if provided, overrides width
    lineWidth = 2.5,
    side = 'right', // 'left' | 'right'
    offset = 10, // distance from side
    amp = 18, // wave amplitude (px)
    freq = 0.015, // wave frequency
    glow = true,
}) {
    const containerWidth = typeof thickness === 'number' ? thickness : width;
    const canvasRef = React.useRef(null);
    const gsapRef = React.useRef(null);

    React.useEffect(() => {
        let isMounted = true;
        let stInstance = null;

        const setupCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return { ctx: null, w: 0, h: 0 };
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const cssW = containerWidth;
            const cssH = window.innerHeight;
            canvas.style.width = cssW + 'px';
            canvas.style.height = cssH + 'px';
            canvas.width = Math.max(2, Math.floor(cssW * dpr));
            canvas.height = Math.floor(cssH * dpr);
            const ctx = canvas.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return { ctx, w: cssW, h: cssH };
        };

        const draw = (progress) => {
            const { ctx, w, h } = setupCanvas();
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);

            // String path parameters
            const cx = w / 2; // center x of wave area
            const length = Math.max(0, Math.min(h, h * progress));
            const phase = progress * Math.PI * 2; // slight animation as you scroll

            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#ff0080');
            grad.addColorStop(0.22, '#F37022');
            grad.addColorStop(0.44, '#FFD166');
            grad.addColorStop(0.66, '#06D6A0');
            grad.addColorStop(0.82, '#118AB2');
            grad.addColorStop(1, '#6A51FF');

            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.strokeStyle = grad;
            ctx.shadowBlur = glow ? 6 : 0;
            ctx.shadowColor = 'rgba(243,112,34,0.25)';

            ctx.beginPath();
            const steps = Math.max(60, Math.floor(length / 8));
            for (let i = 0; i <= steps; i++) {
                const y = (i / steps) * length;
                const x = cx + amp * Math.sin(y * freq + phase);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const init = async () => {
            try {
                const mod = await import('gsap');
                const { ScrollTrigger } = await import('gsap/ScrollTrigger');
                if (!isMounted) return;
                const gsap = mod.gsap || mod.default || mod;
                gsap.registerPlugin(ScrollTrigger);
                gsapRef.current = gsap;

                // Initial draw
                draw(0);

                stInstance = ScrollTrigger.create({
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.5,
                    onUpdate: (self) => draw(self.progress),
                });

                window.addEventListener('resize', () => draw(stInstance ? stInstance.progress : 0));
            } catch (e) {
                // gsap not available; still draw static track
                draw(0);
            }
        };

        init();
        return () => {
            isMounted = false;
            try { if (stInstance) stInstance.kill(); } catch (_) {}
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerWidth, lineWidth, amp, freq]);

    // Hide native scrollbar while this rainbow is mounted
    React.useEffect(() => {
        document.body.classList.add('sr-hide-scrollbar');
        document.documentElement.classList.add('sr-hide-scrollbar');
        return () => {
            document.body.classList.remove('sr-hide-scrollbar');
            document.documentElement.classList.remove('sr-hide-scrollbar');
        };
    }, []);

    return (
        <div className="fixed top-0" style={{ [side === 'left' ? 'left' : 'right']: offset, zIndex: 20, pointerEvents: 'none' }}>
            <canvas ref={canvasRef} style={{ borderRadius: containerWidth / 2 }} />
            <style>{`
                /* Hide native page scrollbar but keep scrolling */
                html.sr-hide-scrollbar, body.sr-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                html.sr-hide-scrollbar::-webkit-scrollbar, body.sr-hide-scrollbar::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none; }
            `}</style>
        </div>
    );
}


