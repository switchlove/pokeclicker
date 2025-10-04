/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Item.d.ts"/>
/// <reference path="./types.d.ts"/>
declare class Vitamin extends Item {
    type: VitaminType;
    constructor(type: VitaminType, basePrice: number, currency?: Currency, options?: ShopOptions, displayName?: string, description?: string);
    gain(n: number): void;
    use(): boolean;
    checkCanUse(): boolean;
    get image(): string;
}
