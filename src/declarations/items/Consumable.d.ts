/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Item.d.ts"/>
/// <reference path="./types.d.ts"/>
declare class Consumable extends Item {
    type: ConsumableType;
    _canUse: (pokemon: any) => boolean;
    constructor(type: ConsumableType, basePrice: number, currency?: Currency, options?: ShopOptions, displayName?: string, description?: string, canUse?: (pokemon: any) => boolean);
    canUse(pokemon: {
        [key: string]: any;
        id: number;
    }): boolean;
}
