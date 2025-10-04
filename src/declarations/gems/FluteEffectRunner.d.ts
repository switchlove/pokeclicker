/// <reference path="knockout.d.ts"/>
/// <reference path="../multiplier/Multiplier.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare class FluteEffectRunner {
    static counter: number;
    static numActiveFlutes: KnockoutObservable<number>;
    static activeGemTypes: KnockoutObservableArray<number>;
    static additionalInfoTooltip: KnockoutComputed<string>;
    static fluteActiveTime: {
        [k: string]: KnockoutObservable<number>;
    };
    static initialize(multiplier: Multiplier): void;
    static tick(): void;
    static getLowestGem(itemName: string): number;
    static updateActiveGemTypes(): void;
    static gemCost(): void;
    static getEffect(itemName: FluteItemType): number;
    static toggleEffect(itemName: FluteItemType): void;
    static removeEffect(itemName: FluteItemType): void;
    static fluteFormattedTime(itemName: FluteItemType): number;
    static fluteTooltip(itemName: FluteItemType): string;
    static updateFormattedTimeLeft(itemName: FluteItemType): any;
    static getFluteMultiplier(itemName: FluteItemType): number;
    static isActive(itemName: FluteItemType): KnockoutComputed<boolean>;
    static fluteGemTooltip(item: any): string;
}
