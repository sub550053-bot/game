export interface Point {
  x: number;
  y: number;
}

export type FishType = 'puffer' | 'jellyfish' | 'barracuda' | 'guppy';

export interface Fish {
  id: string;
  type: FishType;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  speed: number;
  radius: number;
  patrolProgress: number;
  direction: number; // 1 or -1
  tailAngle: number;
  isPuffed?: boolean;
  puffTimer?: number;
  color: string;
}

export interface Pearl {
  id: string;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  sparklePhase: number;
}

export interface Gate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  keyRequired: boolean;
  color: string;
}

export interface KeyItem {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  color: string;
}

export interface WaterCurrent {
  x: number;
  y: number;
  width: number;
  height: number;
  forceX: number;
  forceY: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface BubbleShield {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'coral' | 'rock' | 'seaweed';
}

export interface LevelData {
  id: number;
  name: string;
  nameUrdu: string;
  depthName: string;
  depthNameUrdu: string;
  spawn: Point;
  exit: Point;
  walls: Wall[];
  fishes: Fish[];
  pearls: Pearl[];
  gates: Gate[];
  keys: KeyItem[];
  currents: WaterCurrent[];
  shields: BubbleShield[];
}

export interface BubbleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
}
