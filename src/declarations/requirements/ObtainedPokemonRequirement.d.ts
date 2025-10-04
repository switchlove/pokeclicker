/// <reference path="./Requirement.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
declare class ObtainedPokemonRequirement extends Requirement {
    pokemon: PokemonNameType;
    constructor(pokemon: PokemonNameType, uncaught?: boolean);
    getProgress(): 0 | 1;
    hint(): string;
}
