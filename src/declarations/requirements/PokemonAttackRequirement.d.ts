/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class PokemonAttackRequirement extends AchievementRequirement {
    pokemon: PokemonNameType;
    private isMultiplier;
    constructor(pokemon: PokemonNameType, attackValue: number, isMultiplier?: boolean, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
