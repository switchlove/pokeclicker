/// <reference path="knockout.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./AchievementRequirement.d.ts"/>
declare class CustomRequirement<T> extends AchievementRequirement {
    private focus;
    private required;
    private hintText;
    constructor(focus: Observable<T> | Computed<T>, required: T, hintText: string, option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
