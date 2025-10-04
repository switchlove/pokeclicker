/// <reference path="knockout.d.ts"/>
declare interface SkippableRateLimit extends Subscribable<unknown> {
    evaluateEarly: () => void;
}
declare module 'knockout' {
    interface ExtendersOptions {
        numeric: number;
        boolean: true;
        arrayEquals: true;
        skippableRateLimit: number;
    }
}
