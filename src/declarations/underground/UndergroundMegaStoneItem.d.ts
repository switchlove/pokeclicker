/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
declare class UndergroundMegaStoneItem extends UndergroundItem {
    megaStone: MegaStoneType;
    pokemon: PokemonNameType;
    constructor(megaStone: MegaStoneType, id: number, itemName: string, space: Array<Array<number>>, pokemon: PokemonNameType, value?: number, weight?: number);
}
