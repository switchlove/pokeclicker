/// <reference path="../../GameConstants.d.ts"/>
/// <reference path="../../requirements/Requirement.d.ts"/>
/// <reference path="../PokemonNameType.d.ts"/>
declare enum EvoTrigger {
    NONE = 0,
    LEVEL = 1,
    STONE = 2
}
declare interface EvoData {
    basePokemon: PokemonNameType;
    evolvedPokemon: PokemonNameType;
    trigger: EvoTrigger;
    restrictions: Array<Requirement>;
    ignoreECChange: boolean;
}
declare interface DummyEvoData extends EvoData {
}
declare interface LevelEvoData extends EvoData {
}
declare interface StoneEvoData extends EvoData {
    stone: StoneType;
}
declare const beforeEvolve: Partial<Record<EvoTrigger, (data: EvoData) => boolean>>;
declare const Evo: (basePokemon: PokemonNameType, evolvedPokemon: PokemonNameType, trigger: EvoTrigger, ignoreECChange: any) => EvoData;
declare const restrict: <T extends EvoData>(evo: T, ...restrictions: EvoData['restrictions']) => T;
declare const DummyEvolution: (basePokemon: PokemonNameType, evolvedPokemon: PokemonNameType) => DummyEvoData;
declare const LevelEvolution: (basePokemon: PokemonNameType, evolvedPokemon: PokemonNameType, level: number, ignoreECChange?: boolean) => LevelEvoData;
declare const StoneEvolution: (basePokemon: PokemonNameType, evolvedPokemon: PokemonNameType, stone: StoneType, ignoreECChange?: boolean) => StoneEvoData;
