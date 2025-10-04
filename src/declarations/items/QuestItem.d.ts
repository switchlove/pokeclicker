/// <reference path="../quests/QuestLineNameType.d.ts"/>
/// <reference path="./Item.d.ts"/>
/// <reference path="./types.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare class QuestItem extends Item {
    private questlineName;
    private endQuestlineName;
    constructor(name: string, displayName: string, description: string, questlineName: QuestLineNameType, endQuestlineName?: QuestLineNameType, basePrice?: number, currency?: Currency, options?: ShopOptions);
    isActive(): boolean;
    isSoldOut(): boolean;
}
