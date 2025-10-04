/// <reference path="./AchievementRequirement.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare class UndergroundLevelRequirement extends AchievementRequirement {
    constructor(level: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
