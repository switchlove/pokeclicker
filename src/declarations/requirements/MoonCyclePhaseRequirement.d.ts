/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
/// <reference path="../moonCycle/MoonCyclePhase.d.ts"/>
declare class MoonCyclePhaseRequirement extends Requirement {
    moonCyclePhases: MoonCyclePhase[];
    constructor(moonCyclePhases: MoonCyclePhase[], option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
