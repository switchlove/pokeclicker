/// <reference path="./BooleanSetting.d.ts"/>
declare class NotificationSetting {
    name: string;
    defaultDisplayName: string;
    warnOnBlocked: () => void;
    inGameNotification: BooleanSetting;
    desktopNotification: BooleanSetting;
    private cachedTranslatedName;
    constructor(name: string, defaultDisplayName: string, defaultValueInGame: boolean, lockInGame?: boolean);
    get displayName(): string;
}
