/// <reference path="./WeatherForecast.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="knockout.d.ts"/>
declare class RegionalForecast {
    region: Region;
    weatherForecastList: ObservableArray<Array<WeatherForecast>>;
    constructor(region: Region, weatherForecastList?: Array<Array<WeatherForecast>>);
}
