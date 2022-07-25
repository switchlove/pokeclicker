//#region Trainer Card - One to govern them all
const trainerCard = Profile.getTrainerCard;
Profile.getTrainerCard = function (...args) {
    let card = trainerCard(...args);
    if (Object.values(args[10]).every(_ => _)) {
        const badgeContainer = card.querySelector('.challenge-badges');
        while (badgeContainer.hasChildNodes()) {
            badgeContainer.removeChild(badgeContainer.children[0]);
        }
        const img = document.createElement('img');
        img.onerror = () => img.remove();
        img.className = 'm-1';
        img.width = 18 * 2;
        img.src = 'assets/images/challenges/acsrq.png';
        img.title = 'All Challenges Shiny Route Quest';
        img.dataset.toggle = 'tooltip';
        img.dataset.placement = 'top';
        badgeContainer.appendChild(img);
    }
    return card;
};
//#endregion

//#region Add new Callenge
const challenges = Challenges;
Challenges = class Challenges extends challenges {
    constructor() {
        super();
        const challenge = this.list.requireCompletePokedex.constructor;
        this.list.shinyMovement = new challenge('Shiny Movement', 'Restrict your movement as ACSRQ routing.', true);
    }
};
//#endregion

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

class ChallengeRequirement extends Requirement {
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
        const completed = this.requirements.filter((req) => ChallengeRequirement.cache.has(req.key) || req.isCompleted()).length;
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
            if (!key || !ChallengeRequirement.cache.has(key)) {
                if (key) {
                    ChallengeRequirement.cache.add(key);
                }
                check = parent?.every(req => req.isCompleted()) ?? true;
                if (!check) {
                    ChallengeRequirement.cache.delete(key);
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
            reqsList = this.requirements.filter(({key, parent}) => !ChallengeRequirement.cache.has(key) && parent)
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
        return super.isCompleted()  && (
            DungeonRunner.dungeonCompleted(this.town?.dungeon, true)
            || !App.game?.challenges.list.shinyMovement?.active());
    }
}

class ItemRequirement extends Requirement {
    constructor(item) {
        super(CaughtStatus.CaughtShiny, GameConstants.AchievementOption.more);
        this.item = item;
    }

    getProgress() {
        const completed = this.item.getCaughtStatus() ?? CaughtStatus.CaughtShiny;
        if (!App.game.breeding.canAccess() && this.item instanceof EggItem) {
            return this.requiredValue;
        }
        return Math.min(completed, this.requiredValue);
    }

    hint() {
        return this.item instanceof PokemonItem
            ? `${this.item.displayName} needs to be caught shiny.`
            : `${this.item.displayName} still have some uses.`;
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
        const gym = Object.values(GymList).find(({badgeReward}) => badgeReward == this.badge);
        if (gym instanceof Champion && player.highestRegion() > gym.parent.region) {
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
        return TemporaryBattleList[this.battleName].requirements;
    },
});
//#endregion

//#region once unlock, always unlock
const routeUnlock = RegionRoute.prototype.isUnlocked;
RegionRoute.prototype.isUnlocked = function () {
    ChallengeRequirement.cache.clear();
    if (!this.wasUnlock && App.game?.challenges.list.shinyMovement?.active()) {
        this.wasUnlock = App.game.statistics.routeKills[this.region][this.number]();
    }
    return routeUnlock.call(this) || this.wasUnlock;
};

const townUnlock = Town.prototype.isUnlocked;
Town.prototype.isUnlocked = function () {
    ChallengeRequirement.cache.clear();
    if (!this.wasUnlock  && App.game?.challenges.list.shinyMovement?.active()) {
        this.wasUnlock = false;
        if (this.dungeon || this.content.some(c => c instanceof MoveToDungeon)) {
            const dungeon = this.dungeon?.name ?? this.content.find(c => c instanceof MoveToDungeon)?.name;
            this.wasUnlock = this.wasUnlock || App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(dungeon)]();
        }
        if (this.content.some(c => c instanceof Gym)) {
            const badge = this.content.find(c => c instanceof Gym)?.badgeReward;
            this.wasUnlock = this.wasUnlock || App.game.badgeCase.hasBadge(badge);
        }
    }
    return townUnlock.call(this) || this.wasUnlock;
};

const contentUnlock = TownContent.prototype.isUnlocked;
TownContent.prototype.isUnlocked = function () {
    ChallengeRequirement.cache.clear();
    return contentUnlock.call(this);
};

Gym.prototype.isUnlocked = function () {
    ChallengeRequirement.cache.clear();
    if (!this.wasUnlock && App.game?.challenges.list.shinyMovement?.active()) {
        this.wasUnlock =  App.game.badgeCase.hasBadge(this.badgeReward);
    }
    return contentUnlock.call(this) || this.wasUnlock;
};
//#endregion
//#region End region conditions
const mapTravel = MapHelper.ableToTravel;
MapHelper.ableToTravel = () => mapTravel() && (!App.game?.challenges.list.shinyMovement?.active() || (App.game.party.caughtPokemon.every(pokemon => pokemon.shiny) && MapHelper.isRegionCleared(player.highestRegion())));
MapHelper.isRegionCleared = (region) => {
    let check = true;
    for (let i = 0; check && i <= region; i++) {
        check = check && Routes.getRoutesByRegion(region).every(r => RouteHelper.routeCompleted(r.number, region, false));
        check = check && GameConstants.RegionDungeons[region].every(d => DungeonRunner.dungeonCompleted(dungeonList[d], false));
        check = check && RoamingPokemonList.list[0].flat().every(p => App.game.party.alreadyCaughtPokemon(p.pokemon.id, true));
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
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 2), new RouteShinyRequirement(GameConstants.Region.kanto, 22));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.kanto, 3),  new ItemRequirement(ItemList.Mystery_egg));
ChallengeRequirement.add(TownList['Mt. Moon'], new ItemRequirement(ItemList.Magikarp));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.kanto, 24), new GymBadgeRequirement(BadgeEnums.Cascade));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.kanto, 5), new ItemRequirement(ItemList.Water_stone));
ChallengeRequirement.set(GymList['Vermilion City'], new ItemRequirement(ItemList.Thunder_stone));
ChallengeRequirement.set(TownList['Diglett\'s Cave'], new GymBadgeRequirement(BadgeEnums.Thunder));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.kanto, 11), new DungeonShinyRequirement('Diglett\'s Cave'));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 9), new RouteShinyRequirement(GameConstants.Region.kanto, 11));
ChallengeRequirement.add(GymList['Celadon City'], ...CeladonCityShop.items.map(pkm => new ItemRequirement(pkm)));
ChallengeRequirement.set(TownList['Rocket Game Corner'], new GymBadgeRequirement(BadgeEnums.Rainbow));
ChallengeRequirement.set(TownList['Saffron City'], new DungeonShinyRequirement('Rocket Game Corner'));
ChallengeRequirement.set(TemporaryBattleList['Fighting Dojo'], new ItemRequirement(ItemList.Leaf_stone), new ItemRequirement(ItemList.Moon_stone));
ChallengeRequirement.set(TownList['Pokémon Tower'], ...TemporaryBattleList['Fighting Dojo'].completeRequirements);
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 12), new GymBadgeRequirement(BadgeEnums.Marsh));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 13), new RouteShinyRequirement(GameConstants.Region.kanto, 12));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 14), new RouteShinyRequirement(GameConstants.Region.kanto, 13));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 15), new RouteShinyRequirement(GameConstants.Region.kanto, 14));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 16), new RouteShinyRequirement(GameConstants.Region.kanto, 15));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 17), new RouteShinyRequirement(GameConstants.Region.kanto, 16));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 18), new RouteShinyRequirement(GameConstants.Region.kanto, 17));
ChallengeRequirement.set(TownList['Fuchsia City'], new RouteShinyRequirement(GameConstants.Region.kanto, 18));
ChallengeRequirement.set(GymList['Fuchsia City'], new ItemRequirement(ItemList.Linking_cord));
ChallengeRequirement.add(TownList['Power Plant'], new SafariRequirement());
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 19), new DungeonShinyRequirement('Power Plant'));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 20), new DungeonShinyRequirement('Seafoam Islands'));
ChallengeRequirement.set(TownList['Cinnabar Island'], new RouteShinyRequirement(GameConstants.Region.kanto, 20));
ChallengeRequirement.set(TownList['Pokémon Mansion'], new RouteShinyRequirement(GameConstants.Region.kanto, 20), new ItemRequirement(ItemList.Fire_stone));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.kanto, 21), new QuestLineCompletedRequirement('Bill\'s Errand'));
ChallengeRequirement.set(GymList['Viridian City'], new RouteShinyRequirement(GameConstants.Region.kanto, 21));
// Sevii 123
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 26), new QuestLineStepCompletedRequirement('Bill\'s Errand', GameConstants.Region.kanto));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 27), new RouteShinyRequirement(GameConstants.Region.kanto, 26));
ChallengeRequirement.set(TownList['Two Island'], new DungeonShinyRequirement('Mt. Ember Summit'));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.kanto, 28), new QuestLineStepCompletedRequirement('Bill\'s Errand', 1));
ChallengeRequirement.set(TownList['Three Island'], new RouteShinyRequirement(GameConstants.Region.kanto, 28));
//#endregion
//#region Johto route
ChallengeRequirement.set(TownList['Cherrygrove City'], new RouteShinyRequirement(GameConstants.Region.johto, 46));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 30), new RouteShinyRequirement(GameConstants.Region.johto, 46));
ChallengeRequirement.add(TownList['Sprout Tower'], new ItemRequirement(ItemList.Togepi), new ItemRequirement(ItemList.Mystery_egg));
ChallengeRequirement.set(TownList['Union Cave'], new DungeonShinyRequirement('Ruins of Alph'));
ChallengeRequirement.set(TownList['Azalea Town'], new DungeonShinyRequirement('Slowpoke Well'));
ChallengeRequirement.add(GymList['Azalea Town'], new ItemRequirement(ItemList.Leaf_stone), new ItemRequirement(ItemList.Kings_rock));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 35), new GymBadgeRequirement(BadgeEnums.Plain));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 36), new RouteShinyRequirement(GameConstants.Region.johto, 35));
ChallengeRequirement.add(GymList['Ecruteak City'], new ItemRequirement(ItemList.Fire_stone), new ItemRequirement(ItemList.Soothe_bell));
ChallengeRequirement.set(TownList['Burned Tower'], new GymBadgeRequirement(BadgeEnums.Fog));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 38), new DungeonShinyRequirement('Burned Tower'));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.johto, 40), new ItemRequirement(ItemList.Water_stone), new ItemRequirement(ItemList.Thunder_stone), new ItemRequirement(ItemList.Metal_coat), new DockRequirement());
ChallengeRequirement.add(GymList['Cianwood City'], new ItemRequirement(ItemList.Sun_stone), new ItemRequirement(ItemList.Moon_stone));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 42), new RouteShinyRequirement(GameConstants.Region.johto, 48));
ChallengeRequirement.set(TownList['Mt. Mortar'], new RouteShinyRequirement(GameConstants.Region.johto, 42));
ChallengeRequirement.set(TownList['Mahogany Town'], new DungeonShinyRequirement('Mt. Mortar'));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.johto, 43), new ItemRequirement(ItemList.Upgrade));
ChallengeRequirement.set(TownList['Tin Tower'], new DungeonShinyRequirement('Whirl Islands'), new ObtainedPokemonRequirement(pokemonNameIndex.entei), new ObtainedPokemonRequirement(pokemonNameIndex.suicune), new ObtainedPokemonRequirement(pokemonNameIndex.raikou));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 44), new DungeonShinyRequirement('Tin Tower'));
ChallengeRequirement.add(GymList['Blackthorn City'], new ItemRequirement(ItemList.Dragon_scale));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 45), new GymBadgeRequirement(BadgeEnums.Rising));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.johto, 27), new DungeonShinyRequirement('Dark Cave'));
//#endregion
//#region Hoenn
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 102), new RouteShinyRequirement(GameConstants.Region.hoenn, 103));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.hoenn, 104), new ItemRequirement(ItemList.Kings_rock));
ChallengeRequirement.add(GymList['Rustboro City'], new ItemRequirement(ItemList.Mystery_egg));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 116), new GymBadgeRequirement(BadgeEnums.Stone));
ChallengeRequirement.set(TownList['Granite Cave'], new GymBadgeRequirement(BadgeEnums.Knuckle));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.hoenn, 110), new DockRequirement(), new ItemRequirement(ItemList.Linking_cord));
ChallengeRequirement.add(GymList['Mauville City'], new ItemRequirement(ItemList.Thunder_stone), new ItemRequirement(ItemList.Metal_coat));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 117), new GymBadgeRequirement(BadgeEnums.Dynamo));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 111), new RouteShinyRequirement(GameConstants.Region.hoenn, 117), new ItemRequirement(ItemList.Soothe_bell));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.hoenn, 114), new ItemRequirement(ItemList.Moon_stone), new ItemRequirement(ItemList.Sun_stone));
ChallengeRequirement.set(TownList['Mt. Chimney Crater'], new RouteShinyRequirement(GameConstants.Region.hoenn, 115));
ChallengeRequirement.add(GymList['Lavaridge Town'], new ItemRequirement(ItemList.Fire_stone));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 105), new DungeonShinyRequirement('New Mauville'));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 106), new RouteShinyRequirement(GameConstants.Region.hoenn, 105));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 107), new RouteShinyRequirement(GameConstants.Region.hoenn, 106));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 108), new RouteShinyRequirement(GameConstants.Region.hoenn, 107));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 109), new RouteShinyRequirement(GameConstants.Region.hoenn, 108));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 118), new RouteShinyRequirement(GameConstants.Region.hoenn, 109));
ChallengeRequirement.add(GymList['Fortree City'], new ItemRequirement(ItemList.Leaf_stone));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 120), new GymBadgeRequirement(BadgeEnums.Feather));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 123), new DungeonShinyRequirement('Mt. Pyre'));
ChallengeRequirement.set(TownList['Magma Hideout'], new RouteShinyRequirement(GameConstants.Region.hoenn, 123));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 125), new RouteShinyRequirement(GameConstants.Region.hoenn, 126));
ChallengeRequirement.set(TownList['Mossdeep City'], new DungeonShinyRequirement('Shoal Cave'));
ChallengeRequirement.add(GymList['Mossdeep City'], new ItemRequirement(ItemList.Beldum), new ItemRequirement(ItemList.Prism_scale), new ItemRequirement(ItemList.Upgrade));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.hoenn, 127), new ItemRequirement(ItemList.Water_stone));
ChallengeRequirement.set(Routes.getRoute(GameConstants.Region.hoenn, 129), new DungeonShinyRequirement('Seafloor Cavern'));
ChallengeRequirement.set(TownList['Cave of Origin'], new RouteShinyRequirement(GameConstants.Region.hoenn, 131));
ChallengeRequirement.set(TownList['Pacifidlog Town'], new GymBadgeRequirement(BadgeEnums.Rain));
ChallengeRequirement.add(Routes.getRoute(GameConstants.Region.hoenn, 132), new GymBadgeRequirement(BadgeEnums.Rain), new ItemRequirement(ItemList.Deepsea_tooth), new ItemRequirement(ItemList.Deepsea_scale));
ChallengeRequirement.set(TownList['Ever Grande City'], new DungeonShinyRequirement('Sealed Chamber'));
ChallengeRequirement.set(TownList['Victory Road Hoenn'], new DungeonShinyRequirement('Sealed Chamber'), new ItemRequirement(ItemList.Dragon_scale));
//#endregion

//#region Fix hint!!! Needs yo be at the end!!
for (let town of Object.values(TownList)) {
    if (!(town.requirements[0] instanceof ChallengeRequirement)) {
        ChallengeRequirement.add(town);
    }
}
for (let gym of Object.values(GymList)) {
    if (!(gym.requirements[0] instanceof ChallengeRequirement)) {
        ChallengeRequirement.add(gym);
    }
}
for (let battle of Object.values(TemporaryBattleList)) {
    if (!(battle.requirements[0] instanceof ChallengeRequirement)) {
        ChallengeRequirement.add(battle);
    }
}
for (let region = 0; region < GameConstants.Region.final; region++) {
    for (let route of Routes.getRoutesByRegion(region)) {
        if (!(route.requirements[0] instanceof ChallengeRequirement)) {
            ChallengeRequirement.add(route);
        }
    }
}
//#endregion
