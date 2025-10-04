/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
declare class UndergroundShardItem extends UndergroundItem {
    constructor(id: number, itemName: string, space: Array<Array<number>>, requirement?: Requirement);
}
