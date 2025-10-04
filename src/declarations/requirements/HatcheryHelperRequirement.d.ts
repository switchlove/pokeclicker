/// <reference path="./AchievementRequirement.d.ts"/>
declare class HatcheryHelperRequirement extends AchievementRequirement {
    bonusRequired: number;
    constructor(helpersUnlocked: number, bonusRequired: number);
    getProgress(): number;
    hint(): string;
    toString(): string;
}
