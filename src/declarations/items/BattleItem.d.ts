/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../multiplier/MultiplierType.d.ts"/>
/// <reference path="./Item.d.ts"/>
declare class BattleItem extends Item {
    multiplierType?: keyof typeof MultiplierType;
    multiplyBy?: number;
    type: BattleItemType;
    constructor(type: BattleItemType, description: string, basePrice: number, currency?: Currency, displayName?: string, multiplierType?: keyof typeof MultiplierType, multiplyBy?: number);
    use(amount: number): boolean;
    checkCanUse(): boolean;
}
