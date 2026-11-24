import React, { useEffect, useState } from "react";
import khanaLensLogo from "../assets/images/KhanaLens.png";
import momoImage from "../assets/images/Momo.jpg";
import healthyFoodOne from "../assets/images/HealthyFood-1.jpg";
import healthyFoodTwo from "../assets/images/HealthyFood-2.jpg";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const foodImages = [
  { src: healthyFoodTwo, alt: "Colorful vegetable protein bowl" },
  { src: healthyFoodOne, alt: "Healthy food bowl" },
  { src: momoImage, alt: "Momo bowl" },
];

/* Sample scan results, one per image above. */
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

/* Finds any font file in src/assets/fonts */
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

.splash-viewport {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 100%;
  padding: 0;
  box-sizing: border-box;
  background: transparent !important;
}

/* Card fills the beige app frame with responsive spacing */
.splash-viewport .splash-card {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: clamp(14px, 2.6dvh, 24px) 22px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  color: #1F4D33 !important;
  overflow-x: hidden;
  box-sizing: border-box;
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

.splash-viewport .splash-leaf {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.splash-viewport .splash-leaf-top {
  width: 130px;
  height: 130px;
  right: -40px;
  top: -30px;
  border-radius: 0 100% 0 100%;
  background: rgba(31, 77, 51, 0.07) !important;
  transform: rotate(25deg);
}

.splash-viewport .splash-leaf-side {
  width: 90px;
  height: 90px;
  left: -40px;
  bottom: 25%;
  border-radius: 100% 0 100% 0;
  background: rgba(31, 77, 51, 0.07) !important;
  transform: rotate(-15deg);
}

.splash-viewport .splash-dot-grid {
  position: absolute;
  width: 60px;
  height: 90px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.35;
  background-image: radial-gradient(rgba(31, 77, 51, 0.2) 2px, transparent 2px) !important;
  background-size: 12px 12px;
}

.splash-viewport .splash-dot-grid-left {
  left: 14px;
  top: 40%;
}

.splash-viewport .splash-dot-grid-right {
  right: 14px;
  bottom: 12%;
}

/* Top Back Navigation */
.splash-viewport .getstarted-top-nav {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 2px;
}

.splash-viewport .getstarted-back-btn {
  background: rgba(31, 77, 51, 0.08);
  border: none;
  color: #1F4D33;
  font-size: 12.5px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.splash-viewport .getstarted-back-btn:hover {
  background: rgba(31, 77, 51, 0.16);
  transform: translateX(-2px);
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
  width: 72px;
  height: 72px;
  margin: 0 auto 8px;
  border-radius: 50% !important;
  background: linear-gradient(145deg, #FBF7EE, #E9DCC3) !important;
  box-shadow:
    inset 0 2px 2px rgba(255, 255, 255, 0.9),
    inset 0 -6px 12px rgba(31, 77, 51, 0.08),
    0 0 0 1px rgba(31, 77, 51, 0.15),
    0 12px 24px rgba(31, 77, 51, 0.16) !important;
  padding: 0 !important;
  overflow: visible !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-viewport .splash-logo img {
  width: 86%;
  height: 86%;
  border-radius: 0;
  object-fit: contain;
  transform: none !important;
  display: block;
}

/* Typography */
.splash-viewport .app-title {
  color: #1F4D33 !important;
  font-size: clamp(30px, 8vw, 38px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1.2px;
  margin: 0 0 4px;
  text-align: center;
}

.splash-viewport .app-title span {
  color: #3FA47A !important;
}

.splash-viewport .tagline {
  color: #1F4D33 !important;
  font-size: clamp(16px, 4.6vw, 19px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.4px;
  margin: 0 0 4px;
  text-align: center;
}

.splash-viewport .description {
  color: rgba(31, 77, 51, 0.72) !important;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  text-align: center;
}

/* Food Scanner Viewfinder (NO VIDEO HERE) */
.splash-viewport .splash-media {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transform: none !important;
  margin: 8px 0 0 !important;
}

.splash-viewport .splash-food-image {
  position: relative;
  overflow: hidden;
  width: min(52vw, 205px) !important;
  height: min(52vw, 205px) !important;
  margin: 0 auto 8px !important;
  border: 8px solid rgba(251, 247, 238, 0.95) !important;
  border-radius: 50% !important;
  box-shadow:
    0 18px 36px rgba(31, 77, 51, 0.22),
    0 4px 10px rgba(31, 77, 51, 0.1) !important;
}

.splash-viewport .splash-food-image img.food-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
  transform: scale(1.04);
}

.splash-viewport .splash-food-image img.food-slide.active {
  opacity: 1;
  transform: scale(1);
}

.splash-viewport .scan-dim {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 45%, rgba(6, 42, 23, 0.35) 100%);
  pointer-events: none;
}

.splash-viewport .scan-corners {
  position: absolute;
  inset: 18px;
  pointer-events: none;
}

.splash-viewport .scan-corners span {
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: #8FD7B4;
  border-style: solid;
  border-width: 0;
  filter: drop-shadow(0 0 3px rgba(143, 215, 180, 0.6));
}

.splash-viewport .scan-corners span:nth-child(1) {
  top: 0;
  left: 0;
  border-top-width: 2.5px;
  border-left-width: 2.5px;
  border-top-left-radius: 6px;
}

.splash-viewport .scan-corners span:nth-child(2) {
  top: 0;
  right: 0;
  border-top-width: 2.5px;
  border-right-width: 2.5px;
  border-top-right-radius: 6px;
}

.splash-viewport .scan-corners span:nth-child(3) {
  bottom: 0;
  left: 0;
  border-bottom-width: 2.5px;
  border-left-width: 2.5px;
  border-bottom-left-radius: 6px;
}

.splash-viewport .scan-corners span:nth-child(4) {
  bottom: 0;
  right: 0;
  border-bottom-width: 2.5px;
  border-right-width: 2.5px;
  border-bottom-right-radius: 6px;
}

.splash-viewport .scan-line {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8FD7B4, #FFFFFF, #8FD7B4, transparent);
  box-shadow: 0 0 10px #8FD7B4, 0 0 4px #FFFFFF;
  animation: splash-sweep 2.4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes splash-sweep {
  0%   { top: 18%; opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { top: 82%; opacity: 0; }
}

/* Floating nutrition tags around the circular food image */
.splash-viewport .scan-bubbles {
  position: absolute;
  inset: -12px -20px;
  pointer-events: none;
}

.splash-viewport .scan-bubble {
  position: absolute;
  animation: splash-bubble-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes splash-bubble-in {
  0%   { opacity: 0; transform: scale(0.6) translateY(6px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.splash-viewport .scan-bubble-1 { top: 4%;  left: 0%; }
.splash-viewport .scan-bubble-2 { top: 12%; right: -4%; }
.splash-viewport .scan-bubble-3 { bottom: 22%; left: -6%; }
.splash-viewport .scan-bubble-4 { bottom: 14%; right: -2%; }

.splash-viewport .scan-bubble-inner {
  display: inline-flex;
  flex-direction: column;
  padding: 4px 9px;
  border-radius: 12px;
  background: rgba(251, 247, 238, 0.92);
  border: 1px solid rgba(31, 77, 51, 0.16);
  box-shadow: 0 6px 14px rgba(31, 77, 51, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  line-height: 1.15;
}

.splash-viewport .scan-bubble-label {
  font-size: 9.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: rgba(31, 77, 51, 0.65);
}

.splash-viewport .scan-bubble-value {
  font-size: 11.5px;
  font-weight: 800;
  color: #1F4D33;
}

/* Pagination dots */
.splash-viewport .splash-pagination {
  display: flex;
  gap: 7px;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
}

.splash-viewport .splash-pagination .dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(31, 77, 51, 0.22) !important;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.splash-viewport .splash-pagination .dot.active {
  width: 22px;
  background: #1F4D33 !important;
}

/* Action Buttons */
.splash-viewport .splash-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 320px;
  margin-top: 6px;
}

.splash-viewport .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13.5px 22px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
}

.splash-viewport .splash-primary {
  background: linear-gradient(135deg, #1F4D33 0%, #163D29 100%) !important;
  color: #FFFFFF !important;
  box-shadow:
    0 10px 24px rgba(31, 77, 51, 0.24),
    inset 0 1.5px 0 rgba(255, 255, 255, 0.35) !important;
}

.splash-viewport .splash-secondary {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(251, 247, 238, 0.5) 100%) !important;
  color: #1F4D33 !important;
  border: 1.5px solid rgba(31, 77, 51, 0.4) !important;
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.9),
    0 10px 22px rgba(31, 77, 51, 0.12) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.splash-viewport .btn:hover {
  transform: translateY(-2px);
}

.splash-viewport .splash-register-prompt {
  width: 100%;
  margin: 4px 0 0;
  color: rgba(31, 77, 51, 0.75) !important;
  font-size: 13.5px;
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

export default function SplashPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % foodImages.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentScan = scanResults[activeIndex];

  return (
    <div className="kl-page splash-viewport">
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

        {/* Back Link to Landing Page */}
        <div className="getstarted-top-nav">
          <Link to="/" className="getstarted-back-btn" aria-label="Back to Landing Page">
            <ArrowLeft size={15} />
            <span>Back</span>
          </Link>
        </div>

        {/* Header */}
        <section className="content-header splash-header">
          <div className="logo-badge splash-logo">
            <img src={khanaLensLogo} alt="KhanaLens logo" />
          </div>
          <h1 className="app-title">Khana<span>Lens</span></h1>
          <h2 className="tagline">Scan. Analyze. Eat Smarter.</h2>
          <p className="description">AI-powered nutrition analysis<br />for your everyday meals.</p>
        </section>

        {/* Food Scanner Viewfinder (NO VIDEO ON THIS PAGE) */}
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

        {/* CTA Actions */}
        <div className="button-group splash-actions">
          <Link to="/register" className="btn btn-primary splash-primary">
            Get Started <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-secondary splash-secondary">
            Log In
          </Link>
          <p className="splash-register-prompt">
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
