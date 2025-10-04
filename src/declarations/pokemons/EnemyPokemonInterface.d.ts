/// <reference path="knockout.d.ts"/>
/// <reference path="../interfaces/Pokemon.d.ts"/>
/// <reference path="../wallet/Amount.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
declare interface EnemyPokemonInterface extends PokemonInterface {
    health: number | Observable<number>;
    maxHealth: number | Observable<number>;
    level: number;
    catchRate: number;
    exp: number;
    reward: Amount;
    shadow: ShadowStatus;
    isAlive(): boolean;
    damage(damage: number): void;
}
