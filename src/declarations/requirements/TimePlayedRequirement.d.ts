/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class TimePlayedRequirement extends AchievementRequirement {
    constructor(secondsPlayed: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
