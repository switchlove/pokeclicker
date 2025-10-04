/// <reference path="./MineConfig.d.ts"/>
/// <reference path="knockout.d.ts"/>
/// <reference path="../UndergroundItem.d.ts"/>
type Coordinate = {
    x: number;
    y: number;
};
type MineProperties = {
    width: number;
    height: number;
    minimumDepth?: number;
    maximumExtraLayers?: number;
    minimumItemsToGenerate: number;
    extraItemsToGenerate: number;
    timeToDiscover: number;
    config?: MineConfig;
};
type RewardProperties = {
    id: number;
    undergroundItemID: number;
    localCoordinate: Coordinate;
    backgroundPosition: string;
    rotations: number;
    rewarded: Observable<boolean>;
};
declare enum MineStateType {
    None = 0,
    Loading = 1,
    Undiscovered = 2,
    Active = 3,
    Completed = 4,
    Abandoned = 5
}
declare class Reward {
    private _properties;
    constructor(rewardProperties: RewardProperties);
    get rewardID(): number;
    get undergroundItemID(): number;
    get localCoordinate(): Coordinate;
    get backgroundPosition(): string;
    get rotations(): number;
    get rewarded(): boolean;
    set rewarded(value: boolean);
    save: () => {
        rewarded: boolean;
        id: number;
        undergroundItemID: number;
        localCoordinate: Coordinate;
        backgroundPosition: string;
        rotations: number;
    };
    load: (json: any) => void;
    static load: (json: any) => Reward;
}
declare class Tile {
    private _layerDepth;
    private _reward?;
    private _survey;
    private _surveyRewardID;
    constructor(layerDepth: number);
    get layerDepth(): number;
    set layerDepth(value: number);
    get reward(): Reward;
    set reward(value: Reward);
    get survey(): number | undefined;
    set survey(range: number);
    get surveyRewardID(): number | undefined;
    set surveyRewardID(rewardID: number | undefined);
    save: () => {
        layerDepth: number;
        reward: {
            rewarded: boolean;
            id: number;
            undergroundItemID: number;
            localCoordinate: Coordinate;
            backgroundPosition: string;
            rotations: number;
        };
        survey: number;
        surveyRewardID: number;
    };
    static load: (json: any) => Tile;
}
declare class Mine {
    static DEFAULT_MINIMUM_DEPTH: number;
    static DEFAULT_MAXIMUM_EXTRA_LAYERS: number;
    static MAXIMUM_PLACEMENT_ATTEMPTS: number;
    private _mineProperties;
    private _grid;
    private _timeUntilDiscovery;
    private _itemsBuried;
    private _itemsFound;
    private _itemsPartiallyFound;
    private _completed;
    constructor(mineProperties: MineProperties);
    tick(deltaTime: number): void;
    generate(): void;
    private _generateGrid;
    private _generateUndergroundItems;
    private _canPlaceReward;
    private _attemptPlaceReward;
    getRandomCoordinate(): Coordinate;
    getCoordinateForGridIndex(index: number): Coordinate | null;
    getGridIndexForCoordinate(coordinate: Coordinate): number;
    private getTileForCoordinate;
    survey(coordinate: Coordinate, range: number, rewardID: number): void;
    removeSurveyForRewardID(rewardID: number): void;
    attemptBreakTile(coordinate: Coordinate, layers?: number): boolean;
    attemptFindItem(coordinate: Coordinate): UndergroundItem;
    attemptCompleteLayer(): boolean;
    get grid(): Tile[];
    get timeUntilDiscovery(): number;
    get itemsBuried(): number;
    get itemsFound(): number;
    get itemsPartiallyFound(): number;
    get completed(): boolean;
    get width(): number;
    get height(): number;
    get mineType(): MineType;
    get initialTimeToDiscover(): number;
    private _updateItemsBuriedObservable;
    private _updateItemsFoundObservable;
    private _updateItemsPartiallyFoundObservable;
    save(): {
        properties: MineProperties;
        grid: {
            layerDepth: number;
            reward: {
                rewarded: boolean;
                id: number;
                undergroundItemID: number;
                localCoordinate: Coordinate;
                backgroundPosition: string;
                rotations: number;
            };
            survey: number;
            surveyRewardID: number;
        }[];
        timeUntilDiscovery: number;
        completed: boolean;
    };
    static load(json: any): Mine;
    static buriedItemsIDSet(mine: Mine): Set<number>;
    static hiddenItemsIDSet(mine: Mine): Set<number>;
    static foundItemsIDSet(mine: Mine): Set<number>;
    static partiallyFoundItemsIDSet(mine: Mine): Set<number>;
}

