/// <reference path="../specialEvents/SpecialEventTitleType.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class SpecialEventRequirement extends Requirement {
    private specialEventName;
    constructor(specialEventName: SpecialEventTitleType);
    getProgress(): number;
    hint(): string;
}
