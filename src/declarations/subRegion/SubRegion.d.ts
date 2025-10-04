/// <reference path="../requirements/Requirement.d.ts"/>
declare class SubRegion {
    name: string;
    id: number;
    requirement?: Requirement;
    startTown?: string;
    startRoute?: number;
    constructor(name: string, id: number, requirement?: Requirement, startTown?: string, startRoute?: number);
    unlocked(): boolean;
}
