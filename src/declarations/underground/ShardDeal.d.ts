/// <reference types="knockout" />
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../items/Item.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
type ShardCost = {
    shardTypeString: string;
    shardType?: UndergroundItem;
    amount: number;
};
declare class ShardDeal {
    shards: ShardCost[];
    item: {
        itemType: Item;
        amount: number;
    };
    questPointCost: number;
    currencyType: Currency;
    static list: Partial<Record<ShardTraderLocations, KnockoutObservableArray<ShardDeal>>>;
    constructor(shardCosts: ShardCost[], item: Item, itemAmount: number);
    isVisible(): boolean;
    static getDeals(town: ShardTraderLocations): KnockoutObservableArray<ShardDeal>;
    static canUse(town: ShardTraderLocations, i: number): boolean;
    static use(town: ShardTraderLocations, i: number, tradeTimes?: number): void;
    static generateDeals(): void;
    static generateKantoDeals(): void;
    static generateJohtoDeals(): void;
    static generateHoennDeals(): void;
    static generateSinnohDeals(): void;
    static generateUnovaDeals(): void;
    static generateKalosDeals(): void;
    static generateAlolaDeals(): void;
    static generateGalarDeals(): void;
}

