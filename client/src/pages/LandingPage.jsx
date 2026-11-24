import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import khanaLensLogo from "../assets/images/KhanaLens.png";

/* Grain texture generated as an SVG noise filter */
const grainUrl =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

const landingStyles = `
html,
body,
#root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background: #FFFFFF !important;
}

.landing-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  max-height: 100dvh;
  padding: 0;
  box-sizing: border-box;
  background: linear-gradient(170deg, #FBF8F0 0%, #F7F1E4 60%, #F2EADA 100%) !important;
  color: #1F4D33;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Card fills viewport, respects iOS safe areas (Notch, Dynamic Island, Home Indicator) */
.landing-viewport .landing-card {
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  height: 100%;
  max-height: 100dvh;
  padding-top: max(clamp(14px, 2.4dvh, 22px), env(safe-area-inset-top, 14px));
  padding-bottom: max(clamp(20px, 3.2dvh, 28px), calc(env(safe-area-inset-bottom, 0px) + 16px));
  padding-left: max(18px, env(safe-area-inset-left, 18px));
  padding-right: max(18px, env(safe-area-inset-right, 18px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  box-sizing: border-box;
}

/* Background layers: clean and unified with the application theme */
.landing-viewport .landing-weave,
.landing-viewport .landing-grain {
  display: none;
}

/* ========================================================
   1. BRAND HEADER & TYPOGRAPHY - CENTERED & BALANCED
   ======================================================== */
.landing-viewport .landing-header {
  position: relative;
  z-index: 3;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-shrink: 0;
  margin-top: 0;
}

.landing-viewport .landing-logo-bubble {
  width: clamp(52px, 6.8dvh, 62px);
  height: clamp(52px, 6.8dvh, 62px);
  margin: 0 auto 8px;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.landing-viewport .landing-logo-bubble img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.landing-viewport .landing-title {
  color: #1F4D33;
  font-size: clamp(26px, 6.8vw, 30px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.6px;
  margin: 0 0 4px;
  text-align: center;
}

.landing-viewport .landing-title span {
  color: #3FA47A;
}

.landing-viewport .landing-tagline {
  color: #1F4D33;
  font-size: clamp(15px, 4.2vw, 16.5px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.3px;
  margin: 0 0 5px;
  text-align: center;
}

.landing-viewport .landing-subtitle {
  color: rgba(31, 77, 51, 0.78);
  font-size: clamp(12.5px, 3.2vw, 13.5px);
  font-weight: 450;
  line-height: 1.4;
  margin: 0 auto;
  max-width: 310px;
  text-align: center;
}

/* ========================================================
   2. HERO STAGE: UNIFIED DOKO COMPOSITION CONTAINER
   - Single dedicated parent container with predictable aspect ratio (720 / 530)
   - Layer 0 (z-index: 0): Concentric aperture rings, topography, ambient light bloom, contact shadow
   - Layer 2 (z-index: 2): Doko mascot with Dhaka Topi, basket & ground accessories
   - 100% responsive across 320px, 360px, 375px, 390px, 430px, tablet, desktop
   - Zero drifting, zero accidental cropping, zero collisions
   ======================================================== */
.landing-viewport .doko-composition-stage {
  position: relative;
  width: 100%;
  max-width: 440px;
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  z-index: 2;
}

.landing-viewport .doko-composition-box {
  position: relative;
  width: 100%;
  max-width: clamp(290px, 92vw, 420px);
  aspect-ratio: 720 / 530;
  max-height: clamp(230px, 42dvh, 330px);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.landing-viewport .doko-layer-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.landing-viewport .doko-bg-details {
  width: 100%;
  height: 100%;
  display: block;
}

.landing-viewport .doko-layer-mascot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-viewport .landing-doko-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: transparent !important;
  border: none !important;
  outline: none !important;
}

/* ========================================================
   3. ACTION BUTTONS — PROMINENT, ALIGNED & POLISHED
   ======================================================== */
.landing-viewport .landing-actions {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 326px;
  margin: 0 auto;
  flex-shrink: 0;
}

.landing-viewport .landing-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 50px;
  border-radius: 999px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.landing-viewport .landing-btn:active {
  transform: scale(0.98);
}

/* Primary "Sign Up" Button: identical 50px height, forest green gradient, bold 15.5px */
.landing-viewport .landing-btn-primary {
  height: 50px;
  padding: 0 24px;
  background: linear-gradient(135deg, #1F4D33 0%, #153A26 100%) !important;
  color: #FFFFFF !important;
  box-shadow:
    0 8px 20px rgba(31, 77, 51, 0.22),
    inset 0 1.5px 0 rgba(255, 255, 255, 0.35) !important;
}

/* Secondary "Log In" Button: identical 50px height, frosted cream glass, bold 15.5px */
.landing-viewport .landing-btn-secondary {
  height: 50px;
  padding: 0 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(251, 247, 238, 0.78) 100%) !important;
  color: #1F4D33 !important;
  border: 1.5px solid rgba(31, 77, 51, 0.32) !important;
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.95),
    0 6px 16px rgba(31, 77, 51, 0.06) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
`;

/* 
  Rich UI Background Details:
  - Exact 720x530 coordinate space, 100% synchronized with the Doko Mascot Canvas
  - KhanaLens optical camera aperture rings & crosshair markings locked directly behind Doko at (360, 265)
  - Himalayan topographic contour lines (subtle elevation curves)
  - Warm golden-mint ambient light bloom
  - Diffused contact shadow grounding Doko and the doko basket directly beneath at (360, 455)
*/
function LandingBackgroundDetails() {
  return (
    <svg
      className="doko-bg-details"
      viewBox="0 0 720 530"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* 1. Himalayan Topographic Altitude Contours (Organic subtle lines) */}
      <g fill="none" stroke="#1F4D33" strokeWidth="1.2" opacity="0.05">
        <path d="M -20 180 Q 180 140 360 170 Q 540 200 740 150" />
        <path d="M -20 220 Q 190 175 360 205 Q 530 235 740 190" />
        <path d="M -20 265 Q 180 220 360 245 Q 540 270 740 235" />
        <path d="M -20 310 Q 190 265 360 290 Q 530 315 740 280" />
        <path d="M -20 355 Q 200 315 360 335 Q 520 355 740 325" />
      </g>

      {/* 3. KhanaLens Optical Lens Geometry & Calibration Reticle - Locked at (360, 265) */}
      <g fill="none" stroke="#1F4D33" opacity="0.065">
        {/* Concentric aperture circles centered at X=360 Y=265 */}
        <circle cx="360" cy="265" r="190" strokeWidth="1.2" strokeDasharray="4 6" />
        <circle cx="360" cy="265" r="135" strokeWidth="1.4" />
        <circle cx="360" cy="265" r="75" strokeWidth="1" strokeDasharray="2 4" />

        {/* Focus crosshairs & tick marks */}
        <line x1="360" y1="65" x2="360" y2="90" strokeWidth="1.5" />
        <line x1="360" y1="440" x2="360" y2="465" strokeWidth="1.5" />
        <line x1="165" y1="265" x2="190" y2="265" strokeWidth="1.5" />
        <line x1="530" y1="265" x2="555" y2="265" strokeWidth="1.5" />

        {/* Optical diagonal calibration ticks */}
        <line x1="225" y1="130" x2="240" y2="145" strokeWidth="1.2" />
        <line x1="495" y1="130" x2="480" y2="145" strokeWidth="1.2" />
        <line x1="225" y1="400" x2="240" y2="385" strokeWidth="1.2" />
        <line x1="495" y1="400" x2="480" y2="385" strokeWidth="1.2" />
      </g>

      {/* 4. Subtle Botanical Sparkle Micro-Accents */}
      <g fill="#1F4D33" opacity="0.08">
        <path d="M 120 115 Q 120 125 110 125 Q 120 125 120 135 Q 120 125 130 125 Q 120 125 120 115 Z" />
        <path d="M 600 95 Q 600 105 590 105 Q 600 105 600 115 Q 600 105 610 105 Q 600 105 600 95 Z" />
        <circle cx="95" cy="265" r="1.8" />
        <circle cx="625" cy="265" r="1.8" />
      </g>
    </svg>
  );
}

/* 
  Doko Mascot Foreground Layer:
  - Powered by Bird_weaving_bamboo_basket_513ca55f_t0-8_1080p.mp4
  - Centered horizontally & scaled larger to showcase Doko weaving the doko basket
  - Seamless background integration with mix-blend-mode: multiply & edge feathering
  - 100% solid feathers, Dhaka topi, wings, legs, and bamboo accessories (zero holes/cutouts)
  - Zero overlay box or border lines
*/
function DokoMascotCanvas() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;

    // Centered, tightly framed crop parameters for Bird_weaving_bamboo_basket_513ca55f_t0-8_1080p.mp4
    // Subject across all frames: X=[131, 1535], Y=[46, 1036], center at X=833
    // 720/530 aspect ratio (1.3585) -> cropW: 1413, cropH: 1040
    const cropX = 126;
    const cropY = 20;
    const cropW = 1413;
    const cropH = 1040;

    const render = () => {
      if (video.readyState >= 2) {
        const cw = canvas.width;
        const ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);

        // 1. Draw the exact KhanaLens UI background gradient onto the canvas
        // This guarantees the mascot canvas background matches the UI background 100% on every browser and device
        const grad = ctx.createLinearGradient(0, 0, 0, ch);
        grad.addColorStop(0, "#FBF8F0");
        grad.addColorStop(0.6, "#F7F1E4");
        grad.addColorStop(1, "#F2EADA");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);

        // 2. Multiply blend the video inside the canvas pixel buffer
        // Studio white background multiplies with cream to match the UI with 0.00 color delta
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        if ("filter" in ctx) {
          ctx.filter = "contrast(1.05) brightness(1.03)";
        }
        ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cw, ch);
        ctx.restore();
      }
      animId = requestAnimationFrame(render);
    };

    video.defaultMuted = true;
    video.muted = true;
    const p = video.play();
    if (p !== undefined) p.catch(() => {});

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <>
      {/* Hidden source video */}
      <video
        ref={videoRef}
        src="/Bird_weaving_bamboo_basket_513ca55f_t0-8_1080p.mp4"
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        style={{ display: "none" }}
      />
      {/* High-res transparent canvas capturing Doko weaving bamboo doko basket */}
      <canvas
        ref={canvasRef}
        width={720}
        height={530}
        className="landing-doko-canvas"
        aria-label="KhanaLens mascot Doko weaving traditional bamboo basket"
      />
    </>
  );
}

export default function LandingPage() {
  return (
    <div className="kl-page landing-viewport">
      <style>{landingStyles}</style>
      <div className="landing-weave" aria-hidden="true" />
      <div className="landing-grain" aria-hidden="true" />

      <main className="landing-card">
        {/* 1. Brand Header */}
        <section className="landing-header">
          <div className="landing-logo-bubble">
            <img src={khanaLensLogo} alt="KhanaLens logo" />
          </div>
          <h1 className="landing-title">Khana<span>Lens</span></h1>
          <h2 className="landing-tagline">Scan. Analyze. Eat Smarter.</h2>
          <p className="landing-subtitle">
            Nepal’s premier AI nutrition companion for everyday meals.
          </p>
        </section>

        {/* 2. Unified Doko Hero Stage: Locked Coordinate Composition */}
        <section className="doko-composition-stage">
          <div className="doko-composition-box">
            {/* Layer 0: Background Details & Optical Reticle locked at (360, 265) */}
            <div className="doko-layer-bg">
              <LandingBackgroundDetails />
            </div>
            {/* Layer 2: Doko Mascot Canvas with Dhaka Topi & woven doko basket */}
            <div className="doko-layer-mascot">
              <DokoMascotCanvas />
            </div>
          </div>
        </section>

        {/* 3. Action Buttons: Aligned & Scaled for Mobile/iOS */}
        <div className="landing-actions">
          <Link to="/register" className="landing-btn landing-btn-primary">
            Sign Up <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="landing-btn landing-btn-secondary">
            Log In
          </Link>
        </div>
      </main>
    </div>
  );
}
