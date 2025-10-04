/// <reference path="./Requirement.d.ts"/>
declare class LazyRequirementWrapper<T extends Requirement> extends Requirement {
    private reqCreator;
    private req;
    constructor(reqCreator: () => T);
    getProgress(): number;
    hint(): string;
    private unwrap;
}
