/// <reference types="knockout" />
/// <reference path="./SpecialEventsNotifiedStatus.d.ts"/>
/// <reference path="../notifications/NotificationOption.d.ts"/>
/// <reference path="./SpecialEventTitleType.d.ts"/>
type EventCallback = () => void;
declare enum SpecialEventStatus {
    none = 0,
    started = 1,
    ended = 2
}
declare class SpecialEvent {
    title: SpecialEventTitleType;
    description: string;
    status: KnockoutObservable<SpecialEventStatus>;
    startTime: Date;
    startFunction: EventCallback;
    endTime: Date;
    endFunction: EventCallback;
    hideFromEventCalendar: boolean;
    eventCalendarTimeLeft: KnockoutObservable<number>;
    isActive: KnockoutObservable<boolean>;
    notified: SpecialEventNotifiedStatus;
    constructor(title: SpecialEventTitleType, description: string, startTime: Date, startFunction: EventCallback, endTime: Date, endFunction: EventCallback, hideFromEventCalendar: boolean);
    initialize(): void;
    shouldStartNow(): boolean;
    timeTillStart(): number;
    timeTillEnd(): number;
    hasStarted(): boolean;
    hasEnded(): boolean;
    timeLeft(): string;
    tick(): void;
    eventCalendarActivate(): void;
    notify(time: string, timeout: number, type?: NotificationOption): void;
    checkStart(): void;
    start(): void;
    checkEnd(): void;
    end(): void;
    updateDate(): void;
    fromJSON(json: any): void;
    toJSON(): {
        name: SpecialEventTitleType;
        eventCalendarTimeLeft: number;
    };
}
