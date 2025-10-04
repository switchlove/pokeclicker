/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class GameStateRequirement extends Requirement {
    gameState: GameState;
    constructor(gameState: GameState, expect?: boolean);
    getProgress(): number;
    hint(): string;
}
