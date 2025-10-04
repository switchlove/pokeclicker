/// <reference path="./AchievementRequirement.d.ts"/>
declare class QuestLevelRequirement extends AchievementRequirement {
    constructor(levelRequired: number);
    getProgress(): number;
    hint(): string;
}
