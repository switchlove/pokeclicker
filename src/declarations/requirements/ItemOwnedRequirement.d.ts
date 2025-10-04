/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class ItemOwnedRequirement extends AchievementRequirement {
    itemName: string;
    constructor(itemName: string, amount?: number, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
