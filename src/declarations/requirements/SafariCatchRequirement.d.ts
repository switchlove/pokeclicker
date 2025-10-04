/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class SafariCatchRequirement extends AchievementRequirement {
    private shiny;
    constructor(value: number, shiny?: boolean, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
    toString(): string;
}
