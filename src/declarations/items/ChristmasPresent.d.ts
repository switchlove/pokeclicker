/// <reference path="./Item.d.ts"/>
declare class ChristmasPresent extends Item {
    size: number;
    constructor(size?: number);
    gain(): void;
    get description(): string;
}
