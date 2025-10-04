/// <reference path="./DayCyclePart.d.ts"/>
declare class DayCycleMoment {
    part: DayCyclePart;
    color: string;
    description: string;
    constructor(part: DayCyclePart, color: string, description: string);
    get tooltip(): string;
}
