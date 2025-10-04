/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class DayOfWeekRequirement extends Requirement {
    DayOfWeekNum: number;
    constructor(DayOfWeekNum: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
