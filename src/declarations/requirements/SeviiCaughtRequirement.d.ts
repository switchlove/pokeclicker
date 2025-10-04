/// <reference path="./AchievementRequirement.d.ts"/>
declare class SeviiCaughtRequirement extends AchievementRequirement {
    shiny: boolean;
    constructor(value: number, shiny: boolean);
    getProgress(): number;
    hint(): string;
    toString(): string;
}
