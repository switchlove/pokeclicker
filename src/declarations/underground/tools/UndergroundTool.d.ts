/// <reference path="./UndergroundToolType.d.ts"/>
/// <reference path="../mine/Mine.d.ts"/>
/// <reference path="knockout.d.ts"/>
type UndergroundToolProperties = {
    id: UndergroundToolType;
    displayName: string;
    description: string;
    durabilityPerUse: number;
    itemDestroyChance?: number;
    customRestoreRateFn?: (tool: UndergroundTool, level: number) => number;
    action: (x: number, y: number) => {
        coordinatesMined: Array<Coordinate>;
        success: boolean;
    };
};
declare class UndergroundTool {
    private _toolProperties;
    private _durability;
    canUseTool: PureComputed<boolean>;
    restoreRatePerSecond: PureComputed<number>;
    private maxDurabilityPerSecond;
    constructor(toolProperties: UndergroundToolProperties);
    tick(deltaTime: number): void;
    private handleDurabilityTick;
    reduceDurabilityByUse(): void;
    get id(): UndergroundToolType;
    get displayName(): string;
    get description(): string;
    get durabilityPerUse(): number;
    get durability(): number;
    get itemDestroyChance(): number;
    get action(): (x: number, y: number) => {
        coordinatesMined: Coordinate[];
        success: boolean;
    };
    fromJSON(save: any): void;
    toJSON(): {
        durability: number;
    };
    calculateDurabilityRestoreRatePerSecond(level?: number): number;
}

