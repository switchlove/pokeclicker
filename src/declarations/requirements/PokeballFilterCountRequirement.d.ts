/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class PokeballFilterCountRequirement extends AchievementRequirement {
    constructor(requiredAmount: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
