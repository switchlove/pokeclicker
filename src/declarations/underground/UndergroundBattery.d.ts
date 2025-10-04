/// <reference path="./mine/Mine.d.ts"/>
/// <reference path="knockout.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
type Pattern = Array<Array<{
    coordinate: Coordinate;
    depth: number;
}>>;
declare class UndergroundBatteryPattern {
    private _id;
    private _tier;
    private _weight;
    private _pattern;
    private _tilesCleared;
    private _requirement?;
    canAccess: PureComputed<boolean>;
    constructor(id: string, tier: number, pattern: Pattern, requirement?: Requirement);
    get hint(): string;
    get id(): string;
    get name(): string;
    get tier(): number;
    get pattern(): Pattern;
    get weight(): number;
}
declare class UndergroundBattery {
    private _charges;
    private _batteryCooldown;
    private static _patterns;
    private _activeDischargePattern;
    private _activeDischargeFrame;
    canDischarge: PureComputed<boolean>;
    static addPattern(pattern: UndergroundBatteryPattern): void;
    initialize(): void;
    update(delta: number): void;
    charge(): void;
    discharge(): void;
    private handleDischargingPattern;
    get charges(): number;
    get maxCharges(): number;
    get patterns(): UndergroundBatteryPattern[];
    fromJSON(save: any): void;
    toJSON(): {
        charges: number;
        batteryCooldown: number;
        activeDischargeID: string;
        activeDischargeFrame: number;
    };
}
