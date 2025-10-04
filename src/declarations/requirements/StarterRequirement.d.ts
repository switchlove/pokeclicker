/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class StarterRequirement extends Requirement {
    region: Region;
    private starter;
    constructor(region: Region, starter: Starter);
    getProgress(): Starter.Grass | Starter.Fire | Starter.Water | Starter.Special;
    hint(): string;
}
