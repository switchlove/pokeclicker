/// <reference path="knockout.d.ts"/>
/// <reference path="./SettingOption.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
declare class Setting<T> {
    name: string;
    private _defaultDisplayName;
    private _options;
    defaultValue: T;
    requirement: Requirement;
    saveAsDefault: boolean;
    private _value;
    private readonly _observable;
    readonly observableValue: KnockoutComputed<T>;
    private computedOptions;
    private cachedTranslatedName;
    constructor(name: string, _defaultDisplayName: string, _options: SettingOption<T>[] | (() => SettingOption<T>[]), defaultValue: T, requirement?: Requirement, saveAsDefault?: boolean);
    get value(): T;
    set value(value: T);
    get options(): SettingOption<T>[];
    set(value: T): void;
    validValue(value: T): boolean;
    isSelected(value: T): KnockoutComputed<boolean>;
    isValueUnlocked(value: T): boolean;
    isUnlocked(): boolean;
    getValidOptions(): SettingOption<T>[];
    get displayName(): string;
    get defaultDisplayName(): string;
}
