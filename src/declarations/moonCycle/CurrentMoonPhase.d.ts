/// <reference path="./MoonCyclePhase.d.ts"/>
declare class CurrentMoonPhase {
    phase: MoonCyclePhase;
    color: string;
    description: string;
    constructor(phase: MoonCyclePhase, color: string, description: string);
    get tooltip(): string;
}
