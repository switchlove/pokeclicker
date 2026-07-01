/* eslint-disable no-tabs */
var clickEngagedD, clickEngagedG, clickEngagedS, clickEngagedBF, clickEngagedSR, clickEngagedBRoute, chestOpened, curDungeon, curRoute, dMax, dMaxY, lastArea, lastPokeType, lastRegion, leftStep, localLocal, menuPos, phases, phaseVal, save, saveKey, saveLoaded;

var bossA = 0;
var bossB = 0;
var catchValue = 0;
var hasRun = 0;
var hasExported = 0;
var isCatching = false;
var isCurrentShiny = 0;
var lastCount = 0;
var lastCounts = 0;
var lastECount = 0;
var lastEPoke = 0;
var lastPoke = 0;
var maxPhaseCount = 0;
var moveBoss = 0;
var mystSCount = 0;
var started = 0;
var lVer = '0.0.0';
var rVer = '0.0.0';

Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
}, false;

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var getJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = response.json();
    return data;
};

function notifyBotComplete(botName) {
    Notifier.notify({
        title: `[SCRIPT] ACSRQ - ${botName} Bot`,
        message: `${botName} Bot has completed it's run!`,
        type: NotificationConstants.NotificationOption.success,
        timeout: Settings.getSetting('botCompleteNotifyDuration').observableValue() * GameConstants.SECOND,
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        main();
        setInterval(() => {
            main();
        }, 500);
    }, 1000);

    //#region PreventAutoSave
    /*Game.prototype.save = function () {
        player._lastSeen = Date.now();
        if (!Settings.getSetting('disableSave').value) {
            Save.store(player);
        }
    };*/
    //#endregion

    setInterval(() => {
        const noWanderSetting = Settings.getSetting('noWander');
        if (noWanderSetting && noWanderSetting.observableValue() == true) {
            var wanLog = [];
            for (var x = 0; x < App.game.logbook.logs().length; x++) {
                if (App.game.logbook.logs()[x].description().includes('wandered')) {
                    if (App.game.logbook.logs()[x].description().includes('shiny')) {
                        wanLog.push(App.game.logbook.logs()[x]);
                    }
                } else {
                    wanLog.push(App.game.logbook.logs()[x]);
                }
            }
            App.game.logbook.logs(wanLog);
        }
    }, 5000);
});

function main() {
    var CharCard = document.querySelector('#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div');
    if (CharCard == null && App.game != undefined) {
        acsrqSave();
        setTimeout(() => {
            acsrqMenu();
            acsrqPhases();
            setTimeout(() => {
                acsrqSettings();
            }, 1500);
        }, 250);
    } else {
        if (localSettings().state || !!sessionStorage.getItem('reload')) {
            Game.prototype.computeOfflineEarnings = () => { };
            // $(`.clickable[data-key="${localSettings().key}"]`)[0]?.click();
        }
    }
}

function acsrqSave() {
    /* localLocal, i.e. what the hell does what here
        localLocal[0][0-7] - Phase # storage for each region's routes
        localLocal[1] - Phase # storage for dungeons, dungeon are all in one array
        localLocal[2] - since last storage
        localLocal[3][0-1] - last shiny storage, id and encouterType
        localLocal[4] - Safari phase # storage
        localLocal[5][0-2] - nothing, cur mon sr'ing, sr count
    */
    localLocal = [
        [
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        '',
        ['0', ''],
        '',
        ['', '', ''],
    ];
    saveKey = `acsrq-${Save.key}`;

    if (localStorage.getItem(`acsrq-${Save.key}`) != null) {
        localLocal = JSON.parse(localStorage.getItem(`acsrq-${Save.key}`));
        if (localLocal != null) {
            /*localLocal.splice(2, 1);
            localStorage.removeItem(`acsrq-${Save.key}`);*/
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
    } else {
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    }

    if (localLocal[0].length == 7) {
        newArr = [];
        newArr.push(localLocal[0][0]);
        newArr.push(localLocal[0][1]);
        newArr.push(localLocal[0][2]);
        newArr.push(localLocal[0][3]);
        newArr.push(localLocal[0][4]);
        newArr.push(localLocal[0][5]);
        newArr.push(localLocal[0][6]);
        newArr.push(['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']);
        localLocal[0] = newArr;
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    }
    if (localLocal[1].length == 135) {
        localLocal[1].push('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    }

    phases = [];
    if (localStorage.getItem(`phaseTracker${Save.key}`) == null) {
        localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
    } else {
        phases = JSON.parse(localStorage.getItem(`phaseTracker${Save.key}`));
    }

    saveLoaded = 1;
}

function acsrqMenu() {
    lastPokeEncounter();
    areaClears();
}

async function acsrqSettings() {
    if (Settings.getSetting('botOptions')?.observableValue()) {
        //Breeding Bot
        const breedingCheck = document.getElementById('checkbox-botstate.breeding');
        if (!breedingCheck.disabled && breedingCheck.checked) {
            autoBreed();
        }

        //Dungeon Bot
        const dungeonCheck = document.getElementById('checkbox-botstate.dungeon');
        dungeonClick(!dungeonCheck.disabled && dungeonCheck.checked);

        //Gym Bot
        const gymCheck = document.getElementById('checkbox-botstate.gym');
        gymClick(!gymCheck.disabled && gymCheck.checked);

        //Safari Bot
        const safariCheck = document.getElementById('checkbox-botstate.safari');
        safariClick(!safariCheck.disabled && safariCheck.checked);

        //BF Bot
        const bfCheck = document.getElementById('checkbox-botstate.bf');
        bfClick(!bfCheck.disabled && bfCheck.checked);

        //Boosted Route Bot
        const boostedRouteCheck = document.getElementById('checkbox-botstate.boostedRoute');
        boostedRouteClick(!boostedRouteCheck.disabled && boostedRouteCheck.checked);
    }

    // getJSON("https://raw.githubusercontent.com/switchlove/pokeclicker/acsrq-beta/docs/acsrq.json").then(data => {
    //     rVer = data.version;
    //     document.querySelector("#settingsAcsrqDebug > table > tbody > tr:nth-child(1) > td:nth-child(2)").innerText = String(rVer);
    // }).catch(error => {
    //     console.error(error);
    // });

    // getJSON("./acsrq.json").then(data => {
    //     lVer = data.version;
    //     document.querySelector("#settingsAcsrqDebug > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerText = String(lVer);
    // }).catch(error => {
    //     console.error(error);
    // });

    if (rVer != lVer) {
        document.querySelector('#settingsAcsrqDebug > table > tbody > tr:nth-child(1) > td:nth-child(2)').style.color = '#A93226';
        document.querySelector('#settingsAcsrqDebug > table > tbody > tr:nth-child(2) > td:nth-child(2)').style.color = '#A93226';
    } else if (rVer == lVer) {
        document.querySelector('#settingsAcsrqDebug > table > tbody > tr:nth-child(1) > td:nth-child(2)').style.color = '#229954';
        document.querySelector('#settingsAcsrqDebug > table > tbody > tr:nth-child(2) > td:nth-child(2)').style.color = '#229954';
    }
}

function dungeonClick(x) {
    clickEngagedD = !!x;
}

function gymClick(x) {
    clickEngagedG = !!x;
}

function safariClick(x) {
    clickEngagedS = !!x;
}

function bfClick(x) {
    clickEngagedBF = !!x;
}

function boostedRouteClick(x) {
    clickEngagedBRoute = !!x;
}

function lastPokeEncounter() {
    if (JSON.parse(localStorage.getItem(saveKey))[3][0] != '0') {
        lastPoke = JSON.parse(localStorage.getItem(saveKey))[3][0];
    }
    if (JSON.parse(localStorage.getItem(saveKey))[3][1] != '') {
        lastPokeType = JSON.parse(localStorage.getItem(saveKey))[3][1];
    } else {
        lastPokeType = '?: ';
    }

    const lastEncounterEl = document.querySelector('#lastEncounterPoke > td:nth-child(1)');
    if (!lastEncounterEl) return;

    if (lastPoke == 0) {
        lastEncounterEl.innerHTML = 'N/A';
    } else {
        var pkName = PokemonHelper.getPokemonById(lastPoke).name.split(' ')[0];
        lastEncounterEl.innerHTML = lastPokeType + pkName;
    }
}

async function areaClears() {
    var townContent = player.town.content;
    var gymsFound = 0;
    var gymAtX = 0;

    for (let x = 0; x < townContent.length; x++) {
        if (townContent[x].leaderName != null) {
            gymsFound++;
            gymAtX = x;
        }
    }

    if (document.querySelector('#safariModal').style.display != 'none' && document.querySelector('#safariModal').style.display != '') {
        clears = 0;
        if (Safari.inProgress() != false) {
            await phaseCounter(3);
        }
    } else if (player.route != 0) {
        clears = App.game.statistics.routeKills[player.region][player.route]().toLocaleString('en-US');
        if (lastArea != player.route || lastRegion != player.region) {
            localLocal[2] = 0;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
        lastArea = player.route;
        lastRegion = player.region;
        await phaseCounter(1);
    } else if (player.town.dungeon != undefined) {
        clears = App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town.name)]().toLocaleString('en-US');
        if (lastArea != player.town.dungeon.name || lastRegion != player.region) {
            localLocal[2] = 0;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
        lastArea = player.town.dungeon.name;
        lastRegion = player.region;
        await phaseCounter(2);
    } else if (App.game.gameState == 6) {
        if (gymsFound == 1) {
            clears = townContent[gymAtX].clears();
            if (lastArea != townContent[gymAtX].leaderName || lastRegion != player.region) {
                localLocal[2] = 0;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
            lastArea = townContent[gymAtX].leaderName;
            lastRegion = player.region;
            await phaseCounter(4);
        } else if (gymsFound > 1) {
            clears = townContent[Settings.getSetting('gymE4Opts').observableValue() - 1].clears();
            if (lastArea != townContent[Settings.getSetting('gymE4Opts').observableValue() - 1].leaderName || lastRegion != player.region) {
                localLocal[2] = 0;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
            lastArea = townContent[Settings.getSetting('gymE4Opts').observableValue() - 1].leaderName;
            lastRegion = player.region;
            await phaseCounter(5);
        } else {
            clears = 0;
        }
    } else {
        clears = 0;
    }
    const areaClearsEl = document.querySelector('#areaClears > td:nth-child(1)');
    if (areaClearsEl) areaClearsEl.innerHTML = clears;
}

async function phaseCounter(arg) {
    var arg = arg;

    if (localStorage.getItem(saveKey) != null) {
        localLocal[2] = JSON.parse(localStorage.getItem(saveKey))[2];
    }

    var gymFound = 0;
    var townC = player.town.content;
    for (let x = 0; x < townC.length; x++) {
        if (townC[x].constructor.name == 'Gym') {
            gymFound++;
        }
    }

    const phaseCountEl = document.querySelector('#phaseCount');

    if (phaseVal == '' || phaseVal == null || phaseVal == undefined) {
        if (document.querySelector('#safariModal').style.display != 'none' && document.querySelector('#safariModal').style.display != '') {
            if (Safari.inProgress() != false) {
                phaseVal = 0;
                localLocal[4] = 0;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
        } else if (player.route != 0) {
            curRoute = player.route;
            curDungeon = GameConstants.getDungeonIndex(player.town.name);
            for (let rC = 0; rC < Routes.getRoutesByRegion(player.region).length; rC++) {
                if (Routes.getRoutesByRegion(player.region)[rC].number == player.route) {
                    cArea = rC;
                }
            }
            if (localLocal[0][player.region][cArea] == '') {
                phaseVal = 0;
                localLocal[0][player.region][cArea] = 0;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            } else {
                phaseVal = localLocal[0][player.region][cArea];
            }
        } else if (player.town.dungeon != undefined) {
            curRoute = player.route;
            curDungeon = GameConstants.getDungeonIndex(player.town.name);
            cArea = GameConstants.getDungeonIndex(player.town.name);
            if (curDungeon == -1) {
                phaseVal = 0;
            } else {
                if (localLocal[1][cArea] == '') {
                    phaseVal = 0;
                    localLocal[1][cArea] = 0;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                } else {
                    phaseVal = localLocal[1][cArea];
                }
            }
        } else if (gymFound >= 1) {
            phaseVal = 0;
        }
    } else if (phaseCountEl && phaseCountEl.value != phaseVal) {
        if (document.querySelector('#safariModal').style.display != 'none' && document.querySelector('#safariModal').style.display != '') {
            if (Safari.inProgress() != false) {
                phaseVal = phaseCountEl.value;
                localLocal[4] = phaseVal;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
        } else if (player.route != 0) {
            phaseVal = phaseCountEl.value;
            for (let rC = 0; rC < Routes.getRoutesByRegion(player.region).length; rC++) {
                if (Routes.getRoutesByRegion(player.region)[rC].number == player.route) {
                    cArea = rC;
                }
            }
            localLocal[0][player.region][cArea] = phaseVal;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        } else if (player.town.dungeon != undefined) {
            phaseVal = phaseCountEl.value;
            cArea = GameConstants.getDungeonIndex(player.town.name);
            localLocal[1][cArea] = phaseVal;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
    } else if (curRoute != player.route || curDungeon != GameConstants.getDungeonIndex(player.town.name)) {
        if (document.querySelector('#safariModal').style.display != 'none' && document.querySelector('#safariModal').style.display != '') {
            if (Safari.inProgress() != false) {
                phaseVal = phaseCountEl?.value;
                phaseVal = localLocal[4];
                phaseVal = localLocal[4];
            }
        } else if (player.route != 0) {
            curRoute = player.route;
            curDungeon = GameConstants.getDungeonIndex(player.town.name);
            for (let rC = 0; rC < Routes.getRoutesByRegion(player.region).length; rC++) {
                if (Routes.getRoutesByRegion(player.region)[rC].number == player.route) {
                    cArea = rC;
                }
            }
            phaseVal = localLocal[0][player.region][cArea];
        } else if (player.town.dungeon != undefined) {
            curRoute = player.route;
            curDungeon = GameConstants.getDungeonIndex(player.town.name);
            cArea = GameConstants.getDungeonIndex(player.town.name);
            phaseVal = localLocal[1][cArea];
        }
    }

    switch (arg) {
        case 1: //wild battles
            if (Battle.enemyPokemon().id != null) {
                if (lastEPoke == 0 && Battle.enemyPokemon().id != 0) {
                    lastEPoke = Battle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                    localLocal[2]++;
                } else if (lastEPoke == Battle.enemyPokemon().id && lastECount == (App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]() + 1)) {
                    break;
                } else if (lastECount == App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]()) {
                    break;
                } else {
                    lastEPoke = Battle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                    localLocal[2]++;
                }
                if (Battle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        lastPokeType = 'W: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = Battle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[2] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        isCurrentShiny = 1;
                    } else if (lastPoke == Battle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]()) {
                        break;
                    } else {
                        lastPokeType = 'W: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = Battle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[2] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        isCurrentShiny = 1;

                    }
                } else {
                    if (isCurrentShiny == 1) {
                        var catchStatus = '';
                        phaseLogs = App.game.logbook.logs();
                        for (var x = 0; x < 3; x++) {
                            var phaseLog = phaseLogs[x];
                            if (phaseLog.type.label == 'ESCAPED') {
                                catchStatus = 'Failed';
                                break;
                            } else if (phaseLog.type.label == 'CAUGHT') {
                                catchStatus = 'Captured';
                                break;
                            }
                        }
                        if (catchStatus == '') {
                            catchStatus = 'No Attempt';
                        }
                        catchValue = 0;
                        isCurrentShiny = 0;
                        newPhase = [phaseVal, Routes.getRoute(player.region, player.route).routeName, 'Wild', PokemonHelper.getPokemonById(lastPoke).name, catchStatus, App.game.statistics.routeKills[player.region][player.route]()];
                        phases.push(newPhase);
                        localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
                        hasRun = 0;
                        acsrqPhases();
                    }
                }
            }
            break;
        case 2: //dungeons
            if (DungeonBattle.enemyPokemon() != null) {
                if (lastEPoke == 0 && DungeonBattle.enemyPokemon().id != 0) {
                    lastEPoke = DungeonBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[DungeonBattle.enemyPokemon().id]();
                    localLocal[2]++;
                } else if (lastEPoke == DungeonBattle.enemyPokemon().id && lastECount == App.game.statistics.pokemonEncountered[DungeonBattle.enemyPokemon().id]()) {
                    break;
                } else if (DungeonBattle.enemyPokemon().id == 0) {
                    break;
                } else {
                    lastEPoke = DungeonBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[DungeonBattle.enemyPokemon().id]();
                    localLocal[2]++;
                }
                if (DungeonBattle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        if (DungeonRunner.fightingBoss() == true) {
                            lastPokeType = 'B: ';
                            localLocal[3][1] = lastPokeType;
                        } else if (DungeonBattle.trainer() != null) {
                            App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.dungeon.name}] You encountered a trainer's Shiny ${DungeonBattle.enemyPokemon().name}.`);
                            lastPokeType = 'T: ';
                            localLocal[3][1] = lastPokeType;
                        } else {
                            lastPokeType = 'W: ';
                            localLocal[3][1] = lastPokeType;
                        }
                        lastPoke = DungeonBattle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[DungeonBattle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[2] = 0;
                        localLocal[1][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        isCurrentShiny = 1;
                    } else if (lastPoke == DungeonBattle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[DungeonBattle.enemyPokemon().id]()) {
                        // Defeating a dungeon boss immediately clears the dungeon and returns
                        // to town, so enemyPokemon() never becomes a new (non-shiny) Pokemon
                        // and the catch/escape outcome below would never be checked. Resolve
                        // it here instead, as soon as the CAUGHT/ESCAPED log appears.
                        if (lastPokeType == 'B: ' && isCurrentShiny == 1) {
                            var bossLog = App.game.logbook.logs()[0];
                            var bossCatchStatus = '';
                            if (bossLog?.type.label == 'CAUGHT') {
                                bossCatchStatus = 'Boss Captured';
                            } else if (bossLog?.type.label == 'ESCAPED') {
                                bossCatchStatus = 'Boss Failed';
                            }
                            if (bossCatchStatus != '') {
                                catchValue = 0;
                                isCurrentShiny = 0;
                                newPhase = [phaseVal, player.town.dungeon.name, 'Boss', PokemonHelper.getPokemonById(lastPoke).name, bossCatchStatus, App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town.dungeon.name)]()];
                                phases.push(newPhase);
                                localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
                                hasRun = 0;
                                acsrqPhases();
                            }
                        }
                        break;
                    } else {
                        if (DungeonRunner.fightingBoss() == true) {
                            lastPokeType = 'B: ';
                            localLocal[3][1] = lastPokeType;
                        } else if (DungeonBattle.trainer() != null) {
                            App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.dungeon.name}] You encountered a trainer's Shiny ${DungeonBattle.enemyPokemon().name}.`);
                            lastPokeType = 'T: ';
                            localLocal[3][1] = lastPokeType;
                        } else {
                            lastPokeType = 'W: ';
                            localLocal[3][1] = lastPokeType;
                        }
                        lastPoke = DungeonBattle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[DungeonBattle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[2] = 0;
                        localLocal[1][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        isCurrentShiny = 1;
                    }
                } else {
                    if (isCurrentShiny == 1) {
                        var encounterType = '';
                        var catchStatus = '';
                        phaseLogs = App.game.logbook.logs();
                        phaseLoop:
                        for (var x = 0; x < 3; x++) {
                            var phaseLog = phaseLogs[x];
                            if (phaseLog.type.label == 'SHINY' && lastPokeType == 'B: ') {
                                if (phaseLogs[x - 1]?.type.label == 'CAUGHT') {
                                    catchStatus = 'Boss Captured';
                                    encounterType = 'Boss';
                                    break phaseLoop;
                                } else if (phaseLogs[x - 1]?.type.label == 'ESCAPED') {
                                    catchStatus = 'Boss Failed';
                                    encounterType = 'Boss';
                                    break phaseLoop;
                                }
                            } else if (phaseLog.type.label == 'SHINY' && lastPokeType == 'T: ') {
                                catchStatus = 'Trainer';
                                encounterType = 'Trainer';
                                break phaseLoop;
                            } else if (phaseLog.type.label == 'CAUGHT' && lastPokeType == 'W: ') {
                                catchStatus = 'Captured';
                                encounterType = 'Wild';
                                break phaseLoop;
                            } else if (phaseLog.type.label == 'ESCAPED' && lastPokeType == 'W: ') {
                                catchStatus = 'Failed';
                                encounterType = 'Wild';
                                break phaseLoop;
                            }
                        }
                        if (catchStatus == '') {
                            catchStatus = 'No Attempt';
                        }
                        catchValue = 0;
                        isCurrentShiny = 0;
                        newPhase = [phaseVal, player.town.dungeon.name, encounterType, PokemonHelper.getPokemonById(lastPoke).name, catchStatus, App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town.dungeon.name)]()];
                        phases.push(newPhase);
                        localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
                        hasRun = 0;
                        acsrqPhases();
                    }
                }
            }
            break;
        case 3: //safari
            if (SafariBattle.enemy != undefined) {
                if (lastEPoke == 0) {
                    lastEPoke = SafariBattle.enemy.id;
                    lastECount = App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]();
                    localLocal[2]++;
                } else if (lastEPoke == SafariBattle.enemy.id && lastECount == App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]()) {
                    break;
                } else {
                    lastEPoke = SafariBattle.enemy.id;
                    lastECount = App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]();
                    localLocal[2]++;
                }
                if (SafariBattle.enemy.shiny == true) {
                    if (lastPoke == 0) {
                        lastPokeType = 'W: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = SafariBattle.enemy.id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]();
                        phaseVal++;
                        localLocal[2] = 0;
                        localLocal[4] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        isCurrentShiny = 1;
                    } else if (lastPoke == SafariBattle.enemy.id && lastCounts == App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]()) {
                        break;
                    } else {
                        lastPokeType = 'W: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = SafariBattle.enemy.id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]();
                        phaseVal++;
                        localLocal[2] = 0;
                        localLocal[4] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        isCurrentShiny = 1;
                    }
                } else {
                    if (isCurrentShiny == 1) {
                        var catchStatus = '';
                        phaseLogs = App.game.logbook.logs();
                        for (var x = 0; x < 3; x++) {
                            var phaseLog = phaseLogs[x];
                            if (phaseLog.type.label == 'ESCAPED') {
                                catchStatus = 'Failed';
                                break;
                            } else if (phaseLog.type.label == 'CAUGHT') {
                                catchStatus = 'Captured';
                                break;
                            }
                        }
                        if (catchStatus == '') {
                            catchStatus = 'No Attempt';
                        }
                        catchValue = 0;
                        isCurrentShiny = 0;
                        newPhase = [phaseVal, 'Safari Zone', 'Wild', PokemonHelper.getPokemonById(lastPoke).name, catchStatus, 'N/A'];
                        phases.push(newPhase);
                        localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
                        hasRun = 0;
                        acsrqPhases();
                    }
                }
            }
            break;
        case 4: //gym
            if (GymBattle.enemyPokemon() != null) {
                if (lastEPoke == 0 && GymBattle.enemyPokemon().id != 0) {
                    lastEPoke = GymBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]();
                    localLocal[2]++;
                } else if (lastEPoke == GymBattle.enemyPokemon().id && lastECount == (App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]() + 1)) {
                    break;
                } else if (lastECount == App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]()) {
                    break;
                } else {
                    lastEPoke = GymBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]();
                    localLocal[2]++;
                }
                if (GymBattle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.gym.town} Gym] You encountered a trainer's Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[2] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    } else if (lastPoke == GymBattle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]()) {
                        break;
                    } else {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.gym.town} Gym] You encountered a trainer's Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[2] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    }
                }
            }
            break;
        case 5: //e4
            if (GymBattle.enemyPokemon() != null) {
                if (lastEPoke == 0 && GymBattle.enemyPokemon().id != 0) {
                    lastEPoke = GymBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]();
                    localLocal[2]++;
                } else if (lastEPoke == GymBattle.enemyPokemon().id && lastECount == (App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]() + 1)) {
                    break;
                } else if (lastECount == App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]()) {
                    break;
                } else {
                    lastEPoke = GymBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]();
                    localLocal[2]++;
                }
                if (GymBattle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.name}] You encountered a ${player.town.gymList[0].town}'s Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[2] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    } else if (lastPoke == GymBattle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]()) {
                        break;
                    } else {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.name}] You encountered a ${player.town.gymList[0].town}'s Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[3][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[3][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[2] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    }
                }
            }
    }
    if (phaseCountEl) {
        phaseCountEl.value = phaseVal;
    }

    const lastEncounterEl2 = document.querySelector('#lastEncounter > td:nth-child(1)');
    if (lastEncounterEl2) {
        if (localLocal[2].toLocaleString('en-US') == '') {
            lastEncounterEl2.innerHTML = 0;
        } else {
            lastEncounterEl2.innerHTML = localLocal[2].toLocaleString('en-US');
        }
    }
    localStorage.setItem(saveKey, JSON.stringify(localLocal));
}

function removePhase(id) {
    var newArray = [];
    for (var x = 0; x < phases.length; x++) {
        if (x !== id) {
            newArray.push(phases[x]);
        }
    }
    phases = newArray;
    localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
    hasRun = 0;
    acsrqPhases();
}

function removeAllPhases() {
    phases = [];
    localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
    hasRun = 0;
    acsrqPhases();
}

async function acsrqExport() {
    hasExported = 0;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    var test_array = phases;
    var csv = test_array.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"` : String(item)).join(',')).join('\n');
    var data = encodeURI(`data:text/csv;charset=utf-8,${csv}`);

    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', 'phases.csv');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function acsrqPhases() {
    if (!Settings.getSetting('trackPhases')) return;
    if (Settings.getSetting('trackPhases').observableValue() == true) {
        var newArray = [];
        var phaseCountDifference = phases.length - Settings.getSetting('phaseCount').observableValue();
        if (phaseCountDifference > 0) {
            for (var phase = 0; phase < phases.length; phase++) {
                if (phaseCountDifference > 0) {
                    phaseCountDifference--;
                } else {
                    newArray.push(phases[phase]);
                }
            }
            phases = newArray;
        }
        if (hasRun == 0) {
            let phaseTable = $('#phaseTable tbody')[0];
            phaseTable.innerHTML = '';
    		for (var x = 0; x < phases.length; x++) {
    			var tablePhase = document.createElement('tr');
    			var phaseId = `phase${x}`;
    			// eslint-disable-next-line no-useless-concat
    			tablePhaseQuery = `<tr><td>${phases[x][0]}</td>` + `<td>${phases[x][1]}</td>` + `<td>${phases[x][2]}</td>` + `<td>${phases[x][3]}</td>` + `<td>${phases[x][4]}</td>` + `<td>${phases[x][5]}</td>` + '<td>' + `<button type="button" class="btn btn-primary" onclick="removePhase(${x})">Remove</button>` + '</td></tr>';
    			tablePhase.innerHTML = tablePhaseQuery;
    			tablePhase.style.display = 'none';
    			phaseTable.append(tablePhase);
    			var childNumber = x + 1;
    			if (x < Number(Settings.getSetting('phaseCount').observableValue())) {
    				var displayQuery = `#phaseTable tbody > tr:nth-child(${childNumber})`;
    				document.querySelector(displayQuery).removeAttribute('style');
    				hasRun = 1;
    			}
    		}
    	}
    	localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
    }
}
