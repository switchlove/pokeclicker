/// <reference path="./Requirement.d.ts"/>
declare class NullRequirement extends Requirement {
    constructor();
    getProgress(): number;
    hint(): string;
}
