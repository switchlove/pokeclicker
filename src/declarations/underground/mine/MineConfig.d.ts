/// <reference path="../UndergroundItem.d.ts"/>
declare enum MineType {
    Random = 0,
    Diamond = 1,
    GemPlate = 2,
    Shard = 3,
    Fossil = 4,
    EvolutionItem = 5,
    Special = 6
}
declare interface MineConfig {
    type: MineType;
    displayName: string;
    getAvailableItems: () => UndergroundItem[];
    fixedItemCount?: number;
}
declare class MineConfigs {
    private static _list;
    static add(config: MineConfig): void;
    static find(type: MineType): MineConfig;
}
