/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
declare class UndergroundGemItem extends UndergroundItem {
    id: number;
    type: PokemonType;
    value: number;
    requirement?: Requirement;
    constructor(id: number, itemName: string, space: Array<Array<number>>, type: PokemonType, value?: number, requirement?: Requirement);
}
