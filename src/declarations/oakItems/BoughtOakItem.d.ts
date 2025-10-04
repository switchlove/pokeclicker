/// <reference types="knockout" />
/// <reference path="../wallet/Amount.d.ts"/>
/// <reference path="./OakItem.d.ts"/>
declare class BoughtOakItem extends OakItem {
    shopName: string;
    private purchasedKO;
    constructor(name: any, displayName: string, description: string, shopName: string, increasing: boolean, bonusList: number[], inactiveBonus?: number, expGain?: number, expList?: number[], maxLevel?: number, costList?: Amount[], bonusSymbol?: string);
    isUnlocked(): boolean;
    get hint(): import("knockout").PureComputed<string>;
    toJSON(): Record<string, any>;
    fromJSON(json: Record<string, any>): void;
    get purchased(): boolean;
    set purchased(bool: boolean);
}
