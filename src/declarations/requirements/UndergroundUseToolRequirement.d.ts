/// <reference path="./AchievementRequirement.d.ts"/>
/// <reference path="../underground/tools/UndergroundToolType.d.ts"/>
declare class UndergroundUseToolRequirement extends AchievementRequirement {
    toolType: UndergroundToolType;
    constructor(toolType: UndergroundToolType, amount: number);
    getProgress(): number;
    hint(): string;
}
