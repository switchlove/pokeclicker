/// <reference path="../../GameConstants.d.ts"/>
/// <reference path="../../items/ItemNameType.d.ts"/>
/// <reference path="../../quests/QuestLineNameType.d.ts"/>
/// <reference path="../../weather/WeatherType.d.ts"/>
/// <reference path="./Base.d.ts"/>
/// <reference path="../../dayCycle/DayCyclePart.d.ts"/>
/// <reference path="../../moonCycle/MoonCyclePhase.d.ts"/>
type EvoFn = (...args: unknown[]) => EvoData;
declare const anyDungeonRestrict: (evo: EvoFn) => (...rest: Parameters<EvoFn>) => EvoData;
declare const dungeonRestrict: <T extends EvoFn>(evo: T) => (dungeon: string, ...rest: Parameters<T>) => EvoData;
declare const anyGymRestrict: (evo: EvoFn) => (...rest: Parameters<EvoFn>) => EvoData;
declare const GymRestrict: <T extends EvoFn>(evo: T) => (town: string, ...rest: Parameters<T>) => EvoData;
declare const regionRestrict: <T extends EvoFn>(evo: T) => (regions: Region[], ...rest: Parameters<T>) => EvoData;
declare const environmentRestrict: <T extends EvoFn>(evo: T) => (environment: Environment, ...rest: Parameters<T>) => EvoData;
declare const heldItemRestrict: <T extends EvoFn>(evo: T) => (heldItemName: ItemNameType, ...rest: Parameters<T>) => EvoData;
declare const questlineRestrict: <T extends EvoFn>(evo: T) => (questName: QuestLineNameType, ...rest: Parameters<T>) => EvoData;
declare const weatherRestrict: <T extends EvoFn>(evo: T) => (weather: WeatherType[], ...rest: Parameters<T>) => EvoData;
declare const dayCyclePartRestrict: <T extends EvoFn>(evo: T) => (dayCycleParts: DayCyclePart[], ...rest: Parameters<T>) => EvoData;
declare const dayRestrict: <T extends EvoFn>(evo: T) => (...rest: Parameters<T>) => EvoData;
declare const nightRestrict: <T extends EvoFn>(evo: T) => (...rest: Parameters<T>) => EvoData;
declare const moonCyclePhaseRestrict: <T extends EvoFn>(evo: T) => (moonCyclePhases: MoonCyclePhase[], ...rest: Parameters<T>) => EvoData;
declare const megaEvolveRestrict: <T extends EvoFn>(evo: T) => (megaStone: MegaStoneType, ...rest: Parameters<T>) => EvoData;
declare const attackRestrict: <T extends EvoFn>(evo: T) => (attackValue: number, isMultiplier: boolean, ...rest: Parameters<T>) => EvoData;
