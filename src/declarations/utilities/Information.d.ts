/// <reference path="intro.js.d.ts"/>
declare class Information {
    static defaultOptions: {
        showStepNumbers: boolean;
        hideNext: boolean;
        hidePrev: boolean;
        exitOnOverlayClick: boolean;
        showBullets: boolean;
    };
    static show(options?: introJs.Options): introJs.IntroJs;
    static hide(): introJs.IntroJs;
}
