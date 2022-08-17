var clickEngagedD, clickEngagedG, clickEngagedS, clickEngagedBF, clickEngagedSR, chestOpened, curDungeon, curRoute, dMax, dMaxY, lastArea, lastPokeType, lastRegion, leftStep, localLocal, menuPos, phases, phaseVal, save, saveKey, saveLoaded;

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

Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
},false;

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('load', () => {
    setTimeout(() => {
        main();
        setInterval(() => {
            main();
        }, 500);
    }, 1000);

    //#region PreventAutoSave
    Game.prototype.save = function() {
        player._lastSeen = Date.now();
        if (!Settings.getSetting('disableSave').value) {
            Save.store(player);
        }
    };
    //#endregion

    setInterval(function(){
        if (Settings.getSetting('noWander').observableValue() == true) {
            var wanLog = []
            for(var x = 0; x < App.game.logbook.logs().length; x++){
                if(App.game.logbook.logs()[x].description.includes("wandered")){
                    if(App.game.logbook.logs()[x].description.includes("shiny")){
                        wanLog.push(App.game.logbook.logs()[x]);
                    }
                }
                else{
                    wanLog.push(App.game.logbook.logs()[x]);
                }
            }
            App.game.logbook.logs(wanLog);
        }
    }, 5000);

    setInterval(function(){
        if (clickEngagedD){
            if (DungeonRunner.map != undefined && Battle.catching() != true && DungeonRunner.fighting() != true){
                dungeonBot();
            }
        }
        if (clickEngagedG){
            gymBot();
        }
        if (clickEngagedBF){
            bfBot();
        }
    }, 100);

    setInterval(function(){
        if (clickEngagedS){
            safariBot();
        }
    }, 250);
});

function main() {
    var CharCard = document.querySelector("#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div");
    if (CharCard == null && App.game != undefined) {
        a6save();
        a6menu();
        a6phases();

        if (Settings.getSetting('ballBuyOpts').observableValue() != 'none' && Settings.getSetting('ballPurAmount').observableValue() != 0) {
            ballBot();
        }

        setTimeout(() => {
            a6settings();
        }, 1500);
    } else {
        if (localSettings().state) {
            $(`.clickable[data-key="${localSettings().key}"]`)[0]?.click();
        }
    }
}

function a6save() {
    localLocal = [[["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0","0", "0", "0", "0", "0", "0", "0", "0", "0", "0","0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]], ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], "", "", ["0",""], "", ["", "", ""]];
    saveKey = "a6csrq-" + Save.key;

    if ( localStorage.getItem(saveKey) == null ) {
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    } else {
        localLocal = JSON.parse(localStorage.getItem(saveKey));
    }

    if (localLocal[0].length == 25) {
        newArr = [];
        newArr.push(localLocal[0]);
        newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
        newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
        newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
        newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
        newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
        localLocal[0] = newArr;
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    }
    if (localLocal[0].length == 6) {
        newArr = [];
        newArr.push(localLocal[0][0]);
        newArr.push(localLocal[0][1]);
        newArr.push(localLocal[0][2]);
        newArr.push(localLocal[0][3]);
        newArr.push(localLocal[0][4]);
        newArr.push(localLocal[0][5]);
        newArr.push(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0","0", "0", "0", "0", "0", "0", "0", "0", "0", "0","0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
        localLocal[0] = newArr;
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    }
    if (localLocal[1].length == 10) {
        localLocal[1].push("0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0");
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    }
    if (localLocal[1].length == 98) {
        localLocal[1].push("0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0");
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
    }

    phases = [];
    if ( localStorage.getItem(`phaseTracker${Save.key}`) == null ) {
        localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
    } else {
        phases = JSON.parse(localStorage.getItem(`phaseTracker${Save.key}`));
    }
    localStorage[`phaseTracker${Save.key}`] = JSON.stringify(phases);
    localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));

    saveLoaded = 1;
}

function a6menu() {
    lastPokeEncounter();
    areaClears();
}

async function a6settings() {
    if (Settings.getSetting('botOptions')?.observableValue()) {
        //Breeding Bot
        const breedingCheck = document.getElementById('checkbox-botstate.breeding');
        if (!breedingCheck.disabled && breedingCheck.checked) {
            autoBreed();
        }

        //Dungeon Bot
        const dungeonCheck = document.getElementById('checkbox-botstate.dungeon');
        const dungeon = player.town().dungeon;
        const curDT = App.game.wallet.currencies[GameConstants.Currency.dungeonToken]();
        if (!dungeonCheck.disabled && dungeonCheck.checked && curDT >= dungeon.tokenCost) {
            switch (Settings.getSetting('dungeOpts').observableValue()) {
                case 'dungOptN':
                    dungeonClick(1);
                    break;
                case 'dungOptSC':
                    dungeonClick(!DungeonRunner.dungeonCompleted(dungeon, true));
                    break;
                case 'dungOptC':
                    dungeonClick(App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(dungeon.name)]() < Settings.getSetting('maxClears').observableValue());
                    break;
                case 'dungOptDT':
                    dungeonClick(curDT >= Settings.getSetting('minDT').observableValue());
                    break;
                default:
                    dungeonClick(0);
            }
        } else {
            dungeonClick(0);
        }

        //Gym Bot
        const gymCheck = document.getElementById('checkbox-botstate.gym');
        gymClick(!gymCheck.disabled && gymCheck.checked);

        //Safari Bot
        const safariCheck = document.getElementById('checkbox-botstate.safari');
        if (!safariCheck.disabled && safariCheck.checked) {
            if (Safari.inProgress()) {
                switch (Settings.getSetting('safariOpts').observableValue()) {
                    case 'safariOptN':
                        safariClick(1);
                        break;
                    case 'safariOptSC':
                        safariClick(!Safari.completed(true));
                        break;
                    default:
                        safariClick(0);
                }
            } else if (!Safari.completed(true)) {
                safariClick(0);
            }
        } else if (safariCheck.checked && clickEngagedS && !Safari.completed(true)) {
            if ($('#safariModal')[0].classList.contains('show')) {
                Safari.payEntranceFee();
            } else if (App.game.gameState != 5) {
                App.game.gameState = 5;
                setTimeout(() => {
                    Safari.openModal();
                }, 500);
            }
        } else {
            safariClick(0);
        }

        //BF Bot
        const bfCheck = document.getElementById('checkbox-botstate.bf');
        bfClick(!bfCheck.disabled && bfCheck.checked);

        //Planter Bots
        const plantSelect = document.getElementById('select-botstate.plant');
        if (!plantSelect.disabled && plantSelect.value != 'N/A') {
            plantBot();
        }
        //Mutator Bots
        const mutateSelect = document.getElementById('select-botstate.mutate');
        if (!mutateSelect.disabled && mutateSelect.value != 'N/A') {
            mutateBot();
        }
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

function lastPokeEncounter() {
    if (JSON.parse(localStorage.getItem(saveKey))[4][0] != "0") {
        lastPoke = JSON.parse(localStorage.getItem(saveKey))[4][0];
    }
    if (JSON.parse(localStorage.getItem(saveKey))[4][1] != "") {
        lastPokeType = JSON.parse(localStorage.getItem(saveKey))[4][1];
    } else {
        lastPokeType = '?: ';
    }

    if (lastPoke == 0) {
        document.querySelector("#lastEncounterPoke > td:nth-child(1)").innerHTML = 'N/A';
    } else {
        var pkName = PokemonHelper.getPokemonById(lastPoke).name.split(" ")[0];
        document.querySelector("#lastEncounterPoke > td:nth-child(1)").innerHTML = lastPokeType + pkName;
    }
}

async function areaClears() {
    var townContent = player.town().content;
    var gymsFound = 0;
    var gymAtX = 0;

    for (let x = 0; x < townContent.length; x++) {
        if (townContent[x].leaderName != null ) {
            gymsFound++;
            gymAtX = x;
        }
    }

    if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
        clears = 0;
        if (Safari.inProgress() != false) {
            await phaseCounter(3);
        }
    } else if (player.route() != 0) {
        clears = App.game.statistics.routeKills[player.region][player.route()]().toLocaleString('en-US');
        if (lastArea != player.route() || lastRegion != player.region) {
            lastPoke = 0;
            localLocal[4][0] = 0;
            localLocal[4][1] = '';
            localLocal[3] = 0;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
        lastArea = player.route();
        lastRegion = player.region;
        await phaseCounter(1);
    } else if (player.town().dungeon != undefined) {
        clears = App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().name)]().toLocaleString('en-US');
        if (lastArea != player.town().dungeon.name || lastRegion != player.region) {
            lastPoke = 0;
            localLocal[4][0] = 0;
            localLocal[4][1] = '';
            localLocal[3] = 0;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
        lastArea = player.town().dungeon.name;
        lastRegion = player.region;
        await phaseCounter(2);
    } else if (App.game.gameState == 6) {
        if (gymsFound == 1) {
            clears = townContent[gymAtX].clears()
            if (lastArea != townContent[gymAtX].leaderName || lastRegion != player.region) {
                lastPoke = 0;
                localLocal[4][0] = 0;
                localLocal[4][1] = '';
                localLocal[3] = 0;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
            lastArea = townContent[gymAtX].leaderName;
            lastRegion = player.region;
            await phaseCounter(4);
        } else if (gymsFound > 1) {
            clears = townContent[Settings.getSetting('gymE4Opts').observableValue() - 1].clears()
            if (lastArea != townContent[Settings.getSetting('gymE4Opts').observableValue() - 1].leaderName || lastRegion != player.region) {
                lastPoke = 0;
                localLocal[4][0] = 0;
                localLocal[4][1] = '';
                localLocal[3] = 0;
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
    document.querySelector("#areaClears > td:nth-child(1)").innerHTML = clears;
}

async function phaseCounter(arg) {
    var arg = arg;

    if (localStorage.getItem(saveKey) != null) {
        localLocal[3] = JSON.parse(localStorage.getItem(saveKey))[3];
    }

    var gymFound = 0;
    var townC = player.town().content;
    for (let x = 0; x < townC.length; x++) {
        if (townC[x].constructor.name == 'Gym') {
            gymFound++;
        }
    }

    if (phaseVal == '' || phaseVal == null || phaseVal == undefined){
        if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
            if (Safari.inProgress() != false) {
                phaseVal = 0;
                localLocal[5] = 0;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
        } else if (player.route() != 0) {
            curRoute = player.route();
            curDungeon = GameConstants.getDungeonIndex(player.town().name);
            for (let rC = 0; rC < Routes.getRoutesByRegion(player.region).length; rC++) {
                if (Routes.getRoutesByRegion(player.region)[rC].number == player.route()) {
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
        } else if (player.town().dungeon != undefined) {
            curRoute = player.route();
            curDungeon = GameConstants.getDungeonIndex(player.town().name);
            cArea = GameConstants.getDungeonIndex(player.town().name);
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
    } else if (document.querySelector("#phaseCount").value != phaseVal) {
        if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
            if (Safari.inProgress() != false) {
                phaseVal = document.querySelector("#phaseCount").value;
                localLocal[5] = phaseVal;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
        } else if (player.route() != 0) {
            phaseVal = document.querySelector("#phaseCount").value;
            cArea = player.route() - 1;
            localLocal[0][player.region][cArea] = phaseVal;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        } else if (player.town().dungeon != undefined) {
            phaseVal = document.querySelector("#phaseCount").value;
            cArea = GameConstants.getDungeonIndex(player.town().name);
            localLocal[1][cArea] = phaseVal;
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }
    } else if (curRoute != player.route() || curDungeon != GameConstants.getDungeonIndex(player.town().name)) {
        if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
            if (Safari.inProgress() != false) {
                phaseVal = document.querySelector("#phaseCount").value;
                phaseVal = localLocal[5];
                phaseVal = localLocal[5];
            }
        } else if (player.route() != 0) {
            curRoute = player.route();
            curDungeon = GameConstants.getDungeonIndex(player.town().name);
            cArea = player.route() - 1;
            phaseVal = localLocal[0][player.region][cArea];
        } else if (player.town().dungeon != undefined) {
            curRoute = player.route();
            curDungeon = GameConstants.getDungeonIndex(player.town().name);
            cArea = GameConstants.getDungeonIndex(player.town().name);
            phaseVal = localLocal[1][cArea];
        }
    }

    switch (arg) {
        case 1: //wild battles
            if (Battle.enemyPokemon().id != null) {
                if (lastEPoke == 0 && Battle.enemyPokemon().id != 0) {
                    lastEPoke = Battle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                    localLocal[3]++;
                } else if ( lastEPoke == Battle.enemyPokemon().id && lastECount == (App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]() + 1) ) {
                    break;
                } else if ( lastECount == App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]() ) {
                    break;
                } else {
                    lastEPoke = Battle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[Battle.enemyPokemon().id]();
                    localLocal[3]++;
                }
                if (Battle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        lastPokeType = 'W: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = Battle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[3] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
						isCurrentShiny = 1;
                    } else if ( lastPoke == Battle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]() ) {
                        break;
                    } else {
                        lastPokeType = 'W: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = Battle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[Battle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[3] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
						isCurrentShiny = 1;

                    }
                } else {
					if (isCurrentShiny == 1) {
						var catchStatus = "";
						phaseLogs = App.game.logbook.logs();
						for (var x = 0; x < 3; x++) {
							var phaseLog = phaseLogs[x];
							if(phaseLog.type.label == "ESCAPED") {
								catchStatus = "Failed";
								break;
							} else if (phaseLog.type.label == "CAUGHT") {
								catchStatus = "Captured";
								break;
							}
						}
                        if (catchStatus == "") {
                            catchStatus = "No Attempt";
                        }
						catchValue = 0;
						isCurrentShiny = 0;
						newPhase = [phaseVal, Routes.getRoute(player.region, player.route()).routeName, "Wild", App.game.party.getPokemon(lastPoke).name, catchStatus, App.game.statistics.routeKills[player.region][player.route()]()];
						phases.push(newPhase);
						localStorage[`phaseTracker${Save.key}`] = JSON.stringify(phases);
						localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
						hasRun = 0;
						a6phases();
					}
				}
            }
            break;
        case 2: //dungeons
            if (DungeonBattle.enemyPokemon() != null) {
                if (lastEPoke == 0 && DungeonBattle.enemyPokemon().id != 0) {
                    lastEPoke = DungeonBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[DungeonBattle.enemyPokemon().id]();
                    localLocal[3]++;
                } else if ( lastEPoke == DungeonBattle.enemyPokemon().id && lastECount == App.game.statistics.pokemonEncountered[DungeonBattle.enemyPokemon().id]() ) {
                    break;
                } else if ( DungeonBattle.enemyPokemon().id == 0 ) {
                    break;
                } else {
                    lastEPoke = DungeonBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[DungeonBattle.enemyPokemon().id]();
                    localLocal[3]++;
                }
                if (DungeonBattle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        if ( DungeonRunner.fightingBoss() == true ) {
                            lastPokeType = 'B: ';
                            localLocal[4][1] = lastPokeType;
                        } else if ( DungeonBattle.trainer() != null ) {
                            App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town().dungeon.name}] You encountered a trainer's Shiny ${DungeonBattle.enemyPokemon().name}.`);
                            lastPokeType = 'T: ';
                            localLocal[4][1] = lastPokeType;
                        } else {
                            lastPokeType = 'W: ';
                            localLocal[4][1] = lastPokeType;
                        }
                        lastPoke = DungeonBattle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[DungeonBattle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[3] = 0;
                        localLocal[1][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
						isCurrentShiny = 1;
                    } else if ( lastPoke == DungeonBattle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[DungeonBattle.enemyPokemon().id]() ) {
                        break;
                    } else {
                        if ( DungeonRunner.fightingBoss() == true ) {
                            lastPokeType = 'B: ';
                            localLocal[4][1] = lastPokeType;
                        } else if ( DungeonBattle.trainer() != null ) {
                            App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town().dungeon.name}] You encountered a trainer's Shiny ${DungeonBattle.enemyPokemon().name}.`);
                            lastPokeType = 'T: ';
                            localLocal[4][1] = lastPokeType;
                        } else {
                            lastPokeType = 'W: ';
                            localLocal[4][1] = lastPokeType;
                        }
                        lastPoke = DungeonBattle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[DungeonBattle.enemyPokemon().id]();
                        phaseVal++;
                        localLocal[3] = 0;
                        localLocal[1][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
						isCurrentShiny = 1;
                    }
                } else {
					if (isCurrentShiny == 1) {
						var encounterType = "";
						var catchStatus = "";
						phaseLogs = App.game.logbook.logs();
						phaseLoop:
						for (var x = 0; x < 3; x++) {
							var phaseLog = phaseLogs[x];
							if (phaseLog.type.label == "SHINY" && lastPokeType == 'B: ') {
								if (phaseLog.description.includes("trainer")) {
									catchStatus = "Boss Trainer";
									encounterType = "Boss"
									break phaseLoop;
								} else {
									if (phaseLogs[x-1].type.label == "CAUGHT") {
										catchStatus = "Boss Captured";
										encounterType = "Boss";
										break phaseLoop;
									} else if (phaseLogs[x-1].type.label == "ESCAPED") {
										catchStatus = "Boss Failed";
										encounterType = "Boss";
										break phaseLoop;
									}
								}
							} else if (phaseLog.type.label == "SHINY" && lastPokeType == 'T: ') {
								catchStatus = "Trainer";
								encounterType = "Trainer";
								break phaseLoop;
							} else if(phaseLog.type.label == "CAUGHT" && lastPokeType == 'W: ') {
								catchStatus = "Captured";
								encounterType = "Wild";
								break phaseLoop;
							} else if(phaseLog.type.label == "ESCAPED" && lastPokeType == 'W: ') {
								catchStatus = "Failed";
								encounterType = "Wild";
								break phaseLoop;
							}
						}
                        if (catchStatus == "") {
                            catchStatus = "No Attempt";
                        }
						catchValue = 0;
						isCurrentShiny = 0;
						newPhase = [phaseVal, player.town().dungeon.name, encounterType, App.game.party.getPokemon(lastPoke).name, catchStatus, App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().dungeon.name)]()];
						phases.push(newPhase);
						localStorage[`phaseTracker${Save.key}`] = JSON.stringify(phases);
						localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
						hasRun = 0;
						a6phases();
					}
				}
            }
            break;
        case 3: //safari
            if (SafariBattle.enemy != undefined) {
                if (lastEPoke == 0) {
                    lastEPoke = SafariBattle.enemy.id;
                    lastECount = App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]();
                    localLocal[3]++;
                } else if ( lastEPoke == SafariBattle.enemy.id && lastECount == App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]() ) {
                    break;
                } else {
                    lastEPoke = SafariBattle.enemy.id;
                    lastECount = App.game.statistics.pokemonEncountered[SafariBattle.enemy.id]();
                    localLocal[3]++;
                }
                if (SafariBattle.enemy.shiny == true) {
                    if (lastPoke == 0) {
                        lastPokeType = 'W: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = SafariBattle.enemy.id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]();
                        phaseVal++;
                        localLocal[3] = 0;
                        localLocal[5] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
						isCurrentShiny = 1;
                    } else if ( lastPoke == SafariBattle.enemy.id && lastCounts == App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]() ) {
                        break;
                    } else {
                        lastPokeType = 'W: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = SafariBattle.enemy.id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[SafariBattle.enemy.id]();
                        phaseVal++;
                        localLocal[3] = 0;
                        localLocal[5] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
						isCurrentShiny = 1;
                    }
                } else {
					if (isCurrentShiny == 1) {
						var catchStatus = "";
						phaseLogs = App.game.logbook.logs();
						for (var x = 0; x < 3; x++) {
							var phaseLog = phaseLogs[x];
							if (phaseLog.type.label == "ESCAPED") {
								catchStatus = "Failed";
								break;
							} else if (phaseLog.type.label == "CAUGHT") {
								catchStatus = "Captured";
								break;
							}
						}
                        if (catchStatus == "") {
                            catchStatus = "No Attempt";
                        }
						catchValue = 0;
						isCurrentShiny = 0;
						newPhase = [phaseVal, "Safari Zone", "Wild", App.game.party.getPokemon(lastPoke).name, catchStatus, "N/A"];
						phases.push(newPhase);
						localStorage[`phaseTracker${Save.key}`] = JSON.stringify(phases);
						localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
						hasRun = 0;
						a6phases();
					}
				}
            }
            break;
        case 4: //gym
            if (GymBattle.enemyPokemon() != null) {
                if (lastEPoke == 0 && GymBattle.enemyPokemon().id != 0) {
                    lastEPoke = GymBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]();
                    localLocal[3]++;
                } else if ( lastEPoke == GymBattle.enemyPokemon().id && lastECount == (App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]() + 1) ) {
                    break;
                } else if ( lastECount == App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]() ) {
                    break;
                } else {
                    lastEPoke = GymBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]();
                    localLocal[3]++;
                }
                if (GymBattle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town().gym.town} Gym] You encountered a trainer's Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[3] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    } else if ( lastPoke == GymBattle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]() ) {
                        break;
                    } else {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town().gym.town} Gym] You encountered a trainer's Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[3] = 0;
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
                    localLocal[3]++;
                } else if ( lastEPoke == GymBattle.enemyPokemon().id && lastECount == (App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]() + 1) ) {
                    break;
                } else if ( lastECount == App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]() ) {
                    break;
                } else {
                    lastEPoke = GymBattle.enemyPokemon().id;
                    lastECount = App.game.statistics.pokemonEncountered[GymBattle.enemyPokemon().id]();
                    localLocal[3]++;
                }
                if (GymBattle.enemyPokemon().shiny == true) {
                    if (lastPoke == 0) {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town().name}] You encountered a ${player.town().gymList[0].town}'s Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[3] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    } else if ( lastPoke == GymBattle.enemyPokemon().id && lastCounts == App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]() ) {
                        break;
                    } else {
                        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town().name}] You encountered a ${player.town().gymList[0].town}'s Shiny ${this.enemyPokemon().name}.`);
                        lastPokeType = 'T: ';
                        localLocal[4][1] = lastPokeType;
                        lastPoke = GymBattle.enemyPokemon().id;
                        localLocal[4][0] = lastPoke;
                        lastCounts = App.game.statistics.shinyPokemonEncountered[GymBattle.enemyPokemon().id]();
                        phaseVal = 0;
                        localLocal[3] = 0;
                        localLocal[0][player.region][cArea] = phaseVal;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    }
                }
            }
    }
    document.querySelector("#phaseCount").value = phaseVal;

    if (localLocal[3].toLocaleString('en-US') == '') {
        document.querySelector("#lastEncounter > td:nth-child(1)").innerHTML = 0;
    } else {
        document.querySelector("#lastEncounter > td:nth-child(1)").innerHTML = localLocal[3].toLocaleString('en-US');
    }
    localStorage.setItem(saveKey, JSON.stringify(localLocal));
}

function removePhase(id){
	var newArray = [];
	for(var x = 0; x < phases.length; x++){
		if(x !== id){
			newArray.push(phases[x]);
		}
	}
	phases = newArray;
	localStorage[`phaseTracker${Save.key}`] = JSON.stringify(phases);
	localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
	hasRun = 0;
	a6phases();
}

function removeAllPhases(){
	phases = [];
	localStorage[`phaseTracker${Save.key}`] = JSON.stringify(phases);
	localStorage.setItem(`phaseTracker${Save.key}`, JSON.stringify(phases));
	hasRun = 0;
	a6phases();
}

async function a6export() {
    hasExported = 0;
    var test_array = phases;
    var csv = test_array.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"`: String(item)).join(',')).join('\n');
    var data = encodeURI('data:text/csv;charset=utf-8,' + csv);

    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', 'phases.csv');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function a6phases() {
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
    		for(var x = 0; x < phases.length; x++){
    			var tablePhase = document.createElement('tr');
    			var phaseId = "phase" + x;
    			tablePhaseQuery = "<tr><td>" + phases[x][0] + "</td>" + "<td>" + phases[x][1] + "</td>" + "<td>" + phases[x][2] + "</td>" + "<td>" + phases[x][3] + "</td>" + "<td>" + phases[x][4] + "</td>" + "<td>" + phases[x][5] + "</td>" + "<td>" + "<button type=\"button\" class=\"btn btn-primary\" onclick=\"removePhase(" + x + ")\">Remove</button>" + "</td></tr>";
    			tablePhase.innerHTML = tablePhaseQuery;
    			tablePhase.style.display = "none";
    			phaseTable.append(tablePhase);
    			var childNumber = x + 1;
    			if (x < Number(Settings.getSetting('phaseCount').observableValue())) {
    				var displayQuery = "#phaseTable tbody > tr:nth-child(" + childNumber + ")";
    				document.querySelector(displayQuery).removeAttribute("style");
    				hasRun = 1;
    			}
    		}
    	}
    	localStorage[`phaseTracker${Save.key}`] = JSON.stringify(phases);
    }
}

async function dungeonBot() {
    if (App.game.gameState == 6) {
        stage = 0;
        started = 0;
        chestOpened = 0;
        if (App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() >= DungeonRunner.dungeon.tokenCost) {
            DungeonRunner.initializeDungeon(player.town().dungeon);
        }
    } else if ( DungeonRunner.timeLeft() != -10 && DungeonRunner.dungeonFinished() != true) {
        for (let aa = 0; aa < DungeonRunner.map.board().length; aa++) {
            for (let bb = 0; bb < DungeonRunner.map.board()[aa].length; bb++) {
                var cellType = DungeonRunner.map.board()[aa][bb].type();
                if (cellType == 4) {
                    bossA = aa;
                    bossB = bb;
                }
            }
        }
        var pX = DungeonRunner.map.playerPosition().x;
        var pY = DungeonRunner.map.playerPosition().y;
        if ( Settings.getSetting('botRush').observableValue() == true) {
            if (App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(DungeonRunner.dungeon.name)]() >= 200) {
                if (Math.abs(DungeonRunner.map.playerPosition().y - bossA) <= 1) {
                    if (pX == bossB) {
                        await DungeonRunner.map.moveToCoordinates(bossB,bossA);
                        await DungeonRunner.handleClick();
                    }
                }
                if (Math.abs(DungeonRunner.map.playerPosition().x - bossB) <= 1) {
                    if (pY == bossA) {
                        await DungeonRunner.map.moveToCoordinates(bossB,bossA);
                        await DungeonRunner.handleClick();
                    }
                }
            }
            if (pX == bossB && pY == bossA) {
                await DungeonRunner.handleClick();
            }
        }
        if ( Settings.getSetting('chestCollect').observableValue() == true) {
            if (DungeonRunner.map.currentTile().type() == 3) {
                if (chestOpened < Settings.getSetting('maxChests').observableValue()) {
                    DungeonRunner.handleClick();
                    chestOpened++
                }
            }
        }
        var dClears = App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().dungeon.name)]();
        var dSize = player.region;

        if (started == 0){
            moveBoss = 0;
            if (dClears < 10) {
                dSize = player.region;
                dMax = 4 + player.region;
            } else if (dClears < 100) {
                dSize = player.region - 1;
                dMax = 4 + player.region - 1;
            } else if (dClears < 1000) {
                dSize = player.region - 2;
                dMax = 4 + player.region - 2;
            } else if (dClears < 10000) {
                dSize = player.region - 3;
                dMax = 4 + player.region - 3;
            } else if (dClears < 100000) {
                dSize = player.region - 4;
                dMax = 4 + player.region - 4;
            } else {
                dSize = player.region - 5;
                dMax = 4 + player.region - 5;
            }
            if (dSize < 0) {
                dSize = 0;
            }
            if (dMax < 4) {
                dMax = 4;
            }
            dMaxY = dMax;
            if (pY == dMax) {
                DungeonRunner.map.moveLeft();
                if (pX == 0 && pY == dMax) {
                    started = 1;
                }
            }
        } else {
            if (moveBoss == 1) {
                if (pX == bossB && pY == bossA) {
                    await DungeonRunner.handleClick();
                }
            } else {
                DungeonRunner.map.moveRight();
                if (pX == dMax && pY == dMaxY) {
                    await DungeonRunner.map.moveToCoordinates(0,dMaxY);
                    await DungeonRunner.map.moveUp();
                    dMaxY = dMaxY - 1;
                } else if (pX == dMax && pY == 0) {
                    await DungeonRunner.map.moveToCoordinates(bossB,bossA);
                    moveBoss = 1;
                }
            }
        }
    }
}

async function gymBot() {
    if (App.game.gameState == 6) {
        var gymsFound = 0;
        var gymAtX = 0;
        var townContent = player.town().content;
        for (let x = 0; x < townContent.length; x++) {
            if (townContent[x].leaderName != null ) {
                gymsFound++;
                gymAtX = x;
            }
        }

        if (gymsFound == 1) {
            if (townContent[gymAtX].isUnlocked() == true) {
                switch(Settings.getSetting('gymOpts').observableValue()) {
                    case "gymOptC":
                        if ((townContent[gymAtX].clears() || 0) < Number(Settings.getSetting('maxClears').observableValue())) {
                            GymRunner.startGym(townContent[gymAtX]);
                        }
                        break;
                    case "gymOptN":
                        GymRunner.startGym(townContent[gymAtX]);
                }
            }
        } else if (gymsFound > 1) {
            var pickE4 = Settings.getSetting('gymE4Opts').observableValue();
            if (townContent[pickE4 - 1].isUnlocked() == true) {
                switch (pickE4) {
                    case "1":
                        GymRunner.startGym(townContent[0]);
                        break;
                    case "2":
                        GymRunner.startGym(townContent[1]);
                        break;
                    case "3":
                        GymRunner.startGym(townContent[2]);
                        break;
                    case "4":
                        GymRunner.startGym(townContent[3]);
                        break;
                    case "5":
                        GymRunner.startGym(townContent[4]);
                        break;
                    default:
                        GymRunner.startGym(townContent[0]);
                }
            }
        }
    }
}

async function safariBot() {
    let bound = {x: Safari.grid[0].length, y: Safari.grid.length};
    let matrix = Array.from({length: bound.y}, () => Array.from({length: bound.x}, () => Infinity));
    const dirOrder = (()=> {
        const lastDir = Safari.lastDirection
        switch (lastDir) {
            case 'left': priority = 'right'; break;
            case 'up': priority = 'down'; break;
            case 'right': priority = 'left'; break;
            case 'down': priority = 'up'; break;
        }
        return [...new Set([priority, lastDir, 'up', 'down', 'left', 'right'])]
    })();

    let nearestGrass = {x:0, y:0, d:Infinity}
    const walkable = [
        0, //ground
        10, //grass
        11,12,13,14,21,22,23,24,15,16,17,18,19 //sand
    ];

    movementMatrix = (origin) => {
        let queue = new Set([JSON.stringify(origin)]);
        for(let p = 0; p < queue.size; p++) {
            let {x, y} = JSON.parse([...queue][p]);
            if (!walkable.includes(Safari.grid[y][x]))
                continue;

            const next = dirOrder.map((dir) => {
                const xy = Safari.directionToXY(dir)
                xy.x += x
                xy.y += y
                return xy;
            }).filter(({x,y})=> y < bound.y && y >= 0 && x < bound.x && x >= 0 );
            for (let n = 0; n < next.length; n++)
                queue.add(JSON.stringify(next[n]));

            if (x == origin.x && y == origin.y)
                matrix[y][x] = 0;
            else {
                matrix[y][x] = Math.min(...next.map(({x, y}) => matrix[y][x])) + 1;

                if (Safari.completed(true)) {
                    if (Safari.grid[y][x] != 10 && matrix[y][x] < nearestGrass.d)
                        nearestGrass = {x, y, d: matrix[y][x]};
                } else {
                    if (Safari.grid[y][x] == 10 && matrix[y][x] < nearestGrass.d && next.map(({x,y}) => Safari.grid[y][x]).includes(10))
                        nearestGrass = {x, y, d: matrix[y][x]};
                }
            }
        }
    }

    if (Safari.inProgress() && document.querySelector("#safariModal").classList.contains('show')) {
        if (Safari.inBattle()) {
            if (!SafariBattle.busy()) {
                if (SafariBattle.enemy.shiny && !App.game.party.alreadyCaughtPokemon(SafariBattle.enemy.id, true)) {
                    if (SafariBattle.enemy.eatingBait != 2 && App.game.farming.berryList[11]() > 25) {
                        SafariBattle.throwBait(2);
                    } else if (Safari.balls() > 0) { //prevent balls to be negativ and lock the safari
                        SafariBattle.throwBall();
                    }
                } else {
                    SafariBattle.run();
                    setTimeout(()=> {
                        SafariBattle.busy(false);
                    }, 1600); // anti soft lock
                }
            }
        } else {
            let dest = {d: Infinity}
            movementMatrix(Safari.playerXY)

            const pkm = Safari.pokemonGrid();
            for (let i = 0; i < pkm.length; i++) {
                const dist = matrix[pkm[i].y][pkm[i].x];
                if (
                    pkm[i].shiny && !App.game.party.alreadyCaughtPokemon(pkm[i].id, true) &&
                    dist < dest.d && dist < pkm[i].steps
                ) {
                    dest = pkm[i];
                    dest.d = dist;
                }
            }
            if (dest.d == Infinity)
                dest = nearestGrass;

            movementMatrix(dest);
            const next = dirOrder.map(dir => {
                const xy = Safari.directionToXY(dir);
                xy.x += Safari.playerXY.x;
                xy.y += Safari.playerXY.y;

                if (xy.y >= bound.y || xy.y < 0 || xy.x >= bound.x || xy.x < 0)
                    return null;
                return {dir, ...xy, d: matrix[Safari.playerXY.y][Safari.playerXY.x] - matrix[xy.y][xy.x]}
            }).filter((n) => n && n.d > 0);

            if (next[0])
                Safari.step(next[0].dir);
        }
    }
}

async function bfBot() {
    if (App.game.gameState == 8) {
        switch(Settings.getSetting('bfOpts').observableValue()) {
            case "bfOptL":
                if (BattleFrontierRunner.started() == true) {
                    if (BattleFrontierRunner.stage() >= Number(Settings.getSetting('maxLvl').observableValue())) {
                        BattleFrontierRunner.end();
                    }
                } else {
                    BattleFrontierRunner.start();
                }
                break;
            case "bfOptT":
                if (BattleFrontierRunner.started() == true) {
                    if (Number(BattleFrontierRunner.timeLeftSeconds()) <= Number(Settings.getSetting('maxTime').observableValue())) {
                        BattleFrontierRunner.end();
                    }
                } else {
                    BattleFrontierRunner.start();
                }
                break;
            case "bfOptN":
                if (BattleFrontierRunner.started() != true) {
                    BattleFrontierRunner.start();
                }
        }
    }
}

function plantLayout(layout) {
    const berrieOrder = Object.keys(layout).sort((a, b) =>  App.game.farming.berryData[b].growthTime[3] - App.game.farming.berryData[a].growthTime[3])

    for (let i = 0; i < berrieOrder.length; i++) {
        if (App.game.farming.plotList[layout[berrieOrder[i]][0]].berry == -1) {
            if (i > 0) {
                const plot = App.game.farming.plotList[layout[berrieOrder[0]][0]];
                if (plot?.berryData?.growthTime[3] - plot?.age > App.game.farming.berryData[berrieOrder[i]]?.growthTime[3]) {
                    continue;
                }
            }

            layout[berrieOrder[i]].forEach(plot => App.game.farming.plant(plot, berrieOrder[i]))
        }
    }
}

async function plantBot() {
    var selectedBerry = Settings.getSetting('botstate.plant').value;
    var berryId = BerryType[selectedBerry];

    if (berryId >= 0 && App.game.farming.unlockedBerries[berryId]()) {
        if (App.game.farming.plotList[12].isEmpty() == true){
            if (App.game.farming.berryList[berryId]() > 1) {
                if (App.game.farming.plotList[12].isEmpty() == true) {
                    FarmController.selectedBerry(berryId);
                    App.game.farming.plantAll(FarmController.selectedBerry());
                } else if (App.game.farming.plotList[12].age > App.game.farming.berryData[b].growthTime[3]) {
                    App.game.farming.harvestAll();
                }
            }
        }

        if (App.game.farming.plotList.some(p => p.berry != -1 && (p.age > p.berryData.growthTime[3]))) {
            App.game.farming.harvestAll();
        }
    } else {
        const layouts = {
            "S+C": {
                65: [5,6,7,8,9,15,16,17,18,19],
                40: [0,1,2,3,4,10,11,12,13,14,20,21,22,23,24]
            },
            "S+L": {
                65: [0,1,2,3,4,5,7,9,10,11,12,13,14,15,17,19,20,21,22,23,24],
                19: [6,8,16,18]
            },
            "S+L+C": {
                65: [5,7,9,15,17,19],
                19: [6,8,16,18],
                40: [0,1,2,3,4,10,11,12,13,14,20,21,22,23,24]
            }
        }

        if (selectedBerry.endsWith('+P')) {
            const tp = App.game.farming.plotList[7];
            const bp = App.game.farming.plotList[17];

            if (tp.berry == -1 || bp.berry == BerryType.Petaya && bp.age >= bp.berryData.growthTime[4] - 10 - bp.berryData?.growthTime[3]  && tp.berry != BerryType.Petaya) {
                App.game.farming.harvest(7);
                App.game.farming.plant(7,BerryType.Petaya);
            } else if (tp.berry == BerryType.Petaya && tp.age > tp.berryData.growthTime[4] - 10) {
                App.game.farming.harvest(7);
                App.game.farming.plant(7,BerryType.Starf);
            }

            if (tp.berry == BerryType.Petaya && tp.age >= tp.berryData.growthTime[4] - 10 - tp.berryData?.growthTime[3] && bp.berry != BerryType.Petaya) {
                App.game.farming.harvest(17);
                App.game.farming.plant(17,BerryType.Petaya);
            } else if (bp.berry == -1 || bp.berry == BerryType.Petaya && bp.age > bp.berryData.growthTime[4] - 10) {
                App.game.farming.harvest(17);
                App.game.farming.plant(17,BerryType.Starf);
            }
        }

        plantLayout(layouts[selectedBerry.replace('+P', '')]);
        if (!App.game.farming.berryInFarm(BerryType.Petaya, PlotStage.Berry, true)
        && App.game.farming.plotList.some(p => p.berry != -1 && (p.age > p.berryData.growthTime[4] - 5))) {
            App.game.farming.harvestAll();
        }
    }
}

async function mutateBot() {
    const all = Array.from({length: App.game.farming.plotList.length}, (_,i) => i);
    const mutationLayouts = {
        'Persim': { 2:[6], 6:[12] },
        'Razz': { 0:[6], 5:[12] },
        'Bluk': { 1:[6], 5:[12] },
        'Nanab': { 2:[6], 4:[12] },
        'Wepear': { 3:[6], 6:[12] },
        'Pinap': { 7:[6], 4:[12] },
        'Figy': { 0:[7,11,12] },
        'Wiki': { 1:[7,11,12] },
        'Mago': { 2:[7,11,12] },
        'Aguav': { 3:[7,11,12] },
        'Iapapa': { 4:[7,11,12] },
        'Lum': { 7:[6], 6:[7], 5:[11], 4:[8], 3:[16], 2:[13], 1:[17], 0:[18]},
        // 3x3 throigh Grepa, then 5x5
        'Pomeg': { 18:[12], 16:[6] },
        'Kelpsy': { 8:[12], 1:[6] },
        'Qualot': { 16:[12], 13:[6] },
        'Hondew': { 15:[12], 17:[13], 14:[8] },
        'Grepa': { 17:[12], 14:[6] },
        'Tamato': { 20:[6,9,21,24], 9:[0,1,2,3,4,5,7,8,10,11,12,13,14,15,16,17,18,19,20,22,23] },
        'Cornn': { 15:[6,9,21,24], 10:[5,8,20,23], 5:[1,4,16,19] },
        'Magost': { 16:[6,9,21,24], 11:[5,8,20,23], 2:[1,4,16,19] },
        'Rabuta': { 17:[6,9,21,24], 4:[0,1,2,3,4,5,7,8,10,11,12,13,14,15,16,17,18,19,20,22,23] },
        'Nomel': { 13:[6,9,21,24] },
        'Spelon': { 25:all },
        'Pamtre': { 26:all },
        'Watmel': { 27:all },
        'Durin': { 28:all },
        'Belue': { 29:all },
        'Occa': { 30:[5,9,22], 25:[0,4,17], 14:[2,15,19], 9:[7,20,24] },
        'Passho': { 1:[5,9,22], 6:[0,4,17], 21:[2,15,19], 43:[7,20,24] },
        'Wacan': { 22:[5,9,22], 18:[0,4,17], 13:[2,15,19], 24:[7,20,24] },
        'Rindo': { 17:[6,9,21,24], 14:[0,3,15,18] },
        'Yache': { 36:[0,2,4,10,12,14,20,22,24] },
        'Chople': { 30:all },
        'Kebia': { 31:all },
        'Shuca': { 32:all },
        'Coba': { 17:[6,9,21,24], 15:[0,3,15,18] },
        'Payapa': { 10:[5,9,22], 15:[0,4,17], 26:[2,15,19], 31:[7,20,24] },
        'Tanga': { 38:[0,1,2,3,4,5,7,9,10,11,12,13,14,15,17,19,20,21,22,23,24] },
        'Charti': { 26:all },
        'Kasib': { 0:all },
        'Haban': { 35:[12], 38:[1,9,15,23], 36:[3,5,19,21], 37:[2,10,14,22] },
        'Colbur': { 44:[6,9,21,24], 28:[1,4,16,19], 47:[5,8,20,23] },
        'Babiri': { 42:[0,1,2,3,4,7,17,20,21,22,23,24], 47:[5,9,10,11,12,13,14,15,19] },
        'Chilan': { 40:all },
        'Roseli': { 11:[5,9,22], 16:[0,4,17], 27:[2,15,19], 32:[7,20,24] },
        'Micle': { 31:[0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24] },
        'Custap': { 32:[0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24] },
        'Jaboca': { 33:[0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24] },
        'Rowap': { 34:[0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24] },
        'Kee': { 60:[6,9,21,24], 59:[0,3,15,18] },
        'Maranga': { 62:[6,9,21,24], 61:[0,3,15,18] },
        'Liechi': { 36:[0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
        'Ganlon': { 42:[0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
        'Salac': { 43:[0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
        'Petaya': { 48:[24], 50:[16], 39:[14], 42:[15], 46:[10], 40:[21], 44:[12], 38:[22], 49:[4], 36:[13], 52:[17], 35:[0], 43:[11], 51:[23], 45:[18], 37:[19], 41:[2], 47:[20] },
        'Apicot': { 51:[0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
        'Lansat': { 52:[0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
    }

    const selectedBerry = Settings.getSetting('botstate.mutate').value;
    plantLayout(mutationLayouts[selectedBerry]);

    if (App.game.farming.plotList.some(p => p.berry != -1 && 
        (p.age >  p.berryData.growthTime[4] - 5 || p.berry == BerryType[selectedBerry] &&  p.age > p.berryData.growthTime[3])
    )) {
        App.game.farming.harvestAll();
    }
}

async function autoBreed() {
    if (App.game.breeding.hasFreeEggSlot() == true) {
        if(Settings.getSetting('breedingOpts').observableValue() == 'none' || Settings.getSetting('breedingOpts').observableValue() == 'attack'){
            PartyController.hatcherySortedList = [...App.game.party.caughtPokemon];
            let sortededHatcheryList = PartyController.hatcherySortedList.sort(PartyController.compareBy(Settings.getSetting('hatcherySort').observableValue(), Settings.getSetting('hatcherySortDirection').observableValue()));
            let filteredEggList = sortededHatcheryList.filter( (partyPokemon) => {
                if (partyPokemon.breeding || partyPokemon.level < 100) {
                    return false;
                }
                if (!BreedingFilters.search.value().test(partyPokemon.name)) {
                    return false;
                }
                if (BreedingFilters.category.value() >= 0) {
                    if (partyPokemon.category !== BreedingFilters.category.value()) {
                        return false;
                    }
                }
                if (BreedingFilters.shinyStatus.value() >= 0) {
                    if (+partyPokemon.shiny !== BreedingFilters.shinyStatus.value()) {
                        return false;
                    }
                }
                if (BreedingFilters.region.value() > -2) {
                    if (PokemonHelper.calcNativeRegion(partyPokemon.name) !== BreedingFilters.region.value()) {
                        return false;
                    }
                }
                const type1 = BreedingFilters.type1.value() > -2 ? BreedingFilters.type1.value() : null;
                const type2 = BreedingFilters.type2.value() > -2 ? BreedingFilters.type2.value() : null;
                if (type1 !== null || type2 !== null) {
                    const { type: types } = pokemonMap[partyPokemon.name];
                    if ([type1, type2].includes(PokemonType.None)) {
                        const type = type1 == PokemonType.None ? type2 : type1;
                        if (!BreedingController.isPureType(partyPokemon, type)) {
                            return false;
                        }
                    } else if ((type1 !== null && !types.includes(type1)) || (type2 !== null && !types.includes(type2))) {
                        return false;
                    }
                }
                if(Settings.getSetting('breedingOpts').observableValue() == 'attack') {
                    var breedAtk = Settings.getSetting('minBreedAttack').observableValue();
                    if (partyPokemon._attack() > breedAtk) {
                        return false;
                    }
                }
                return true;
            });
            [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
            if (filteredEggList[0] != undefined) {
                App.game.breeding.addPokemonToHatchery(filteredEggList[0]);
            }
        } else if(Settings.getSetting('breedingOpts').observableValue() == 'mystery') {
            if (player.itemList["Mystery_egg"]() >= 1) {
                ItemList["Mystery_egg"].use();
            } else {
                Settings.setSettingByName('breedingOpts','none');
                Notifier.notify({
                    title: `[SCRIPT] ACSRQ`,
                    message: `You're out of eggs!`,
                    type: NotificationConstants.NotificationOption.warning,
                    timeout: 5 * GameConstants.SECOND,
                });
            }
            [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
        } else if(Settings.getSetting('breedingOpts').observableValue() == 'typed') {
            var typeEggU = Settings.getSetting('typedEggOpts').observableValue();
            typeEggU = typeEggU.charAt(0).toUpperCase() + typeEggU.slice(1) + '_egg';
            if (player._itemList[typeEggU]() >= 1) {
                ItemList[typeEggU].use();
            } else {
                Settings.setSettingByName('breedingOpts','none');
                Notifier.notify({
                    title: `[SCRIPT] ACSRQ`,
                    message: `You're out of eggs!`,
                    type: NotificationConstants.NotificationOption.warning,
                    timeout: 5 * GameConstants.SECOND,
                });
            }
            [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
        } else if(Settings.getSetting('breedingOpts').observableValue() == 'fossil') {
            var fossilU = Settings.getSetting('fossilOpts').observableValue();
            if (player.mineInventory().find(i => i.name == fossilU).amount() >= 1) {
                Underground.sellMineItem(player.mineInventory().find(i => i.name == fossilU).id);
            } else {
                Settings.setSettingByName('breedingOpts','none');
                Notifier.notify({
                    title: `[SCRIPT] ACSRQ`,
                    message: `You're out of ${fossilU}s!`,
                    type: NotificationConstants.NotificationOption.warning,
                    timeout: 5 * GameConstants.SECOND,
                });
            }
            [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
        }
    } else {
        [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
    }
}

async function ballBot() {
    const buyOpts = Settings.getSetting('ballBuyOpts').observableValue();
    const purAmount = Number(Settings.getSetting('ballPurAmount').observableValue());
    const minAmount = Number(Settings.getSetting('minBallAmount').observableValue());

    if (buyOpts == -1 || App.game.pokeballs.pokeballs[buyOpts].quantity() > minAmount)
        return;

    let shop;
    if (App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Champion Lance')]()) {
        shop = pokeMartShop;
    } else {
        switch (player.region) {
            case GameConstants.Region.kanto:
                shop = [ViridianCityShop, LavenderTownShop, FuchsiaCityShop][buyOpts];
                break;
            case GameConstants.Region.johto:
                shop = [CherrygroveCityShop, GoldenrodDepartmentStoreShop, GoldenrodDepartmentStoreShop][buyOpts];
                break;
            case GameConstants.Region.hoenn:
                shop = [OldaleTownShop, SlateportCityShop, FortreeCityShop][buyOpts];
                break;
            case GameConstants.Region.sinnoh:
                shop = [SandgemTownShop, HearthomeCityShop, DepartmentStoreShop][buyOpts];
                break;
            case GameConstants.Region.unova:
                shop = [FloccesyTownShop, VirbankCityShop, MistraltonCityShop][buyOpts];
                break;
            case GameConstants.Region.kalos:
                shop = [AquacordeTownShop, DepartmentStoreShop, DepartmentStoreShop][buyOpts];
                break;
            case GameConstants.Region.alola:
                shop = [HauoliCityShop, HeaheaCityShop, DepartmentStoreShop][buyOpts];
                break;
        }
    }

    if (shop.isUnlocked() && (!shop.parent || shop.parent?.isUnlocked())) {
        let item = shop.items.find(({name}) => name == GameConstants.Pokeball[buyOpts]);

        if (!(item && item.isAvailable()  && item.price() == item.basePrice)) {
            return;
        }

        ShopHandler.showShop(shop);
        ShopHandler.setSelected(shop.items.indexOf(item));
        ShopHandler.amount(purAmount);

        if (!App.game.wallet.hasAmount(new Amount(item.totalPrice(ShopHandler.amount()), item.currency))) {
            ShopHandler.maxAmount();
        }
        ShopHandler.buyItem();
    }
}
