/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="./Item.d.ts"/>
/// <reference path="./types.d.ts"/>
declare class MegaStoneItem extends Item {
    megaStone: MegaStoneType;
    basePokemon: PokemonNameType;
    constructor(megaStone: MegaStoneType, basePokemon: PokemonNameType, basePrice: number, currency?: Currency, options?: ShopOptions, displayName?: string, description?: string);
    totalPrice(amount: number): number;
    gain(amt: number): void;
    isAvailable(): boolean;
    get image(): string;
    isSoldOut(): boolean;
    get description(): string;
}
