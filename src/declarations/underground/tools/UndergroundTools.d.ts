/// <reference path="./UndergroundTool.d.ts"/>
/// <reference path="./UndergroundToolType.d.ts"/>
declare class UndergroundTools {
    tools: UndergroundTool[];
    private _selectedToolType;
    constructor();
    initialize(): void;
    update(delta: number): void;
    getTool(toolType: UndergroundToolType): UndergroundTool;
    getRandomTool(): UndergroundTool;
    useTool(toolType: UndergroundToolType, x: number, y: number): void;
    get selectedToolType(): UndergroundToolType;
    set selectedToolType(type: UndergroundToolType);
    fromJSON(json: Record<string, any>): void;
    toJSON(): Record<string, any>;
}
