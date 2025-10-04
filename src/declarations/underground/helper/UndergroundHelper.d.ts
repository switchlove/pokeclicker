/// <reference path="knockout.d.ts"/>
/// <reference path="../mine/MineConfig.d.ts"/>
/// <reference path="../../requirements/Requirement.d.ts"/>
/// <reference path="../../requirements/MultiRequirement.d.ts"/>
/// <reference path="../../requirements/OneFromManyRequirement.d.ts"/>
/// <reference path="../../GameConstants.d.ts"/>
/// <reference path="../UndergroundItem.d.ts"/>
type UndergroundHelperParams = {
    id: string;
    name: string;
    images: string[];
    favoriteMine: MineType;
    unlockRequirement?: Requirement | MultiRequirement | OneFromManyRequirement;
    retentionText?: string[];
};
declare class UndergroundHelper {
    private _id;
    private _name;
    private _images;
    private _favoriteMine;
    private _unlockRequirement?;
    private _retentionText;
    private _experience;
    private _hired;
    private _timeSinceWork;
    private _level;
    private _progressToNextLevel;
    private _rewardRetention;
    private _smartToolUsageChance;
    private _favoriteMineChance;
    private _shouldDiscoverFavorite;
    private _workCycleTime;
    private _allowedEnergyRestores;
    selectedEnergyRestore: PureComputed<EnergyRestoreSize | -1>;
    private _trackedStolenItems;
    constructor(options: UndergroundHelperParams);
    isUnlocked(): boolean;
    tick(delta: number): void;
    private _workAction;
    private getSmartCoordinate;
    tryUseEnergyPotion(): void;
    hire(): void;
    fire(): void;
    toggleEnergyRestore(energyRestore: EnergyRestoreSize): void;
    hasAllowedEnergyRestore(energyRestore: EnergyRestoreSize): boolean;
    addExp(experience: number): void;
    retainItem(item: UndergroundItem, amount: number): void;
    hasStolenItem(stolenItemID: number): boolean;
    get id(): string;
    get name(): string;
    get images(): string[];
    get hired(): boolean;
    get experience(): number;
    get level(): number;
    get progressToNextLevel(): number;
    get rewardRetention(): number;
    get retentionText(): string;
    get smartToolUsageChance(): number;
    get favoriteMine(): MineType;
    get favoriteMineChance(): number;
    get shouldDiscoverFavorite(): boolean;
    set shouldDiscoverFavorite(value: boolean);
    get canGenerateSpecial(): boolean;
    get timeSinceWork(): number;
    get workCycleTime(): number;
    toJSON(): Record<string, any>;
    fromJSON(json: any): void;
    static convertLevelToExperience(level: number): number;
    static convertExperienceToLevel(experience: number): number;
}
declare class UndergroundHelpers {
    static list: Array<UndergroundHelper>;
    available: PureComputed<UndergroundHelper[]>;
    hired: PureComputed<UndergroundHelper[]>;
    canHire: PureComputed<boolean>;
    constructor();
    toJSON(): Record<string, any>[];
    fromJSON(json: Array<any>): void;
    static add(helper: UndergroundHelper): void;
}

