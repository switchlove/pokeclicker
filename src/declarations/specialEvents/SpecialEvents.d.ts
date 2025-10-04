/// <reference path="knockout.d.ts"/>
/// <reference path="../DataStore/common/Feature.d.ts"/>
/// <reference path="./SpecialEvent.d.ts"/>
/// <reference path="./SpecialEventTitleType.d.ts"/>
declare class SpecialEvents implements Feature {
    name: string;
    saveKey: string;
    defaults: Record<string, any>;
    counter: number;
    events: SpecialEvent[];
    activeEventCount: PureComputed<number>;
    constructor();
    newEvent(title: SpecialEventTitleType, description: string, startTime: Date, startFunction: EventCallback, endTime: Date, endFunction: EventCallback, hideFromEventCalendar?: boolean): void;
    initialize(): void;
    fromJSON(json: any): void;
    toJSON(): {
        events: {
            name: SpecialEventTitleType;
            eventCalendarTimeLeft: number;
        }[];
    };
    canAccess(): boolean;
    update(delta: number): void;
    getEvent(eventName: SpecialEventTitleType): SpecialEvent;
    tick(): void;
    addEvents(): void;
}
