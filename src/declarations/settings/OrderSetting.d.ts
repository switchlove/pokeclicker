/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./Setting.d.ts"/>
declare class OrderSetting<T> extends Setting<T[]> {
    constructor(name: string, displayName: string, defaultValue: T[], requirement?: Requirement, saveAsDefault?: boolean);
    validValue(value: T[]): boolean;
}
