/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class SeededDateRequirement extends Requirement {
    seededRandFunction: () => boolean;
    constructor(seededRandFunction: () => boolean, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
