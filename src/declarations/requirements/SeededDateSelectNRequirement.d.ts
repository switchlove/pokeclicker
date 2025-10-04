/// <reference path="./Requirement.d.ts"/>
declare class SeededDateSelectNRequirement extends Requirement {
    private index;
    private total;
    private select;
    constructor(index: number, total: number, select: number);
    getProgress(): number;
    hint(): string;
}
