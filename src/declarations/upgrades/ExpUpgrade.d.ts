/// <reference path="../wallet/Amount.d.ts"/>
/// <reference path="./Upgrade.d.ts"/>
/**
 * An upgrade that requires experience to level up.
 */
declare class ExpUpgrade extends Upgrade {
    defaults: {
        level: number;
        exp: number;
    };
    expList: number[];
    private expKO;
    constructor(name: any, displayName: string, maxLevel: number, expList: number[], costList: Amount[], bonusList: number[], increasing: boolean);
    gainExp(exp: number): void;
    canBuy(): boolean;
    hasEnoughExp(): boolean;
    toJSON(): Record<string, any>;
    fromJSON(json: Record<string, any>): void;
    get normalizedExp(): number;
    get expPercentage(): number;
    get progressString(): string;
    private get exp();
    private set exp(value);
}
