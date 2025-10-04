/// <reference path="./CaughtIndicatingItem.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare abstract class PokerusIndicatingItem extends CaughtIndicatingItem {
    abstract getPokerusStatus(): Pokerus;
    abstract getPokerusProgress(): string;
}
