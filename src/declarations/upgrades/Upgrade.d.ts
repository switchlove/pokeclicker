/// <reference path="knockout.d.ts"/>
/// <reference path="../DataStore/common/Saveable.d.ts"/>
/// <reference path="../wallet/Amount.d.ts"/>
declare class Upgrade implements Saveable {
    name: any;
    displayName: string;
    maxLevel: number;
    costList: Amount[];
    bonusList: number[];
    increasing: boolean;
    defaults: {
        level: number;
    };
    saveKey: string;
    levelKO: KnockoutObservable<number>;
    constructor(name: any, displayName: string, maxLevel: number, costList?: Amount[], bonusList?: number[], increasing?: boolean);
    calculateCost(): Amount;
    calculateBonus(level?: number): number;
    upgradeBonus(): number;
    isMaxLevel(): boolean;
    canAfford(): boolean;
    canBuy(): boolean;
    buy(): void;
    levelUp(): void;
    fromJSON(json: Record<string, any>): void;
    toJSON(): Record<string, any>;
    get level(): number;
    set level(value: number);
}
