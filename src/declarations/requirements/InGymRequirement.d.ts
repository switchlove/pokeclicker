/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class InGymRequirement extends Requirement {
    gymTown: string;
    constructor(gymTown: string, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
