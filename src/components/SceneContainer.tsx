import React from 'react';

export interface SceneContainerProps {
  headline?: string;
  subtext?: string;
  theme?: 'paper' | 'dark' | 'blueprint';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  headline,
  subtext,
  theme = 'paper',
  children,
  className,
  style,
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0F172A' : '#F8FAFC';
  const gridColor = isDark
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(30, 41, 59, 0.04)';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style,
      }}
    >
      {/* Tactical Background Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${gridColor} 2px, transparent 2px), linear-gradient(90deg, ${gridColor} 2px, transparent 2px)`,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Scene Header */}
      {(headline || subtext) && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 80,
            right: 80,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {headline && (
            <h2
              style={{
                fontSize: '44px',
                fontWeight: 900,
                color: textColor,
                letterSpacing: '-1px',
                margin: 0,
                textTransform: 'uppercase',
                display: 'inline-block',
              }}
            >
              {headline}
            </h2>
          )}
          {subtext && (
            <p
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: subtextColor,
                margin: 0,
              }}
            >
              {subtext}
            </p>
          )}
        </div>
      )}

      {/* Main Scene Content */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};
