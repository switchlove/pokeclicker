/// <reference path="./UndergroundItem.d.ts"/>
declare enum SortOptions {
    default = 0,
    name = 1,
    quantity = 2,
    value = 3
}
type SortOptionConfig = {
    text: string;
    getValue: (treasure: UndergroundItem) => any;
    invert?: boolean;
};
declare const SortOptionConfigs: Record<SortOptions, SortOptionConfig>;
