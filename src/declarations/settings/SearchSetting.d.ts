/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./Setting.d.ts"/>
declare class SearchSetting extends Setting<string> {
    readonly regex: ko.PureComputed<RegExp>;
    constructor(name: string, displayName: string, defaultValue: string, requirement?: Requirement, saveAsDefault?: boolean);
}
