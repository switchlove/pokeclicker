/// <reference path="./Requirement.d.ts"/>
declare class OneFromManyRequirement extends Requirement {
    requirements: (Requirement)[];
    constructor(requirements?: (Requirement)[]);
    getProgressPercentage(): string;
    isCompleted(): boolean;
    hint(): string;
    getProgress(): number;
}
