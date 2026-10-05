import { Fish, Gate, KeyItem, LevelData, Pearl, Wall, WaterCurrent } from '../types/game';

export interface OceanZone {
  id: number;
  name: string;
  nameUrdu: string;
  depthRange: string;
  depthRangeUrdu: string;
  startLevel: number;
  endLevel: number;
  themeColor: string;
}

export const OCEAN_ZONES: OceanZone[] = [
  {
    id: 1,
    name: 'Sunlit Coral Reefs',
    nameUrdu: 'روشن مرجانی چٹانیں',
    depthRange: '0m to -200m',
    depthRangeUrdu: '0 تا -200 میٹر',
    startLevel: 1,
    endLevel: 40,
    themeColor: '#38bdf8',
  },
  {
    id: 2,
    name: 'Sunken Vaults & Aqueducts',
    nameUrdu: 'ڈوبے ہوئے غار و نالیاں',
    depthRange: '-200m to -600m',
    depthRangeUrdu: '-200 تا -600 میٹر',
    startLevel: 41,
    endLevel: 80,
    themeColor: '#34d399',
  },
  {
    id: 3,
    name: 'Twilight Jet Streams',
    nameUrdu: 'نیم تاریک تیز لہریں',
    depthRange: '-600m to -1200m',
    depthRangeUrdu: '-600 تا -1200 میٹر',
    startLevel: 81,
    endLevel: 120,
    themeColor: '#fbbf24',
  },
  {
    id: 4,
    name: 'Midnight Electric Trench',
    nameUrdu: 'برقی خندق و گہرا سمندر',
    depthRange: '-1200m to -2500m',
    depthRangeUrdu: '-1200 تا -2500 میٹر',
    startLevel: 121,
    endLevel: 160,
    themeColor: '#a855f7',
  },
  {
    id: 5,
    name: 'Hadal Temple Abyss',
    nameUrdu: 'پاتال کا قدیم معبد',
    depthRange: '-2500m to -4000m',
    depthRangeUrdu: '-2500 تا -4000 میٹر',
    startLevel: 161,
    endLevel: 200,
    themeColor: '#f43f5e',
  },
];

// Generator for all 200 levels
export class LevelCatalog {
  private static cache: Map<number, LevelData> = new Map();

  public static getLevel(levelId: number): LevelData {
    const id = Math.max(1, Math.min(200, levelId));
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    const level = this.generateLevel(id);
    this.cache.set(id, level);
    return level;
  }

  private static generateLevel(id: number): LevelData {
    const zoneIndex = Math.floor((id - 1) / 40);
    const zone = OCEAN_ZONES[zoneIndex] || OCEAN_ZONES[0];
    const stageInZone = ((id - 1) % 40) + 1;

    // Outer boundary walls
    const walls: Wall[] = [
      { x: 10, y: 10, width: 680, height: 16, type: 'coral' },
      { x: 10, y: 524, width: 680, height: 16, type: 'coral' },
      { x: 10, y: 10, width: 16, height: 530, type: 'coral' },
      { x: 674, y: 10, width: 16, height: 530, type: 'coral' },
    ];

    let spawn = { x: 65, y: 65 };
    let exit = { x: 620, y: 470 };

    const fishes: Fish[] = [];
    const pearls: Pearl[] = [];
    const gates: Gate[] = [];
    const keys: KeyItem[] = [];
    const currents: WaterCurrent[] = [];

    // Archetype selection (8 distinct layout patterns)
    const pattern = (stageInZone - 1) % 8;

    if (pattern === 0) {
      // Classic S-Curve Trench
      walls.push({ x: 26, y: 160, width: 490, height: 20, type: 'coral' });
      walls.push({ x: 180, y: 340, width: 494, height: 20, type: 'rock' });

      // Puffer patrolling upper canal
      fishes.push({
        id: `fish_${id}_1`,
        type: 'puffer',
        x: 220,
        y: 85,
        startX: 110,
        startY: 85,
        targetX: 520,
        targetY: 85,
        vx: 1.2 + (stageInZone % 4) * 0.1,
        vy: 0,
        speed: 1.2 + (stageInZone % 4) * 0.1,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      // Jellyfish bobbing in middle passage
      fishes.push({
        id: `fish_${id}_2`,
        type: 'jellyfish',
        x: 350,
        y: 250,
        startX: 350,
        startY: 195,
        targetX: 350,
        targetY: 305,
        vx: 0,
        vy: 1.1,
        speed: 1.1,
        radius: 16,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#c084fc',
      });

      if (id > 15) {
        fishes.push({
          id: `fish_${id}_3`,
          type: 'barracuda',
          x: 480,
          y: 430,
          startX: 240,
          startY: 430,
          targetX: 600,
          targetY: 430,
          vx: 2.1,
          vy: 0,
          speed: 2.1,
          radius: 15,
          patrolProgress: 0,
          direction: 1,
          tailAngle: 0,
          color: '#38bdf8',
        });
      }

      pearls.push({ id: `p_${id}_1`, x: 620, y: 75, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 75, y: 250, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 340, y: 440, radius: 10, collected: false, sparklePhase: 2 });
    } else if (pattern === 1) {
      // Twin Columns with Coral Gate & Starfish Key
      walls.push({ x: 220, y: 26, width: 20, height: 320, type: 'rock' });
      walls.push({ x: 440, y: 190, width: 20, height: 334, type: 'coral' });

      gates.push({
        id: `gate_${id}_1`,
        x: 440,
        y: 80,
        width: 20,
        height: 110,
        isOpen: false,
        keyRequired: true,
        color: '#fbbf24',
      });

      keys.push({
        id: `key_${id}_1`,
        x: 95,
        y: 450,
        collected: false,
        color: '#fbbf24',
      });

      fishes.push({
        id: `fish_${id}_1`,
        type: 'jellyfish',
        x: 330,
        y: 120,
        startX: 330,
        startY: 60,
        targetX: 330,
        targetY: 460,
        vx: 0,
        vy: 1.4,
        speed: 1.4,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#e879f9',
      });

      fishes.push({
        id: `fish_${id}_2`,
        type: 'puffer',
        x: 550,
        y: 280,
        startX: 480,
        startY: 280,
        targetX: 620,
        targetY: 280,
        vx: 1.2,
        vy: 0,
        speed: 1.2,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      pearls.push({ id: `p_${id}_1`, x: 330, y: 75, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 105, y: 320, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 550, y: 120, radius: 10, collected: false, sparklePhase: 2 });
    } else if (pattern === 2) {
      // Central Coral Atoll with Swift Currents
      walls.push({ x: 260, y: 170, width: 180, height: 180, type: 'coral' });

      currents.push({ x: 40, y: 380, width: 220, height: 60, forceX: 0.18, forceY: 0, direction: 'right' });
      currents.push({ x: 440, y: 90, width: 220, height: 60, forceX: -0.18, forceY: 0, direction: 'left' });

      fishes.push({
        id: `fish_${id}_1`,
        type: 'barracuda',
        x: 350,
        y: 90,
        startX: 80,
        startY: 90,
        targetX: 600,
        targetY: 90,
        vx: 2.3,
        vy: 0,
        speed: 2.3,
        radius: 16,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#38bdf8',
      });

      fishes.push({
        id: `fish_${id}_2`,
        type: 'puffer',
        x: 540,
        y: 260,
        startX: 540,
        startY: 180,
        targetX: 540,
        targetY: 340,
        vx: 0,
        vy: 1.2,
        speed: 1.2,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      pearls.push({ id: `p_${id}_1`, x: 350, y: 125, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 350, y: 410, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 110, y: 470, radius: 10, collected: false, sparklePhase: 2 });
    } else if (pattern === 3) {
      // Quad Cavern Chambers
      walls.push({ x: 26, y: 260, width: 270, height: 20, type: 'coral' });
      walls.push({ x: 400, y: 260, width: 274, height: 20, type: 'coral' });
      walls.push({ x: 335, y: 26, width: 20, height: 234, type: 'rock' });
      walls.push({ x: 335, y: 280, width: 20, height: 244, type: 'rock' });

      keys.push({ id: `key_${id}_1`, x: 580, y: 120, collected: false, color: '#38bdf8' });
      gates.push({
        id: `gate_${id}_1`,
        x: 335,
        y: 350,
        width: 20,
        height: 100,
        isOpen: false,
        keyRequired: true,
        color: '#38bdf8',
      });

      fishes.push({
        id: `fish_${id}_1`,
        type: 'puffer',
        x: 180,
        y: 140,
        startX: 80,
        startY: 140,
        targetX: 280,
        targetY: 140,
        vx: 1.3,
        vy: 0,
        speed: 1.3,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      fishes.push({
        id: `fish_${id}_2`,
        type: 'jellyfish',
        x: 480,
        y: 140,
        startX: 400,
        startY: 140,
        targetX: 620,
        targetY: 140,
        vx: 1.2,
        vy: 0,
        speed: 1.2,
        radius: 16,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#c084fc',
      });

      pearls.push({ id: `p_${id}_1`, x: 180, y: 70, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 80, y: 470, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 500, y: 360, radius: 10, collected: false, sparklePhase: 2 });
    } else if (pattern === 4) {
      // Serpentine Corridors
      walls.push({ x: 120, y: 26, width: 20, height: 380, type: 'coral' });
      walls.push({ x: 250, y: 140, width: 20, height: 384, type: 'rock' });
      walls.push({ x: 380, y: 26, width: 20, height: 380, type: 'coral' });
      walls.push({ x: 510, y: 140, width: 20, height: 384, type: 'rock' });

      fishes.push({
        id: `fish_${id}_1`,
        type: 'jellyfish',
        x: 185,
        y: 200,
        startX: 185,
        startY: 70,
        targetX: 185,
        targetY: 460,
        vx: 0,
        vy: 1.4,
        speed: 1.4,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#ec4899',
      });

      fishes.push({
        id: `fish_${id}_2`,
        type: 'puffer',
        x: 315,
        y: 300,
        startX: 315,
        startY: 90,
        targetX: 315,
        targetY: 450,
        vx: 0,
        vy: 1.2,
        speed: 1.2,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      pearls.push({ id: `p_${id}_1`, x: 185, y: 65, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 315, y: 480, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 445, y: 65, radius: 10, collected: false, sparklePhase: 2 });
    } else if (pattern === 5) {
      // Whirlpool Spiral Cavern
      walls.push({ x: 160, y: 100, width: 380, height: 20, type: 'coral' });
      walls.push({ x: 520, y: 120, width: 20, height: 320, type: 'coral' });
      walls.push({ x: 160, y: 420, width: 380, height: 20, type: 'coral' });
      walls.push({ x: 160, y: 220, width: 20, height: 200, type: 'coral' });
      walls.push({ x: 260, y: 220, width: 180, height: 20, type: 'rock' });

      fishes.push({
        id: `fish_${id}_1`,
        type: 'puffer',
        x: 340,
        y: 60,
        startX: 120,
        startY: 60,
        targetX: 560,
        targetY: 60,
        vx: 1.4,
        vy: 0,
        speed: 1.4,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      fishes.push({
        id: `fish_${id}_2`,
        type: 'jellyfish',
        x: 350,
        y: 320,
        startX: 220,
        startY: 320,
        targetX: 470,
        targetY: 320,
        vx: 1.2,
        vy: 0,
        speed: 1.2,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#38bdf8',
      });

      exit = { x: 350, y: 280 };
      pearls.push({ id: `p_${id}_1`, x: 600, y: 260, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 100, y: 350, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 480, y: 380, radius: 10, collected: false, sparklePhase: 2 });
    } else if (pattern === 6) {
      // Sunken Temple Pillars
      walls.push({ x: 150, y: 140, width: 60, height: 60, type: 'rock' });
      walls.push({ x: 350, y: 140, width: 60, height: 60, type: 'rock' });
      walls.push({ x: 500, y: 140, width: 60, height: 60, type: 'rock' });
      walls.push({ x: 250, y: 320, width: 60, height: 60, type: 'rock' });
      walls.push({ x: 430, y: 320, width: 60, height: 60, type: 'rock' });

      fishes.push({
        id: `fish_${id}_1`,
        type: 'barracuda',
        x: 350,
        y: 240,
        startX: 80,
        startY: 240,
        targetX: 620,
        targetY: 240,
        vx: 2.2,
        vy: 0,
        speed: 2.2,
        radius: 16,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#00f5ff',
      });

      fishes.push({
        id: `fish_${id}_2`,
        type: 'puffer',
        x: 180,
        y: 350,
        startX: 70,
        startY: 350,
        targetX: 630,
        targetY: 350,
        vx: 1.3,
        vy: 0,
        speed: 1.3,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      pearls.push({ id: `p_${id}_1`, x: 180, y: 70, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 460, y: 70, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 340, y: 460, radius: 10, collected: false, sparklePhase: 2 });
    } else {
      // The Abyssal Gauntlet
      walls.push({ x: 80, y: 120, width: 440, height: 18, type: 'coral' });
      walls.push({ x: 180, y: 260, width: 494, height: 18, type: 'rock' });
      walls.push({ x: 80, y: 400, width: 440, height: 18, type: 'coral' });

      fishes.push({
        id: `fish_${id}_1`,
        type: 'jellyfish',
        x: 580,
        y: 190,
        startX: 580,
        startY: 140,
        targetX: 580,
        targetY: 240,
        vx: 0,
        vy: 1.3,
        speed: 1.3,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#e879f9',
      });

      fishes.push({
        id: `fish_${id}_2`,
        type: 'puffer',
        x: 120,
        y: 330,
        startX: 120,
        startY: 280,
        targetX: 120,
        targetY: 380,
        vx: 0,
        vy: 1.3,
        speed: 1.3,
        radius: 17,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        isPuffed: false,
        puffTimer: 0,
        color: '#f59e0b',
      });

      fishes.push({
        id: `fish_${id}_3`,
        type: 'barracuda',
        x: 350,
        y: 470,
        startX: 120,
        startY: 470,
        targetX: 580,
        targetY: 470,
        vx: 2.4,
        vy: 0,
        speed: 2.4,
        radius: 16,
        patrolProgress: 0,
        direction: 1,
        tailAngle: 0,
        color: '#38bdf8',
      });

      exit = { x: 620, y: 470 };
      pearls.push({ id: `p_${id}_1`, x: 580, y: 60, radius: 10, collected: false, sparklePhase: 0 });
      pearls.push({ id: `p_${id}_2`, x: 120, y: 200, radius: 10, collected: false, sparklePhase: 1 });
      pearls.push({ id: `p_${id}_3`, x: 580, y: 340, radius: 10, collected: false, sparklePhase: 2 });
    }

    const calculatedDepth = Math.round(15 + id * 19.5);
    const depthName = `Depth: -${calculatedDepth}m`;
    const depthNameUrdu = `گہرائی: -${calculatedDepth} میٹر`;

    const name = `Level ${id}: ${zone.name}`;
    const nameUrdu = `مرحلہ ${id}: ${zone.nameUrdu}`;

    return {
      id,
      name,
      nameUrdu,
      depthName,
      depthNameUrdu,
      spawn,
      exit,
      walls,
      fishes,
      pearls,
      gates,
      keys,
      currents,
      shields: [],
    };
  }
}
