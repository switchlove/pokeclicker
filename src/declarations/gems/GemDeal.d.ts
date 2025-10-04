/// <reference path="../items/Item.d.ts"/>
/// <reference path="../enums/PokemonType.d.ts"/>
type GemCost = {
    gemType: PokemonType;
    amount: number;
};
declare class GemDeal {
    gems: GemCost[];
    item: {
        itemType: Item;
        amount: number;
    };
    constructor(gemCosts: GemCost[], item: Item, itemAmount: number);
    isVisible(): boolean;
}
