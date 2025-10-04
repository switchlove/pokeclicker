/// <reference path="../gym/GymPokemon.d.ts"/>
declare class Trainer {
    trainerClass: string;
    private team;
    subTrainerClass?: string;
    name: string;
    constructor(trainerClass: string, team: GymPokemon[], name?: string, subTrainerClass?: string);
    get image(): string;
    getTeam(): GymPokemon[];
}
