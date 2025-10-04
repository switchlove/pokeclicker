/// <reference types="knockout" />
/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../wallet/Amount.d.ts"/>
/// <reference path="../enums/BerryType.d.ts"/>
/// <reference path="../items/Item.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
type GenericTraderShopIdentifier = 'Palaeontologist' | 'EverstoneDealer' | 'FossilCinnabarLab' | 'FossilDevonCorporation' | 'FossilOreburghMiningMuseum' | 'FossilNacreneMuseum' | 'FossilAmbretteFossilLab' | 'FossilMasterGalarRoute6';
declare enum DealCostOrProfitType {
    Gem = "Gem",
    Shard = "Shard",
    Berry = "Berry",
    Item = "Item",
    Amount = "Amount"
}
type DealCostProfit = {
    amount: number;
    hidePlayerInventory?: boolean;
};
type GemDealCost = {
    type: DealCostOrProfitType.Gem;
    gemType: PokemonType;
} & DealCostProfit;
type ShardDealCost = {
    type: DealCostOrProfitType.Shard;
    shardItem: Item;
} & DealCostProfit;
type BerryDealCost = {
    type: DealCostOrProfitType.Berry;
    berryType: BerryType;
} & DealCostProfit;
type ItemDealCost = {
    type: DealCostOrProfitType.Item;
    item: Item;
} & DealCostProfit;
type AmountDealCost = {
    type: DealCostOrProfitType.Amount;
    currency: Amount;
} & DealCostProfit;
type DealCost = GemDealCost | ShardDealCost | BerryDealCost | ItemDealCost | AmountDealCost;
type ItemDealProfit = {
    type: DealCostOrProfitType.Item;
    item: Item;
} & DealCostProfit;
type AmountDealProfit = {
    type: DealCostOrProfitType.Amount;
    currency: Amount;
} & DealCostProfit;
type DealProfit = ItemDealProfit | AmountDealProfit;
type GenericDealParams = {
    costs: DealCost[];
    profits: DealProfit[];
    tradeRequirement?: Requirement;
    visibleRequirement?: Requirement;
    tradeButtonOverride?: string;
};
declare class GenericDeal {
    private readonly _costs;
    private readonly _profits;
    private readonly _tradeRequirement?;
    private readonly _visibleRequirement?;
    private readonly _tradeButtonOverride?;
    get costs(): DealCost[];
    get profits(): DealProfit[];
    get requirement(): Requirement | undefined;
    get tradeButtonOverride(): string | undefined;
    static list: Partial<Record<GenericTraderShopIdentifier, KnockoutObservableArray<GenericDeal>>>;
    constructor(params: GenericDealParams);
    isVisible(): boolean;
    static getDeals(id: GenericTraderShopIdentifier): KnockoutObservableArray<GenericDeal>;
    static isLocked(id: GenericTraderShopIdentifier, index: number): boolean;
    static canUse(id: GenericTraderShopIdentifier, index: number): boolean;
    static use(id: GenericTraderShopIdentifier, index: number, tradeTimes?: number): boolean;
    static anySoldOut(deal: GenericDeal): boolean;
    static maxTrades(deal: GenericDeal): number;
    static inventoryAmount(a: DealCost | DealProfit): number;
    static generateDeals(): void;
}

