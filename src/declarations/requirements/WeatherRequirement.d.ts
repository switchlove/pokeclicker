/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../weather/WeatherType.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class WeatherRequirement extends Requirement {
    private weather;
    constructor(weather: WeatherType[], option?: AchievementOption);
    getProgress(): number;
    hint(): string;
}
