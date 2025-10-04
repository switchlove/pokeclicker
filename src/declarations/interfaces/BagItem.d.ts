/// <reference path="../enums/ItemType.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
declare interface BagItem {
    type: ItemType;
    id: string | number;
    requirement?: Requirement;
}
