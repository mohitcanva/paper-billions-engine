export type CharacterPose =
  | 'idle'
  | 'holding'
  | 'pointing_left'
  | 'pointing_right'
  | 'explaining'
  | 'excited'
  | 'shrug';

export type CharacterExpression = 'neutral' | 'happy' | 'excited' | 'surprised';

export type PropType = 'money_bag' | 'balloon' | 'server';

export interface CharacterConfig {
  pose?: CharacterPose;
  prop?: PropType;
  expression?: CharacterExpression;
  x?: number;
  y?: number;
  scale?: number;
  flipX?: boolean;
  audioSrc?: string;
  isSpeaking?: boolean;
}

export interface ChartBar {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  title?: string;
  currency?: string;
  unit?: string;
  highlightIndex?: number;
  bars: ChartBar[];
}

export interface PlacedProp {
  name: PropType;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
}

export interface BaseScene {
  id: string;
  type: string;
  audioFile?: string;
  durationInSeconds: number;
  durationInFrames: number;
}

export interface BlackTitleCardScene extends BaseScene {
  type: 'black_title_card';
  title: string;
  subtitle?: string;
  kicker?: string;
  accentColor?: string;
}

export interface CharacterPropScene extends BaseScene {
  type: 'character_prop';
  headline?: string;
  subtext?: string;
  character: CharacterConfig;
}

export interface BarChartScene extends BaseScene {
  type: 'bar_chart_explainer';
  headline?: string;
  subtext?: string;
  character?: CharacterConfig;
  chart: ChartConfig;
}

export interface MultiPropScene extends BaseScene {
  type: 'multi_prop_showcase';
  headline?: string;
  subtext?: string;
  character?: CharacterConfig;
  props: PlacedProp[];
}

export type StoryboardScene =
  | BlackTitleCardScene
  | CharacterPropScene
  | BarChartScene
  | MultiPropScene
  | (BaseScene & Record<string, any>);

export interface Storyboard {
  title: string;
  fps: number;
  width: number;
  height: number;
  scenes: StoryboardScene[];
  totalDurationInSeconds: number;
  totalDurationInFrames: number;
  updatedAt?: string;
}
