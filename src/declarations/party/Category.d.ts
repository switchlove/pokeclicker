/// <reference path="knockout.d.ts"/>
/// <reference path="../DataStore/common/Saveable.d.ts"/>
type PokemonCategory = {
    id: number;
    name: KnockoutObservable<string>;
    color: KnockoutObservable<string>;
    subscriber?: KnockoutSubscription;
};
declare class PokemonCategories implements Saveable {
    static categories: KnockoutObservableArray<PokemonCategory>;
    static playerCategories: import("knockout").PureComputed<PokemonCategory[]>;
    static categoryAssignEnabled: KnockoutObservable<boolean>;
    static categoryAssignSelected: KnockoutObservable<number>;
    saveKey: string;
    defaults: Record<string, any>;
    static initialize(): void;
    static reset(): void;
    static addCategory(name: string, color: string, id?: number): void;
    static removeCategory(id: number, force?: boolean): void;
    static getCategoryById(id: number): PokemonCategory;
    toJSON(): Record<string, any>;
    fromJSON(json: Record<string, any>): void;
}
