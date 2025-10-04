/// <reference path="knockout.d.ts"/>
/// <reference path="./DayCycleMoment.d.ts"/>
/// <reference path="./DayCyclePart.d.ts"/>
declare class DayCycle {
    static currentDayCyclePart: Computed<DayCyclePart>;
    static image: Computed<string>;
    static color: Computed<string>;
    static tooltip: Computed<string>;
    static dayCycleMoments: Record<DayCyclePart, DayCycleMoment>;
}
