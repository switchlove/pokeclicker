/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
/// <reference path="../dayCycle/DayCyclePart.d.ts"/>
declare class DayCyclePartRequirement extends Requirement {
    dayCycleParts: DayCyclePart[];
    constructor(dayCycleParts: DayCyclePart[], option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
