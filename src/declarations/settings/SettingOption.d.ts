/// <reference path="../requirements/Requirement.d.ts"/>
declare class SettingOption<T> {
    text: string;
    value: T;
    requirement?: Requirement;
    constructor(text: string, value: T, requirement?: Requirement);
    isUnlocked(): boolean;
}
