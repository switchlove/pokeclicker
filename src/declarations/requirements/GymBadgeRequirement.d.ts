/// <reference path="../enums/Badges.d.ts"/>
/// <reference path="../GameConstants.d.ts"/>
/// <reference path="./Requirement.d.ts"/>
declare class GymBadgeRequirement extends Requirement {
    badge: BadgeEnums;
    constructor(badge: BadgeEnums, option?: GameConstants.AchievementOption);
    getProgress(): number;
    hint(): string;
}
