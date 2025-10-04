/// <reference path="./PokerusIndicatingItem.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
/// <reference path="../enums/CaughtStatus.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./types.d.ts"/>
declare class PokemonItem extends PokerusIndicatingItem {
    ignoreEV: boolean;
    type: PokemonNameType;
    private _translatedOrDisplayName;
    constructor(pokemon: PokemonNameType, basePrice?: number, currency?: Currency, ignoreEV?: boolean, displayName?: string, options?: ShopOptions, name?: string);
    gain(amt: number): void;
    getCaughtStatus(): CaughtStatus;
    getPokerusStatus(): Pokerus;
    getPokerusProgress(): string;
    showBagAmount(): boolean;
    get image(): string;
    get displayName(): string;
}
