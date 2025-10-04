/// <reference path="./AchievementRequirement.d.ts"/>
declare class FarmHandRequirement extends AchievementRequirement {
    constructor(handsUnlocked: number);
    getProgress(): number;
    hint(): string;
}
