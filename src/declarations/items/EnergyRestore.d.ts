/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Item.d.ts"/>
declare class EnergyRestore extends Item {
    type: EnergyRestoreSize;
    constructor(type: EnergyRestoreSize, basePrice: number, currency?: Currency, displayName?: string);
    use(): boolean;
}
