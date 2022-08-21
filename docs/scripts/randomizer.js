var rolledMons = [];
const gameInitialize = Game.prototype.initialize;
Game.prototype.initialize = function() {
    //Shiny Code
    this.redeemableCodes.codeList[1].rewardFunction = function() {
        const pokemon = pokemonMap.randomRegion(GameConstants.Region.final);
        App.game.party.gainPokemonById(pokemon.id, true, true);
    };

    //Pokedex List
    const pokedexList = PokedexHelper.getList;
    PokedexHelper.getList = eval(pokedexList.toString()
        .replace('getList()', '() =>')
        .replace('if (nativeRegion > GameConstants.MAX_AVAILABLE_REGION || nativeRegion == GameConstants.Region.none) {return false;}', '')
        .replace(' && pokemon.id != Math.floor(pokemon.id)', '')
    );

    //Move to Region
    MapHelper.ableToTravel = function() {
        var a, b;
        // If player already reached highest region, they can't move on
        if (player.highestRegion() >= GameConstants.MAX_AVAILABLE_REGION) {
            return false;
        }
        // Check if player doesn't require complete dex to move on to the next region and has access to next regions starter town
        if (!App.game.challenges.list.requireCompletePokedex.active()) {
            return (b = (a = TownList[GameConstants.StartingTowns[player.highestRegion() + 1]]) === null || a === void 0 ? void 0 : a.isUnlocked()) !== null && b !== void 0 ? b : false;
        }
        // Check if Champion of Region
        return App.game.badgeCase.badgeCount() == (player.highestRegion() + 1) * 13;
    };

    this.randomizer = new Randomizer();
    gameInitialize.call(this);

    //Tutoral Quest
    const catch5Pidgey = App.game.quests.getQuestLine('Tutorial Quests').quests()[6];
    const R1Pokemon = App.game.randomizer.routes[Routes.getName(1,GameConstants.Region.kanto)].land[0];
    catch5Pidgey.customDescription = catch5Pidgey.customDescription.replace('Pidgey', R1Pokemon);
    catch5Pidgey.focus = () => App.game.statistics.pokemonCaptured[PokemonHelper.getPokemonByName(R1Pokemon).id]();
};

class Randomizer {
    saveKey = 'randomizer';

    dungeons = {};
    routes = {};
    eggs = App.game.breeding.hatchList;

    constructor() {
        for (let dungeon in dungeonList) {
            this.dungeons[dungeon] = new Randomizer.Dungeon(dungeonList[dungeon]);
            if (!this.dungeons[dungeon]) {
                this.dungeons[dungeon] = new Randomizer.Dungeon(dungeonList[dungeon]);
            }
        }
        for (let region = 0; region <= GameConstants.MAX_AVAILABLE_REGION; region++) {
            for (let route of Routes.getRoutesByRegion(region)) {
                this.routes[route.routeName] = new Randomizer.Route(route);
            }
        }
    }

    fromJSON(json) {
        for (let dungeon in this.dungeons) {
            this.dungeons[dungeon].fromJSON((json.dungeons && json.dungeons[dungeon]) || this.dungeons[dungeon].toJSON());
        }
        for (let route in this.routes) {
            this.routes[route].fromJSON((json.routes && json.routes[route]) || this.routes[route].toJSON());
        }

        if (JSON.stringify(json.eggs || this.eggs) === JSON.stringify(this.eggs)) {
            for (let region in this.eggs) {
                this.eggs[region].forEach((eggs, t) => {
                    for (let i = 0; i < eggs.length; i++) {
                        eggs[i] = Randomizer.Rand();
                    }
                });
            }
        } else {
            for (let region in this.eggs) {
                this.eggs[region].forEach((eggs, t) => {
                    for (let i = 0; i < eggs.length; i++) {
                        eggs[i] = t < json.eggs[region]?.length && i < json.eggs[region][t].length
                            ? json.eggs[region][t][i]
                            : Randomizer.Rand();
                    }
                });
            }
        }
    }

    toJSON() {
        return {
            dungeons: JSON.parse(JSON.stringify(this.dungeons)),
            routes: JSON.parse(JSON.stringify(this.routes)),
            eggs: this.eggs,
        };
    }

    //TODO: make a randomisation system...
    static Rand() {
		var availableMons = pokemonList.filter(poke => !rolledMons.includes(poke.name));
		var rolledMon = Rand.fromArray(availableMons).name;
		rolledMons.push(rolledMon);
		if(rolledMons.length == pokemonList.length){
			rolledMons = [];
		}
        return rolledMon;
    }

    static Dungeon = class {
        constructor(dungeon) {
            this.enemyList = dungeon.enemyList;
            this.bossList = dungeon.bossList;
        }

        toJSON() {
            return {
                enemyList: this.enemyList.map(
                    p => p instanceof Object
                        ? p instanceof DungeonTrainer
                            ? p.team.map(({name}) => name)
                            : p.pokemon
                        : p
                ),
                bossList: this.bossList.map(
                    b => b instanceof DungeonTrainer
                        ? b.team.map(({name}) => name)
                        : b.name
                ),
            };
        }

        fromJSON(json) {
            if (JSON.stringify(json.enemyList) === JSON.stringify(this.toJSON().enemyList)) {
                for (let i = 0; i < this.enemyList.length; i++) {
                    this.randEnemy(i);
                }
            } else {
                const jsonPokemon = json.enemyList.filter(p => !Array.isArray(p));
                const thisPokemon = this.enemyList.map((p, i) => p instanceof DungeonTrainer ? -1 : i ).filter(_ => _ >= 0);
                for (let i = 0; i < thisPokemon.length; i++) {
                    if (i < jsonPokemon.length) {
                        if (this.enemyList[thisPokemon[i]] instanceof Object) {
                            this.enemyList[thisPokemon[i]].pokemon = jsonPokemon[i];
                        } else {
                            this.enemyList[thisPokemon[i]] = jsonPokemon[i];
                        }
                    } else {
                        this.randEnemy(thisPokemon[i]);
                    }
                }

                const jsonTrainer = json.enemyList.filter(p => Array.isArray(p));
                const thisTrainer = this.enemyList.map((p, i) => p instanceof DungeonTrainer ? i : -1 ).filter(_ => _ >= 0);
                for (let i = 0; i < thisTrainer.length; i++) {
                    if (i < jsonTrainer.length) {
                        this.enemyList[thisTrainer[i]].team.forEach((p, j) => {
                            p.name = j < jsonTrainer[i].length
                                ? jsonTrainer[i][j]
                                : Randomizer.Rand();
                        });
                    } else {
                        this.randEnemy(thisTrainer[i]);
                    }
                }
            }

            if (JSON.stringify(json.bossList) === JSON.stringify(this.toJSON().bossList)) {
                for (let i = 0; i < this.bossList.length; i++) {
                    this.randBoss(i);
                }
            } else {
                const jsonBoss = json.bossList.filter(b => !Array.isArray(b));
                const thisBoss = this.bossList.map((b, i) => b instanceof DungeonBossPokemon ? i : -1 ).filter(_ => _ >= 0);
                for (let i = 0; i < thisBoss.length; i++) {
                    if (i < jsonBoss.length) {
                        this.bossList[thisBoss[i]].name = jsonBoss[i];
                    } else {
                        this.randBoss(thisBoss[i]);
                    }
                }

                const jsonTrainer = json.bossList.filter(b => Array.isArray(b));
                const thisTrainer = this.bossList.map((b, i) => b instanceof DungeonTrainer ? i : -1 ).filter(_ => _ >= 0);
                for (let i = 0; i < thisTrainer.length; i++) {
                    if (i < jsonTrainer.length) {
                        this.bossList[thisTrainer[i]].team.forEach((p, j) => {
                            p.name = j < jsonTrainer[i].length
                                ? jsonTrainer[i][j]
                                : Randomizer.Rand();
                        });
                    } else {
                        this.randBoss(thisTrainer[i]);
                    }
                }
            }
        }

        randEnemy(index) {
            if (this.enemyList[index] instanceof DungeonTrainer) {
                this.enemyList[index].team = this.enemyList[index].team.map(pokemon => {
                    pokemon.name = Randomizer.Rand();
                    return pokemon;
                });
            } else if (this.enemyList[index] instanceof Object) {
                this.enemyList[index].pokemon = Randomizer.Rand();
            } else {
                this.enemyList[index] = Randomizer.Rand();
            }
        }

        randBoss(index) {
            if (this.bossList[index] instanceof DungeonTrainer) {
                this.bossList[index].team = this.bossList[index].team.map(pokemon => {
                    pokemon.name = Randomizer.Rand();
                    return pokemon;
                });
            } else if (this.bossList[index] instanceof DungeonBossPokemon) {
                this.bossList[index].name = Randomizer.Rand();
            }
        }
    };

    static Route = class {
        constructor(route) {
            this.land = route.pokemon.land;
            this.water = route.pokemon.water;
            this.headbutt = route.pokemon.headbutt;
            this.special = route.pokemon.special;
        }

        toJSON() {
            return {
                land: this.land,
                water: this.water,
                headbutt: this.headbutt,
                special: this.special.map(({pokemon}) => pokemon),
            };
        }

        fromJSON(json) {
            for (let section of ['land', 'water', 'headbutt'].filter(s => this[s].length)) {
                if (JSON.stringify(json[section]) === JSON.stringify(this[section])) {
                    for (let i = 0; i < this[section].length; i++) {
                        this[section][i] = Randomizer.Rand();
                    }
                } else {
                    for (let i = 0; i < this[section].length; i++) {
                        this[section][i] = i < json[section].length
                            ? json[section][i]
                            : Randomizer.Rand();
                    }
                }
            }

            if (this.special.length > 0) {
                if (JSON.stringify(json.special) === JSON.stringify(this.toJSON().special)) {
                    this.special.forEach(({pokemon}) => {
                        for (let i = 0; i < pokemon.length; i++) {
                            pokemon[i] = Randomizer.Rand();
                        }
                    });
                } else {
                    this.special.forEach(({pokemon}, i) => {
                        for (let j = 0; j < pokemon.length; j++) {
                            pokemon[j] = j < json.special.length
                                ? json.special[i][j]
                                : Randomizer.Rand();
                        }
                    });
                }
            }
        }
    }
}
