/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class MoneyRequirement extends AchievementRequirement {
    constructor(requiredValue: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
