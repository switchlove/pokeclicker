/// <reference path="./ItemOwnedRequirement.d.ts"/>
declare class UniqueItemOwnedRequirement extends ItemOwnedRequirement {
    itemName: string;
    private obtainText?;
    private unlockHint?;
    constructor(itemName: string, obtainText?: string, unlockHint?: string);
    hint(): string;
}
