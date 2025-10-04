/// <reference path="../enums/KeyItemType.d.ts"/>
declare class KeyItemController {
    private static inspectedItem;
    private static selectedItem;
    private static latestGainedItem;
    static showGainModal(item: KeyItemType): void;
    static hover(item: KeyItemType): void;
    static hoverRelease(): void;
}
