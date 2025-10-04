declare class OakItemLoadout {
    name: ko.Observable<string>;
    loadout: ko.ObservableArray<number>;
    constructor(name: string, loadout?: Array<number>);
    static copy(old: OakItemLoadout): OakItemLoadout;
}
