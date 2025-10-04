/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class AttackRequirement extends AchievementRequirement {
    private static attack;
    constructor(value: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
