/// <reference path="../enums/CaughtStatus.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./CaughtIndicatingItem.d.ts"/>
declare class EggItem extends CaughtIndicatingItem {
    type: EggItemType;
    constructor(type: EggItemType, basePrice: number, currency?: Currency, displayName?: string);
    use(): boolean;
    addToHatchery(): boolean;
    getCaughtStatus(): CaughtStatus;
}
