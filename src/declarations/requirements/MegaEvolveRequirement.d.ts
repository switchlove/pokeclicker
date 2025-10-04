/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class MegaEvolveRequirement extends Requirement {
    private name;
    private megaStone;
    constructor(name: PokemonNameType, megaStone: MegaStoneType);
    getProgress(): number;
    hint(): string;
}
