/// <reference path="knockout.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./PokemonNameType.d.ts"/>
/// <reference path="./DataPokemon.d.ts"/>
/// <reference path="../items/MegaStoneItem.d.ts"/>
/// <reference path="../TemporaryScriptTypes.d.ts"/>
declare namespace PokemonHelper {
declare function calcNativeRegion(pokemonName: PokemonNameType): number;
declare function calcUniquePokemonsByRegion(region: Region): number;
declare function getPokemonById(id: number): DataPokemon;
declare function getPokemonByName(name: PokemonNameType): DataPokemon;
declare function typeStringToId(id: string): any;
declare function typeIdToString(id: number): string;
declare function getImage(pokemonId: number, shiny?: boolean, gender?: BattlePokemonGender, shadow?: ShadowStatus): string;
declare function getPokeballImage(pokemonName: PokemonNameType): string;
declare function displayName(englishName: string): Computed<string>;
declare function matchPokemonByNames(pattern: RegExp, pokemonName: PokemonNameType, pokemon?: TmpPartyPokemonType): boolean;
declare function hasMegaEvolution(pokemonName: PokemonNameType): boolean;
declare function hasUncaughtMegaEvolution(pokemonName: PokemonNameType): boolean;
declare function isMegaEvolution(pokemonName: PokemonNameType): boolean;
declare function getMegaStones(pokemonName: PokemonNameType): MegaStoneItem[];
declare function hasGigantamaxForm(pokemonName: PokemonNameType): boolean;
declare function hasUncaughtGigantamaxForm(pokemonName: PokemonNameType): boolean;
declare function isGigantamaxForm(pokemonName: PokemonNameType): boolean;
declare const getAllShadowPokemon: import("knockout").PureComputed<Set<PokemonNameType>>;
declare function incrementPokemonStatistics(pokemonId: number, statistic: PokemonStatisticsType, shiny: boolean, gender: BattlePokemonGender, shadow: ShadowStatus): void;
}
