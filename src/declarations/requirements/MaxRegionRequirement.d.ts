/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class MaxRegionRequirement extends Requirement {
    constructor(maxRegion?: Region, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
