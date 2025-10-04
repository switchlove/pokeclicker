/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
declare class UndergroundFossilPieceItem extends UndergroundItem {
    constructor(id: number, itemName: string, space: Array<Array<number>>, value?: number, requirement?: Requirement);
}
