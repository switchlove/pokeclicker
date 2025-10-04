/// <reference path="./Changelog.d.ts"/>
declare class ChangelogUpdate extends Changelog {
    version: string;
    constructor(version: string, date: Date, desc?: string);
}
