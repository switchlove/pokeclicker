/// <reference path="./Requirement.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../enums/OakItemType.d.ts"/>
declare class OakItemLevelRequirement extends Requirement {
    private _oakItemType;
    constructor(oakItemType: OakItemType, level: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
