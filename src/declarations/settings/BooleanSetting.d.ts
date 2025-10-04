/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./Setting.d.ts"/>
declare class BooleanSetting extends Setting<boolean> {
    constructor(name: string, displayName: string, defaultValue: boolean, requirement?: Requirement, saveAsDefault?: boolean);
    set(value: boolean): void;
    toggle(): void;
}
