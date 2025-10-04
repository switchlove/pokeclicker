/// <reference path="./MultiplierType.d.ts"/>
type GetMultiplierFunction = (useBonus: boolean) => number;
type MultTypeString = keyof typeof MultiplierType;
declare class Multiplier {
    private multipliers;
    constructor();
    addBonus(type: MultTypeString, bonusFunction: GetMultiplierFunction, source: string): void;
    getBonus(type: MultTypeString, useBonus?: boolean): number;
}
