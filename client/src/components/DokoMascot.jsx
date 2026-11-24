import React, { useEffect, useState, useRef } from 'react';
import dokoImage from '../assets/images/mascot-doko.png';

/**
 * DokoMascot — The Official Khana Lens Mascot (Doko / डोको)
 *
 * The beloved 3D Nepali character wearing the traditional Dhaka Topi
 * handcrafting a bamboo Doko basket.
 *
 * Features:
 * - Plays high-definition animated video of Doko weaving & breathing
 * - Natural 3D blinking eyes & bamboo weaving physics
 * - Interactive tap/click response with joyful jump physics
 * - Speech bubbles with encouraging Nepali nutrition tips
 * - Celebratory floating sparkles & rice particles
 */
export default function DokoMascot({
  size = 220,
  interactive = true,
  autoJump = false,
  message = null,
  showShadow = true,
  useVideo = true,
  rounded = true,
  className = '',
  style = {},
  onPress = null,
}) {
  const [isJumping, setIsJumping] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [speechText, setSpeechText] = useState(message);
  const videoRef = useRef(null);
  const jumpTimeoutRef = useRef(null);

  // Occasional idle jump if enabled
  useEffect(() => {
    if (!autoJump) return;
    const interval = setInterval(() => {
      triggerJump();
    }, 7000);
    return () => clearInterval(interval);
  }, [autoJump]);

  useEffect(() => {
    if (message !== undefined) {
      setSpeechText(message);
    }
  }, [message]);

  const triggerJump = () => {
    if (isJumping) return;
    setIsJumping(true);

    const newSparkles = [
      { id: Date.now() + 1, x: 20, y: 30, emoji: '✨' },
      { id: Date.now() + 2, x: 80, y: 25, emoji: '⭐' },
      { id: Date.now() + 3, x: 50, y: 15, emoji: '🌾' },
      { id: Date.now() + 4, x: 15, y: 65, emoji: '✨' },
      { id: Date.now() + 5, x: 85, y: 65, emoji: '🍃' },
    ];
    setSparkles(newSparkles);

    const phrases = [
      'Namaste! 🌾',
      'Khana scan garihalnu hos! 📸',
      'Healthy khana, healthy life! 🥗',
      'Doko is crafting your health! 🚀',
      'Eat smart today! 🍛',
    ];
    if (!message) {
      setSpeechText(phrases[Math.floor(Math.random() * phrases.length)]);
    }

    jumpTimeoutRef.current = setTimeout(() => {
      setIsJumping(false);
      setTimeout(() => setSparkles([]), 400);
      if (!message) {
        setTimeout(() => setSpeechText(null), 3200);
      }
    }, 650);

    if (onPress) onPress();
  };

  const calculatedHeight = size;
  const calculatedWidth = (size * 1024) / 576;

  return (
    <div
      className={`doko-mascot-container ${isJumping ? 'is-jumping' : ''} ${className}`}
      style={{
        width: calculatedWidth,
        maxWidth: '100%',
        height: calculatedHeight,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onClick={interactive ? triggerJump : undefined}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : undefined}
      aria-label="KhanaLens Mascot Doko"
    >
      <style>{`
        .doko-mascot-container {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .doko-mascot-container:hover {
          transform: scale(1.02);
        }
        .doko-mascot-container:active {
          transform: scale(0.97);
        }

        /* Doko Jump Animation (Cartoon Squash & Stretch) */
        @keyframes doko-cartoon-jump {
          0% {
            transform: translateY(0) scale(1, 1);
          }
          15% {
            transform: translateY(6px) scale(1.08, 0.92);
          }
          45% {
            transform: translateY(-28px) scale(0.95, 1.08);
          }
          65% {
            transform: translateY(-30px) scale(1.01, 0.99);
          }
          85% {
            transform: translateY(3px) scale(1.05, 0.95);
          }
          100% {
            transform: translateY(0) scale(1, 1);
          }
        }

        .doko-mascot-container.is-jumping .doko-body-wrapper {
          animation: doko-cartoon-jump 0.65s cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
        }

        /* Floor Shadow */
        .doko-floor-shadow {
          position: absolute;
          bottom: 2%;
          left: 50%;
          transform: translateX(-50%);
          width: 65%;
          height: 12%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(31, 77, 51, 0.25) 0%, rgba(31, 77, 51, 0.05) 55%, transparent 75%);
          transition: transform 0.65s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.65s ease;
          pointer-events: none;
          z-index: 1;
        }

        .doko-mascot-container.is-jumping .doko-floor-shadow {
          transform: translateX(-50%) scale(0.72);
          opacity: 0.35;
        }

        /* Video / Mascot Media */
        .doko-media-frame {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          position: relative;
          z-index: 2;
          pointer-events: none;
          border-radius: ${rounded ? '20px' : '0'};
          filter: drop-shadow(0 8px 18px rgba(31, 77, 51, 0.1));
        }

        /* Speech Bubble */
        .doko-speech-bubble {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid #1F4D33;
          color: #1F4D33;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 6px 18px rgba(31, 77, 51, 0.15);
          z-index: 10;
          animation: pop-bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }
        .doko-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: #FFFFFF;
          border-right: 1.5px solid #1F4D33;
          border-bottom: 1.5px solid #1F4D33;
        }

        @keyframes pop-bounce {
          0% { transform: translateX(-50%) scale(0.6); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        /* Burst Sparkle Particles */
        .doko-sparkle-item {
          position: absolute;
          font-size: 18px;
          pointer-events: none;
          z-index: 9;
          animation: sparkle-burst 0.6s ease-out forwards;
        }

        @keyframes sparkle-burst {
          0% { opacity: 0; transform: scale(0.3) translateY(0); }
          50% { opacity: 1; transform: scale(1.2) translateY(-12px); }
          100% { opacity: 0; transform: scale(0.8) translateY(-24px); }
        }
      `}</style>

      {/* Dynamic floor shadow */}
      {showShadow && <div className="doko-floor-shadow" />}

      {/* Doko body wrapper */}
      <div
        className="doko-body-wrapper"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {useVideo ? (
          <video
            ref={videoRef}
            className="doko-media-frame"
            autoPlay
            loop
            muted
            playsInline
            poster="/doko-poster.jpg"
            aria-label="New Doko Mascot Animated Video"
          >
            <source src="/Bird_weaving_bamboo_basket_513ca55f_t0-8_1080p.mp4" type="video/mp4" />
            <source src="/doko-animated.mp4" type="video/mp4" />
            <source src="/doko-animated.webm" type="video/webm" />
            <img
              src={dokoImage}
              alt="Doko — KhanaLens Mascot"
              className="doko-media-frame"
            />
          </video>
        ) : (
          <img
            src={dokoImage}
            alt="Doko — KhanaLens Mascot"
            className="doko-media-frame"
            loading="eager"
            decoding="async"
          />
        )}

        {/* Pop Speech Bubble */}
        {speechText && (
          <div className="doko-speech-bubble">
            {speechText}
          </div>
        )}

        {/* Burst Sparkles when pressed/jumping */}
        {sparkles.map((sp) => (
          <span
            key={sp.id}
            className="doko-sparkle-item"
            style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
          >
            {sp.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
