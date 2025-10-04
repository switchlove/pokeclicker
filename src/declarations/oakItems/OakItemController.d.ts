/// <reference path="../enums/OakItemType.d.ts"/>
declare class OakItemController {
    private static inspectedItemKO;
    private static selectedItemKO;
    static click(item: OakItemType): void;
    static hover(item: OakItemType): void;
    static hoverRelease(): void;
    static get inspectedItem(): OakItemType;
    static set inspectedItem(item: OakItemType);
    static get selectedItem(): OakItemType;
    static set selectedItem(item: OakItemType);
}
