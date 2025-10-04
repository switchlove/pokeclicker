/// <reference path="./Item.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../multiplier/MultiplierType.d.ts"/>
declare class FluteItem extends Item {
    gemTypes: (keyof typeof PokemonType)[];
    multiplierType: keyof typeof MultiplierType;
    multiplyBy: number;
    name: FluteItemType;
    constructor(name: FluteItemType, description: string, gemTypes: (keyof typeof PokemonType)[], multiplierType: keyof typeof MultiplierType, multiplyBy: number);
    use(): boolean;
    getDescription(): string;
    getFormattedTooltip(): string;
    getMultiplier(): number;
    isSoldOut(): boolean;
    checkCanUse(): boolean;
}
