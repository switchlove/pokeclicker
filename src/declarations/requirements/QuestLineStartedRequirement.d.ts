/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../quests/QuestLineNameType.d.ts"/>
/// <reference path="../TemporaryScriptTypes.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class QuestLineStartedRequirement extends Requirement {
    private questLineName;
    cachedQuest: TmpQuestType;
    get quest(): any;
    constructor(questLineName: QuestLineNameType, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
