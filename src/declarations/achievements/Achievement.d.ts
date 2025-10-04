/// <reference path="knockout.d.ts"/>
/// <reference path="../requirements/AchievementRequirement.d.ts"/>
/// <reference path="./AchievementCategory.d.ts"/>
declare class Achievement {
    name: string;
    protected _description: string;
    property: AchievementRequirement;
    bonusWeight: number;
    category: AchievementCategory;
    achievableFunction: () => boolean | null;
    persist: boolean;
    isCompleted: KnockoutComputed<boolean>;
    getProgressText: KnockoutComputed<string>;
    bonus: number;
    unlocked: KnockoutObservable<boolean>;
    protected notificationTitle: string;
    protected notificationTimeout: number;
    constructor(name: string, _description: string, property: AchievementRequirement, bonusWeight: number, category: AchievementCategory, achievableFunction?: () => boolean | null, persist?: boolean);
    check(): boolean;
    notifyUnlocked(): void;
    getProgress(): number;
    getProgressPercentage(): string | 0 | 100;
    getBonus(): string;
    achievable(): boolean;
    get description(): string;
    get displayName(): string;
}
