/// <reference path="./AchievementRequirement.d.ts"/>
declare class TotalMegaStoneObtainedRequirement extends AchievementRequirement {
    constructor(value: number);
    getProgress(): number;
    hint(): string;
}
