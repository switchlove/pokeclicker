/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class PokemonDefeatedSelectNRequirement extends Requirement {
    private pokemon;
    private index;
    private total;
    private select;
    constructor(pokemon: PokemonNameType, index: number, total: number, select: number);
    getProgress(): number;
    hint(): string;
}
