/// <reference path="../requirements/MultiRequirement.d.ts"/>
/// <reference path="../requirements/OneFromManyRequirement.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./PokemonList.d.ts"/>
/// <reference path="./PokemonNameType.d.ts"/>
declare class RoamingPokemon {
    pokemonName: PokemonNameType;
    unlockRequirement?: Requirement | MultiRequirement | OneFromManyRequirement;
    pokemon: PokemonListData;
    constructor(pokemonName: PokemonNameType, unlockRequirement?: Requirement | MultiRequirement | OneFromManyRequirement);
    isRoaming(): boolean;
}
