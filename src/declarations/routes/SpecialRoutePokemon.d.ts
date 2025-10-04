/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
declare class SpecialRoutePokemon {
    pokemon: PokemonNameType[];
    req: Requirement;
    constructor(pokemon: PokemonNameType[], req: Requirement);
    isAvailable(): boolean;
}
