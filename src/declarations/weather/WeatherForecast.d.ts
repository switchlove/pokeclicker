/// <reference path="knockout.d.ts"/>
/// <reference path="../enums/WeatherForecastStatus.d.ts"/>
/// <reference path="./WeatherType.d.ts"/>
declare class WeatherForecast {
    date: Date;
    weatherType: WeatherType;
    status: Observable<WeatherForecastStatus>;
    constructor(date: Date, weatherType: WeatherType, status?: WeatherForecastStatus);
    setStatusHasPassed(): void;
}
