/// <reference path="./AchievementRequirement.d.ts"/>
declare class TotalSpecialEventsActiveRequirement extends AchievementRequirement {
    constructor(requiredValue: number);
    getProgress(): number;
    hint(): string;
}
