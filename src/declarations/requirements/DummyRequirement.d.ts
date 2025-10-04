/// <reference path="./AchievementRequirement.d.ts"/>
declare class DummyRequirement extends AchievementRequirement {
    constructor();
    getProgress(): number;
    hint(): string;
}
