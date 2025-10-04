/// <reference path="./GemDeal.d.ts"/>
/// <reference path="knockout.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare class GemDeals {
    static list: Partial<Record<GemShops, KnockoutObservableArray<GemDeal>>>;
    static generateDeals(): void;
    static getDeals(shop: GemShops): GemDeal[];
    static canUse(shop: GemShops, i: number): boolean;
    static use(shop: GemShops, i: number, tradeTimes?: number): boolean;
}
