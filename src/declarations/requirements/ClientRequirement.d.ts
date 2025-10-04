/// <reference path="./Requirement.d.ts"/>
declare class ClientRequirement extends Requirement {
    usingClient: boolean;
    constructor(usingClient?: boolean);
    getProgress(): number;
    hint(): string;
}
