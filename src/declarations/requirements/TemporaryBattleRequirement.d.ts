/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class TemporaryBattleRequirement extends AchievementRequirement {
    battleName: string;
    constructor(battleName: string, defeatsRequired?: number, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
