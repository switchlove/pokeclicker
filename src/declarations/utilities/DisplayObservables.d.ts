/// <reference path="knockout.d.ts"/>
declare enum BootstrapState {
    'hidden' = "hidden",
    'hide' = "hide",
    'show' = "show"
}
declare const modalState: Record<string, BootstrapState | Observable<BootstrapState>>;
declare const collapseState: Record<string, BootstrapState | Observable<BootstrapState>>;

