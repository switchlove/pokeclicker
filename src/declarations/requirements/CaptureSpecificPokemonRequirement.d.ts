/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class CaptureSpecificPokemonRequirement extends AchievementRequirement {
    private includeBreeding;
    private pokemon;
    constructor(pokemonName: PokemonNameType[], capturesNeeded?: number, includeBreeding?: boolean, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
