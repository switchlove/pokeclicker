/// <reference path="../requirements/AchievementRequirement.d.ts"/>
/// <reference path="./Achievement.d.ts"/>
declare class SecretAchievement extends Achievement {
    private _hint;
    constructor(name: string, description: string, property: AchievementRequirement, _hint: string, persist?: boolean);
    get description(): string;
    get displayName(): string;
}
