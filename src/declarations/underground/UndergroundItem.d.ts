/// <reference types="knockout" />
/// <reference path="../enums/UndergroundItemValueType.d.ts"/>
/// <reference path="../requirements/Requirement.d.ts"/>
declare class UndergroundItem {
    id: number;
    itemName: string;
    space: Array<Array<number>>;
    value: number;
    valueType: UndergroundItemValueType;
    requirement?: Requirement;
    type?: number;
    private weight;
    private customWeight?;
    sellLocked: KnockoutObservable<boolean>;
    constructor(id: number, itemName: string, space: Array<Array<number>>, value?: number, valueType?: UndergroundItemValueType, requirement?: Requirement, weight?: (() => number) | number);
    isUnlocked(): boolean;
    isSellable(): boolean;
    hasSellValue(): boolean;
    toggleSellLock(): void;
    get displayName(): string;
    get name(): string;
    get image(): string;
    get undergroundImage(): string;
    getWeight(): number;
}
