/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class StatisticRequirement extends AchievementRequirement {
    private statistic;
    private hintText;
    private focus;
    constructor(statistic: string | Array<string | number>, requiredAmount: number, hintText?: string, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
