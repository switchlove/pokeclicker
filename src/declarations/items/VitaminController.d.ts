/// <reference path="../koExtenders.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare class VitaminController {
    static currentlySelected: import("knockout").Observable<VitaminType>;
    static add: import("knockout").Observable<boolean>;
    static multiplier: string[];
    static multiplierIndex: import("knockout").Observable<number>;
    static incrementMultiplier(): void;
    static decrementMultiplier(): void;
    static getMultiplier(): number;
    static getImage(vitaminType: any): string;
}
