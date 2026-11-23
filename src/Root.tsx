import React from 'react';
import { Composition, staticFile } from 'remotion';
import { Video } from './Video';
import { BlackTitleCard } from './components/BlackTitleCard';
import { Character } from './components/Character';
import { BarChart } from './components/BarChart';
import { MoneyBagProp, BalloonProp, ServerProp } from './components/Props';
import { SceneContainer } from './components/SceneContainer';
import storyboardData from '../public/storyboard.json';
import { Storyboard } from './types';

export const RemotionRoot: React.FC = () => {
  const storyboard = storyboardData as Storyboard;

  // Calculate total frames dynamically from storyboard scenes or audio total
  const calculatedSceneFrames = storyboard.scenes.reduce(
    (sum, scene) => sum + (scene.durationInFrames || 90),
    0
  );

  const totalFrames = storyboard.totalDurationInFrames || calculatedSceneFrames || 435;

  return (
    <>
      {/* Main Full-Length Video Composition with Single Continuous Narration */}
      <Composition
        id="Video"
        component={Video}
        durationInFrames={totalFrames}
        fps={storyboard.fps || 30}
        width={storyboard.width || 1920}
        height={storyboard.height || 1080}
        defaultProps={{
          storyboard,
        }}
      />

      {/* Component Sandbox: Black Title Card */}
      <Composition
        id="BlackTitleCardDemo"
        component={() => (
          <BlackTitleCard
            title="HOW TO BUILD A BILLION DOLLAR EMPIRE"
            subtitle="The secret formula of viral YouTube storytelling"
            kicker="CASE STUDY // EPISODE 01"
            accentColor="#FACC15"
          />
        )}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Component Sandbox: Paper Billions Character with Continuous Audio Sync */}
      <Composition
        id="CharacterDemo"
        component={() => (
          <SceneContainer
            headline="CHARACTER ANIMATION ENGINE"
            subtext="Clean 2D vector bean body with continuous audio-synced mouth movement"
          >
            <Character
              pose="holding"
              prop="money_bag"
              expression="happy"
              x={960}
              y={560}
              scale={2.2}
              audioSrc={staticFile('audio/full_voiceover.mp3')}
              audioOffsetInFrames={105}
            />
          </SceneContainer>
        )}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Component Sandbox: Animated Bar Chart */}
      <Composition
        id="BarChartDemo"
        component={() => (
          <SceneContainer
            headline="EXPONENTIAL REVENUE SURGE"
            subtext="Dynamic vector infographics with spring entrance physics"
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '55%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <BarChart
                title="ANNUAL REVENUE (MILLIONS USD)"
                currency="$"
                unit="M"
                highlightIndex={3}
                bars={[
                  { label: '2021', value: 1.8, color: '#94A3B8' },
                  { label: '2022', value: 6.5, color: '#64748B' },
                  { label: '2023', value: 24.2, color: '#38BDF8' },
                  { label: '2024', value: 68.5, color: '#10B981' },
                ]}
              />
            </div>
          </SceneContainer>
        )}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Component Sandbox: SVG Props */}
      <Composition
        id="PropsDemo"
        component={() => (
          <SceneContainer
            headline="PRE-BUILT FLAT-VECTOR SVG PROPS"
            subtext="Thick dark outlines with Paper Billions aesthetic"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '120px',
                height: '100%',
                paddingTop: '60px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <MoneyBagProp width={200} height={240} />
                <h3 style={{ marginTop: 20, color: '#1E293B', fontWeight: 800 }}>money_bag.svg</h3>
              </div>
              <div style={{ textAlign: 'center' }}>
                <BalloonProp width={180} height={240} />
                <h3 style={{ marginTop: 20, color: '#1E293B', fontWeight: 800 }}>balloon.svg</h3>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ServerProp width={200} height={240} />
                <h3 style={{ marginTop: 20, color: '#1E293B', fontWeight: 800 }}>server.svg</h3>
              </div>
            </div>
          </SceneContainer>
        )}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
