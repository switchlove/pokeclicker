/**
 * Update Shop css to reflect ShopMon
 */
Shop.prototype.areaStatus = function() {
    let status = [areaStatus.completed];
    let pkmItems = this.items.filter(item => item instanceof CaughtIndicatingItem);
    for (let pkm of pkmItems) {
        if (!App.game.breeding.canAccess() && pkm instanceof EggItem) {
            continue;
        }
        switch (pkm.getCaughtStatus()) {
            case CaughtStatus.NotCaught:
                status.push(areaStatus.uncaughtPokemon);
                break;
            case CaughtStatus.Caught:
                status.push(areaStatus.uncaughtShinyPokemon);
                break;
        }
    }
    return Math.min(...status);
};

//#region Custom Requirements
function switchRequirement(req) {
    switch (req?.constructor.name) {
        case 'MultiRequirement':
        case 'OneFromManyRequirement':
            req.requirements = req.requirements.map(switchRequirement);
            return req;
        case 'RouteKillRequirement':
            return new RouteShinyRequirement(req.region, req.route);
        case 'ClearDungeonRequirement':
            return new DungeonShinyRequirement(GameConstants.RegionDungeons.flat()[req.dungeonIndex]);
        default:
            return req;
    }
}

/** For object with {requirement} */
class ChallengeRequirement extends Requirement {
    constructor(
        originalRequirement,
        newRequirements,
        override = false
    ) {
        super(1, GameConstants.AchievementOption.more);
        this.originalRequirement = originalRequirement;
        this.newRequirements = newRequirements;
        this.override = override;
    }

    get requirements() {
        if (!App.game?.challenges.list.shinyMovement?.active()) {
            return [this.originalRequirement];
        } else {
            if (this.override) {
                return this.newRequirements;
            } else {
                return [this.originalRequirement, ...this.newRequirements];
            }
        }
    }

    static set(place, ...requirements) {
        let oldReq = place.requirement;
        place.requirement = new this(oldReq, requirements, true);
    }

    static add(place, ...requirements) {
        let oldReq = place.requirement;
        place.requirement = new this(oldReq, requirements);
    }

    isCompleted() {
        return this.requirements.every(r => r.isCompleted());
    }

    hint() {
        return '';
    }
}

/** For object with {req} */
class ChallengeReq extends ChallengeRequirement {
    static set(place, ...requirements) {
        let oldReq = place.req;
        place.req = new this(oldReq, requirements, true);
    }

    static add(place, ...requirements) {
        let oldReq = place.req;
        place.req = new this(oldReq, requirements);
    }
}

/** For object with {requirements} */
class ChallengeRequirements extends Requirement {
    constructor(
        originalRequirements,
        newRequirements,
        override = false
    ) {
        super(1, GameConstants.AchievementOption.more);
        this.originalRequirements = originalRequirements.map(switchRequirement);
        this.newRequirements = newRequirements;
        this.override = override;
    }

    get requirements() {
        if (!App.game?.challenges.list.shinyMovement?.active()) {
            return this.originalRequirements;
        } else {
            if (this.override) {
                return this.newRequirements;
            } else {
                return [...this.originalRequirements, ...this.newRequirements];
            }
        }
    }

    set requiredValue(value) {}
    get requiredValue() {
        return this.requirements.length;
    }

    getProgress() {
        const completed = this.requirements.filter((req) => ChallengeRequirements.cache.has(req.key) || req.isCompleted()).length;
        return Math.min(completed, this.requiredValue);
    }

    static set(place, ...requirements) {
        let oldReq = place.requirements;
        place.requirements = [new this(oldReq, requirements, true)];
    }

    static add(place, ...requirements) {
        let oldReq = place.requirements;
        place.requirements = [new this(oldReq, requirements)];
    }

    static cache = new Set();
    isCompleted() {
        let check = super.isCompleted();
        for (let rdx = 0; rdx < this.requirements.length && check && App.game?.challenges.list.shinyMovement?.active(); rdx++) {
            const {key, parent} = this.requirements[rdx];
            if (!key || !ChallengeRequirements.cache.has(key)) {
                if (key) {
                    ChallengeRequirements.cache.add(key);
                }
                check = parent?.every(req => req.isCompleted()) ?? true;
                if (!check) {
                    ChallengeRequirements.cache.delete(key);
                }
            }
        }
        return check;
    }

    hint() {
        let reqsList = [];
        if (!super.isCompleted()) {
            reqsList = this.requirements.filter(req => !req.isCompleted()).map(req => req.hint());
        } else {
            reqsList = this.requirements.filter(({key, parent}) => !ChallengeRequirements.cache.has(key) && parent)
                .map(req => req.parent?.map(req => req.hint().split('\n'))).flat(2);
        }
        return  [...new Set(reqsList.filter(_ => _.length))].join('\n');
    }
}

class RouteShinyRequirement extends RouteKillRequirement {
    constructor(region, route) {
        super(GameConstants.ROUTE_KILLS_NEEDED, region, route);
        this.key = `route(${region},${route})`;
    }

    get parent() {
        return Routes.getRoute(this.region, this.route).requirements;
    }

    isCompleted() {
        return super.isCompleted() && (
            RouteHelper.routeCompleted(this.route, this.region, true)
            || !App.game?.challenges.list.shinyMovement?.active());
    }
}

class DungeonShinyRequirement extends ClearDungeonRequirement {
    constructor(name) {
        super(1, GameConstants.getDungeonIndex(name));
        this.town = TownList[name];
        this.key = `dungeon(${name})`;
    }

    get parent() {
        return this.town?.requirements;
    }

    isCompleted() {
        return super.isCompleted() && (
            DungeonRunner.dungeonCompleted(this.town?.dungeon, true)
            || !App.game?.challenges.list.shinyMovement?.active());
    }
}

class ObtainedPokemonShinyRequirement extends ObtainedPokemonRequirement {
    constructor(pokemon) {
        super(pokemon.name);
        this.isCompleted = () => super.isCompleted() && (pokemon.options?.requirement?.isCompleted() ?? true);
    }

    getProgress() {
        return App.game.party.alreadyCaughtPokemonByName(this.pokemon, true);
    }
}

class ItemsRequirement extends Requirement {
    constructor(...items) {
        super(CaughtStatus.CaughtShiny, GameConstants.AchievementOption.more);
        this.items = items.filter(item => item instanceof CaughtIndicatingItem);
    }

    isCompleted() {
        return this.items.every(item => {
            if (!App.game.breeding.canAccess() && item instanceof EggItem) {
                return true;
            }
            return (item.getCaughtStatus() ?? CaughtStatus.CaughtShiny) == CaughtStatus.CaughtShiny;
        });
    }

    hint() {
        const incomplete = this.items.filter(item => (item.getCaughtStatus() ?? CaughtStatus.CaughtShiny) != CaughtStatus.CaughtShiny);
        const output = [];

        const pkmn = incomplete.filter(item => item instanceof PokemonItem);
        if (pkmn.length > 0) {
            output.push(`${pkmn.map(item => item.displayName).join(' and ')} needs to be bought shiny.`);
        }

        const other = incomplete.filter(item => !(item instanceof PokemonItem));
        if (other.length > 0) {
            output.push(`${other.map(item => item.displayName).join(' and ')} still have some uses.`);
        }

        return output.join('\n');
    }
}

class SafariRequirement extends Requirement {
    constructor() {
        super(SafariPokemon.list.length, GameConstants.AchievementOption.more);
    }

    getProgress() {
        const completed = SafariPokemon.list.map(({name}) => App.game.party.getPokemonByName(name)?.shiny).filter(_ => _);
        return Math.min(completed.length, this.requiredValue);
    }

    hint() {
        return `Safari needs to be completed. (${this.getProgressPercentage()}%)`;
    }
}

class DockRequirement extends Requirement {
    isCompleted() {
        return !App.game?.challenges.list.shinyMovement?.active() || MapHelper.isRegionCleared(player.region - 1);
    }

    hint() {
        return 'You still have something to do in a previous region.';
    }
}

Object.defineProperty(GymBadgeRequirement.prototype, 'parent', {
    get: function() {
        if (this.option ==  GameConstants.AchievementOption.less) {
            return []
        }

        const gym = Object.values(GymList).find(({badgeReward}) => badgeReward == this.badge);
        if (gym.flags.champion && player.highestRegion() > gym.parent.region) {
            return [];
        }

        return [
            ...gym.parent.requirements,
            ...gym.requirements,
        ];
    },
});
Object.defineProperty(TemporaryBattleRequirement.prototype, 'parent', {
    get: function() {
        if (TemporaryBattleList[this.battleName].completeRequirements.every(r => r.isCompleted())) {
            return [];
        }
        return TemporaryBattleList[this.battleName].requirements;
    },
});
//#endregion

//#region once unlock, always unlock
const routeUnlock = RegionRoute.prototype.isUnlocked;
RegionRoute.prototype.isUnlocked = function () {
    ChallengeRequirements.cache.clear();
    if (!this.wasUnlock && App.game?.challenges.list.shinyMovement?.active()) {
        this.wasUnlock = App.game.statistics.routeKills[this.region][this.number]();
    }
    return routeUnlock.call(this) || this.wasUnlock;
};

const townUnlock = Town.prototype.isUnlocked;
Town.prototype.isUnlocked = function () {
    ChallengeRequirements.cache.clear();
    if (!this.wasUnlock  && App.game?.challenges.list.shinyMovement?.active()) {
        this.wasUnlock = townUnlock.call(this) || this.npcs?.some(n => n.talkedTo());
        if (this.dungeon || this.content.some(c => c instanceof MoveToDungeon)) {
            const dungeons = [this.dungeon?.name] ?? this.content.filter(c => c instanceof MoveToDungeon).map(dungeon => dungeon.name);
            this.wasUnlock = this.wasUnlock || dungeons.some(name => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(name)]());
        }
        if (this.content.some(c => c instanceof Gym)) {
            const badges = this.content.filter(c => c instanceof Gym).map(gym => gym.badgeReward);
            this.wasUnlock = this.wasUnlock || badges.some(badge => App.game.badgeCase.hasBadge(badge));
        }
        if (this.content.some(c => c instanceof TemporaryBattle)) {
            const battles = this.content.filter(c => c instanceof TemporaryBattle);
            this.wasUnlock = this.wasUnlock || battles.some(battle => battle.completeRequirements.some(req => req.isCompleted()));
        }
    }
    return townUnlock.call(this) || this.wasUnlock;
};

const contentUnlock = TownContent.prototype.isUnlocked;
TownContent.prototype.isUnlocked = function () {
    ChallengeRequirements.cache.clear();
    return contentUnlock.call(this);
};

Gym.prototype.isUnlocked = function () {
    ChallengeRequirements.cache.clear();
    if (!this.wasUnlock && App.game?.challenges.list.shinyMovement?.active()) {
        this.wasUnlock =  App.game.badgeCase.hasBadge(this.badgeReward);
    }
    return contentUnlock.call(this) || this.wasUnlock;
};

Gym.prototype.protectedOnclick = eval(`(${
    Gym.prototype.protectedOnclick.toString()
        .replace('protectedOnclick', 'function')
        .replace('reqsList.length', '!App.game.badgeCase.hasBadge(this.badgeReward) && reqsList.length')
})`);

//#endregion
//#region End region conditions
const mapTravel = MapHelper.ableToTravel;
MapHelper.ableToTravel = () => mapTravel() && (!App.game?.challenges.list.shinyMovement?.active() || (App.game.party.caughtPokemon.every(pokemon => pokemon.shiny) && MapHelper.isRegionCleared(player.highestRegion())));
MapHelper.isRegionCleared = (region) => {
    let check = true;
    for (let i = 0; check && i <= region; i++) {
        const subRegionsId = SubRegions.getSubRegions(i).map(sub => sub.id);
        check = check
            && Routes.getRoutesByRegion(i)
                .filter(r => subRegionsId.includes(r.subRegion))
                ?.every(r => RouteHelper.routeCompleted(r.number, i, false))
            && GameConstants.RegionDungeons[i]
                .filter(d => (dungeonList[d].optionalParameters.dungeonRegionalDifficulty ?? 0) <= region)
                ?.every(d => DungeonRunner.dungeonCompleted(dungeonList[d], false))
            && RoamingPokemonList.list[i].flat().every(p => !p.isRoaming() || App.game.party.alreadyCaughtPokemon(p.pokemon.id, true));
    }
    return check;
};

// replace Pokedex by Shiny pokedex in prof oak check
const defaultDialog = Object.getOwnPropertyDescriptor(ProfNPC.prototype, 'dialogHTML').get;
const customDialog = defaultDialog.toString()
    .replace('get dialogHTML', 'function')
    .replace('const requiresCompleteDex',
        'const readyToMove = MapHelper.isRegionCleared(this.region) && (App.game.party.caughtPokemon.every(pokemon => pokemon.shiny) || this.region != player.highestRegion());\
        const requiresCompleteDex')
    .replace('html += `<p>${this.pokedexCompleteText}</p>`;',
        'html += `<p>${this.pokedexCompleteText}</p>`;\
        if (!readyToMove) {\
            html += `<p>But it seems you are still missing something</p>`;\
        }'
    )
    .replace('(?<!Shiny )Master', 'Shiny Master')
    .replace('nextRegionUnlocked && (', 'nextRegionUnlocked && readyToMove && (');
Object.defineProperty(ProfNPC.prototype, 'dialogHTML', {
    get: function () {
        return App.game?.challenges.list.shinyMovement?.active()
            ? eval(`(${customDialog})`).call(this)
            : defaultDialog.call(this);
    },
});
//#endregion
//#region KeyItem conditions
const keyItemsInitialize = KeyItems.prototype.initialize;
KeyItems.prototype.initialize = function() {
    keyItemsInitialize.call(this);
    this.itemList = this.itemList.map(item => {
        switch (item.name) {
            case KeyItemType.Town_map:
                item.unlocker.dispose();
                new KeyItem(item.name, item.description,
                    () => App.game.statistics.routeKills[GameConstants.Region.kanto][1]() >= GameConstants.ROUTE_KILLS_NEEDED && (!App.game?.challenges.list.shinyMovement?.active() || RouteHelper.routeCompleted(1, GameConstants.Region.kanto, true)),
                    false, item.unlockRewardOnClose, item.displayName, this.unlockRewardOnUnlock);
            case KeyItemType.Super_rod:
                item.unlocker.dispose();
                return new KeyItem(item.name, item.description,
                    () => App.game.statistics.routeKills[GameConstants.Region.kanto][12]() >= GameConstants.ROUTE_KILLS_NEEDED && (!App.game?.challenges.list.shinyMovement?.active() || RouteHelper.routeCompleted(12, GameConstants.Region.kanto, true)),
                    undefined, item.unlockRewardOnClose, item.displayName, this.unlockRewardOnUnlock);
            case KeyItemType.Mystery_egg:
                item.unlocker.dispose();
                return new KeyItem(item.name, item.description,
                    () => App.game.statistics.routeKills[GameConstants.Region.kanto][5]() >= GameConstants.ROUTE_KILLS_NEEDED && (!App.game?.challenges.list.shinyMovement?.active() || RouteHelper.routeCompleted(5, GameConstants.Region.kanto, true)),
                    undefined, item.unlockRewardOnClose, item.displayName, this.unlockRewardOnUnlock);
            default:
                return item;
        }
    });
};

const defaultFarmNotification = FarmController.openFarmModal;
const customFarmNotification = defaultFarmNotification.toString()
    .replace('openFarmModal', 'function')
    .replace('13 or 15', '13');
FarmController.openFarmModal = function() {
    if (App.game?.challenges.list.shinyMovement?.active()) {
        eval(`(${customFarmNotification})`).call();
    } else {
        defaultFarmNotification.call();
    }
};
//#endregion

//#region Kanto route
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kanto, 2), new TemporaryBattleRequirement('Blue 1'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kanto, 3),  new ItemsRequirement(ItemList.Mystery_egg));
ChallengeRequirements.add(TownList['Mt. Moon'], new ItemsRequirement(ItemList.Magikarp));
ChallengeRequirements.add(TemporaryBattleList['Blue 2'], new GymBadgeRequirement(BadgeEnums.Cascade));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kanto, 24), new GymBadgeRequirement(BadgeEnums.Cascade));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kanto, 5), new ItemsRequirement(ItemList.Water_stone));
ChallengeRequirements.set(TownList['Vermilion City'], new TemporaryBattleRequirement('Blue 3'));
ChallengeRequirements.set(GymList['Vermilion City'], new ItemsRequirement(ItemList.Thunder_stone));
ChallengeRequirements.set(TownList['Diglett\'s Cave'], new GymBadgeRequirement(BadgeEnums.Thunder));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kanto, 11), new DungeonShinyRequirement('Diglett\'s Cave'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 9), new RouteShinyRequirement(GameConstants.Region.kanto, 11));
ChallengeRequirements.add(GymList['Celadon City'], ...CeladonCityShop.items.map(pkm => new ItemsRequirement(pkm)));
ChallengeRequirements.set(TownList['Rocket Game Corner'], new GymBadgeRequirement(BadgeEnums.Rainbow));
ChallengeRequirements.set(TownList['Saffron City'], new DungeonShinyRequirement('Rocket Game Corner'));
ChallengeRequirements.set(TemporaryBattleList['Fighting Dojo'], new ItemsRequirement(ItemList.Leaf_stone, ItemList.Moon_stone));
ChallengeRequirements.set(TownList['Pokémon Tower'], ...TemporaryBattleList['Fighting Dojo'].completeRequirements);
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 12), new GymBadgeRequirement(BadgeEnums.Marsh));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 13), new TemporaryBattleRequirement('Snorlax route 12'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 14), new RouteShinyRequirement(GameConstants.Region.kanto, 13));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 15), new RouteShinyRequirement(GameConstants.Region.kanto, 14));
ChallengeRequirements.set(TemporaryBattleList['Snorlax route 16'], new RouteShinyRequirement(GameConstants.Region.kanto, 15));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 16), new TemporaryBattleRequirement('Snorlax route 16'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 17), new RouteShinyRequirement(GameConstants.Region.kanto, 16));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 18), new RouteShinyRequirement(GameConstants.Region.kanto, 17));
ChallengeRequirements.set(TownList['Fuchsia City'], new RouteShinyRequirement(GameConstants.Region.kanto, 18));
ChallengeRequirements.set(GymList['Fuchsia City'], new ItemsRequirement(ItemList.Linking_cord));
ChallengeRequirements.add(TownList['Power Plant'], new SafariRequirement());
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 19), new DungeonShinyRequirement('Power Plant'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 20), new DungeonShinyRequirement('Seafoam Islands'));
ChallengeRequirements.set(TownList['Cinnabar Island'], new RouteShinyRequirement(GameConstants.Region.kanto, 20));
ChallengeRequirements.set(TownList['Pokémon Mansion'], new RouteShinyRequirement(GameConstants.Region.kanto, 20), new ItemsRequirement(ItemList.Fire_stone));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kanto, 21), new QuestLineCompletedRequirement('Bill\'s Errand'));
ChallengeRequirements.set(GymList['Viridian City'], new RouteShinyRequirement(GameConstants.Region.kanto, 21));
// Sevii 123
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 26), new QuestLineStepCompletedRequirement('Bill\'s Errand', 0));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 27), new RouteShinyRequirement(GameConstants.Region.kanto, 26));
ChallengeRequirements.set(TownList['Two Island'], new DungeonShinyRequirement('Mt. Ember Summit'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 28), new QuestLineStepCompletedRequirement('Bill\'s Errand', 1));
ChallengeRequirements.set(TownList['Three Island'], new RouteShinyRequirement(GameConstants.Region.kanto, 28));
//#endregion
//#region Johto route
ChallengeRequirements.set(TownList['Cherrygrove City'], new RouteShinyRequirement(GameConstants.Region.johto, 46));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.johto, 30), new RouteShinyRequirement(GameConstants.Region.johto, 46));
ChallengeRequirements.add(TownList['Sprout Tower'], new ItemsRequirement(ItemList.Togepi, ItemList.Mystery_egg));
ChallengeRequirements.set(TownList['Union Cave'], new DungeonShinyRequirement('Ruins of Alph'));
ChallengeRequirements.set(TownList['Azalea Town'], new DungeonShinyRequirement('Slowpoke Well'));
ChallengeRequirements.add(GymList['Azalea Town'], new ItemsRequirement(ItemList.Leaf_stone, ItemList.Kings_rock));
ChallengeRequirements.add(TemporaryBattleList['Silver 2'], new GymBadgeRequirement(BadgeEnums.Hive));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.johto, 35), new GymBadgeRequirement(BadgeEnums.Plain));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.johto, 36), new RouteShinyRequirement(GameConstants.Region.johto, 35));
ChallengeRequirements.add(GymList['Ecruteak City'], new ItemsRequirement(ItemList.Fire_stone, ItemList.Soothe_bell));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.johto, 38), new TemporaryBattleRequirement('Silver 3'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.johto, 40), new ItemsRequirement(ItemList.Water_stone, ItemList.Thunder_stone, ItemList.Metal_coat), new DockRequirement());
ChallengeRequirements.add(GymList['Cianwood City'], new ItemsRequirement(ItemList.Sun_stone, ItemList.Moon_stone));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.johto, 42), new RouteShinyRequirement(GameConstants.Region.johto, 48));
ChallengeRequirements.set(TownList['Mt. Mortar'], new RouteShinyRequirement(GameConstants.Region.johto, 42));
ChallengeRequirements.set(TownList['Mahogany Town'], new DungeonShinyRequirement('Mt. Mortar'));
ChallengeRequirements.add(TemporaryBattleList['Suicune 2'], new DungeonShinyRequirement('Mt. Mortar'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.johto, 43), new ItemsRequirement(ItemList.Upgrade));
ChallengeRequirements.set(TownList['Tin Tower'], new DungeonShinyRequirement('Whirl Islands'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.johto, 44), new DungeonShinyRequirement('Tin Tower'));
ChallengeRequirements.add(TownList['Blackthorn City'], new QuestLineCompletedRequirement('Whirl Guardian'));
ChallengeRequirements.add(GymList['Blackthorn City'], new ItemsRequirement(ItemList.Dragon_scale));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.johto, 45), new GymBadgeRequirement(BadgeEnums.Rising));
ChallengeRequirements.set(TownList['Tohjo Falls'], new DungeonShinyRequirement('Dark Cave'));
//#endregion
//#region Hoenn
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.hoenn, 102),  new TemporaryBattleRequirement('May 1'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.hoenn, 104), new ItemsRequirement(ItemList.Kings_rock));
ChallengeRequirements.add(GymList['Rustboro City'], new ItemsRequirement(ItemList.Mystery_egg));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 116), new GymBadgeRequirement(BadgeEnums.Stone));
ChallengeRequirements.set(TownList['Granite Cave'], new GymBadgeRequirement(BadgeEnums.Knuckle));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.hoenn, 110), new DockRequirement(), new ItemsRequirement(ItemList.Linking_cord));
ChallengeRequirements.add(GymList['Mauville City'], new RouteShinyRequirement(GameConstants.Region.hoenn, 110), new ItemsRequirement(ItemList.Thunder_stone, ItemList.Metal_coat));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 117), new GymBadgeRequirement(BadgeEnums.Dynamo));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 111), new RouteShinyRequirement(GameConstants.Region.hoenn, 117), new ItemsRequirement(ItemList.Soothe_bell));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.hoenn, 114), new ItemsRequirement(ItemList.Moon_stone, ItemList.Sun_stone));
ChallengeRequirements.set(TownList['Mt. Chimney Crater'], new RouteShinyRequirement(GameConstants.Region.hoenn, 115));
ChallengeRequirements.add(GymList['Lavaridge Town'], new ItemsRequirement(ItemList.Fire_stone));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 105), new DungeonShinyRequirement('New Mauville'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 106), new RouteShinyRequirement(GameConstants.Region.hoenn, 105));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 107), new RouteShinyRequirement(GameConstants.Region.hoenn, 106));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 108), new RouteShinyRequirement(GameConstants.Region.hoenn, 107));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 109), new RouteShinyRequirement(GameConstants.Region.hoenn, 108));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 118), new RouteShinyRequirement(GameConstants.Region.hoenn, 109));
ChallengeRequirements.add(TemporaryBattleList['Kecleon 1'], new ItemsRequirement(ItemList.Leaf_stone));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.hoenn, 120), new GymBadgeRequirement(BadgeEnums.Feather));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 123), new DungeonShinyRequirement('Mt. Pyre'));
ChallengeRequirements.set(TownList['Magma Hideout'], new RouteShinyRequirement(GameConstants.Region.hoenn, 123));
ChallengeRequirements.set(TemporaryBattleList['May 5'], new DungeonShinyRequirement('Magma Hideout'));
ChallengeRequirements.set(TownList['Lilycove City'], new DungeonShinyRequirement('Magma Hideout'));
ChallengeRequirements.add(TownList['Aqua Hideout'], new TemporaryBattleRequirement('May 5'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 125), new RouteShinyRequirement(GameConstants.Region.hoenn, 126));
ChallengeRequirements.set(TownList['Mossdeep City'], new DungeonShinyRequirement('Shoal Cave'));
ChallengeRequirements.add(GymList['Mossdeep City'], new ItemsRequirement(ItemList.Beldum, ItemList.Prism_scale, ItemList.Upgrade));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 127), new GymBadgeRequirement(BadgeEnums.Mind));
ChallengeRequirements.set(TownList['Sootopolis City'], new RouteShinyRequirement(GameConstants.Region.hoenn, 127));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.hoenn, 128), new ItemsRequirement(ItemList.Water_stone));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.hoenn, 129), new DungeonShinyRequirement('Cave of Origin'));
ChallengeRequirements.set(TownList['Pacifidlog Town'], new GymBadgeRequirement(BadgeEnums.Rain));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.hoenn, 132), new GymBadgeRequirement(BadgeEnums.Rain), new ItemsRequirement(ItemList.Deepsea_tooth, ItemList.Deepsea_scale));
ChallengeRequirements.set(TownList['Ever Grande City'], new DungeonShinyRequirement('Sealed Chamber'), new QuestLineCompletedRequirement('The Three Golems'));
ChallengeRequirements.set(TownList['Victory Road Hoenn'], new DungeonShinyRequirement('Sealed Chamber'), new QuestLineCompletedRequirement('The Three Golems'), new ItemsRequirement(ItemList.Dragon_scale));
ChallengeRequirement.add(dungeonList['Cave of Origin'].bossList[1].options, new DungeonShinyRequirement('Pinkan Mountain'));
ChallengeRequirement.add(dungeonList['Cave of Origin'].bossList[2].options, new DungeonShinyRequirement('Pinkan Mountain'));
ChallengeRequirements.add(TownList['Battle Frontier'], new DungeonShinyRequirement('Pinkan Mountain'));
// Sevii 4567
ChallengeRequirements.set(TownList['Six Island'], new RouteShinyRequirement(GameConstants.Region.kanto, 40));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 34), new RouteShinyRequirement(GameConstants.Region.kanto, 40));
ChallengeRequirements.set(TownList['Pattern Bush'], new RouteShinyRequirement(GameConstants.Region.kanto, 37));
ChallengeRequirements.set(TownList['Five Island'], new DungeonShinyRequirement('Altering Cave'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 30),  new DungeonShinyRequirement('Altering Cave'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 32),  new DungeonShinyRequirement('Sunburst Island'));
ChallengeRequirements.add(TownList['Seven Island'], new GymBadgeRequirement(BadgeEnums.Sea_Ruby));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kanto, 38), new GymBadgeRequirement(BadgeEnums.Sea_Ruby));
ChallengeRequirements.add(TownList['Mikan Island'], new ItemsRequirement(...TanobyRuinsShop.items));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kanto, 41), new GymBadgeRequirement(BadgeEnums['Coral-Eye']));
ChallengeRequirements.set(TownList['Trovita Island'], new RouteShinyRequirement(GameConstants.Region.kanto, 42));
//#endregion
//#region Sinnoh
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.sinnoh, 201), new TemporaryBattleRequirement('Barry 1'));
ChallengeRequirements.add(TemporaryBattleList['Barry 2'], new ItemsRequirement(ItemList.Mystery_egg));
ChallengeRequirements.add(GymList['Oreburgh City'], new ItemsRequirement(ItemList.Moon_stone, ItemList.Sun_stone));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 204), new GymBadgeRequirement(BadgeEnums.Coal));
ChallengeRequirements.add(TownList['Valley Windworks'], new ItemsRequirement(ItemList.Linking_cord, ItemList.Kings_rock));
ChallengeRequirements.add(GymList['Eterna City'], new ItemsRequirement(ItemList.Leaf_stone));
ChallengeRequirements.set(TownList['Old Chateau'], new GymBadgeRequirement(BadgeEnums.Forest));
ChallengeRequirements.set(TownList['Team Galactic Eterna Building'], new DungeonShinyRequirement('Old Chateau'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 207), new DungeonShinyRequirement('Wayward Cave'));
ChallengeRequirements.add(GymList['Hearthome City'], new ItemsRequirement(ItemList.Fire_stone, ItemList.Soothe_bell));
ChallengeRequirements.add(TownList['Solaceon Ruins'], new ItemsRequirement(ItemList.Dawn_stone, ItemList.Dusk_stone, ItemList.Shiny_stone, ItemList.Spiritomb));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 210), new DungeonShinyRequirement('Solaceon Ruins'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 214), new GymBadgeRequirement(BadgeEnums.Cobble));
ChallengeRequirements.add(TownList['Pastoria City'], new TemporaryBattleRequirement('Barry 4'));
ChallengeRequirements.add(GymList['Pastoria City'], new ItemsRequirement(ItemList.Water_stone, ItemList.Prism_scale, ItemList.Skorupi));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 212), new GymBadgeRequirement(BadgeEnums.Fen));
ChallengeRequirements.set(TownList['Celestic Town'], new RouteShinyRequirement(GameConstants.Region.sinnoh, 212));
ChallengeRequirements.add(TemporaryBattleList['Galactic Boss Cyrus'], new ItemsRequirement(ItemList.Dragon_scale));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 211), new QuestLineStepCompletedRequirement('A new world', 3));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 219), new RouteShinyRequirement(GameConstants.Region.sinnoh, 211));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.sinnoh, 218), new ItemsRequirement(...PalParkShop.items));
ChallengeRequirements.add(TownList['Canalave City'], new TemporaryBattleRequirement('Barry 5'));
ChallengeRequirements.add(GymList['Canalave City'], new ItemsRequirement(ItemList.Metal_coat), new DockRequirement());
ChallengeRequirements.add(TownList['Iron Island'], new GymBadgeRequirement(BadgeEnums.Mine));
ChallengeRequirements.add(TownList['Lake Valor'], new DungeonShinyRequirement('Iron Island'));
ChallengeRequirements.add(GymList['Snowpoint City'], new ItemsRequirement(ItemList.Upgrade));
ChallengeRequirements.add(GymList['Sunyshore City'], new ItemsRequirement(ItemList.Thunder_stone, ItemList.Deepsea_tooth, ItemList.Deepsea_scale));
ChallengeRequirement.set(dungeonList['Spear Pillar'].bossList[1].options, new DungeonShinyRequirement('Flower Paradise'));
ChallengeRequirement.set(dungeonList['Spear Pillar'].bossList[2].options, new DungeonShinyRequirement('Flower Paradise'));
ChallengeRequirements.set(TownList['Hall of Origin'], new DungeonShinyRequirement('Flower Paradise'));
ChallengeRequirements.set(TownList['Snowpoint Temple'], new DungeonShinyRequirement('Hall of Origin'));
ChallengeRequirements.set(TownList['Newmoon Island'], new DungeonShinyRequirement('Snowpoint Temple'));
ChallengeRequirements.set(TownList['Fullmoon Island'], new DungeonShinyRequirement('Newmoon Island'));
ChallengeRequirements.add(TownList['Fight Area'], new QuestLineStartedRequirement('Zero\'s Ambition'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.sinnoh, 225), new QuestLineCompletedRequirement('Zero\'s Ambition'));
ChallengeRequirements.add(TemporaryBattleList['Barry 7'], new ItemsRequirement(ItemList.Electirizer, ItemList.Magmarizer));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.sinnoh, 226), new TemporaryBattleRequirement('Barry 7'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.sinnoh, 228),  new DungeonShinyRequirement('Stark Mountain'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.sinnoh, 230), new ItemsRequirement(ItemList.Dubious_disc, ItemList.Protector, ItemList.Reaper_cloth));
//#endregion
//#region Unova
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.unova, 19), new TemporaryBattleRequirement('Hugh 1'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.unova, 20), new ItemsRequirement(ItemList.Mystery_egg));
ChallengeRequirements.set(TownList['Castelia City'], new DungeonShinyRequirement('Liberty Garden'));
ChallengeRequirements.set(TownList['Castelia Sewers'], new DungeonShinyRequirement('Liberty Garden'), new DockRequirement(), new ItemsRequirement(ItemList.Kings_rock, ItemList.Linking_cord));
ChallengeRequirements.set(GymList['Castelia City'], new DungeonShinyRequirement('Castelia Sewers'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 4), new GymBadgeRequirement(BadgeEnums.Insect));
ChallengeRequirements.set(TownList['Nimbasa City'], new DungeonShinyRequirement('Relic Castle'));
ChallengeRequirements.add(GymList['Nimbasa City'], new ItemsRequirement(ItemList.Metal_coat));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 16), new GymBadgeRequirement(BadgeEnums.Bolt));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 5), new DungeonShinyRequirement('Lostlorn Forest'));
ChallengeRequirements.add(GymList['Driftveil City'], new ItemsRequirement(ItemList.Zorua, ItemList.Razor_claw, ItemList.Razor_fang));
ChallengeRequirements.add(TownList['Relic Passage'], new TemporaryBattleRequirement('Hugh 3'));
ChallengeRequirements.add(TownList['A Totally Unsuspicious Frigate'], new DungeonShinyRequirement('Relic Passage'));
ChallengeRequirements.add(TemporaryBattleList['Cheren'], new QuestLineStepCompletedRequirement('Quest for the DNA Splicers', 7));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.unova, 6), new TemporaryBattleRequirement('Colress 2'));
ChallengeRequirements.set(TownList['Chargestone Cave'], new DungeonShinyRequirement('Mistralton Cave'));
ChallengeRequirements.add(GymList['Mistralton City'], new ItemsRequirement(ItemList.Thunder_stone, ItemList.Upgrade));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 7), new GymBadgeRequirement(BadgeEnums.Jet));
ChallengeRequirements.set(TownList['Lentimas Town'], new DungeonShinyRequirement('Celestial Tower'));
ChallengeRequirements.set(TownList['Reversal Mountain'], new DungeonShinyRequirement('Celestial Tower'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 14), new TemporaryBattleRequirement('Hugh 4'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 13), new RouteShinyRequirement(GameConstants.Region.unova, 14));
ChallengeRequirements.add(GymList['Opelucid City'], new ItemsRequirement(ItemList.Dragon_scale));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 9), new QuestLineStepCompletedRequirement('Quest for the DNA Splicers', 14));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 24), new RouteShinyRequirement(GameConstants.Region.unova, 9));
ChallengeRequirements.add(GymList['Humilau City'], new ItemsRequirement(ItemList.Prism_scale));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 22), new GymBadgeRequirement(BadgeEnums.Wave));
ChallengeRequirements.set(TownList['Victory Road Unova'], new DungeonShinyRequirement('Abundant Shrine'));
ChallengeRequirements.add(TemporaryBattleList['Hugh 6'], new ObtainedPokemonShinyRequirement(PokemonHelper.getPokemonByName('Kyurem')));
ChallengeRequirements.add(TownList['Black and White Park'], new TemporaryBattleRequirement('Hugh 6'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.unova, 15), new ItemsRequirement(ItemList.Moon_stone, ItemList.Sun_stone));
ChallengeRequirements.add(TemporaryBattleList['Hugh 7'], new RouteShinyRequirement(GameConstants.Region.unova, 15));
ChallengeRequirements.set(TownList['Twist Mountain'], new TemporaryBattleRequirement('Hugh 7'));
ChallengeRequirements.set(TownList['Dragonspiral Tower'], new DungeonShinyRequirement('Twist Mountain'));
ChallengeRequirements.set(TownList['Icirrus City'], new DungeonShinyRequirement('Dragonspiral Tower'),  new ItemsRequirement(ItemList.Black_DNA, ItemList.White_DNA));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 8), new DungeonShinyRequirement('Dragonspiral Tower'),  new ItemsRequirement(ItemList.Black_DNA, ItemList.White_DNA, ItemList.Protector, ItemList.Dubious_disc, ItemList.Reaper_cloth));
ChallengeRequirements.set(TownList['Pinwheel Forest'], new RouteShinyRequirement(GameConstants.Region.unova, 8));
ChallengeRequirements.set(TownList['Moor of Icirrus'], new DungeonShinyRequirement('Pinwheel Forest'));
ChallengeRequirements.add(TownList['Anville Town'], new DungeonShinyRequirement('Pledge Grove'));
ChallengeRequirements.set(TownList['Nacrene City'], new DungeonShinyRequirement('Pledge Grove'), new ItemsRequirement(...AnvilleTownShop.items));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.unova, 3), new ItemsRequirement(...AnvilleTownShop.items, ItemList.Soothe_bell));
ChallengeRequirements.add(TownList.Dreamyard, new ItemsRequirement(ItemList.Leaf_stone, ItemList.Fire_stone, ItemList.Water_stone));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.unova, 2), new DungeonShinyRequirement('Dreamyard'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.unova, 1), new ItemsRequirement(ItemList.Shiny_stone, ItemList.Dusk_stone, ItemList.Dawn_stone));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.unova, 17), new ItemsRequirement(ItemList.Electirizer, ItemList.Magmarizer));
ChallengeRequirements.set(TownList['P2 Laboratory'], new RouteShinyRequirement(GameConstants.Region.unova, 18));
//#endregion
//#region Kalos
ChallengeRequirements.add(GymList['Santalune City'], new ItemsRequirement(ItemList.Mystery_egg));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 22), new GymBadgeRequirement(BadgeEnums.Bug));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 4), new RouteShinyRequirement(GameConstants.Region.kalos, 22));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kalos, 5), new ItemsRequirement(...FriseurFurfrouShop.items));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kalos, 6), new ItemsRequirement(ItemList.Thunder_stone));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kalos, 7), new ItemsRequirement(ItemList['Furfrou (Star)'], ItemList['Furfrou (La Reine)']));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kalos, 9), new ItemsRequirement(ItemList.Water_stone));
ChallengeRequirements.add(GymList['Cyllage City'], new ItemsRequirement(ItemList.Upgrade, ItemList.Prism_scale));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 10), new GymBadgeRequirement(BadgeEnums.Cliff));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kalos, 11), new ItemsRequirement(ItemList.Fire_stone, ItemList.Kings_rock));
ChallengeRequirements.add(GymList['Shalour City'], new ItemsRequirement(ItemList.Linking_cord, ItemList.Metal_coat));
ChallengeRequirements.add(GymList['Coumarine City'], new ItemsRequirement(ItemList.Leaf_stone, ItemList.Electirizer, ItemList.Magmarizer));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 23), new GymBadgeRequirement(BadgeEnums.Plant), new DockRequirement());
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 13), new DungeonShinyRequirement('Sea Spirit\'s Den'));
ChallengeRequirements.add(GymList['Laverre City'], new ItemsRequirement(ItemList.Deepsea_tooth, ItemList.Deepsea_scale, ItemList.Sachet, ItemList.Whipped_dream));
ChallengeRequirements.set(TownList['Frost Cavern'], new DungeonShinyRequirement('Lost Hotel'));
ChallengeRequirements.set(TownList['Dendemille Town'], new DungeonShinyRequirement('Frost Cavern'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 16), new DungeonShinyRequirement('Frost Cavern'), new ItemsRequirement(ItemList.Dusk_stone, ItemList.Shiny_stone, ItemList.Dawn_stone));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 17), new RouteShinyRequirement(GameConstants.Region.kalos, 16));
ChallengeRequirements.add(GymList['Anistar City'], new ItemsRequirement(ItemList.Moon_stone, ItemList.Sun_stone, ItemList.Razor_claw, ItemList.Razor_fang));
ChallengeRequirements.set(TownList['Couriway Town'], new DungeonShinyRequirement('Terminus Cave'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 19), new DungeonShinyRequirement('Terminus Cave'), new ItemsRequirement(ItemsRequirement.Dragon_scale));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.kalos, 20), new ItemsRequirement(ItemList.Protector, ItemList.Dubious_disc, ItemList.Reaper_cloth));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.kalos, 21), new GymBadgeRequirement(BadgeEnums.Iceberg));
ChallengeRequirements.set(TownList['Victory Road Kalos'], new RouteShinyRequirement(GameConstants.Region.kalos, 21));
//#endregion
//#region Alola
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.alola, 2), new ItemsRequirement(ItemList.Mystery_egg, ItemList.Shiny_stone, ItemList.Dusk_stone, ItemList.Dawn_stone), new DockRequirement());
ChallengeRequirements.set(TownList['Melemele Woods'], new DungeonShinyRequirement('Hau\'oli Cemetery'));
ChallengeRequirements.set(TownList['Iki Town'], new DungeonShinyRequirement('Seaward Cave'));
ChallengeRequirement.set(SubRegions.getSubRegionById(GameConstants.Region.alola, 1), new DungeonShinyRequirement('Ten Carat Hill'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.alola, 4), new ItemsRequirement(ItemList.Water_stone, ItemList.Kings_rock, ItemList.Metal_coat));
ChallengeRequirements.set(TownList['Paniola Ranch'], new DungeonShinyRequirement('Pikachu Valley'));
ChallengeRequirements.set(TownList['Paniola Town'], new DungeonShinyRequirement('Pikachu Valley'));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.alola, 20), new RouteShinyRequirement(GameConstants.Region.alola, 19));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.alola, 6), new RouteShinyRequirement(GameConstants.Region.alola, 20));
ChallengeRequirements.add(GymList['Konikoni City'], new ItemsRequirement(ItemList.Fire_stone, ItemList.Linking_cord, ItemList.Soothe_bell));
ChallengeRequirements.set(TownList['Memorial Hill'], new GymBadgeRequirement(BadgeEnums.RockiumZ));
ChallengeRequirements.set(TownList['Aether Paradise'],  new RouteShinyRequirement(GameConstants.Region.alola, 21));
ChallengeRequirements.add(TemporaryBattleList['Ultra Wormhole'], new ItemsRequirement(ItemList.Upgrade, ItemList['Type: Null']));
ChallengeRequirements.add(TownList['Malie Garden'], new ItemsRequirement(ItemList.Thunder_stone, ItemList.Electirizer, ItemList.Magmarizer));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.alola, 11), new DungeonShinyRequirement('Hokulani Observatory'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.alola, 14), new ItemsRequirement(ItemList.Razor_claw, ItemList.Razor_fang, ItemList.Ice_stone));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.alola, 15), new RouteShinyRequirement(GameConstants.Region.alola, 23));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.alola, 24), new ItemsRequirement(ItemList.Deepsea_scale, ItemList.Deepsea_tooth, ItemList.Prism_scale, ItemList.Sachet, ItemList.Whipped_dream));
ChallengeRequirements.add(TownList['Exeggutor Island Hill'], new ItemsRequirement(ItemList.Leaf_stone, ItemList.Dragon_scale, ItemList.Protector, ItemList.Dubious_disc, ItemList.Reaper_cloth));
ChallengeRequirements.set(Routes.getRoute(GameConstants.Region.alola, 26), new DungeonShinyRequirement('Exeggutor Island Hill'));
ChallengeRequirements.set(TownList['Vast Poni Canyon'], new RouteShinyRequirement(GameConstants.Region.alola, 26));
ChallengeRequirements.add(TemporaryBattleList['Ultra Megalopolis'], new ItemsRequirement(ItemList.Moon_stone, ItemList.Sun_stone, ItemList.Poipole));
// Post Game
ChallengeRequirement.add(dungeonList['Pikachu Valley'].bossList[5].options, new DungeonShinyRequirement('Ruins of Conflict'));
ChallengeRequirement.add(dungeonList['Brooklet Hill'].bossList[2].options, new ObtainedPokemonShinyRequirement(dungeonList['Pikachu Valley'].bossList[5]));
ChallengeRequirement.add(dungeonList['Brooklet Hill'].bossList[3].options, new ObtainedPokemonShinyRequirement(dungeonList['Pikachu Valley'].bossList[5]));
ChallengeRequirement.add(dungeonList['Lush Jungle'].bossList[1].options,
    new ObtainedPokemonShinyRequirement(dungeonList['Brooklet Hill'].bossList[2]),
    new ObtainedPokemonShinyRequirement(dungeonList['Brooklet Hill'].bossList[3])
);
ChallengeRequirement.add(dungeonList['Wela Volcano Park'].enemyList[6].options, new ObtainedPokemonShinyRequirement(dungeonList['Lush Jungle'].bossList[1]));
ChallengeRequirement.add(dungeonList['Wela Volcano Park'].bossList[2].options, new ObtainedPokemonShinyRequirement(dungeonList['Lush Jungle'].bossList[1]));
ChallengeRequirement.add(dungeonList['Wela Volcano Park'].bossList[3].options, new ObtainedPokemonShinyRequirement(dungeonList['Lush Jungle'].bossList[1]));
ChallengeRequirement.add(dungeonList['Diglett\'s Tunnel'].enemyList[2].options, new ObtainedPokemonShinyRequirement(dungeonList['Lush Jungle'].bossList[1]));
ChallengeRequirements.add(TownList['Ruins of Life'], new QuestLineStepCompletedRequirement('Ultra Beast Hunt', 10));
ChallengeRequirement.add(dungeonList['Malie Garden'].enemyList[14].options, new DungeonShinyRequirement('Ruins of Life'));
ChallengeRequirement.add(dungeonList['Malie Garden'].enemyList[15].options, new DungeonShinyRequirement('Ruins of Life'));
ChallengeReq.add(Routes.getRoute(GameConstants.Region.alola, 17).pokemon.special[0], new DungeonShinyRequirement('Ruins of Life'));
ChallengeReq.add(Routes.getRoute(GameConstants.Region.alola, 23).pokemon.special[0], new DungeonShinyRequirement('Ruins of Life'));
ChallengeRequirement.add(dungeonList['Hokulani Observatory'].bossList[2].options, new QuestLineStepCompletedRequirement('Ultra Beast Hunt', 12));
ChallengeRequirement.add(dungeonList['Hokulani Observatory'].bossList[3].options, new QuestLineStepCompletedRequirement('Ultra Beast Hunt', 12));
ChallengeRequirements.add(TownList['Ruins of Abundance'],
    new ObtainedPokemonShinyRequirement(dungeonList['Hokulani Observatory'].bossList[2]),
    new ObtainedPokemonShinyRequirement(dungeonList['Hokulani Observatory'].bossList[3])
);
ChallengeRequirement.add(dungeonList['Thrifty Megamart'].bossList[1].options, new DungeonShinyRequirement('Ruins of Abundance'));
ChallengeRequirements.add(TownList['Lake of the Sunne and Moone'], new DungeonShinyRequirement('Ruins of Abundance'));
ChallengeRequirement.add(dungeonList['Mina\'s Houseboat'].bossList[1].options, new DungeonShinyRequirement('Lake of the Sunne and Moone'));
ChallengeRequirement.add(dungeonList['Vast Poni Canyon'].bossList[1].options, new ObtainedPokemonShinyRequirement(dungeonList['Mina\'s Houseboat'].bossList[1]));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.alola, 27),
    new ObtainedPokemonShinyRequirement(dungeonList['Vast Poni Canyon'].bossList[1]),
    new QuestLineStepCompletedRequirement('Ultra Beast Hunt', 15)
);
ChallengeRequirements.add(TownList['Ruins of Hope'],
    new RouteShinyRequirement(GameConstants.Region.alola, 27),
    new QuestLineStepCompletedRequirement('Ultra Beast Hunt', 16)
);
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.alola, 28), new DungeonShinyRequirement('Ruins of Hope'));
ChallengeRequirements.add(TownList['Resolution Cave'], new DungeonShinyRequirement('Poni Meadow'));
ChallengeRequirements.add(Routes.getRoute(GameConstants.Region.alola, 29), new DungeonShinyRequirement('Resolution Cave'));
ChallengeRequirement.add(dungeonList['Lake of the Sunne and Moone'].bossList[1].options, new RouteShinyRequirement(GameConstants.Region.alola, 30));
ChallengeRequirement.add(dungeonList['Lake of the Sunne and Moone'].bossList[2].options, new RouteShinyRequirement(GameConstants.Region.alola, 30));
//#endregion

//#region Fix hint!!! Needs yo be at the end!!
for (let town of Object.values(TownList)) {
    if (!(town.requirements[0] instanceof ChallengeRequirements)) {
        ChallengeRequirements.add(town);
    }
}
for (let gym of Object.values(GymList)) {
    if (!(gym.requirements[0] instanceof ChallengeRequirements)) {
        ChallengeRequirements.add(gym);
    }
}
for (let battle of Object.values(TemporaryBattleList)) {
    if (!(battle.requirements[0] instanceof ChallengeRequirements)) {
        ChallengeRequirements.add(battle);
    }
}
for (let region = 0; region < GameConstants.Region.final; region++) {
    for (let route of Routes.getRoutesByRegion(region)) {
        if (!(route.requirements[0] instanceof ChallengeRequirements)) {
            ChallengeRequirements.add(route);
        }
    }
}
//#endregion

// hopefully it will be fixed in vanilla soon
//#region Fix EvolItems
for (let stone of Object.values(ItemList).filter(i => i instanceof EvolutionStone)) {
    stone.getCaughtStatus.dispose();
    stone.getCaughtStatus =  ko.pureComputed(() => {
        // Only include Pokémon which have evolutions
        const unlockedEvolutions = pokemonList.filter((p) => p.evolutions)
            // only include base Pokémon we have caught
            .filter(p => PartyController.getCaughtStatusByName(p.name))
            // Map to the evolution which uses this stone type
            .map((p) => p.evolutions.filter(e => e.trigger === EvoTrigger.STONE && e.stone === stone.type))
            // Flatten the array (in case of multiple evolutions)
            .flat()
            // Ensure the we actually found an evolution
            .filter(evolution => evolution)
            // Filter out evolution which can't be done in this region
            .filter(evolution => evolution.restrictions.every(req => req.isCompleted()))
            // Filter out any Pokémon which can't be obtained yet (future region)
            .filter(evolution => PokemonHelper.calcNativeRegion(evolution.getEvolvedPokemon) <= player.highestRegion())
            // Finally get the evolution
            .map(evolution => evolution.evolvedPokemon);

        if (unlockedEvolutions.length == 0) {
            return undefined;
        }

        // Calculate the lowest caught status
        return unlockedEvolutions.reduce((status, pokemonName) => {
            return Math.min(status, PartyController.getCaughtStatusByName(pokemonName));
        }, CaughtStatus.CaughtShiny);
    });
}
//#endregion
