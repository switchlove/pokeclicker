/// <reference path="../enums/OakItemType.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Item.d.ts"/>
declare class BuyOakItem extends Item {
    item: OakItemType;
    constructor(item: OakItemType, basePrice: number, currency?: Currency);
    totalPrice(amount: number): number;
    gain(amt: number): void;
    isAvailable(): boolean;
    get image(): string;
}
