import React from 'react';
import { Series, Audio, staticFile } from 'remotion';
import { Storyboard, StoryboardScene, PlacedProp } from './types';
import defaultStoryboard from '../public/storyboard.json';
import { BlackTitleCard } from './components/BlackTitleCard';
import { Character } from './components/Character';
import { BarChart } from './components/BarChart';
import { PropRenderer } from './components/Props';
import { SceneContainer } from './components/SceneContainer';

export interface VideoProps {
  storyboard?: Storyboard;
}

export const Video: React.FC<VideoProps> = ({ storyboard = defaultStoryboard as Storyboard }) => {
  const { scenes, audioFile, fps = 30 } = storyboard;
  const fullAudioSrc = audioFile ? staticFile(audioFile) : staticFile('audio/full_voiceover.mp3');

  let accumulatedFrames = 0;

  return (
    <>
      {/* 1. Continuous Narration Audio Track spanning the entire timeline */}
      {fullAudioSrc && <Audio src={fullAudioSrc} />}

      {/* 2. Visual Scene Sequence */}
      <Series>
        {scenes.map((scene: StoryboardScene, index: number) => {
          // Calculate exact frame offset into the continuous full_voiceover.mp3 track
          const startFrame =
            scene.start_time !== undefined
              ? Math.round(scene.start_time * fps)
              : accumulatedFrames;

          accumulatedFrames += scene.durationInFrames;

          return (
            <Series.Sequence
              key={scene.id || index}
              durationInFrames={scene.durationInFrames}
              name={scene.id}
            >
              {/* Scene Visuals Router */}
              {scene.type === 'black_title_card' && (
                <BlackTitleCard
                  title={scene.title || ''}
                  subtitle={scene.subtitle}
                  kicker={scene.kicker}
                  accentColor={scene.accentColor || '#FACC15'}
                />
              )}

              {scene.type === 'character_prop' && (
                <SceneContainer
                  headline={scene.headline}
                  subtext={scene.subtext}
                  theme="paper"
                >
                  <Character
                    {...scene.character}
                    audioSrc={fullAudioSrc}
                    audioOffsetInFrames={startFrame}
                  />
                </SceneContainer>
              )}

              {scene.type === 'bar_chart_explainer' && (
                <SceneContainer
                  headline={scene.headline}
                  subtext={scene.subtext}
                  theme="paper"
                >
                  {/* Infographic Bar Chart on the Right */}
                  <div
                    style={{
                      position: 'absolute',
                      right: 100,
                      top: '52%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <BarChart {...scene.chart} />
                  </div>

                  {/* Character Pointing at Chart from the Left, Synced to Audio */}
                  {scene.character && (
                    <Character
                      {...scene.character}
                      pose={scene.character.pose || 'pointing_right'}
                      audioSrc={fullAudioSrc}
                      audioOffsetInFrames={startFrame}
                    />
                  )}
                </SceneContainer>
              )}

              {scene.type === 'multi_prop_showcase' && (
                <SceneContainer
                  headline={scene.headline}
                  subtext={scene.subtext}
                  theme="paper"
                >
                  {/* Placed Props */}
                  {scene.props?.map((p: PlacedProp, pIndex: number) => (
                    <PropRenderer
                      key={pIndex}
                      name={p.name}
                      x={p.x}
                      y={p.y}
                      scale={p.scale}
                      rotation={p.rotation}
                    />
                  ))}

                  {/* Explaining Character with Lip-Sync */}
                  {scene.character && (
                    <Character
                      {...scene.character}
                      audioSrc={fullAudioSrc}
                      audioOffsetInFrames={startFrame}
                    />
                  )}
                </SceneContainer>
              )}
            </Series.Sequence>
          );
        })}
      </Series>
    </>
  );
};
