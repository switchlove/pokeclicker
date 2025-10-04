/// <reference path="knockout.d.ts"/>
/// <reference path="./RegionalForecast.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../requirements/ClearDungeonRequirement.d.ts"/>
declare class WeatherApp {
    saveKey: string;
    defaults: Record<string, any>;
    static fullForecast: ObservableArray<RegionalForecast>;
    static selectedRegion: Observable<Region>;
    static dateList: ObservableArray<Date>;
    static defaultDateRange: number;
    static shortcutRequirement: ClearDungeonRequirement;
    static shortcutVisible: import("knockout").PureComputed<boolean>;
    /**
     * Generates the forecasts for all regions
     */
    static generateAllRegionsForecast(): void;
    /**
     * Generates the forecast for a single region
     * @param region
     * @param dateRange
     * @param date
     */
    static generateRegionalForecast(region: Region, dateRange?: number, date?: Date): void;
    /**
     * Generate the date list for the table
     * @param dateRange
     * @param date
     */
    static generateDateList(dateRange?: number, date?: Date): void;
    /**
     * Generate the hour list for the table
     * @returns number[]
     */
    static generateHourList(): any[];
    /**
     * Adds the regional forecast to the forecast list
     * @param regionalForecast
     */
    static addRegionalForecast(regionalForecast: RegionalForecast): void;
    /**
     * Checks if the date in the weather forecast has already passed and set the status if it does
     */
    static checkDateHasPassed(): void;
    /**
     * Functions to initialize on load
     */
    static initialize(): void;
    /**
     * Checks if the Weather App is unlocked
     * @returns boolean
     */
    static isUnlocked(): boolean;
    /**
     * Opens the Weather App modal.
     */
    static openWeatherAppModal(): void;
    fromJSON(json: any): void;
    toJSON(): {
        selectedRegion: Region;
    };
}
