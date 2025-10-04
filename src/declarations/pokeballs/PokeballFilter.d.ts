/// <reference path="knockout.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="../settings/Setting.d.ts"/>
/// <reference path="./PokeballFilterOptions.d.ts"/>
type PokeballFilterParams = {
    name: string;
    options: PokeballFilterOptions;
    ball?: Pokeball;
    inverted?: boolean;
    enabled?: boolean;
};
declare class PokeballFilter {
    ball: Observable<Pokeball>;
    _options: Observable<{
        [K in keyof PokeballFilterOptions]: Setting<PokeballFilterOptions[K]>;
    }>;
    _name: Observable<string>;
    enabled: Observable<boolean>;
    inverted: Observable<boolean>;
    uuid: string;
    constructor(name: string, options: PokeballFilterOptions, ball?: Pokeball, enabled?: boolean, inverted?: boolean);
    test(data: PokeballFilterMatchData): boolean;
    get description(): string;
    get name(): string;
    set name(value: string);
    get options(): Unwrapped<typeof this._options>;
    set options(value: Unwrapped<typeof this._options>);
    toJSON(): Required<PokeballFilterParams>;
}
