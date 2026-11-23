import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { CharacterConfig, CharacterPose, CharacterExpression } from '../types';
import { MoneyBagProp, BalloonProp, ServerProp } from './Props';

export interface CharacterProps extends CharacterConfig {
  className?: string;
  style?: React.CSSProperties;
  audioOffsetInFrames?: number;
}

export const Character: React.FC<CharacterProps> = ({
  pose = 'idle',
  prop,
  expression = 'happy',
  x = 0,
  y = 0,
  scale = 1,
  flipX = false,
  audioSrc,
  audioOffsetInFrames = 0,
  isSpeaking = false,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Audio-driven mouth calculation using useAudioData & visualizeAudio
  let audioData = null;
  try {
    if (audioSrc) {
      // useAudioData is a Remotion hook
      // eslint-disable-next-line react-hooks/rules-of-hooks
      audioData = useAudioData(audioSrc);
    }
  } catch (e) {
    // Graceful fallback if audio is not yet loaded or server-side
    audioData = null;
  }

  let volume = 0;
  if (audioSrc && audioData) {
    try {
      // Sample audio at current scene frame offset into the continuous track
      const sampleFrame = Math.max(0, frame + audioOffsetInFrames);
      const samples = visualizeAudio({
        fps,
        frame: sampleFrame,
        audioData,
        numberOfSamples: 16,
      });
      const avg = samples.reduce((acc, v) => acc + v, 0) / (samples.length || 1);
      // Amplify speech envelope so mouth articulates clearly
      volume = Math.min(1, avg * 2.8);
    } catch (err) {
      volume = 0;
    }
  } else if (isSpeaking) {
    // Procedural phonetic oscillation fallback
    const wave1 = (Math.sin(frame * 0.8) + 1) / 2;
    const wave2 = (Math.cos(frame * 0.35) + 1) / 2;
    volume = wave1 * 0.6 + wave2 * 0.3;
  }

  // 2. Idle breathing & subtle head movement
  const breathe = Math.sin(frame * 0.08) * 1.8;
  const headBob = Math.sin(frame * 0.08 - 0.4) * 1.2;
  const headTilt = Math.sin(frame * 0.04) * 1.5;

  // 3. Eyeball blink (blinks every ~75 frames for 3 frames)
  const isBlinking = frame % 75 >= 0 && frame % 75 <= 3;

  // 4. Render Mouth based on volume
  const renderMouth = () => {
    const isMouthOpen = volume > 0.08;

    if (!isMouthOpen) {
      // Closed resting smile or neutral line
      if (expression === 'surprised') {
        return <circle cx="100" cy="74" r="3.5" fill="#1A1A1A" />;
      }
      return (
        <path
          d="M 91 74 C 95 78, 105 78, 109 74"
          stroke="#1A1A1A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      );
    }

    // Dynamic Talking Mouth: height and width scale with volume
    const mouthHeight = interpolate(volume, [0.08, 0.75], [5, 17], {
      extrapolateRight: 'clamp',
    });
    const mouthWidth = interpolate(volume, [0.08, 0.75], [16, 24], {
      extrapolateRight: 'clamp',
    });

    const halfW = mouthWidth / 2;
    const topY = 73;
    const bottomY = topY + mouthHeight;

    return (
      <g>
        {/* Mouth Cavity */}
        <path
          d={`M ${100 - halfW} ${topY} Q 100 ${topY - 1} ${100 + halfW} ${topY} Q 100 ${bottomY + 2} ${100 - halfW} ${topY} Z`}
          fill="#881337"
          stroke="#1A1A1A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Upper White Tooth Bar */}
        <path
          d={`M ${100 - halfW + 3} ${topY + 1} Q 100 ${topY} ${100 + halfW - 3} ${topY + 1} L ${100 + halfW - 4} ${topY + 4} L ${100 - halfW + 4} ${topY + 4} Z`}
          fill="#FFFFFF"
        />
        {/* Lower Pink Tongue (visible when open wide) */}
        {mouthHeight > 9 && (
          <path
            d={`M ${100 - 6} ${bottomY - 1} Q 100 ${bottomY - 6} ${100 + 6} ${bottomY - 1} Q 100 ${bottomY + 1} ${100 - 6} ${bottomY - 1} Z`}
            fill="#FB7185"
          />
        )}
      </g>
    );
  };

  // 5. Eyebrows based on expression
  const renderEyebrows = () => {
    switch (expression) {
      case 'excited':
        return (
          <>
            <path d="M 85 43 Q 91 38 97 44" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 103 44 Q 109 38 115 43" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'surprised':
        return (
          <>
            <path d="M 85 41 Q 91 35 97 41" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 103 41 Q 109 35 115 41" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'happy':
      default:
        return (
          <>
            <path d="M 86 46 Q 91 42 96 46" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 104 46 Q 109 42 114 46" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  // 6. Arms & Hands based on pose
  const renderArms = () => {
    switch (pose) {
      case 'holding':
        return (
          <>
            {/* Left Arm: resting relaxed */}
            <path
              d="M 76 104 C 62 125, 62 145, 68 160"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Hand: simple thumb/palm */}
            <circle cx="69" cy="162" r="4.5" fill="#1A1A1A" />

            {/* Right Arm: bent forward carrying the held prop */}
            <path
              d="M 124 104 C 142 120, 154 122, 162 110"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Hand clasping */}
            <circle cx="163" cy="109" r="5" fill="#1A1A1A" />
          </>
        );

      case 'pointing_right':
        return (
          <>
            {/* Left Arm: hand on hip */}
            <path
              d="M 76 104 L 56 122 L 72 135"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right Arm: outstretched pointing finger */}
            <path
              d="M 124 104 L 158 96 L 195 90"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Pointing Hand finger */}
            <line x1="195" y1="90" x2="208" y2="87" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="195" cy="90" r="5" fill="#1A1A1A" />
          </>
        );

      case 'pointing_left':
        return (
          <>
            {/* Left Arm: outstretched pointing finger */}
            <path
              d="M 76 104 L 42 96 L 5 90"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <line x1="5" y1="90" x2="-8" y2="87" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="5" cy="90" r="5" fill="#1A1A1A" />

            {/* Right Arm: hand on hip */}
            <path
              d="M 124 104 L 144 122 L 128 135"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'explaining':
        return (
          <>
            {/* Left Arm gesturing out */}
            <path
              d="M 76 104 C 54 116, 44 130, 48 145"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="48" cy="146" r="5" fill="#1A1A1A" />

            {/* Right Arm gesturing out */}
            <path
              d="M 124 104 C 146 116, 156 130, 152 145"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="152" cy="146" r="5" fill="#1A1A1A" />
          </>
        );

      case 'excited':
        return (
          <>
            {/* Both arms raised up high in celebration */}
            <path
              d="M 76 104 L 52 75 L 42 45"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="41" cy="44" r="5.5" fill="#1A1A1A" />

            <path
              d="M 124 104 L 148 75 L 158 45"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="159" cy="44" r="5.5" fill="#1A1A1A" />
          </>
        );

      case 'shrug':
        return (
          <>
            <path
              d="M 76 98 L 50 115 L 45 95"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="44" cy="94" r="5" fill="#1A1A1A" />

            <path
              d="M 124 98 L 150 115 L 155 95"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="156" cy="94" r="5" fill="#1A1A1A" />
          </>
        );

      case 'idle':
      default:
        return (
          <>
            {/* Natural relaxed arms at sides */}
            <path
              d="M 76 104 C 64 125, 66 148, 70 162"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="71" cy="164" r="4.5" fill="#1A1A1A" />

            <path
              d="M 124 104 C 136 125, 134 148, 130 162"
              stroke="#1A1A1A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="129" cy="164" r="4.5" fill="#1A1A1A" />
          </>
        );
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) ${flipX ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'center center',
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-20 -10 240 270"
        width="240"
        height="270"
        fill="none"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0px 12px 24px rgba(0,0,0,0.12))',
        }}
      >
        {/* ================= STICK LEGS & SHOES ================= */}
        <g id="legs">
          {/* Left Stick Leg */}
          <line x1="88" y1="168" x2="84" y2="218" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" />
          {/* Left Shoe */}
          <path
            d="M 84 218 C 76 218, 68 221, 66 226 C 66 229, 88 229, 92 229 Z"
            fill="#1E293B"
            stroke="#1A1A1A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Right Stick Leg */}
          <line x1="112" y1="168" x2="116" y2="218" stroke="#1A1A1A" strokeWidth="5.5" strokeLinecap="round" />
          {/* Right Shoe */}
          <path
            d="M 116 218 C 124 218, 132 221, 134 226 C 134 229, 112 229, 108 229 Z"
            fill="#1E293B"
            stroke="#1A1A1A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>

        {/* ================= BEAN-SHAPED BODY ================= */}
        <g id="body" transform={`translate(0, ${breathe})`}>
          {/* Iconic Bean Torso with thick dark outline */}
          <path
            d="M 83 92
               C 65 110, 58 142, 72 165
               C 84 182, 116 182, 128 165
               C 142 142, 135 110, 117 92
               Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />

          {/* Paper Billions Red Tie Accent */}
          <g transform="translate(100, 92)">
            <polygon points="-4,2 4,2 6,36 0,44 -6,36" fill="#DC2626" stroke="#1A1A1A" strokeWidth="2.5" />
            <polygon points="-5,0 5,0 4,6 -4,6" fill="#B91C1C" stroke="#1A1A1A" strokeWidth="2" />
          </g>
        </g>

        {/* ================= STICK ARMS ================= */}
        <g id="arms" transform={`translate(0, ${breathe * 0.8})`}>
          {renderArms()}
        </g>

        {/* ================= CIRCULAR HEAD & FACE ================= */}
        <g
          id="head"
          transform={`translate(100, 58) rotate(${headTilt}) translate(-100, -58) translate(0, ${headBob})`}
        >
          {/* Circular Head with thick dark outline */}
          <circle
            cx="100"
            cy="58"
            r="32"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="5.5"
          />

          {/* Expressive Eyebrows */}
          {renderEyebrows()}

          {/* Cute Eyes (with intermittent blinking) */}
          {isBlinking ? (
            <>
              <path d="M 86 54 Q 90 58 94 54" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 106 54 Q 110 58 114 54" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <ellipse cx="90" cy="54" rx="3.5" ry="5.5" fill="#1A1A1A" />
              <circle cx="89" cy="52" r="1.2" fill="#FFFFFF" />
              <ellipse cx="110" cy="54" rx="3.5" ry="5.5" fill="#1A1A1A" />
              <circle cx="109" cy="52" r="1.2" fill="#FFFFFF" />
            </>
          )}

          {/* Automatic Mouth Movement Synced to Audio Volume */}
          {renderMouth()}
        </g>

        {/* ================= OPTIONAL HELD PROP ================= */}
        {prop === 'money_bag' && pose === 'holding' && (
          <g transform="translate(145, 105) scale(0.68) rotate(-12)">
            <MoneyBagProp />
          </g>
        )}
        {prop === 'balloon' && pose === 'holding' && (
          <g transform="translate(130, -20) scale(0.7) rotate(8)">
            <BalloonProp />
          </g>
        )}
        {prop === 'server' && (
          <g transform="translate(135, 80) scale(0.65)">
            <ServerProp />
          </g>
        )}
      </svg>
    </div>
  );
};
