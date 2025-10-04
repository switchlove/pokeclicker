/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare class TypeHelper {
    static readonly typeColors: string[];
    static readonly typeColorsLocked: string[];
    static typeMatrix: Array<Array<number>>;
    static getAttackModifier(a1: PokemonType, a2: PokemonType, d1: PokemonType, d2: PokemonType): number;
    static typeToValue(type: TypeEffectiveness): TypeEffectivenessValue;
    static valueToType(value: TypeEffectivenessValue): TypeEffectiveness;
}
