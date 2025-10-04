/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
declare class UndergroundEvolutionItem extends UndergroundItem {
    type: StoneType;
    constructor(id: number, itemName: string, space: Array<Array<number>>, type: StoneType, value?: number, requirement?: Requirement);
}
