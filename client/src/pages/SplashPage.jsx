import React, { useEffect, useState } from "react";
import khanaLensLogo from "../assets/images/KhanaLens.png";
import momoImage from "../assets/images/Momo.jpg";
import healthyFoodOne from "../assets/images/HealthyFood-1.jpg";
import healthyFoodTwo from "../assets/images/HealthyFood-2.jpg";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const foodImages = [
  { src: healthyFoodTwo, alt: "Colorful vegetable protein bowl" },
  { src: healthyFoodOne, alt: "Healthy food bowl" },
  { src: momoImage, alt: "Momo bowl" },
];

/* Sample scan results, one per image above. Replace with real API results later. */
const scanResults = [
  {
    name: "Veggie protein bowl",
    items: [
      ["Calories", "420 kcal"],
      ["Protein", "28 g"],
      ["Carbs", "38 g"],
      ["Fat", "16 g"],
    ],
  },
  {
    name: "Healthy bowl",
    items: [
      ["Calories", "380 kcal"],
      ["Protein", "22 g"],
      ["Carbs", "45 g"],
      ["Fat", "11 g"],
    ],
  },
  {
    name: "Momo",
    items: [
      ["Calories", "320 kcal"],
      ["Protein", "14 g"],
      ["Carbs", "36 g"],
      ["Fat", "12 g"],
    ],
  },
];

/* Finds any font file in src/assets/fonts. Does not break the page if the folder is empty. */
const fontFiles = import.meta.glob("../assets/fonts/*.{ttf,otf,woff2}", {
  eager: true,
  query: "?url",
  import: "default",
});
const fontUrl = Object.values(fontFiles)[0];
const fontFormat = fontUrl?.endsWith(".woff2")
  ? "woff2"
  : fontUrl?.endsWith(".otf")
    ? "opentype"
    : "truetype";

const fontFaceRule = fontUrl
  ? `@font-face {
  font-family: 'Google Sans Local';
  src: url('${fontUrl}') format('${fontFormat}');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`
  : "";

/* Grain texture generated as an SVG noise filter */
const grainUrl =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

/* Logo palette: forest green #1F4D33, deep green #163D29, mint #8FD7B4, cream #FBF7EE */
const splashCss = `
${fontFaceRule}

html,
body,
#root {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  background: #FFFFFF !important;
  overflow-x: hidden;
}

/* Google Sans on everything inside the splash page, falling back to Inter */
.splash-viewport,
.splash-viewport * {
  font-family: 'Google Sans Local', 'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

/* Outside of the card: white */
.splash-viewport.app-viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  padding: 16px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 15% 10%, rgba(31, 77, 51, 0.04), transparent 45%),
    radial-gradient(circle at 85% 90%, rgba(63, 164, 122, 0.04), transparent 45%),
    #FFFFFF !important;
}

/* Card: soft cream glass, centered */
.splash-viewport .splash-card {
  position: relative;
  flex: 0 0 auto;
  margin: 0 auto;
  width: min(100%, 390px);
  height: min(860px, calc(100dvh - 32px));
  min-height: 0;
  padding: clamp(36px, 7dvh, 60px) 26px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 34px;
  background:
    linear-gradient(170deg, #FBF8F0 0%, #F7F1E4 60%, #F2EADA 100%) !important;
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(31, 77, 51, 0.1) !important;
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.9),
    0 30px 60px rgba(31, 77, 51, 0.12) !important;
  color: #1F4D33 !important;
  overflow: hidden;
}

/* Background layers: soft weave, light grain, faint aperture */
.splash-viewport .splash-weave {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.3;
  background-image:
    repeating-linear-gradient(45deg, rgba(31, 77, 51, 0.06) 0 1px, transparent 1px 16px),
    repeating-linear-gradient(-45deg, rgba(31, 77, 51, 0.06) 0 1px, transparent 1px 16px);
  -webkit-mask-image: radial-gradient(ellipse at 50% 45%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse at 50% 45%, #000 20%, transparent 75%);
}

.splash-viewport .splash-grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.1;
  mix-blend-mode: multiply;
  background-image: ${grainUrl};
  background-size: 180px 180px;
}

.splash-viewport .splash-lens-bg {
  position: absolute;
  width: 400px;
  height: 400px;
  right: -200px;
  bottom: -130px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.05;
}

.splash-viewport .splash-leaf::before,
.splash-viewport .splash-leaf::after {
  background: rgba(31, 77, 51, 0.07) !important;
}

.splash-viewport .splash-dot-grid {
  background-image: radial-gradient(rgba(31, 77, 51, 0.2) 2.5px, transparent 2.5px) !important;
}

/* Header */
.splash-viewport .splash-header {
  position: relative;
  z-index: 1;
  width: 100%;
  align-items: center;
  text-align: center;
}

/* Logo as a glass bubble */
.splash-viewport .splash-logo {
  width: 92px;
  height: 92px;
  margin: 0 auto 18px;
  border-radius: 50% !important;
  background: linear-gradient(145deg, #FBF7EE, #E9DCC3) !important;
  box-shadow:
    inset 0 2px 2px rgba(255, 255, 255, 0.9),
    inset 0 -6px 12px rgba(31, 77, 51, 0.08),
    0 0 0 1px rgba(31, 77, 51, 0.15),
    0 16px 30px rgba(31, 77, 51, 0.18) !important;
  padding: 0 !important;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-viewport .splash-logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: contain;
  transform: none !important;
  display: block;
}

/* Typography */
.splash-viewport .app-title {
  color: #1F4D33 !important;
  font-size: clamp(40px, 11vw, 50px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1.4px;
  margin: 0 0 12px;
  text-align: center;
}

.splash-viewport .app-title span {
  color: #3FA47A !important;
}

.splash-viewport .tagline {
  color: #1F4D33 !important;
  font-size: clamp(20px, 5.6vw, 24px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin: 0 0 10px;
  text-align: center;
}

.splash-viewport .description {
  color: rgba(31, 77, 51, 0.72) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.55;
  margin: 0;
  text-align: center;
}

/* Food image frame, styled as a camera viewfinder */
.splash-viewport .splash-media {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transform: none !important;
  margin: 28px 0 0 !important;
}

.splash-viewport .splash-food-image {
  position: relative;
  overflow: hidden;
  width: min(56vw, 220px) !important;
  height: min(56vw, 220px) !important;
  margin: 0 auto 12px !important;
  border: 9px solid rgba(251, 247, 238, 0.95) !important;
  background: #123524 !important;
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.6),
    0 18px 40px rgba(31, 77, 51, 0.18),
    0 0 0 20px rgba(31, 77, 51, 0.06),
    0 0 0 21px rgba(31, 77, 51, 0.12) !important;
}

.splash-viewport .food-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.8s ease;
  z-index: 0;
}

.splash-viewport .food-slide.active {
  opacity: 1;
  z-index: 1;
}

/* Dim overlay so the scan reads clearly */
.splash-viewport .scan-dim {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(18, 53, 36, 0.25), rgba(18, 53, 36, 0.05) 50%, rgba(18, 53, 36, 0.3));
}

/* Corner brackets, always visible */
.splash-viewport .scan-corners span {
  position: absolute;
  z-index: 4;
  width: 26px;
  height: 26px;
  border-color: #8FD7B4;
  border-style: solid;
  border-width: 0;
  filter: drop-shadow(0 0 4px rgba(143, 215, 180, 0.8));
}

.splash-viewport .scan-corners span:nth-child(1) { top: 14px; left: 14px; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 8px; }
.splash-viewport .scan-corners span:nth-child(2) { top: 14px; right: 14px; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 8px; }
.splash-viewport .scan-corners span:nth-child(3) { bottom: 14px; left: 14px; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 8px; }
.splash-viewport .scan-corners span:nth-child(4) { bottom: 14px; right: 14px; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 8px; }

/* Laser scan line sweeping top to bottom */
.splash-viewport .scan-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 3px;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, #8FD7B4 20%, #ffffff 50%, #8FD7B4 80%, transparent);
  box-shadow: 0 0 12px rgba(143, 215, 180, 0.95), 0 0 30px rgba(63, 164, 122, 0.6);
  animation: scan-sweep 2.4s ease-in-out infinite;
}

.splash-viewport .scan-line::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -46px;
  height: 46px;
  background: linear-gradient(180deg, rgba(143, 215, 180, 0), rgba(143, 215, 180, 0.22));
}

@keyframes scan-sweep {
  0% { top: 14px; opacity: 0; }
  8% { opacity: 1; }
  92% { opacity: 1; }
  100% { top: calc(100% - 14px); opacity: 0; }
}

/* Small bubbles popping out from all sides of the scanning image */
.splash-viewport .scan-bubbles {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.splash-viewport .scan-bubble {
  position: absolute;
  animation: bubble-pop 0.6s cubic-bezier(0.2, 0.8, 0.25, 1) both;
}

/* Each bubble comes from its own side: --fx / --fy set the starting offset */
.splash-viewport .scan-bubble-1 { left: -4px; top: 34px; --fx: -36px; --fy: 0px; }
.splash-viewport .scan-bubble-2 { right: -4px; top: 66px; --fx: 36px; --fy: 0px; }
.splash-viewport .scan-bubble-3 { left: 44px; top: -8px; --fx: 0px; --fy: -28px; }
.splash-viewport .scan-bubble-4 { right: 16px; top: 180px; --fx: 0px; --fy: 28px; }

.splash-viewport .scan-bubble-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 11px;
  border-radius: 999px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.98) 0%, rgba(232, 247, 240, 0.92) 100%);
  border: 1px solid rgba(63, 164, 122, 0.4);
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    0 8px 16px rgba(31, 77, 51, 0.16);
  white-space: nowrap;
  animation: bubble-float 3.2s ease-in-out infinite;
}

.splash-viewport .scan-bubble-label {
  color: #3FA47A;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  line-height: 1.2;
}

.splash-viewport .scan-bubble-value {
  color: #1E9E6A;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
}

@keyframes bubble-pop {
  from { opacity: 0; transform: translate(var(--fx, 0px), var(--fy, 0px)) scale(0.4); }
  to { opacity: 1; transform: none; }
}

@keyframes bubble-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .splash-viewport .scan-line {
    animation: none !important;
    display: none !important;
  }
  .splash-viewport .scan-bubble,
  .splash-viewport .scan-bubble-inner {
    animation: none !important;
  }
}

@media (max-height: 760px) {
  .splash-viewport .splash-food-image {
    width: 180px !important;
    height: 180px !important;
    margin-bottom: 8px !important;
  }
  .splash-viewport .scan-bubble-3 { top: -8px; }
  .splash-viewport .scan-bubble-4 { top: 150px; }
}

@media (max-width: 380px) {
  .splash-viewport .scan-bubble-inner {
    padding: 5px 9px;
  }
  .splash-viewport .scan-bubble-value {
    font-size: 11px;
  }
}

.splash-viewport .splash-pagination .dot {
  background-color: rgba(31, 77, 51, 0.25) !important;
}

.splash-viewport .splash-pagination .dot.active {
  background-color: #1F4D33 !important;
  box-shadow: 0 0 10px rgba(31, 77, 51, 0.35);
}

/* Buttons: full card width, aligned to each other */
.splash-viewport .splash-actions {
  position: relative !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  z-index: 1;
  width: 100% !important;
  margin: auto 0 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.splash-viewport .splash-card .btn {
  width: 100%;
  min-height: 58px;
  border-radius: 18px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
}

/* Primary: logo green liquid glass */
.splash-viewport .splash-primary {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(62, 116, 88, 0.96) 0%, rgba(31, 77, 51, 0.96) 100%) !important;
  color: #FBF7EE !important;
  border: 1px solid rgba(31, 77, 51, 0.6) !important;
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.4),
    inset 0 -2px 6px rgba(0, 0, 0, 0.2),
    0 14px 28px rgba(31, 77, 51, 0.28) !important;
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
}

.splash-viewport .splash-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0));
  border-radius: inherit;
  pointer-events: none;
}

/* Secondary: translucent glass with logo green text */
.splash-viewport .splash-secondary {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(251, 247, 238, 0.5) 100%) !important;
  color: #1F4D33 !important;
  border: 1.5px solid rgba(31, 77, 51, 0.4) !important;
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.9),
    0 10px 22px rgba(31, 77, 51, 0.12) !important;
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}

.splash-viewport .splash-primary:hover,
.splash-viewport .splash-secondary:hover {
  transform: translateY(-2px);
}

.splash-viewport .splash-register-prompt {
  width: 100%;
  margin: 6px 0 0;
  color: rgba(31, 77, 51, 0.75) !important;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.splash-viewport .splash-register-prompt a {
  color: #1F4D33 !important;
  font-weight: 700;
}

@media (min-width: 480px) {
  .splash-viewport .splash-card {
    border-radius: 34px !important;
  }
}
`;

function SplashPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % foodImages.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentScan = scanResults[activeIndex];

  return (
    <div className="app-viewport splash-viewport">
      <style>{splashCss}</style>
      <main className="mobile-card splash-card">
        <div className="splash-weave" aria-hidden="true" />
        <div className="splash-grain" aria-hidden="true" />
        <svg className="splash-lens-bg" viewBox="0 0 200 200" aria-hidden="true">
          <g fill="none" stroke="#1F4D33" strokeWidth="1.4">
            <circle cx="100" cy="100" r="96" />
            <circle cx="100" cy="100" r="72" />
            <circle cx="100" cy="100" r="46" />
            <polygon points="144,100 122,138.1 78,138.1 56,100 78,61.9 122,61.9" />
            <line x1="122" y1="61.9" x2="170" y2="30" />
            <line x1="144" y1="100" x2="196" y2="100" />
            <line x1="122" y1="138.1" x2="170" y2="170" />
            <line x1="78" y1="138.1" x2="30" y2="170" />
            <line x1="56" y1="100" x2="4" y2="100" />
            <line x1="78" y1="61.9" x2="30" y2="30" />
          </g>
        </svg>
        <div className="splash-leaf splash-leaf-top" aria-hidden="true" />
        <div className="splash-leaf splash-leaf-side" aria-hidden="true" />
        <div className="splash-dot-grid splash-dot-grid-left" aria-hidden="true" />
        <div className="splash-dot-grid splash-dot-grid-right" aria-hidden="true" />

        <section className="content-header splash-header">
          <div className="logo-badge splash-logo">
            <img src={khanaLensLogo} alt="KhanaLens logo" />
          </div>
          <h1 className="app-title">Khana<span>Lens</span></h1>
          <h2 className="tagline">Scan. Analyze. Eat Smarter.</h2>
          <p className="description">AI-powered nutrition analysis<br />for your everyday meals.</p>
        </section>

        <section className="media-section splash-media">
          <div className="food-image-wrapper splash-food-image">
            {foodImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={`food-slide ${activeIndex === index ? "active" : ""}`}
              />
            ))}
            <div className="scan-dim" />
            <div className="scan-corners">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div key={`scan-${activeIndex}`} className="scan-line" />
          </div>

          <div key={`bubbles-${activeIndex}`} className="scan-bubbles" aria-live="polite">
            {currentScan.items.map(([label, value], index) => (
              <div
                key={label}
                className={`scan-bubble scan-bubble-${index + 1}`}
                style={{ animationDelay: `${0.2 + index * 0.15}s` }}
              >
                <div className="scan-bubble-inner">
                  <span className="scan-bubble-label">{label}</span>
                  <b className="scan-bubble-value">{value}</b>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination splash-pagination">
            {foodImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`dot ${activeIndex === index ? "active" : ""}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <div className="button-group splash-actions">
          <Link to="/login" className="btn btn-primary splash-primary">Get Started <ArrowRight size={22} /></Link>
          <Link to="/login" className="btn btn-secondary splash-secondary">Log In</Link>
          <p className="splash-register-prompt">Don’t have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </main>
    </div>
  );
}

export default SplashPage;