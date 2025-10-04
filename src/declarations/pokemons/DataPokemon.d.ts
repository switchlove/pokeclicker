/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../interfaces/BagItem.d.ts"/>
/// <reference path="../interfaces/Pokemon.d.ts"/>
/// <reference path="../party/LevelType.d.ts"/>
/// <reference path="./evolutions/Base.d.ts"/>
/// <reference path="./PokemonNameType.d.ts"/>
declare class DataPokemon implements PokemonInterface {
    id: number;
    name: PokemonNameType;
    catchRate: number;
    evolutions: EvoData[];
    type1: PokemonType;
    type2: PokemonType;
    attack: number;
    hitpoints: number;
    levelType: LevelType;
    exp: number;
    eggCycles: number;
    heldItem: BagItem | null;
    gender: any;
    shiny: boolean;
    constructor(id: number, name: PokemonNameType, catchRate: number, evolutions: EvoData[], type1: PokemonType, type2: PokemonType, attack: number, hitpoints: number, levelType: LevelType, exp: number, eggCycles: number, heldItem: BagItem | null, gender: any);
}
