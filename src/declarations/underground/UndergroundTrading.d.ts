/// <reference path="knockout.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
declare const TRADE_DOWN_AMOUNT = 3;
declare class UndergroundTrading {
    private static _selectedTradeFromItem;
    private static _selectedTradeToItem;
    private static _tradeAmount;
    private static _sellAmount;
    static quickSellEnabled: Observable<boolean>;
    private static _computedAvailableItemsToTradeList;
    private static _computedTradeToItemList;
    static trade(): boolean;
    static get canTrade(): boolean;
    static get selectedTradeFromItem(): UndergroundItem | null;
    static set selectedTradeFromItem(item: UndergroundItem | null);
    static get selectedTradeToItem(): UndergroundItem | null;
    static set selectedTradeToItem(item: UndergroundItem | null);
    static get tradeFromAmount(): number;
    static set tradeFromAmount(value: number);
    static get tradeAmount(): number;
    static set tradeAmount(value: number);
    static get availableItemsToTrade(): Array<UndergroundItem>;
    static get tradeToItemList(): Array<UndergroundItem>;
    static get sellAmount(): number;
    static set sellAmount(amount: number);
    static get canSell(): boolean;
    static sell(): void;
    static quickSell(item: UndergroundItem): void;
}
