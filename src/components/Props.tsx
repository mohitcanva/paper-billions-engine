import React from 'react';
import { useCurrentFrame } from 'remotion';
import { PropType } from '../types';

export interface BasePropComponentProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

export const MoneyBagProp: React.FC<BasePropComponentProps> = ({
  className,
  style,
  width = 180,
  height = 216,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      width={width}
      height={height}
      fill="none"
      className={className}
      style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))', ...style }}
    >
      {/* Tied Top Frill / Neck Flaps */}
      <path
        d="M 75 75 C 65 45, 55 40, 60 25 C 75 35, 90 45, 100 50 C 110 45, 125 35, 140 25 C 145 40, 135 45, 125 75 Z"
        fill="#EAB308"
        stroke="#1E293B"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Rope Tie */}
      <path
        d="M 68 76 C 88 84, 112 84, 132 76"
        stroke="#78350F"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="100" cy="80" r="7" fill="#92400E" stroke="#1E293B" strokeWidth="3" />
      {/* Dangling Rope Ends */}
      <path d="M 97 84 C 95 95, 90 102, 92 110" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
      <path d="M 103 84 C 108 95, 114 100, 112 112" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />

      {/* Main Plump Sack Body */}
      <path
        d="M 70 80
           C 40 100, 25 145, 30 180
           C 35 210, 60 225, 100 225
           C 140 225, 165 210, 170 180
           C 175 145, 160 100, 130 80
           Z"
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Shadow Fold Arc */}
      <path
        d="M 45 185 C 55 210, 85 218, 100 218 C 120 218, 145 210, 155 185"
        stroke="#CA8A04"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Iconic Dollar Sign Badge */}
      <g transform="translate(100, 155)">
        <circle cx="0" cy="0" r="34" fill="#FEF08A" stroke="#1E293B" strokeWidth="4" />
        <text
          x="0"
          y="16"
          fontFamily="'Impact', 'Arial Black', sans-serif"
          fontSize="48"
          fontWeight="900"
          fill="#16A34A"
          stroke="#1E293B"
          strokeWidth="3"
          textAnchor="middle"
        >
          $
        </text>
      </g>
    </svg>
  );
};

export const BalloonProp: React.FC<BasePropComponentProps> = ({
  className,
  style,
  width = 150,
  height = 216,
}) => {
  const frame = useCurrentFrame();
  // Gentle floating sway
  const sway = Math.sin(frame * 0.08) * 4;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 260"
      width={width}
      height={height}
      fill="none"
      className={className}
      style={{
        transform: `rotate(${sway}deg)`,
        transformOrigin: '90px 250px',
        filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.12))',
        ...style,
      }}
    >
      {/* Wavy Dangling String */}
      <path
        d="M 90 155
           C 82 175, 102 195, 88 215
           C 78 230, 95 245, 86 258"
        stroke="#475569"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Balloon Knot at Bottom */}
      <polygon
        points="84,158 96,158 90,148"
        fill="#DC2626"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx="90" cy="157" rx="6" ry="3" fill="#B91C1C" stroke="#1E293B" strokeWidth="2" />

      {/* Balloon Teardrop Body */}
      <path
        d="M 90 150
           C 45 150, 20 115, 20 75
           C 20 30, 52 10, 90 10
           C 128 10, 160 30, 160 75
           C 160 115, 135 150, 90 150
           Z"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Sleek Vector Highlight Arc */}
      <path
        d="M 45 40
           C 40 55, 42 80, 52 95"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <circle cx="50" cy="30" r="4" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
};

export const ServerProp: React.FC<BasePropComponentProps> = ({
  className,
  style,
  width = 180,
  height = 216,
}) => {
  const frame = useCurrentFrame();
  const blink1 = Math.floor(frame / 6) % 2 === 0;
  const blink2 = Math.floor(frame / 10) % 2 === 0;
  const pulseAlert = (Math.sin(frame * 0.2) + 1) / 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      width={width}
      height={height}
      fill="none"
      className={className}
      style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.2))', ...style }}
    >
      {/* Server Base Stand */}
      <rect x="40" y="215" width="120" height="15" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="6" />

      {/* Server Main Chassis Tower */}
      <rect x="30" y="20" width="140" height="195" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="7" />

      {/* Top Server Unit 1 */}
      <g transform="translate(42, 35)">
        <rect x="0" y="0" width="116" height="48" rx="6" fill="#0F172A" stroke="#475569" strokeWidth="3" />
        <rect x="8" y="10" width="30" height="28" rx="3" fill="#334155" />
        <line x1="12" y1="24" x2="34" y2="24" stroke="#64748B" strokeWidth="2" />
        <rect x="44" y="10" width="30" height="28" rx="3" fill="#334155" />
        <line x1="48" y1="24" x2="70" y2="24" stroke="#64748B" strokeWidth="2" />
        {/* Animated LEDs */}
        <circle cx="88" cy="18" r="4" fill={blink1 ? '#10B981' : '#064E3B'} />
        <circle cx="102" cy="18" r="4" fill={blink2 ? '#3B82F6' : '#1E3A8A'} />
        <circle cx="88" cy="30" r="4" fill={!blink1 ? '#10B981' : '#064E3B'} />
        <circle cx="102" cy="30" r="4" fill={`rgba(239, 68, 68, ${0.4 + 0.6 * pulseAlert})`} />
      </g>

      {/* Middle Server Unit 2 */}
      <g transform="translate(42, 95)">
        <rect x="0" y="0" width="116" height="48" rx="6" fill="#0F172A" stroke="#475569" strokeWidth="3" />
        <line x1="12" y1="16" x2="68" y2="16" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <line x1="12" y1="24" x2="68" y2="24" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <line x1="12" y1="32" x2="68" y2="32" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <circle cx="86" cy="24" r="5" fill={blink2 ? '#38BDF8' : '#0369A1'} />
        <circle cx="100" cy="24" r="5" fill={blink1 ? '#34D399' : '#065F46'} />
      </g>

      {/* Bottom Server Unit 3 */}
      <g transform="translate(42, 155)">
        <rect x="0" y="0" width="116" height="48" rx="6" fill="#0F172A" stroke="#475569" strokeWidth="3" />
        <rect x="8" y="10" width="30" height="28" rx="3" fill="#334155" />
        <rect x="44" y="10" width="30" height="28" rx="3" fill="#334155" />
        <circle cx="88" cy="24" r="6" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="102" cy="24" r="4" fill={blink1 ? '#F59E0B' : '#78350F'} />
      </g>
    </svg>
  );
};

export const PropRenderer: React.FC<{
  name: PropType;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
}> = ({ name, x = 0, y = 0, scale = 1, rotation = 0 }) => {
  let PropComponent = MoneyBagProp;
  if (name === 'balloon') PropComponent = BalloonProp;
  if (name === 'server') PropComponent = ServerProp;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <PropComponent />
    </div>
  );
};
