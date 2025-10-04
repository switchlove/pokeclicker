/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class PokeballRequirement extends AchievementRequirement {
    pokeball: GameConstants.Pokeball;
    constructor(value: number, pokeball: GameConstants.Pokeball, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
    toString(): string;
}
