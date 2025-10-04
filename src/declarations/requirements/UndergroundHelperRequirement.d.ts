/// <reference path="./AchievementRequirement.d.ts"/>
declare class UndergroundHelperRequirement extends AchievementRequirement {
    levelRequired: number;
    constructor(helpersUnlocked: number, levelRequired: number);
    getProgress(): number;
    hint(): string;
}
