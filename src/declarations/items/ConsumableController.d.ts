/// <reference path="../koExtenders.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare class ConsumableController {
    static currentlySelected: import("knockout").Observable<ConsumableType>;
    static currentlySelectedName: import("knockout").Computed<string>;
    static multiplier: string[];
    static multiplierIndex: import("knockout").Observable<number>;
    static incrementMultiplier(): void;
    static decrementMultiplier(): void;
    static getMultiplier(): number;
    static getImage(consumableType: any): string;
}
