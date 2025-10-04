/// <reference path="./mine/MineConfig.d.ts"/>
/// <reference path="./UndergroundItem.d.ts"/>
/// <reference path="knockout.d.ts"/>
/// <reference path="./helper/UndergroundHelper.d.ts"/>
/// <reference path="./mine/Mine.d.ts"/>
/// <reference path="./tools/UndergroundToolType.d.ts"/>
declare const UNDERGROUND_MAX_CLICKS_PER_SECOND = 20;
declare class UndergroundController {
    private static lastMineClick;
    static organisedTreasuresList: PureComputed<{
        title: string;
        treasures: UndergroundItem[];
    }[]>;
    static shortcutVisible: PureComputed<boolean>;
    static rotateMatrix90Clockwise<T>(matrix: Array<Array<T>>, rotations?: number): Array<Array<T>>;
    static calculateRewardAmountFromMining(): number;
    static generateMineConfig(mineType: MineType, helper?: UndergroundHelper): MineConfig;
    static getMineConfig(mineType: MineType): MineConfig;
    static calculateDiscoverMineTimeout(mineType: MineType): number;
    static calculateSurveyRange(): number;
    static gainMineItem(id: number, amount?: number): void;
    static sellMineItem(item: UndergroundItem, amount?: number): void;
    static gainProfit(item: UndergroundItem, amount: number, percentage?: number): boolean;
    static openUndergroundModal(): void;
    static clickModalMineSquare(index: number): void;
    static handleCoordinatesMined(coordinates: Coordinate[], toolType: UndergroundToolType | null, helper?: UndergroundHelper): void;
    static calculateMineTileStyle(index: number): {
        'background-image'?: undefined;
        'background-position'?: undefined;
        'background-size'?: undefined;
        transform?: undefined;
        filter?: undefined;
    } | {
        'background-image': string;
        'background-position': string;
        'background-size': string;
        transform: string;
        filter: string;
    };
    static addGlobalUndergroundExp(experience: number): void;
    static addPlayerUndergroundExp(experience: number, share?: boolean): void;
    static addHiredHelperUndergroundExp(experience: number, share?: boolean): void;
    static notifyMineCompleted(helper?: UndergroundHelper): void;
    static notifyItemFound(item: UndergroundItem, amount: number, helper?: UndergroundHelper): void;
    static notifyItemDestroyed(item: UndergroundItem, amount: number, helper?: UndergroundHelper): void;
    static notifyHelperHired(helper: UndergroundHelper): void;
    static notifyHelperFired(helper: UndergroundHelper): void;
    static notifyHelperItemRetention(item: UndergroundItem, amount: number, helper: UndergroundHelper): void;
    static notifyBatteryFull(): void;
    private static buildHelperNotificationTitle;
    private static organisedTreasuresListCompareBy;
}
