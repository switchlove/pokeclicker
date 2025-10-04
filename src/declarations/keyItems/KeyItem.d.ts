/// <reference path="knockout.d.ts"/>
/// <reference path="../enums/KeyItemType.d.ts"/>
declare class KeyItem {
    unlockRewardOnClose: () => void;
    unlockRewardOnUnlock: () => void;
    id: KeyItemType;
    displayName: string;
    description: string;
    unlockReq: KnockoutComputed<boolean>;
    unlocker: KnockoutSubscription;
    isUnlocked: KnockoutObservable<boolean>;
    constructor(id: KeyItemType, description: string, unlockReq?: () => boolean, isUnlocked?: boolean, unlockRewardOnClose?: () => void, displayName?: string, unlockRewardOnUnlock?: () => void);
    unlock(): void;
}
