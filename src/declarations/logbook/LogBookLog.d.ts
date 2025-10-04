/// <reference path="knockout.d.ts"/>
/// <reference path="./helpers.d.ts"/>
/// <reference path="./LogBookTypes.d.ts"/>
declare class LogBookLog {
    type: LogBookType;
    content: LogContent;
    date: number;
    description: PureComputed<string> | import("../translation/Translation").TranslationVar;
    constructor(type?: LogBookType, content?: LogContent, date?: number);
    get displayLabel(): PureComputed<string>;
}
