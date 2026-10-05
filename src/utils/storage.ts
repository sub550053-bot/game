export interface AquaSaveData {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  totalPearls: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  language: 'ur' | 'en';
}

const STORAGE_KEY = 'aqua_bounce_odyssey_save_v1';

const defaultData: AquaSaveData = {
  unlockedLevel: 1,
  levelStars: {},
  totalPearls: 0,
  soundEnabled: true,
  musicEnabled: true,
  language: 'ur',
};

export class AquaStorage {
  public static load(): AquaSaveData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...defaultData, ...JSON.parse(data) };
      }
    } catch {
      // safe fallback
    }
    return { ...defaultData };
  }

  public static save(data: AquaSaveData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // safe fallback
    }
  }

  public static saveLevelCompletion(
    current: AquaSaveData,
    levelId: number,
    starsEarned: number
  ): AquaSaveData {
    const updated = { ...current };
    const prevStars = updated.levelStars[levelId] || 0;
    if (starsEarned > prevStars) {
      updated.levelStars[levelId] = starsEarned;
      updated.totalPearls += (starsEarned - prevStars);
    }
    if (levelId === updated.unlockedLevel && updated.unlockedLevel < 25) {
      updated.unlockedLevel = levelId + 1;
    }
    this.save(updated);
    return updated;
  }
}
