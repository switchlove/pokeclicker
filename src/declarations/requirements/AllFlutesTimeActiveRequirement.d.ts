/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class AllFlutesTimeActiveRequirement extends AchievementRequirement {
    private static lowestTimeActive;
    constructor(requiredMinutes: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
