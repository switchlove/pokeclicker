/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Consumable.d.ts"/>
/// <reference path="./types.d.ts"/>
declare class AttackGainConsumable extends Consumable {
    bonusMultiplier: number;
    constructor(type: ConsumableType, basePrice: number, currency?: Currency, options?: ShopOptions, displayName?: string, description?: string, bonusMultiplier?: number, canUse?: (pokemon: any) => boolean);
}
