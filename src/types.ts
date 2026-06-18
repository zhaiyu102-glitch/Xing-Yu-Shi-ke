export type GameState = "INTRO" | "TRAVEL" | "CARD" | "CURTAIN" | "DIALOGUE" | "WARPING";

export interface PoetData {
  name: string;
  dynasty: string;
  icon: string;
  bio: string;
  text: string;
  curtains: string;
  bubbleText?: string;
  style: {
    inkColor: string;
    sash: string;
    actionType: string;
  };
}

export interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  depth: number;
  isPoet: boolean;
  poetData?: PoetData;
  pulse?: number;
  offset: number;
}

export interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  speed: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  char: string;
  life: number;
  maxLife: number;
  color: string;
  type: "starTrail" | "meteor" | "waterfall" | "splash" | "curtain" | "orbit" | "river" | "rain" | "bird" | "inkDust";
  originalX?: number;
  side?: "left" | "right";
  angle?: number;
  wingPhase?: number;
  targetRadius?: number;
}

export interface Meteor {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  trail: any[];
}

export interface PoetBodyState {
  x: number;
  targetX?: number;
  y: number;
  scale: number;
  targetScale: number;
  alpha: number;
  animTime: number;
  fadeOutStage: boolean;
  lingerFrames?: number;
  innerPoetScale?: number;
  innerPoetAlpha?: number;
  lqSequence?: string;
  lqUnfoldRatio?: number;
  lqPauseFrames?: number;
  lqPoetHidden?: boolean;
  lqZoomRatio?: number;
  lqTimeline?: number;
  lbSequence?: string;
  lbUnfoldRatio?: number;
  lbPauseFrames?: number;
  lbPoetHidden?: boolean;
  lbZoomRatio?: number;
  scrollTextProgress?: number;
  lqBirds?: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: number;
    wingAngle: number;
    isFlappingUp: boolean;
    speed: number;
  }>;
}

