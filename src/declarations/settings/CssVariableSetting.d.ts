/// <reference path="./Setting.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
declare class CssVariableSetting extends Setting<string> {
    constructor(name: string, displayName: string, options?: any[], defaultValue?: string, requirement?: Requirement);
    set(value: string): void;
    validValue(value: string): boolean;
}
