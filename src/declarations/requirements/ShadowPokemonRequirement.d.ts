/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class ShadowPokemonRequirement extends AchievementRequirement {
    private status;
    constructor(value: number, status?: GameConstants.ShadowStatus, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
    toString(): string;
}
