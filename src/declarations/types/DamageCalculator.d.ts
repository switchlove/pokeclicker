/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../weather/WeatherType.d.ts"/>
/// <reference path="../TemporaryScriptTypes.d.ts"/>
declare class DamageCalculator {
    static type1: import("knockout").Observable<PokemonType>;
    static type2: import("knockout").Observable<PokemonType>;
    static region: import("knockout").Observable<Region>;
    static subregion: import("knockout").Observable<number>;
    static weather: import("knockout").Observable<WeatherType>;
    static includeBreeding: import("knockout").Observable<boolean>;
    static baseAttackOnly: import("knockout").Observable<boolean>;
    static ignoreLevel: import("knockout").Observable<boolean>;
    static detailType: import("knockout").Observable<PokemonType>;
    static observableTypeDamageArray: import("knockout").PureComputed<number[]>;
    static observableTypeDetails: import("knockout").PureComputed<TypeDetail[]>;
    static observableTotalDamage: import("knockout").PureComputed<number>;
    static initialize(): void;
    static totalDamage(): number;
    static getDamageByTypes(): number[];
    static getOneTypeDetail(pokemon: TmpPartyPokemonType): TypeDetail;
    static getTypeDetail(): TypeDetail[];
}
type TypeDetail = {
    id: number;
    name: string;
    type1: PokemonType;
    type2: PokemonType;
    damage: number;
    displayName: string;
};
