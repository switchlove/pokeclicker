/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class InDungeonRequirement extends Requirement {
    dungeon: string;
    constructor(dungeon: string, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
