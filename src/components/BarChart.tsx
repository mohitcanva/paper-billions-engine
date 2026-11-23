import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ChartConfig } from '../types';

export interface BarChartProps extends ChartConfig {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  title = 'FINANCIAL GROWTH',
  currency = '$',
  unit = 'M',
  highlightIndex = -1,
  bars,
  className,
  style,
  width = 820,
  height = 540,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find max value for scaling Y axis
  const maxBarValue = Math.max(...bars.map((b) => b.value), 1);
  // Round up to a nice ceiling
  const yCeiling = Math.ceil(maxBarValue * 1.25);

  const chartPaddingTop = 80;
  const chartPaddingBottom = 70;
  const chartPaddingLeft = 90;
  const chartPaddingRight = 50;

  const plotWidth = width - chartPaddingLeft - chartPaddingRight;
  const plotHeight = height - chartPaddingTop - chartPaddingBottom;

  const barCount = bars.length;
  const barSlotWidth = plotWidth / barCount;
  const barWidth = Math.min(84, barSlotWidth * 0.58);

  // Y-axis grid ticks (4 steps)
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((pct) => ({
    pct,
    value: Math.round(yCeiling * pct),
    y: chartPaddingTop + plotHeight * (1 - pct),
  }));

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '6px solid #1E293B',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style,
      }}
    >
      {/* Title Header Bar */}
      {title && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: chartPaddingLeft,
            right: chartPaddingRight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#64748B',
              backgroundColor: '#F1F5F9',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '2px solid #CBD5E1',
            }}
          >
            INDEX: {currency} / {unit}
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {/* Horizontal Gridlines & Y-Axis Labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={chartPaddingLeft}
              y1={tick.y}
              x2={width - chartPaddingRight}
              y2={tick.y}
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray={i === 0 ? 'none' : '4 4'}
            />
            <text
              x={chartPaddingLeft - 18}
              y={tick.y + 5}
              fill="#64748B"
              fontSize="16"
              fontWeight="700"
              textAnchor="end"
              fontFamily="sans-serif"
            >
              {currency}
              {tick.value}
              {unit}
            </text>
          </g>
        ))}

        {/* X-Axis Baseline */}
        <line
          x1={chartPaddingLeft}
          y1={chartPaddingTop + plotHeight}
          x2={width - chartPaddingRight}
          y2={chartPaddingTop + plotHeight}
          stroke="#1E293B"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Animated Bars */}
        {bars.map((bar, index) => {
          const delay = 6 + index * 4;
          const barSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const targetBarHeight = (bar.value / yCeiling) * plotHeight;
          const currentBarHeight = interpolate(
            barSpring,
            [0, 1],
            [0, targetBarHeight],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const centerX =
            chartPaddingLeft +
            index * barSlotWidth +
            barSlotWidth / 2;
          const barX = centerX - barWidth / 2;
          const barY = chartPaddingTop + plotHeight - currentBarHeight;

          const isHighlighted = index === highlightIndex;
          const barFill = bar.color || (isHighlighted ? '#10B981' : '#3B82F6');

          // Animated counting value
          const animatedValue = (barSpring * bar.value).toFixed(1);

          return (
            <g key={index}>
              {/* Drop Shadow Pillar */}
              <rect
                x={barX + 4}
                y={barY + 4}
                width={barWidth}
                height={Math.max(0, currentBarHeight)}
                rx="8"
                fill="rgba(15, 23, 42, 0.15)"
              />

              {/* Main Vector Bar */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={Math.max(0, currentBarHeight)}
                rx="8"
                fill={barFill}
                stroke="#1E293B"
                strokeWidth="4"
              />

              {/* Highlight Glow or Crown Badge */}
              {isHighlighted && barSpring > 0.6 && (
                <g
                  transform={`translate(${centerX}, ${barY - 45})`}
                  style={{
                    opacity: interpolate(barSpring, [0.6, 1], [0, 1]),
                  }}
                >
                  <rect
                    x="-42"
                    y="-12"
                    width="84"
                    height="24"
                    rx="12"
                    fill="#FEF08A"
                    stroke="#1E293B"
                    strokeWidth="3"
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#15803D"
                    fontSize="12"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    ★ SURGE
                  </text>
                </g>
              )}

              {/* Value Label Above Bar */}
              {barSpring > 0.1 && (
                <text
                  x={centerX}
                  y={barY - (isHighlighted ? 14 : 12)}
                  fill="#0F172A"
                  fontSize="18"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {currency}
                  {animatedValue}
                  {unit}
                </text>
              )}

              {/* Category / Year Label on X-Axis */}
              <text
                x={centerX}
                y={chartPaddingTop + plotHeight + 34}
                fill="#334155"
                fontSize="18"
                fontWeight="800"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
