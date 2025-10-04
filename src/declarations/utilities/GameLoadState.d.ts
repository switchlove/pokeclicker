declare enum LoadingStates {
    none = -1,
    initialized = 0,
    appliedBindings = 1,
    running = 2
}
declare class GameLoadState {
    static readonly states: typeof LoadingStates;
    static getLoadState(): LoadingStates;
    static reachedLoadState(state: LoadingStates): boolean;
    /**
     *  Should only be set by App.ts
     */
    static updateLoadState(newState: LoadingStates): void;
    /**
     * Runs a callback function once the game has reached a given step of the load process. If the game has
     * already reached that step, the callback function will run immediately.
     *
     * @param targetState - Load state upon which to run the callback function
     * @param callback - Function run after the desired state of loading
     * @param [exactState=false] - If set to true, will only run [callback] while the loading state is *exactly* [targetState], and will throw an error if already past [targetState]
     *
     */
    static onLoadState(targetState: LoadingStates, callback: () => void, exactState?: boolean): void;
}

