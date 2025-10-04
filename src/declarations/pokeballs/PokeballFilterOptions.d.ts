/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../settings/Setting.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
/// <reference path="../enums/PokemonType.d.ts"/>
/// <reference path="../enums/EncounterType.d.ts"/>
declare class PokeballFilterOption<T, M = T> {
    createSetting: (defaultVal?: T, name?: string, defaultName?: string) => Setting<T>;
    describe: (value: T) => string;
    requirement?: Requirement;
    matchTest: (optionValue: T, testValue: M) => boolean;
    defaultSetting: Setting<T>;
    constructor(createSetting: (defaultVal?: T, name?: string, defaultName?: string) => Setting<T>, describe: (value: T) => string, requirement?: Requirement, matchTest?: (optionValue: T, testValue: M) => boolean);
    canUse(): boolean;
}
declare const pokeballFilterOptions: {
    shiny: PokeballFilterOption<boolean, boolean>;
    shadow: PokeballFilterOption<boolean, boolean>;
    caught: PokeballFilterOption<boolean, boolean>;
    caughtShiny: PokeballFilterOption<boolean, boolean>;
    caughtShadow: PokeballFilterOption<boolean, boolean>;
    pokerus: PokeballFilterOption<Pokerus, Pokerus>;
    pokemonType: PokeballFilterOption<PokemonType, [PokemonType, PokemonType]>;
    encounterType: PokeballFilterOption<EncounterType, EncounterType>;
    category: PokeballFilterOption<number, number[]>;
};
type PokeballFilterValueType<T> = T extends PokeballFilterOption<infer K> ? K : never;
type PokeballFilterMatchType<T> = T extends PokeballFilterOption<any, infer M> ? M : never;
type PokeballFilterOptions = Partial<{
    [K in keyof typeof pokeballFilterOptions]: PokeballFilterValueType<typeof pokeballFilterOptions[K]>;
}>;
type PokeballFilterMatchData = {
    [K in keyof typeof pokeballFilterOptions]: PokeballFilterMatchType<typeof pokeballFilterOptions[K]>;
};

