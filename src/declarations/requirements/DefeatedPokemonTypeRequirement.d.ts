/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class DefeatedPokemonTypeRequirement extends AchievementRequirement {
    private type;
    private monoType;
    private pokemonList;
    private focus;
    constructor(type: PokemonType, requiredValue: number, monoType?: boolean, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
