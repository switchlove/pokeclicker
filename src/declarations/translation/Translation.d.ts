/// <reference path="i18next.d.ts"/>
/// <reference path="knockout.d.ts"/>
/// <reference path="../settings/Setting.d.ts"/>
/// <reference path="./Language.d.ts"/>
/// <reference path="../pokemons/PokemonNameType.d.ts"/>
type TranslationNamespace = 'pokemon' | 'logbook' | 'settings' | 'questlines';
type TranslationVar = string | number | PokemonNameType;
type TranslationVars = Record<string, TranslationVar>;
declare class Translate {
    private languageUpdated;
    cachedTranslationDefaults?: Record<string, TranslationVars>;
    get: (key: string, namespace: string, otherOptions?: TOptions<import("i18next").StringMap>) => PureComputed<string>;
    constructor(languageSetting: Setting<Language>);
    translationHashKey(key: string, defaultValue: string): string;
    /**
     * Combines the translation key with a hash of the default text, making the key change whenever the default text does.
     * This invalidates outdated translations instead of risking the translations becoming inaccurate.
     */
    getHashed(key: string, namespace: string, defaultValue: string, otherOptions?: TOptions): PureComputed<string>;
    private cacheDefaultValue;
}
