/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class UndergroundItemsFoundRequirement extends AchievementRequirement {
    constructor(value: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
