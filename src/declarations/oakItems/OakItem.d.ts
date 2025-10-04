/// <reference types="knockout" />
/// <reference path="../upgrades/ExpUpgrade.d.ts"/>
/// <reference path="../wallet/Amount.d.ts"/>
declare class OakItem extends ExpUpgrade {
    description: string;
    inactiveBonus: number;
    unlockReq: number;
    expGain: number;
    bonusSymbol: string;
    defaults: {
        level: number;
        exp: number;
        isActive: boolean;
    };
    private isActiveKO;
    constructor(name: any, displayName: string, description: string, increasing: boolean, bonusList: number[], inactiveBonus: number, unlockReq: number, expGain: number, expList?: number[], maxLevel?: number, costList?: Amount[], bonusSymbol?: string);
    use(exp?: number, scale?: number): void;
    isUnlocked(): boolean;
    getHint(): string;
    get hint(): import("knockout").PureComputed<string>;
    calculateBonus(level?: number): number;
    calculateBonusIfActive(level?: number): number;
    toJSON(): Record<string, any>;
    fromJSON(json: Record<string, any>): void;
    get expPercentage(): number;
    get progressString(): string;
    get isActive(): boolean;
    set isActive(bool: boolean);
    get bonusText(): string;
    get tooltip(): import("knockout").PureComputed<string>;
}
