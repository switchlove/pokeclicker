/// <reference path="../enums/BerryType.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Item.d.ts"/>
declare class BerryItem extends Item {
    berry: BerryType;
    berryReq?: BerryType;
    berryName: string;
    constructor(berry: BerryType, basePrice: number, currency?: Currency, berryReq?: BerryType);
    gain(amt: number): void;
    get description(): string;
    isAvailable(): boolean;
    get image(): string;
}
