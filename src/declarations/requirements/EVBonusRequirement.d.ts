/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class EVBonusRequirement extends AchievementRequirement {
    static highestPokemonBonus: import("knockout").PureComputed<number>;
    constructor(requiredBonus: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
