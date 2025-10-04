declare enum SortOptions {
    id = 0,
    name = 1,
    attack = 2,
    level = 3,
    shiny = 4,
    attackMaxLevel = 5,
    baseAttack = 6,
    attackBonus = 7,
    breedingEfficiency = 8,
    eggCycles = 9,
    timesHatched = 10,
    category = 11,
    vitaminsUsed = 12,
    evs = 13
}
type SortOptionConfig = {
    text: string;
    getValue: (p: any) => any;
    invert?: boolean;
};
declare const SortOptionConfigs: Record<SortOptions, SortOptionConfig>;
