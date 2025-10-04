/// <reference path="knockout.d.ts"/>
/// <reference path="./CurrentMoonPhase.d.ts"/>
/// <reference path="./MoonCyclePhase.d.ts"/>
declare class MoonCycle {
    static currentMoonCyclePhase: Computed<MoonCyclePhase>;
    static image: Computed<string>;
    static color: Computed<string>;
    static tooltip: Computed<string>;
    static currentMoonPhases: Record<MoonCyclePhase, CurrentMoonPhase>;
    static catchChanceBonus(phase: MoonCyclePhase): number;
}
