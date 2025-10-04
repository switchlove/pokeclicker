/// <reference path="./AchievementRequirement.d.ts"/>
/// <reference path="./MultiRequirement.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class DevelopmentRequirement extends AchievementRequirement {
    requirement: Requirement | MultiRequirement;
    private static default;
    development: boolean;
    constructor(requirement?: Requirement | MultiRequirement);
    getProgress(): number;
    hint(): string;
}
