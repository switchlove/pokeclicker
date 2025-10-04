/// <reference path="../specialEvents/SpecialEventTitleType.d.ts"/>
/// <reference path="./SpecialEventRequirement.d.ts"/>
declare class SpecialEventRandomRequirement extends SpecialEventRequirement {
    private isAvailable;
    constructor(specialEventName: SpecialEventTitleType);
    getProgress(): number;
    hint(): string;
}
