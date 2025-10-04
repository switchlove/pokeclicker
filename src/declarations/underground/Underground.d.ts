/// <reference path="../DataStore/common/Feature.d.ts"/>
/// <reference path="./mine/Mine.d.ts"/>
/// <reference path="./mine/MineConfig.d.ts"/>
/// <reference path="./helper/UndergroundHelper.d.ts"/>
/// <reference path="./tools/UndergroundTools.d.ts"/>
/// <reference path="./UndergroundBattery.d.ts"/>
declare class Underground implements Feature {
    name: string;
    saveKey: string;
    defaults: Record<string, any>;
    private _undergroundExp;
    private _undergroundLevel;
    private _progressToNextLevel;
    private _autoSearchMineType;
    private _mine;
    helpers: UndergroundHelpers;
    tools: UndergroundTools;
    battery: UndergroundBattery;
    canAccess(): boolean;
    initialize(): void;
    update(delta: number): void;
    generateMine(mineType: MineType, helper?: UndergroundHelper): void;
    addUndergroundExp(amount: number): void;
    get mine(): Mine | null;
    get undergroundExp(): number;
    get undergroundLevel(): number;
    get progressToNextLevel(): number;
    get autoSearchMineType(): MineType;
    set autoSearchMineType(type: MineType);
    toJSON(): Record<string, any>;
    fromJSON(json: Record<string, any>): void;
    static calculateMinimumItemsToGenerate(level?: number): number;
    static calculateMaximumItemsToGenerate(level?: number): number;
    static convertLevelToExperience(level: number): number;
    static convertExperienceToLevel(experience: number): number;
}
