/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="./RoutePokemon.d.ts"/>
declare class RegionRoute {
    routeName: string;
    region: Region;
    number: number;
    pokemon: RoutePokemon;
    requirements: Requirement[];
    orderNumber?: number;
    subRegion?: number;
    ignoreRouteInCalculations: boolean;
    routeHealth: any;
    constructor(routeName: string, region: Region, number: number, pokemon: RoutePokemon, requirements?: Requirement[], orderNumber?: number, subRegion?: number, ignoreRouteInCalculations?: boolean, routeHealth?: any);
    isUnlocked(): boolean;
}
