/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class SubregionRequirement extends Requirement {
    region: Region;
    subregion: number;
    constructor(region: Region, subregion: number, option?: AchievementOption);
    getProgress(): 0 | 100;
    hint(): string;
    getProgressPercentage(): "0" | "100";
    isCompleted(): boolean;
}
