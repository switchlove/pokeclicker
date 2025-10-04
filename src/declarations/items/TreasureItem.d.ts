/// <reference path="./Item.d.ts"/>
/// <reference path="../enums/UndergroundItemValueType.d.ts"/>
declare class TreasureItem extends Item {
    valueType: UndergroundItemValueType;
    constructor(id: string, valueType: UndergroundItemValueType, displayName: string);
    get image(): string;
}
