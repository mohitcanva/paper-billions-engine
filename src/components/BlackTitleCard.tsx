import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BlackTitleCardProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BlackTitleCard: React.FC<BlackTitleCardProps> = ({
  title,
  subtitle,
  kicker = 'CASE FILE // EPISODE 01',
  accentColor = '#FACC15',
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Subtle cinematic camera drift
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: 'clamp',
  });

  // 2. Kicker Entrance Spring
  const kickerProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const kickerOpacity = interpolate(kickerProgress, [0, 0.4], [0, 1]);
  const kickerY = interpolate(kickerProgress, [0, 1], [-20, 0]);

  // 3. Staggered Word Entrance for Main Title
  const words = title.split(' ');

  // 4. Subtitle Fade & Rise
  const subtitleProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Decorative Line Wipe
  const lineScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        color: '#FFFFFF',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        transform: `scale(${cameraZoom})`,
        ...style,
      }}
    >
      {/* Background Subtle Radial Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Grid Lines Overlay for Tactical Financial Aesthetic */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      {/* Content Container */}
      <div
        style={{
          maxWidth: '1380px',
          padding: '0 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Kicker Tag */}
        {kicker && (
          <div
            style={{
              opacity: kickerOpacity,
              transform: `translateY(${kickerY}px)`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '3px',
              color: accentColor,
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                display: 'inline-block',
                boxShadow: `0 0 10px ${accentColor}`,
              }}
            />
            {kicker}
          </div>
        )}

        {/* Staggered Animated Main Title */}
        <h1
          style={{
            fontSize: '76px',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            margin: '0 0 28px 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '18px 24px',
          }}
        >
          {words.map((word, i) => {
            const wordDelay = 4 + i * 2.5;
            const wordSpring = spring({
              frame: frame - wordDelay,
              fps,
              config: { damping: 13, stiffness: 110 },
            });
            const wordOpacity = interpolate(wordSpring, [0, 0.5], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const wordY = interpolate(wordSpring, [0, 1], [40, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            // Accent words like numbers or keywords
            const isHighlighted =
              word.includes('$') ||
              /BILLION|MILLION|EMPIRE|SECRETS/i.test(word);

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  color: isHighlighted ? accentColor : '#FFFFFF',
                  textShadow: isHighlighted
                    ? `0 0 35px ${accentColor}66`
                    : 'none',
                }}
              >
                {word}
              </span>
            );
          })}
        </h1>

        {/* Decorative Divider */}
        <div
          style={{
            width: '140px',
            height: '4px',
            backgroundColor: accentColor,
            borderRadius: '2px',
            transform: `scaleX(${lineScale})`,
            transformOrigin: 'center',
            marginBottom: '28px',
          }}
        />

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              fontSize: '28px',
              fontWeight: 500,
              lineHeight: 1.4,
              color: '#94A3B8',
              maxWidth: '880px',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
