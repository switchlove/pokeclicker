/// <reference path="../requirements/Requirement.d.ts"/>
declare class RedeemableCode {
    name: string;
    hash: number;
    isRedeemed: boolean;
    private rewardFunction;
    private requirement;
    constructor(name: string, hash: number, isRedeemed: boolean, rewardFunction: () => Promise<boolean | undefined>, requirement?: Requirement);
    redeem(): Promise<void>;
}
