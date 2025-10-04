/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class InEnvironmentRequirement extends Requirement {
    environment: Environment;
    constructor(environment: Environment, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
