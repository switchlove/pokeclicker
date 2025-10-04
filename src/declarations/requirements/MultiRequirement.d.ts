/// <reference path="./Requirement.d.ts"/>
declare class MultiRequirement extends Requirement {
    requirements: (Requirement)[];
    constructor(requirements?: (Requirement)[]);
    isCompleted(): boolean;
    hint(): string;
    getProgress(): number;
}
