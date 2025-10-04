declare class AchievementCategory {
    name: string;
    achievementBonus: number;
    isUnlocked: () => boolean;
    totalWeight: number;
    constructor(name: string, achievementBonus: number, isUnlocked: () => boolean);
}
