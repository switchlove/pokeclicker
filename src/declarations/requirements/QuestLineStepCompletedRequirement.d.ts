/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../quests/QuestLineNameType.d.ts"/>
/// <reference path="../TemporaryScriptTypes.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class QuestLineStepCompletedRequirement extends Requirement {
    private questLineName;
    private questIndex;
    cachedQuest: TmpQuestType;
    get quest(): any;
    constructor(questLineName: QuestLineNameType, questIndex: (() => number) | number, option?: AchievementOption);
    getProgress(): number;
    isCompleted(): boolean;
    hint(): string;
}
