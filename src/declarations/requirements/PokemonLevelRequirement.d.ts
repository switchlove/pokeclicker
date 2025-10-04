/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class PokemonLevelRequirement extends Requirement {
    pokemon: PokemonNameType;
    constructor(pokemon: PokemonNameType, level: number, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
