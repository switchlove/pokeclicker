var clickEngagedD, clickEngagedG, clickEngagedS, clickEngagedBF, clickEngagedSR, chestOpened, curDungeon, curRoute, dMax, dMaxY, evoName, evoUsed, lastArea, lastPokeType, lastRegion, leftStep, localLocal, menuPos, phases, phaseVal, save, saveKey, saveLoaded, smnName, smnUsed;

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

window.addEventListener("load", function() {
    setTimeout(function(){
        main();

        setInterval(function(){
            main();
        }, 500);

        Settings.add(new Setting('menuPlace', 'Place ACSRQ window after this:',
        [
            new SettingOption('Achievement Tracker', 'achivementTrackerContainer'),
            new SettingOption('Battle Items', 'battleItemContainer'),
            new SettingOption('Hatchery', 'breedingDisplay'),
            new SettingOption('Oak Items', 'oakItemsContainer'),
            new SettingOption('Pokémon List', 'pokemonListContainer'),
            new SettingOption('Quests', 'questDisplayContainer'),
            new SettingOption('Town Map', 'townMap'),
            new SettingOption('Pokéballs', 'pokeballSelector'),
        ], 'pokeballSelector'));
        Settings.add(new BooleanSetting('hideNoti', 'Hide all notifications', false));
        Settings.add(new BooleanSetting('gideBItem', 'Hide Battle Item window', false));
        Settings.add(new BooleanSetting('hideOak', 'Hide Oak Item window', false));
        Settings.add(new BooleanSetting('disableSave', 'Prevent AutoSave', false));
        Settings.add(new BooleanSetting('disEvent', 'Disable special events', false));
        Settings.add(new BooleanSetting('noWander', 'Hide normal Wander log entries', false));
        Settings.add(new BooleanSetting('showShiny', 'Show needed shinies', false));
        Settings.add(new BooleanSetting('showLoot', 'Show possible dungeon loot', false));
        Settings.add(new BooleanSetting('trackPhases', 'Track shiny phases and display below', false));
		Settings.add(new Setting('phaseCount', 'phaseCount', [], '100'));

        Settings.add(new BooleanSetting('botOptions', 'Enable bot options', false));
        Settings.add(new BooleanSetting('botRush', 'Boss rush in dungeons', false));
        Settings.add(new BooleanSetting('chestCollect', 'Open chests in dungeons', false));
        Settings.add(new Setting('dungeOpts', 'Dungeon bot stop options:',
        [
            new SettingOption('None', 'dungOptN'),
            new SettingOption('Clears', 'dungOptC'),
            new SettingOption('Shiny Check', 'dungOptSC'),
            new SettingOption('Dungeon Tokens Left', 'dungOptDT'),
        ], 'dungOptN'));
        Settings.add(new Setting('gymOpts', 'Gym bot stop options:',
        [
            new SettingOption('Clears', 'gymOptC'),
            new SettingOption('None', 'gymOptN'),
        ], 'gymOptN'));
        Settings.add(new Setting('gymE4Opts', 'E4 Boss to fight:',
        [
            new SettingOption('First', '1'),
            new SettingOption('Second', '2'),
            new SettingOption('Third', '3'),
            new SettingOption('Fourth', '4'),
            new SettingOption('Fifth', '5'),
        ], '1'));
        Settings.add(new Setting('bfOpts', 'Battle Frontier stop options:',
        [
            new SettingOption('None', 'bfOptN'),
            new SettingOption('Time', 'bfOptT'),
            new SettingOption('Level', 'bfOptL'),
        ], 'bfOptN'));
        Settings.add(new Setting('maxChests', 'maxChests', [], '1'));
        Settings.add(new Setting('maxClears', 'maxClears', [], '1000'));
        Settings.add(new Setting('minDT', 'minDT', [], '10000'));
        Settings.add(new Setting('maxLvl', 'maxLvl', [], '100'));
        Settings.add(new Setting('maxTime', 'maxTime', [], '30'));
        Settings.add(new Setting('srOpts', 'Soft Reset Type:',
        [
            new SettingOption('None', 'none'),
            new SettingOption('Mystery Eggs', 'mys'),
            new SettingOption('Evo Items', 'evo'),
            new SettingOption('Fossils', 'fos'),
            new SettingOption('Shop Mon', 'poke'),
            new SettingOption('Regular Eggs', 'egg'),
        ], 'none'));
        Settings.add(new Setting('evoOpts', 'Soft Reset Evo Item:',
        [
            new SettingOption('Dawn Stone', 'Dawn_stone'),
            new SettingOption('Deepsea Scale', 'Deepsea_scale'),
            new SettingOption('Deepsea Tooth', 'Deepsea_tooth'),
            new SettingOption('Dragon Scale', 'Dragon_scale'),
            new SettingOption('Dubious Disc', 'Dubious_disc'),
            new SettingOption('Dusk Stone', 'Dusk_stone'),
            new SettingOption('Electirizer', 'Electirizer'),
            new SettingOption('Fire Stone', 'Fire_stone'),
            new SettingOption('Kings Rock', 'Kings_rock'),
            new SettingOption('Leaf Stone', 'Leaf_stone'),
            new SettingOption('Magmarizer', 'Magmarizer'),
            new SettingOption('Metal Coat', 'Metal_coat'),
            new SettingOption('Moon Stone', 'Moon_stone'),
            new SettingOption('Prism Scale', 'Prism_scale'),
            new SettingOption('Protector', 'Protector'),
            new SettingOption('Razor Claw', 'Razor_claw'),
            new SettingOption('Razor Fang', 'Razor_fang'),
            new SettingOption('Reaper Cloth', 'Reaper_cloth'),
            new SettingOption('Sachet', 'Sachet'),
            new SettingOption('Shiny Stone', 'Shiny_stone'),
            new SettingOption('Soothe Bell', 'Soothe_bell'),
            new SettingOption('Sun Stone', 'Sun_stone'),
            new SettingOption('Thunder Stone', 'Thunder_stone'),
            new SettingOption('Linking Cord', 'Linking_cord'),
            new SettingOption('Upgrade', 'Upgrade'),
            new SettingOption('Water Stone', 'Water_stone'),
            new SettingOption('Whipped Dream', 'Whipped_dream'),
        ], 'Water_stone'));
        Settings.add(new Setting('breedingOpts', 'Breeding options:',
        [
            new SettingOption('None', 'none'),
            new SettingOption('Upto Attack', 'attack'),
            new SettingOption('Mystery Eggs', 'mystery'),
            new SettingOption('Typed Eggs', 'typed'),
            new SettingOption('Fossils', 'fossil'),
        ], 'none'));
        Settings.add(new Setting('minBreedAttack', 'minBreedAttack', [], '1000'));
        Settings.add(new Setting('typedEggOpts', 'Typed egg to use:',
        [
            new SettingOption('Fire', 'fire'),
            new SettingOption('Water', 'water'),
            new SettingOption('Grass', 'grass'),
            new SettingOption('Electric', 'electric'),
            new SettingOption('Fighting', 'fighting'),
            new SettingOption('Dragon', 'dragon'),
        ], 'fire'));
        Settings.add(new Setting('fossilOpts', 'Fossil to use:',
        [
            new SettingOption('Dome', 'dome'),
            new SettingOption('Helix', 'helix'),
            new SettingOption('Amber', 'amber'),
            new SettingOption('Root', 'root'),
            new SettingOption('Claw', 'claw'),
            new SettingOption('Skull', 'skull'),
            new SettingOption('Armor', 'armor'),
            new SettingOption('Plume', 'plume'),
            new SettingOption('Cover', 'cover'),
            new SettingOption('Jaw', 'jaw'),
            new SettingOption('Sail', 'sail'),
        ], 'dome'));
        Settings.add(new Setting('evoItemCount', 'evoItemCount', [], '1'));
        Settings.add(new Setting('ballBuyOpts', 'Auto-purchase pokeballs?',
        [
            new SettingOption('None', 'none'),
            new SettingOption('Pokéball', 'pokeB'),
            new SettingOption('Greatball', 'greatB'),
            new SettingOption('Ultraball', 'ultraB'),
        ], 'none'));
        Settings.add(new Setting('minBallAmount', 'minBallAmount', [], '0'));
        Settings.add(new Setting('ballPurAmount', 'ballPurAmount', [], '1000'));
        Settings.add(new Setting('safariOpts', 'Safari bot stop options:',
        [
            new SettingOption('None', 'safariOptN'),
            new SettingOption('Shiny Check', 'safariOptSC'),
        ], 'safariOptSC'));
        /*Settings.add(new Setting('mutateMulch', 'Use Mulch with Mutate bot?',
        [
        new SettingOption('None', 'none'),
        new SettingOption('Boost Mulch', 'boostM'),
        ], 'none'));*/

        const settingsModal = document.getElementById('settingsModal');
        const tabs = settingsModal.getElementsByClassName('nav-tabs')[0];
        const tabContent = settingsModal.getElementsByClassName('tab-content')[0];

        const a6TabEl = document.createElement('div');
        a6TabEl.className = 'tab-pane';
        a6TabEl.id = 'settings-a6csrq';
        a6TabEl.innerHTML = ``;
        tabContent.appendChild(a6TabEl);

        const a6Tab1 = document.createElement('li');
        a6Tab1.className = 'nav-item';

        const a6Tab1Inner = document.createElement('a');
        a6Tab1Inner.innerText = 'ACSRQ';
        a6Tab1Inner.className = 'nav-link';
        a6Tab1Inner.href = '#settings-a6csrq1';
        a6Tab1Inner.dataset.toggle = 'tab';

        a6Tab1.appendChild(a6Tab1Inner);
        tabs.appendChild(a6Tab1);

        const a6Tab1El = document.createElement('div');
        a6Tab1El.className = 'tab-pane';
        a6Tab1El.id = 'settings-a6csrq1';
        a6Tab1El.innerHTML = `<table class="table table-striped table-hover m-0"><tbody>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('menuPlace')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('hideNoti')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('gideBItem')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('hideOak')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('disableSave')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('disEvent')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('noWander')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('showShiny')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('showLoot')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('trackPhases')}"></tr>
        <tr><td class="p-2">Amount of phases to keep track of:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value); hasRun = 0; a6phases();" id="phaseCount" name="phaseCount" data-bind="value: Settings.getSetting('phaseCount').observableValue() || ''" value="100"></td></tr>
		</tbody></table>
        </tbody></table>`;
        tabContent.appendChild(a6Tab1El);

        const a6Tab2 = document.createElement('li');
        a6Tab2.className = 'nav-item';

        const a6Tab2Inner = document.createElement('a');
        a6Tab2Inner.innerText = 'ACSRQ - Scripting';
        a6Tab2Inner.className = 'nav-link';
        a6Tab2Inner.href = '#settings-a6csrq2';
        a6Tab2Inner.dataset.toggle = 'tab';

        a6Tab2.appendChild(a6Tab2Inner);
        tabs.appendChild(a6Tab2);

        const a6Tab2El = document.createElement('div');
        a6Tab2El.className = 'tab-pane';
        a6Tab2El.id = 'settings-a6csrq2';
        a6Tab2El.innerHTML = `<table class="table table-striped table-hover m-0"><tbody>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('botOptions')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('botRush')}"></tr>
        <tr data-bind="template: { name: 'BooleanSettingTemplate', data: Settings.getSetting('chestCollect')}"></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('dungeOpts')}"></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('gymOpts')}"></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('gymE4Opts')}"></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('bfOpts')}"></tr>
        <tr style="display: none"><td class="p-2">Number of chests to open:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="maxChests" name="maxChests" data-bind="value: Settings.getSetting('maxChests').observableValue() || ''" value="1}"></td></tr>
        <tr style="display: none"><td class="p-2">Maximum clears:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="maxClears" name="maxClears" data-bind="value: Settings.getSetting('maxClears').observableValue() || ''" value="1000}"></td></tr>
        <tr style="display: none"><td class="p-2">Minimum DT to retain:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="minDT" name="minDT" data-bind="value: Settings.getSetting('minDT').observableValue() || ''" value="10000"></td></tr>
        <tr style="display: none"><td class="p-2">Battle Frontier level to stop at:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="maxLvl" name="maxLvl" data-bind="value: Settings.getSetting('maxLvl').observableValue() || ''" value="100"></td></tr>
        <tr style="display: none"><td class="p-2">Time remaining to quit Battle Frontier at:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="maxTime" name="maxTime" data-bind="value: Settings.getSetting('maxTime').observableValue() || ''" value="30"></td></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('srOpts')}"></tr>
        <tr style="display: none" data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('evoOpts')}"></tr>
        <tr style="display: none"><td class="p-2">Evo items to use:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="evoItemCount" name="evoItemCount" data-bind="value: Settings.getSetting('evoItemCount').observableValue() || ''" value="1"></td></tr>
        <tr style="display: none" data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('fossilOpts')}"></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('breedingOpts')}"></tr>
        <tr style="display: none"><td class="p-2">Breed each Pokemon up to this attack power:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="minBreedAttack" name="minBreedAttack" data-bind="value: Settings.getSetting('minBreedAttack').observableValue() || ''" value="1000"></td></tr>
        <tr style="display: none" data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('typedEggOpts')}"></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('ballBuyOpts')}"></tr>
        <tr style="display: none"><td class="p-2">Minimum amount of Pokéballs to keep:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="minBallAmount" name="minBallAmount" data-bind="value: Settings.getSetting('minBallAmount').observableValue() || ''" value="0"></td></tr>
        <tr style="display: none"><td class="p-2">Amount of Pokéballs to purchase:</td><td class="p-2"><input class="form-control" onchange="Settings.setSettingByName(this.name, this.value)" id="ballPurAmount" name="ballPurAmount" data-bind="value: Settings.getSetting('ballPurAmount').observableValue() || ''" value="0"></td></tr>
        <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('safariOpts')}"></tr>
        </tbody></table>`;
        //      <tr data-bind="template: { name: 'MultipleChoiceSettingTemplate', data: Settings.getSetting('mutateMulch')}"></tr>
        tabContent.appendChild(a6Tab2El);
    }, 1000);

    setInterval(function(){
        if (Settings.getSetting('disableSave').observableValue() == true) {
            Save.counter = 0;
            window.onbeforeunload = [];
        } else {
            window.onbeforeunload = function () {
                Save.store(player);
            };
        }
    }, 1000);

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
        if (clickEngagedD == 1){
            if (DungeonRunner.map != undefined && Battle.catching() != true && DungeonRunner.fighting() != true){
                dungeonBot();
            }
        }
        if (clickEngagedG == 1){
            gymBot();
        }
        if (clickEngagedBF == 1){
            bfBot();
        }
    }, 100);

    setInterval(function(){
        if (clickEngagedS == 1){
            safariBot();
        }
    }, 250);

    setTimeout(function(){
        setInterval(function(){
            if (clickEngagedSR == 1){
                srBot();
            }
        }, 3000);
    }, 3000);

    setupShinyRequirements();
});

function main(){
    var CharCard = document.querySelector("#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div");
    if (CharCard == null && App.game != undefined) {
        a6save();
        a6menu();
        a6phases();

        var srCheckboxL = document.querySelector("#srCheck");
        srCheckboxL.addEventListener('change', function() {
            if (this.checked) {
                clickEngagedSR = 1;
                localSettings[2] = 1;
                localStorage.setItem(settingKey, JSON.stringify(localSettings));
            } else {
                clickEngagedSR = 0;
                srCount = 0;
                localSettings[2] = 0;
                localStorage.setItem(settingKey, JSON.stringify(localSettings));
                localLocal[6][1] = '';
                localLocal[6][2] = '';
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }
        });
        if (srCheckboxL.checked) {
            clickEngagedSR = 1;
            localSettings[2] = 1;
            localStorage.setItem(settingKey, JSON.stringify(localSettings));
        } else {
            clickEngagedSR = 0;
            srCount = 0;
            localSettings[2] = 0;
            localStorage.setItem(settingKey, JSON.stringify(localSettings));
            localLocal[6][1] = '';
            localLocal[6][2] = '';
            localStorage.setItem(saveKey, JSON.stringify(localLocal));
        }

        var phaseLink = document.querySelector("#areaPhase > td:nth-child(2) > a");
        phaseLink.addEventListener("click", function() {
            if (event.shiftKey) {
                event.preventDefault();
            }
            document.querySelector("#phaseModal").style.display = "block";
        });

        var phaseExport = document.querySelector("#phaseModal > div > div > div.modal-header > button");
        phaseExport.addEventListener("click", function() {
            if(!event.detail || event.detail == 1) {
                if (hasExported == 0) {
                    setTimeout(function(){
                        a6export()
                    }, 2000);
                    hasExported = 1;
                }
                return true;
            } else {
                return false;
            }
        });

        var phaseClose = document.querySelector("#phaseModal > div > div > div.modal-footer > button");
        phaseClose.addEventListener("click", function() {
            document.querySelector("#phaseModal").style.display = "none";
        });

        if (Settings.getSetting('ballBuyOpts').observableValue() != 'none' && Settings.getSetting('ballPurAmount').observableValue() != 0) {
            ballBot();
        }

        setTimeout(function(){
            a6settings();
        }, 1500);
    } else {
        if (localStorage.getItem('a6csrq-settings') != null) {
            if (JSON.parse(localStorage.getItem('a6csrq-settings'))[2] == 1) {
                Save.key = JSON.parse(localStorage.getItem('a6csrq-settings'))[1];

                var pSave = JSON.parse(localStorage.getItem(`player${Save.key}`))
                pSave._lastSeen = Date.now();
                localStorage.setItem(`player${Save.key}`, JSON.stringify(pSave));

                document.querySelector('#saveSelector').remove();
                App.start();
            }
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

    localSettings = ['','','',''];
    settingKey = "a6csrq-settings";

    if ( localStorage.getItem(settingKey) == null ) {
        localStorage.setItem(settingKey, JSON.stringify(localSettings));
    } else {
        localSettings = JSON.parse(localStorage.getItem(settingKey));
    }

    if (localSettings.length == 14) {
        localSettings = localSettings.splice(9,1)[0];
        localStorage.setItem(settingKey, JSON.stringify(localSettings));
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

function a6menu(){
    var myContainer = document.querySelector("#automationContainer");
    if (myContainer === null) {
        var mainDiv = document.createElement('div');
        mainDiv.id = 'automationContainer';
        mainDiv.className = 'card border-secondary mb-3';
        var testDiv = JSON.parse(localStorage.getItem(saveKey))[2];

        if (Settings.getSetting('menuPlace') != null) {
            mainDiv.appendAfter( document.querySelector( "#" + Settings.getSetting('menuPlace').observableValue() ));
            menuPos = document.querySelector("#automationContainer").previousSibling.id;
        } else {
            mainDiv.appendBefore( document.querySelector("#pokeballSelector") );
        }

        var mainHeader = document.createElement('div');
        mainHeader.id = 'automationContainerHeader';
        mainHeader.className = 'card-header p-0';
        mainHeader.dataset.toggle = 'collapse';
        document.querySelector("#automationContainer").append(mainHeader);

        var mainHeaderText = document.createElement('span');
        mainHeaderText.textContent = 'ACSRQ Info';
        document.querySelector("#automationContainerHeader").append(mainHeaderText);

        var mainHeaderTbl = document.createElement('table');
        mainHeaderTbl.id = 'autoPokeTable';
        mainHeaderTbl.style.width = '100%';
        mainHeaderTbl.setAttribute('border', '1');
        var tbdy = document.createElement('tbody');

        var tr00 = document.createElement('tr');
        tr00.id = 'breedingBot';
        tr00.style.display = "none";
        var td1r00 = document.createElement('td');
        td1r00.style.paddingTop = '5px';
        td1r00.style.paddingBottom = '3px';
        var td1r00checkbox = document.createElement('input');
        td1r00checkbox.type = "checkbox";
        td1r00checkbox.value = "0";
        td1r00checkbox.id = "breedingCheck";
        td1r00checkbox.disabled = true;
        var td2r00 = document.createElement('td');

        var tr01 = document.createElement('tr');
        tr01.id = 'dungeonBot';
        tr01.style.display = "none";
        var td1r01 = document.createElement('td');
        td1r01.style.paddingTop = '5px';
        td1r01.style.paddingBottom = '3px';
        var td1r01checkbox = document.createElement('input');
        td1r01checkbox.type = "checkbox";
        td1r01checkbox.value = "0";
        td1r01checkbox.id = "dungeonCheck";
        td1r01checkbox.disabled = true;
        var td2r01 = document.createElement('td');

        var tr02 = document.createElement('tr');
        tr02.id = 'gymBot';
        tr02.style.display = "none";
        var td1r02 = document.createElement('td');
        td1r02.style.paddingTop = '5px';
        td1r02.style.paddingBottom = '3px';
        var td1r02checkbox = document.createElement('input');
        td1r02checkbox.type = "checkbox";
        td1r02checkbox.value = "0";
        td1r02checkbox.id = "gymCheck";
        td1r02checkbox.disabled = true;
        var td2r02 = document.createElement('td');

        var tr03 = document.createElement('tr');
        tr03.id = 'safariBot';
        tr03.style.display = "none";
        var td1r03 = document.createElement('td');
        td1r03.style.paddingTop = '5px';
        td1r03.style.paddingBottom = '3px';
        var td1r03checkbox = document.createElement('input');
        td1r03checkbox.type = "checkbox";
        td1r03checkbox.value = "0";
        td1r03checkbox.id = "safariCheck";
        td1r03checkbox.disabled = true;
        var td2r03 = document.createElement('td');

        var tr04 = document.createElement('tr');
        tr04.id = 'bfBot';
        tr04.style.display = "none";
        var td1r04 = document.createElement('td');
        td1r04.style.paddingTop = '5px';
        td1r04.style.paddingBottom = '3px';
        var td1r04checkbox = document.createElement('input');
        td1r04checkbox.type = "checkbox";
        td1r04checkbox.value = "0";
        td1r04checkbox.id = "bfCheck";
        td1r04checkbox.disabled = true;
        var td2r04 = document.createElement('td');

        var tr05 = document.createElement('tr');
        tr05.id = 'srBot';
        tr05.style.display = "none";
        var td1r05 = document.createElement('td');
        td1r05.style.paddingTop = '5px';
        td1r05.style.paddingBottom = '3px';
        var td1r05checkbox = document.createElement('input');
        td1r05checkbox.type = "checkbox";
        td1r05checkbox.value = "0";
        td1r05checkbox.id = "srCheck";
        td1r05checkbox.disabled = true;
        var td2r05 = document.createElement('td');

        var tr06 = document.createElement('tr');
        tr06.id = 'plantBot';
        tr06.style.display = "none";
        var td1r06 = document.createElement('td');
        td1r06.style.padding = '5px';
        td1r06.style.paddingBottom = '5px';
        var td1r06menuVals = ["N/A", "Cheri", "Chesto", "Pecha", "Rawst", "Aspear", "Leppa", "Oran", "Sitrus", "Persim", "Razz", "Bluk", "Nanab", "Wepear", "Pinap", "Figy", "Wiki", "Mago", "Aguav", "Iapapa", "Lum", "Pomeg", "Kelpsy", "Qualot", "Hondew", "Grepa", "Tamato", "Cornn", "Magost", "Rabuta", "Nomel", "Spelon", "Pamtre", "Watmel", "Durin", "Belue", "Occa", "Passho", "Wacan", "Rindo", "Yache", "Chople", "Kebia", "Shuca", "Coba", "Payapa", "Tanga", "Charti", "Kasib", "Haban", "Colbur", "Babiri", "Chilan", "Roseli", "Micle", "Custap", "Jaboca", "Rowap", "Kee", "Maranga", "Liechi", "Ganlon", "Salac", "Petaya", "Apicot", "Lansat", "Starf", "S+C", "S+C+P", "S+L", "Perp. P"];//, "S+L+P", "S+L+C", "S+L+C+P"];
        var td1r06menu = document.createElement('select');
        for (const val of td1r06menuVals) {
            var td1r06submenu = document.createElement("option");
            td1r06submenu.value = val;
            td1r06submenu.text = val;
            td1r06menu.appendChild(td1r06submenu);
        }
        td1r06menu.id = "autoPlant";
        var td2r06 = document.createElement('td');

        var tr07 = document.createElement('tr');
        tr07.id = 'mutateBot';
        tr07.style.display = "none";
        var td1r07 = document.createElement('td');
        td1r07.style.padding = '5px';
        td1r07.style.paddingBottom = '5px';
        var td1r07menuVals = ["N/A", "Persim", "Razz", "Bluk", "Nanab", "Wepear", "Pinap", "Figy", "Wiki", "Mago", "Aguav", "Iapapa", "Lum", "Pomeg", "Kelpsy", "Qualot", "Hondew", "Grepa", "Tamato", "Cornn", "Magost", "Rabuta", "Nomel", "Spelon", "Pamtre", "Watmel", "Durin", "Belue", "Occa", "Passho", "Wacan", "Rindo", "Yache", "Chople", "Kebia", "Shuca", "Coba", "Payapa", "Tanga", "Charti", "Kasib", "Haban", "Colbur", "Babiri", "Chilan", "Roseli", "Micle", "Custap", "Jaboca", "Rowap", "Kee", "Maranga", "Liechi", "Ganlon", "Salac", "Petaya", "Apicot", "Lansat", "Starf"];
        var td1r07menu = document.createElement('select');
        for (const val of td1r07menuVals) {
            var td1r07submenu = document.createElement("option");
            td1r07submenu.value = val;
            td1r07submenu.text = val;
            td1r07menu.appendChild(td1r07submenu);
        }
        td1r07menu.id = "autoMutate";
        var td2r07 = document.createElement('td');

        var tr2 = document.createElement('tr');
        tr2.id = 'areaPhase';
        var td1r2 = document.createElement('td');
        var td1r2textbox = document.createElement('input');
        td1r2textbox.type = "text";
        td1r2textbox.size = "6";
        td1r2textbox.id = "phaseCount";
        td1r2textbox.style.textAlign = "center";
        var td2r2 = document.createElement('td');
        td2r2.innerHTML = '<a href="#">Phase</a>';

        var tr3 = document.createElement('tr');
        tr3.id = 'lastEncounterPoke';
        var td1r3 = document.createElement('td');
        td1r3.style.paddingTop = '5px';
        td1r3.style.paddingBottom = '3px';
        var td2r3 = document.createElement('td');

        var tr4 = document.createElement('tr');
        tr4.id = 'areaClears';
        var td1r4 = document.createElement('td');
        td1r4.style.paddingTop = '5px';
        td1r4.style.paddingBottom = '3px';
        var td2r4 = document.createElement('td');

        var tr5 = document.createElement('tr');
        tr5.id = 'lastEncounter';
        var td1r5 = document.createElement('td');
        td1r5.style.paddingTop = '5px';
        td1r5.style.paddingBottom = '3px';
        var td2r5 = document.createElement('td');

        var tr7 = document.createElement('tr');
        tr7.id = 'boostedRoute';
        var td1r7 = document.createElement('td');
        td1r7.style.paddingTop = '5px';
        td1r7.style.paddingBottom = '3px';
        var td2r7 = document.createElement('td');

        var tr8 = document.createElement('tr');
        tr8.id = 'uniquePokeShiny';
        var td1r8 = document.createElement('td');
        td1r8.style.paddingTop = '5px';
        td1r8.style.paddingBottom = '3px';
        var td2r8 = document.createElement('td');

        var tr9 = document.createElement('tr');
        tr9.id = 'uniquePoke';
        var td1r9 = document.createElement('td');
        td1r9.style.paddingTop = '5px';
        td1r9.style.paddingBottom = '3px';
        var td2r9 = document.createElement('td');

        var tr10 = document.createElement('tr');
        tr10.id = 'uniquePokeEvent';
        var td1r10 = document.createElement('td');
        td1r10.style.paddingTop = '5px';
        td1r10.style.paddingBottom = '3px';
        var td2r10 = document.createElement('td');

        td1r00.appendChild(td1r00checkbox);
        td2r00.appendChild(document.createTextNode('Breeding Bot'));
        td1r01.appendChild(td1r01checkbox);
        td2r01.appendChild(document.createTextNode('Dungeon Bot'));
        td1r02.appendChild(td1r02checkbox);
        td2r02.appendChild(document.createTextNode('Gym Bot'));
        td1r03.appendChild(td1r03checkbox);
        td2r03.appendChild(document.createTextNode('Safari Bot'));
        td1r04.appendChild(td1r04checkbox);
        td2r04.appendChild(document.createTextNode('BF Bot'));
        td1r05.appendChild(td1r05checkbox);
        td2r05.appendChild(document.createTextNode('SR Bot'));
        td1r06.appendChild(td1r06menu);
        td2r06.appendChild(document.createTextNode('Planter Bot'));
        td1r07.appendChild(td1r07menu);
        td2r07.appendChild(document.createTextNode('Mutate Bot'));
        td1r2.appendChild(td1r2textbox);
        //td2r2.appendChild(document.createTextNode('Phase'));
        td1r3.appendChild(document.createTextNode(''));
        td2r3.appendChild(document.createTextNode('Last Shiny'));
        td1r4.appendChild(document.createTextNode(''));
        td2r4.appendChild(document.createTextNode('Clears'));
        td1r5.appendChild(document.createTextNode(''));
        td2r5.appendChild(document.createTextNode('Since Last Shiny'));
        td1r7.appendChild(document.createTextNode(''));
        td2r7.appendChild(document.createTextNode('Boosted Route'));
        td1r8.appendChild(document.createTextNode(''));
        td2r8.appendChild(document.createTextNode('Region Shinies'));
        td1r9.appendChild(document.createTextNode(''));
        td2r9.appendChild(document.createTextNode('Region Uniques'));
        td1r10.appendChild(document.createTextNode(''));
        td2r10.appendChild(document.createTextNode('Event Uniques'));

        tr00.appendChild(td1r00);
        tr00.appendChild(td2r00);
        tr01.appendChild(td1r01);
        tr01.appendChild(td2r01);
        tr02.appendChild(td1r02);
        tr02.appendChild(td2r02);
        tr03.appendChild(td1r03);
        tr03.appendChild(td2r03);
        tr04.appendChild(td1r04);
        tr04.appendChild(td2r04);
        tr05.appendChild(td1r05);
        tr05.appendChild(td2r05);
        tr06.appendChild(td1r06);
        tr06.appendChild(td2r06);
        tr07.appendChild(td1r07);
        tr07.appendChild(td2r07);
        tr2.appendChild(td1r2);
        tr2.appendChild(td2r2);
        tr3.appendChild(td1r3);
        tr3.appendChild(td2r3);
        tr4.appendChild(td1r4);
        tr4.appendChild(td2r4);
        tr5.appendChild(td1r5);
        tr5.appendChild(td2r5);
        tr7.appendChild(td1r7);
        tr7.appendChild(td2r7);
        tr8.appendChild(td1r8);
        tr8.appendChild(td2r8);
        tr9.appendChild(td1r9);
        tr9.appendChild(td2r9);
        tr10.appendChild(td1r10);
        tr10.appendChild(td2r10);

        tbdy.appendChild(tr00);
        tbdy.appendChild(tr01);
        tbdy.appendChild(tr02);
        tbdy.appendChild(tr03);
        tbdy.appendChild(tr04);
        tbdy.appendChild(tr05);
        tbdy.appendChild(tr06);
        tbdy.appendChild(tr07);
        tbdy.appendChild(tr2);
        tbdy.appendChild(tr3);
        tbdy.appendChild(tr4);
        tbdy.appendChild(tr5);
        tbdy.appendChild(tr7);
        tbdy.appendChild(tr8);
        tbdy.appendChild(tr9);
        tbdy.appendChild(tr10);

        mainHeaderTbl.appendChild(tbdy);
        mainHeader.appendChild(mainHeaderTbl);

        var sFoot = document.createElement('div');
        sFoot.id = 'shinyFooter';
        sFoot.className = 'card-footer p-0';
        sFoot.appendBefore( document.querySelector("#battleContainer > div.card-footer.p-0") );
        sFoot.style.display = "none";

        var sFootTbl = document.createElement('table');
        sFootTbl.id = 'shinyFooterTbl';
        sFootTbl.style.width = '100%';
        var fbdy = document.createElement('tbody');

        var fr00 = document.createElement('tr');
        fr00.id = 'possibleLoot';
        var fd1r00 = document.createElement('td');
        fd1r00.style.width = '50%';
        var fd2r00 = document.createElement('td');
        fd2r00.style.width = '50%';

        var fr01 = document.createElement('tr');
        fr01.id = 'missingShiny';
        var fd1r01 = document.createElement('td');
        fd1r01.style.width = '50%';
        var fd2r01 = document.createElement('td');
        fd2r01.style.width = '50%';

        fd1r00.appendChild(document.createTextNode('Possible Loot'));
        fd2r00.appendChild(document.createTextNode(''));
        fd1r01.appendChild(document.createTextNode('Needed Shiny'));
        fd2r01.appendChild(document.createTextNode(''));
        fr00.appendChild(fd1r00);
        fr00.appendChild(fd2r00);
        fr01.appendChild(fd1r01);
        fr01.appendChild(fd2r01);
        fbdy.appendChild(fr00);
        fbdy.appendChild(fr01);
        sFootTbl.appendChild(fbdy);
        sFoot.appendChild(sFootTbl);

        var ptModal = document.createElement('div');
        ptModal.className = 'modal noselect show';
        ptModal.id = 'phaseModal';
        ptModal.tabindex = -1;
        ptModal.style = "z-index: 1040; display: block; padding-right: 6.9968px;";
        ptModal.style.display = "none";
        ptModal.ariaModal = true;
        ptModal.setAttribute("role", "dialog");

        var ptModalScroll = document.createElement('div');
        ptModalScroll.className = 'modal-dialog modal-dialog-scrollable modal-lg';
        ptModalScroll.setAttribute("role", "document");

        var ptModalContent = document.createElement('div');
        ptModalContent.className = 'modal-content';

        var ptModalHeader = document.createElement('div');
        ptModalHeader.className = 'modal-header';
        ptModalHeader.setAttribute("role", "document");
        ptModalHeader.innerHTML = `<h4 style="margin-bottom: 0px;">Phase Tracker</h4><button class="btn btn-secondary" type="button" data-toggle="collapse" style="margin-left: 25px;">Export</button>`;

        var ptModalBody = document.createElement('div');
        ptModalBody.className = 'modal-body';
        ptModalBody.setAttribute("role", "document");

        var ptModalBodyC = document.createElement('div');
        ptModalBodyC.className = 'mainPhase';
        ptModalBodyC.innerHTML = `<table class="table table-striped table-hover m-0" id="phaseTable"><tr><td>Phase Count</td><td>Location</td><td>Encounter Type</td><td>Pokemon Name</td><td>Capture Status</td><td>Clear Count</td><td>Remove Phase?</td></tr></table>`;

        var ptModalFooter = document.createElement('div');
        ptModalFooter.className = 'modal-footer';

        var ptModalFooterB = document.createElement('button');
        ptModalFooterB.className = 'btn btn-primary';
        ptModalFooterB.dataset.dismiss = 'modal';
        ptModalFooterB.textContent = 'Close';


        document.body.appendChild(ptModal);
        ptModal.appendChild(ptModalScroll);
        ptModalScroll.appendChild(ptModalContent);
        ptModalContent.appendChild(ptModalHeader);
        ptModalContent.appendChild(ptModalBody);
        ptModalBody.appendChild(ptModalBodyC);
        ptModalContent.appendChild(ptModalFooter);
        ptModalFooter.appendChild(ptModalFooterB);

        if (Settings.getSetting('hideOak').observableValue() == true) {
            document.querySelector("#oakItemsContainer").style.display = 'none';
        } else {
            document.querySelector("#oakItemsContainer").removeAttribute("style");
        }
        if (Settings.getSetting('gideBItem').observableValue() == true) {
            document.querySelector("#battleItemContainer").style.display = 'none';
        } else {
            document.querySelector("#battleItemContainer").removeAttribute("style");
        }
        if (Settings.getSetting('hideNoti').observableValue() == true) {
            document.querySelector("#toaster").style.display = 'none';
        } else {
            document.querySelector("#toaster").removeAttribute("style");
        }
        if (localSettings[2] == 1) {
            document.querySelector("#srCheck").checked = true;
            Settings.setSettingByName('disableSave', true)
        }

    } else {

        if ( document.querySelector("#automationContainer").previousSibling.id != Settings.getSetting('menuPlace').observableValue() ) {
            document.querySelector("#automationContainer").appendAfter( document.querySelector( "#" + Settings.getSetting('menuPlace').observableValue() ));
            menuPos = document.querySelector("#automationContainer").previousSibling.id;
        }

        uniqueCheck();
        uniqueCheckAll();
        uniqueCheckEvent();
        boostedRoute();
        lastPokeEncounter();
        areaClears();
        missingShinies();
        missingLoot();

        if (Settings.getSetting('hideOak').observableValue() == true) {
            document.querySelector("#oakItemsContainer").style.display = 'none';
        } else {
            document.querySelector("#oakItemsContainer").removeAttribute("style");
        }
        if (Settings.getSetting('gideBItem').observableValue() == true) {
            document.querySelector("#battleItemContainer").style.display = 'none';
        } else {
            document.querySelector("#battleItemContainer").removeAttribute("style");
        }
        if (Settings.getSetting('hideNoti').observableValue() == true) {
            document.querySelector("#toaster").style.display = 'none';
        } else {
            document.querySelector("#toaster").removeAttribute("style");
        }
        if (localSettings[2] == 1) {
            document.querySelector("#srCheck").checked = true;
            Settings.setSettingByName('disableSave', true)
        }
    }
}

async function a6settings() {
    if (Settings.getSetting('breedingOpts') != null && Settings.getSetting('srOpts') != null){
        if (Settings.getSetting('breedingOpts').observableValue() == 'none' || Settings.getSetting('breedingOpts').observableValue() == 'mystery') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(14)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(15)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(16)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(18)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(19)").style.display = "none";
        }
        if (Settings.getSetting('breedingOpts').observableValue() == 'attack') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(14)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(15)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(16)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(18)").removeAttribute("style");
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(19)").style.display = "none";
        }
        if (Settings.getSetting('breedingOpts').observableValue() == 'typed') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(14)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(15)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(16)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(18)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(19)").removeAttribute("style");
        }
        if (Settings.getSetting('breedingOpts').observableValue() == 'fossil' || Settings.getSetting('srOpts').observableValue() == 'fos') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(14)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(15)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(16)").removeAttribute("style");
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(18)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(19)").style.display = "none";
        }
        if (Settings.getSetting('srOpts').observableValue() == 'evo') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(14)").removeAttribute("style");
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(15)").removeAttribute("style");
        } else {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(14)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(15)").style.display = "none";
        }
    }

    if (Settings.getSetting('chestCollect') != null) {
        if (Settings.getSetting('chestCollect').observableValue() == true) {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(8)").removeAttribute("style");
        } else {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(8)").style.display = "none";
        }
    }
    if (Settings.getSetting('bfOpts') != null) {
        if (Settings.getSetting('bfOpts').observableValue() == 'bfOptL') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(11)").removeAttribute("style");
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(12)").style.display = "none";
        } else if (Settings.getSetting('bfOpts').observableValue() == 'bfOptT') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(12)").removeAttribute("style");
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(11)").style.display = "none";
        } else {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(11)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(12)").style.display = "none";
        }
    }
    if (Settings.getSetting('ballBuyOpts') != null) {
        if (Settings.getSetting('ballBuyOpts').observableValue() == 'none') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(21)").style.display = "none";
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(22)").style.display = "none";
        } else {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(21)").removeAttribute("style");
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(22)").removeAttribute("style");
        }
    }
    localStorage.setItem(settingKey, JSON.stringify(localSettings));

    if (Settings.getSetting('dungeOpts') != null && Settings.getSetting('gymOpts') != null) {
        var dunO = Settings.getSetting('dungeOpts').observableValue();
        var gymO = Settings.getSetting('gymOpts').observableValue();

        if (dunO == 'dungOptC' || gymO == 'gymOptC') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(9)").removeAttribute("style");
        } else {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(9)").style.display = "none";
        }
        if (dunO == 'dungOptDT') {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(10)").removeAttribute("style");
        } else {
            document.querySelector("#settings-a6csrq2 > table > tbody > tr:nth-child(10)").style.display = "none";
        }
    }


    if (Settings.getSetting('botOptions') != null) {
        if (Settings.getSetting('botOptions').observableValue() == true) {
            var townContent = player.town().content;

            //Breeding Bot
            if (App.game.breeding.canAccess() == true && App.game.party.hasMaxLevelPokemon()) {
                document.querySelector("#breedingBot").removeAttribute("style");
                document.querySelector("#breedingCheck").disabled = false;
                var checkAutoBreed = document.querySelector("#breedingCheck");
                var checkAutoBreed = document.querySelector("#breedingCheck");
                if (checkAutoBreed.checked == true){
                    autoBreed();
                }
            }
            //Dungeon Bot
            if (App.game.keyItems.hasKeyItem(KeyItemType.Dungeon_ticket) == true) {
                document.querySelector("#dungeonBot").removeAttribute("style");
                if ( player.route() == 0 && GameConstants.getDungeonIndex(player.town().name) != -1 ) {
                    document.querySelector("#dungeonCheck").disabled = false;
                    var checkDungeonClicker = document.querySelector("#dungeonCheck");
                    if (checkDungeonClicker.checked == true){
                        switch(Settings.getSetting('dungeOpts').observableValue()) {
                            case "dungOptN":
                                if (DungeonRunner.dungeonCompleted(player.town().dungeon) == true) {
                                    dungeonClick(1);
                                } else {
                                    dungeonClick(0);
                                }
                                break;
                            case "dungOptSC":
                                if (DungeonRunner.dungeonCompleted(player.town().dungeon, true) != true) {
                                    dungeonClick(1);
                                } else {
                                    dungeonClick(0);
                                }
                                break;
                            case "dungOptC":
                                if (App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().name)]() < Number(Settings.getSetting('maxClears').observableValue())) {
                                    dungeonClick(1);
                                } else {
                                    dungeonClick(0);
                                    if (App.game.gameState == 4) {
                                        var pX = DungeonRunner.map.playerPosition().x;
                                        var pXF = DungeonRunner.map.playerPosition().x;
                                        var pXM = pX + 1;
                                        DungeonRunner.map.moveRight();
                                        if ( DungeonRunner.map.playerPosition().x == pXM ) {
                                            await DungeonRunner.map.moveLeft();
                                        }
                                        pX = DungeonRunner.map.playerPosition().x;
                                        if ( pX == pXF ) {
                                            DungeonRunner.dungeonLeave();
                                        }
                                    }
                                }
                                break;
                            case "dungOptDT":
                                var setDTLim = Settings.getSetting('minDT').observableValue();
                                var curDT = App.game.wallet.currencies[GameConstants.Currency.dungeonToken]();
                                if (curDT >= setDTLim && curDT >= player.town().dungeon.tokenCost) {
                                    dungeonClick(1);
                                } else {
                                    dungeonClick(0);
                                }
                        }
                    }
                    if (checkDungeonClicker.checked == false){
                        dungeonClick(0);
                    }
                } else {
                    document.querySelector("#dungeonCheck").disabled = true;
                    document.querySelector("#dungeonCheck").checked = false;
                    dungeonClick(0);
                }
            } else {
                document.querySelector("#dungeonBot").style.display = "none";
                document.querySelector("#dungeonCheck").checked = false;
                dungeonClick(0);
            }

            //Gym Bot
            var gymFound = 0;
            document.querySelector("#gymBot").removeAttribute("style");
            if ( player.route() == 0 && GameConstants.getDungeonIndex(player.town().name) == -1 ) {
                for (let x = 0; x < townContent.length; x++) {
                    if (townContent[x].leaderName != undefined) {
                        gymFound = 1;
                        document.querySelector("#gymCheck").disabled = false;
                        var checkGymClicker = document.querySelector("#gymCheck");
                        if (checkGymClicker.checked == true){
                            gymClick(1);
                        }
                        if (checkGymClicker.checked == false){
                            gymClick(0);
                        }
                    } else {
                        if (gymFound != 1) {
                            document.querySelector("#gymCheck").disabled = true;
                            document.querySelector("#gymCheck").checked = false;
                            gymClick(0);
                        }
                    }
                }
            }

            //Safari Bot
            if (Safari.canAccess() == true) {
                document.querySelector("#safariBot").removeAttribute("style");
                if ( Safari.inProgress() == true ) {
                    document.querySelector("#safariCheck").disabled = false;
                    var checkSafariClicker = document.querySelector("#safariCheck");
                    if (checkSafariClicker.checked == true){
                        switch(Settings.getSetting('safariOpts').observableValue()) {
                            case "safariOptN":
                                safariClick(1);
                                break;
                            case "safariOptSC":
                                if (Safari.completed(true) != true) {
                                    safariClick(1);
                                } else {
                                    Safari.closeModal();
                                    safariClick(0);
                                }
                                break;
                        }
                    } else {
                        safariClick(0);
                    }
                } else if ( document.querySelector("#safariCheck").checked == true && Safari.completed(true) != true)  {
                    safariClick(0);
                    if (document.querySelector("#safariModal").classList.contains('show')) {
                        Safari.payEntranceFee();
                    } else if (App.game.gameState != 5) {
                        App.game.gameState = 5;
                        setTimeout(() => {
                            Safari.openModal();
                        }, 500)
                    }
                } else {
                    document.querySelector("#safariCheck").disabled = true;
                    document.querySelector("#safariCheck").checked = false;
                    safariClick(0);
                }
            }

            //BF Bot
            if (MapHelper.calculateTownCssClass('Battle Frontier') != "locked") {
                document.querySelector("#bfBot").removeAttribute("style");
                if ( player.route() == 0 && player.town().name == "Battle Frontier" ) {
                    document.querySelector("#bfCheck").disabled = false;
                    var checkBFClicker = document.querySelector("#bfCheck");
                    if (checkBFClicker.checked == true){
                        bfClick(1);
                    }
                    if (checkBFClicker.checked == false){
                        bfClick(0);
                    }
                } else {
                    document.querySelector("#bfCheck").disabled = true;
                    document.querySelector("#bfCheck").checked = false;
                    bfClick(0);
                }
            } else {
                document.querySelector("#bfCheck").disabled = true;
                document.querySelector("#bfCheck").checked = false;
                bfClick(0);
            }

            //SR Bot
            if (App.game.statistics.routeKills['kanto'][3]() >= 10) {
                document.querySelector("#srBot").removeAttribute("style");
                document.querySelector("#srCheck").disabled = false;
            } else {
                document.querySelector("#srCheck").disabled = true;
                document.querySelector("#srCheck").checked = false;
            }

            //Farm Bots
            if (App.game.farming.canAccess() == true) {
                document.querySelector("#plantBot").removeAttribute("style");
                document.querySelector("#mutateBot").removeAttribute("style");
                //Planter
                var checkAutoFarmer1 = document.querySelector("#autoPlant");
                if (checkAutoFarmer1.value != "N/A"){
                    plantBot();
                }
                //Mutator
                var checkAutoFarmer2 = document.querySelector("#autoMutate");
                if (checkAutoFarmer2.value != "N/A"){
                    mutateBot();
                }
            } else {
                document.querySelector("#plantBot").style.display = "none";
                document.querySelector("#mutateBot").style.display = "none";
            }
        } else {
            document.querySelector("#breedingBot").style.display = "none";
            document.querySelector("#breedingCheck").checked = false;
            document.querySelector("#dungeonBot").style.display = "none";
            document.querySelector("#dungeonCheck").checked = false;
            document.querySelector("#gymBot").style.display = "none";
            document.querySelector("#gymCheck").checked = false;
            document.querySelector("#safariBot").style.display = "none";
            document.querySelector("#safariCheck").checked = false;
            document.querySelector("#plantBot").style.display = "none";
            document.querySelector("#plantBot").value = "N/A";
            document.querySelector("#mutateBot").style.display = "none";
            document.querySelector("#mutateBot").value = "N/A";
            document.querySelector("#breedingBot").style.display = "none";
            document.querySelector("#srBot").style.display = "none";
            document.querySelector("#srCheck").checked = false;
            document.querySelector("#bfBot").style.display = "none";
            document.querySelector("#bfCheck").checked = false;
        }

        if (Settings.getSetting('disEvent').observableValue() == true) {
            if (new Date().getTime() <= new Date(new Date().getFullYear(), 0, 24, 1).getTime() && new Date().getTime() >= new Date(new Date().getFullYear(), 1, 7, 23).getTime()) {
                RoamingPokemonList.remove(GameConstants.Region.kalos, 'Vivillon (Fancy)');
            }
            if (new Date().getTime() <= new Date(new Date().getFullYear(), 6, 6, 1).getTime() && new Date().getTime() >= new Date(new Date().getFullYear(), 6, 12, 23).getTime()) {
                RoamingPokemonList.remove(GameConstants.Region.kanto, 'Flying Pikachu');
            }
            if (new Date().getTime() <= new Date(new Date().getFullYear(), 6, 18, 1).getTime() && new Date().getTime() >= new Date(new Date().getFullYear(), 6, 24, 23).getTime()) {
                dungeonList['Cerulean Cave'].bossList = dungeonList['Cerulean Cave'].bossList.filter(boss => boss.name != 'Armored Mewtwo');
                RoamingPokemonList.list[GameConstants.Region.kanto] = RoamingPokemonList.list[GameConstants.Region.kanto].filter(r => !['Bulbasaur (clone)', 'Charmander (clone)', 'Squirtle (clone)'].includes(r.pokemon.name));
            }
            if (new Date().getTime() <= new Date(new Date().getFullYear(), 10, 5, 23).getTime() && new Date().getTime() >= new Date(new Date().getFullYear(), 9, 30, 1).getTime()) {
                Routes.getRoutesByRegion(GameConstants.Region.kanto).forEach(route => route.pokemon.land = route.pokemon.land.filter(p => !['Spooky Bulbasaur', 'Gastly'].includes(p)));
                Routes.getRoutesByRegion(GameConstants.Region.johto).forEach(route => route.pokemon.land = route.pokemon.land.filter(p => !['Spooky Togepi', 'Misdreavus'].includes(p)));
                Routes.getRoutesByRegion(GameConstants.Region.hoenn).forEach(route => route.pokemon.land = route.pokemon.land.filter(p => !['Pikachu (Gengar)', 'Shuppet', 'Duskull'].includes(p)));
            }
            if (new Date().getTime() <= new Date(new Date().getFullYear(), 10, 16, 1).getTime() && new Date().getTime() >= new Date(new Date().getFullYear(), 10, 23, 23).getTime()) {
                RoamingPokemonList.remove(GameConstants.Region.kanto, 'Let\'s Go Pikachu');
                RoamingPokemonList.remove(GameConstants.Region.kanto, 'Let\'s Go Eevee');
            }
            if (new Date().getTime() <= new Date(new Date().getFullYear(), 11, 24, 1).getTime() && new Date().getTime() >= new Date(new Date().getFullYear(), 11, 30, 23).getTime()) {
                GameHelper.enumNumbers(GameConstants.Region).filter(i => i != GameConstants.Region.none).forEach(region => {
                    RoamingPokemonList.remove(region, 'Santa Snorlax');
                });
            }
        }
    }

    if (document.querySelector("#safariModal").style.display != "none" && document.querySelector("#safariModal").style.display != "") {
        document.querySelector("#shinyFooter").style.display = "none";
    } else if (player.route() != 0) {
        document.querySelector("#shinyFooter").style.display = "block";
    } else if (player.town().dungeon != undefined) {
        document.querySelector("#shinyFooter").style.display = "block";
    } else if (player.town().shops != undefined) {
        if (player.town().shops.length != 0) {
            document.querySelector("#shinyFooter").style.display = "block";
        }
    } else {
        document.querySelector("#shinyFooter").style.display = "none";
    }
}

function dungeonClick(x) {
    if (x == 1){
        clickEngagedD = 1;
    } else if (x == 0){
        clickEngagedD = 0;
    }
}

function gymClick(x) {
    if (x == 1){
        clickEngagedG = 1;
    } else if (x == 0){
        clickEngagedG = 0;
    }
}

function safariClick(x) {
    if (x == 1){
        clickEngagedS = 1;
    } else if (x == 0){
        clickEngagedS = 0;
    }
}

function bfClick(x) {
    if (x == 1){
        clickEngagedBF = 1;
    } else if (x == 0){
        clickEngagedBF = 0;
    }
}

function uniqueCheck() {
    var uniqC = new Set(App.game.party.caughtPokemon.filter(p => p.id > 0 && PokemonHelper.calcNativeRegion(p.name) === player.region).map(p => Math.floor(p.id))).size;
    var uniqT = PokemonHelper.calcUniquePokemonsByRegion(player.region);
    document.querySelector("#uniquePoke > td:nth-child(1)").innerHTML = uniqC + '/' + uniqT;
}

function uniqueCheckAll() {
    var uniqS = new Set(App.game.party.caughtPokemon.filter(p => p.id > 0 && p.shiny == true && PokemonHelper.calcNativeRegion(p.name) === player.region)).size;
    var uniqT = new Set(App.game.party.caughtPokemon.filter(p => p.id > 0 && PokemonHelper.calcNativeRegion(p.name) === player.region)).size;
    document.querySelector("#uniquePokeShiny > td:nth-child(1)").innerHTML = uniqS + '/' + uniqT;
}

function uniqueCheckEvent() {
    var eventPoke = ["Flying Pikachu","Surfing Pikachu","Armored Mewtwo","Santa Snorlax","Spooky Togepi","Spooky Bulbasaur","Pikachu (Gengar)","Let's Go Pikachu","Let's Go Eevee","Bulbasaur (clone)","Ivysaur (clone)","Venusaur (clone)","Charmander (clone)","Charmeleon (clone)","Charizard (clone)","Squirtle (clone)","Wartortle (clone)","Blastoise (clone)","Unown (C)","Unown (D)","Unown (I)","Unown (O)","Unown (R)","Unown (S)","Grinch Celebi","Elf Munchlax","Vivillon (Fancy)","Rotom (discord)"];
    var eventCaught = 0;
    for (let eP = 0; eP < eventPoke.length; eP++) {
        if ( App.game.party.alreadyCaughtPokemonByName(eventPoke[eP]) == true) {
            eventCaught++;
        }
    }
    document.querySelector("#uniquePokeEvent > td:nth-child(1)").innerHTML = eventCaught + '/27';
}

function boostedRoute() {
    document.querySelector("#boostedRoute > td:nth-child(1)").innerHTML = RoamingPokemonList.increasedChanceRoute[player.region][player.subregion]().routeName;
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

async function missingLoot() {
    if (Settings.getSetting('showLoot') != null) {
        if (Settings.getSetting('showLoot').observableValue() == true) {
            if (player.town().dungeon != undefined && player.route() == 0) {
                document.querySelector("#possibleLoot").removeAttribute("style");
                var dLoot = player.town().dungeon.itemList;
                var dLootA = [];

                for (let x = 0; x < dLoot.length; x++) {
                    var lootI = GameConstants.humanifyString(dLoot[x].loot);
                    dLootA.push( lootI );
                }
                dLootA = [ ...new Set(dLootA) ].sort().join(', ');
                document.querySelector("#possibleLoot > td:nth-child(2)").innerText = dLootA;
            } else {
                document.querySelector("#possibleLoot").style.display = "none";
            }
        } else {
            document.querySelector("#possibleLoot").style.display = "none";
        }
    }
}

async function missingShinies() {
    if (Settings.getSetting('showShiny') != null) {
        if (Settings.getSetting('showShiny').observableValue() == true) {
            document.querySelector("#missingShiny").removeAttribute("style");
            //Route poke
            if (player.route() != 0) {
                missS = RouteHelper.getAvailablePokemonList(player.route(), player.region);
                var missC = [];
                for (let x = 0; x < missS.length; x++) {
                    if ( App.game.party.alreadyCaughtPokemonByName(missS[x], true) == true) {
                        missC.push(missS[x])
                    }
                }
                missS = missS.filter( ( el ) => !missC.includes( el ) );
                if ( missS.length == 0) {
                    missS = 'N/A';
                } else if ( missS.length == 1) {
                    missS = missS[0];
                } else if (missS.length > 1) {
                    missS = missS.sort().join(', ');
                }
                document.querySelector("#missingShiny > td:nth-child(2)").innerText = missS;
                document.querySelector("#possibleLoot").style.display = "none";
            }
            //Dungeon Poke
            if (player.town().dungeon != undefined && player.route() == 0) {
                var neededS = '';
                var missTemp = [];
                var missDP = player.town().dungeon.pokemonList;
                var missDBP = player.town().dungeon.bossPokemonList;
                var missDBPa = player.town().dungeon.bossEncounterList;
                for (let x = 0; x < missDP.length; x++) {
                    if ( App.game.party.alreadyCaughtPokemonByName(missDP[x], true) != true ) {
                        missTemp.push(missDP[x])
                    }
                }
                for (let x = 0; x < missDBP.length; x++) {
                    if ( App.game.party.alreadyCaughtPokemonByName(missDBP[x], true) != true ) {
                        if ( missDBPa[x].lock != true ) {
                            missTemp.push(missDBP[x])
                        }
                    }
                }
                if ( missTemp.length == 0) {
                    neededS = 'N/A';
                } else if ( missTemp.length == 1) {
                    neededS = missTemp[0];
                } else if (missTemp.length > 1) {
                    neededS = missTemp.join(', ');
                }
                document.querySelector("#missingShiny > td:nth-child(2)").innerText = neededS;
                //Dungeon Chest Poke
                var lootA = [];
                var lootR = [];
                //var lootL = player.town().dungeon.itemList;
                var lootIC = player.town().dungeon.lootTable.common
                var lootIE = player.town().dungeon.lootTable.epic
                var lootIL = player.town().dungeon.lootTable.mythic

                lootA.concat(lootIC);
                lootA.concat(lootIE);
                lootA.concat(lootIL);

                for (let x = 0; x < lootA.length; x++) {
                    if ( PokemonHelper.getPokemonByName(lootL[x].loot).id != 0) {
                        lootR.push('<span style="color:#D4AC0D;">' + lootL[x].loot + '</span>');
                    }
                }
                var lootC = [];
                for (let x = 0; x < lootR.length; x++) {
                    if ( App.game.party.alreadyCaughtPokemonByName(lootR[x], true) == true) {
                        lootC.push(lootR[x])
                    }
                }
                lootR = lootR.filter( ( el ) => !lootC.includes( el ) );
                if (missTemp.length >= 1 && lootR.length >= 1) {
                    missTemp = missTemp.concat(lootR);
                    missTemp = missTemp.sort().join(', ');
                    document.querySelector("#missingShiny > td:nth-child(2)").innerHTML = missTemp;
                } else if (missTemp.length == 0) {
                    if ( lootR.length == 0) {
                        lootR = 'N/A';
                    } else if ( lootR.length == 1) {
                        lootR = lootR[0];
                    } else if (lootR.length > 1) {
                        lootR = lootR.sort().join(', ');
                    }
                    document.querySelector("#missingShiny > td:nth-child(2)").innerHTML = lootR;
                }
            }
            //Shop Poke
            if (player.town().shops != undefined) {
                if (player.town().shops.length != 0 && player.route() == 0) {
                    var shopS = player.town().shops;
                    var shopA = [];

                    for (let x = 0; x < shopS.length; x++) {
                        for (let y = 0; y < shopS[x].items.length; y++) {
                            shopA.push(shopS[x].items[y].name);
                        }
                    }
                    for( var i = 0; i < shopA.length; i++){
                        if ( PokemonHelper.getPokemonByName(shopA[i]).id == 0) {
                            shopA.splice(i, 1);
                            i--;
                        }
                    }
                    for( var i = 0; i < shopA.length; i++){
                        if ( App.game.party.alreadyCaughtPokemonByName(shopA[i], true) == true) {
                            shopA.splice(i, 1);
                            i--;
                        }
                    }
                    if ( shopA.length == 0) {
                        shopA = 'N/A';
                    } else if ( shopA.length == 1) {
                        shopA = shopA[0];
                    } else if (shopA.length > 1) {
                        shopA = shopA.sort().join(', ');
                    }
                    document.querySelector("#missingShiny > td:nth-child(2)").innerText = shopA;

                    if (player.town().dungeon == undefined) {
                        document.querySelector("#possibleLoot").style.display = "none";
                    }
                }
            }
        } else {
            document.querySelector("#missingShiny").style.display = "none";
        }
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
    		document.querySelector("#phaseTable").innerHTML = `<table class="table table-striped table-hover m-0" id="phaseTable">
    		<tr><td>Phase Count</td><td>Location</td><td>Encounter Type</td><td>Pokemon Name</td><td>Capture Status</td><td>Clear Count</td><td>Remove Phase?</td></tr>
    		</table>`;
    		for(var x = 0; x < phases.length; x++){
    			var tablePhase = document.createElement('tr');
    			var phaseId = "phase" + x;
    			tablePhaseQuery = "<tr><td>" + phases[x][0] + "</td>" + "<td>" + phases[x][1] + "</td>" + "<td>" + phases[x][2] + "</td>" + "<td>" + phases[x][3] + "</td>" + "<td>" + phases[x][4] + "</td>" + "<td>" + phases[x][5] + "</td>" + "<td>" + "<button type=\"button\" class=\"btn btn-primary\" onclick=\"removePhase(" + x + ")\">Remove</button>" + "</td></tr>";
    			tablePhase.innerHTML = tablePhaseQuery;
    			tablePhase.style.display = "none";
    			phaseTable.append(tablePhase);
    			var childNumber = x + 2;
    			if (x < Number(Settings.getSetting('phaseCount').observableValue())) {
    				var displayQuery = "#phaseTable > tr:nth-child(" + childNumber + ")";
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
                        if (townContent[gymAtX].clears() <= Number(Settings.getSetting('maxClears').observableValue())) {
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

async function srBot() {
    var srCount;
    if (localLocal[6][2] != 0) {
        srCount = localLocal[6][2];
    } else {
        srCount = 0;
    }
    localSettings[1] = Save.key;
    localStorage.setItem(settingKey, JSON.stringify(localSettings));
    switch(Settings.getSetting('srOpts').observableValue()) {
        case "mys":
            if (ItemList.Mystery_egg.getCaughtStatus() != 2 ) {
                if (localLocal[6][1] == '') {
                    if (App.game.breeding.eggList[0]().type == -1 && player.itemList["Mystery_egg"]() > 0) {
                        ItemList['Mystery_egg'].use();
                        if(App.game.party.alreadyCaughtPokemonByName(App.game.breeding.eggList[0]().pokemon, true) == true) {
                            console.log( 'Already have - ' + App.game.breeding.eggList[0]().pokemon + ' - Shiny: ' + App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) );
                            location.reload();
                        } else if (App.game.party.alreadyCaughtPokemonByName(App.game.breeding.eggList[0]().pokemon, true) != true) {
                            localLocal[6][1] = App.game.breeding.eggList[0]().pokemon;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        }
                    }
                } else if (localLocal[6][1] != '') {
                    if (App.game.breeding.eggList[0]().type != -1) {
                        if (App.game.breeding.eggList[0]().steps() < App.game.breeding.eggList[0]().totalSteps) {
                            console.log( 'Waiting for steps - ' + App.game.breeding.eggList[0]().pokemon + ' - Shiny: ' + App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) );
                        }
                        if (App.game.breeding.eggList[0]().steps() >= App.game.breeding.eggList[0]().totalSteps) {
                            console.log( 'Hatching - ' + App.game.breeding.eggList[0]().pokemon + ' - Shiny: ' + App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) );
                            Save.store(player);
                            setTimeout(function(){
                                localLocal[6][1] = App.game.breeding.eggList[0]().pokemon;
                                localStorage.setItem(saveKey, JSON.stringify(localLocal));
                                [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
                                if(App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) != true) {
                                    srCount++;
                                    localLocal[6][2] = srCount;
                                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                                    console.log( 'SR Count: ' + srCount );
                                    location.reload();
                                } else {
                                    console.log( 'Got SR shiny - ' + localLocal[6][1] + ' - SR Count: ' + srCount );
                                    localLocal[6][1] = '';
                                    localLocal[6][2] = 0;
                                    localSettings[2] = 0;
                                    srCount = 0;
                                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                                    localStorage.setItem(settingKey, JSON.stringify(localSettings));
                                    Save.store(player);
                                }
                            }, 1500);
                        }
                    }
                }
            }
            break;
        case "evo":
            var evoUse = Settings.getSetting('evoOpts').observableValue();
            var evoUseCount = Number(Settings.getSetting('evoItemCount').observableValue());
            var evoList = PokemonHelper.getPokemonsWithEvolution(GameConstants.StoneType[evoUse]);
            var evoDone = 0;
            for (let x = 0; x < evoList.length; x++) {
                if (evoList[x].evolutions.length > 1) {
                    for (let y = 0; y < evoList[x].evolutions.length; y++) {
                        if (evoList[x].evolutions[y].stone == GameConstants.StoneType[evoUse]) {
                            if ( App.game.party.alreadyCaughtPokemonByName(evoList[x].evolutions[y].evolvedPokemon, true) != true && evoList[x].evolutions[y].isSatisfied()) {
                                evoDone++;
                            }
                        }
                    }
                } else {
                    if ( App.game.party.alreadyCaughtPokemonByName(evoList[x].evolutions[0].evolvedPokemon, true) != true && evoList[x].evolutions[0].isSatisfied()) {
                        evoDone++;
                    }
                }
            }
            if (evoDone >= 1 ) {
                if (player._itemList[evoUse]() >= 1) {
                    evoLoop:
                    for (let x = 0; x < evoList.length; x++) {
                        for (let y = 0; y < evoList[x].evolutions.length; y++) {
                            if (evoList[x].evolutions[y].stone == GameConstants.StoneType[evoUse]) {
                                if ( App.game.party.alreadyCaughtPokemonByName(evoList[x].evolutions[y].evolvedPokemon, true) != true && evoList[x].evolutions[y].isSatisfied()) {
                                    localLocal[6][1] = evoList[x].evolutions[y].evolvedPokemon;
                                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                                    evoName = evoList[x].evolutions[y].evolvedPokemon;
                                    player.itemList[evoUse](player.itemList[evoUse]() - 1);
                                    ItemHandler.stoneSelected(evoUse);
                                    ItemHandler.pokemonSelected(evoList[x].name);
                                    ItemHandler.amountSelected(evoUseCount);
                                    ItemHandler.useStones();
                                    evoUsed = 1;
                                    break evoLoop;
                                }
                            }
                        }
                    }
                }
            }
            if (evoUsed == 1) {
                if (App.game.party.alreadyCaughtPokemonByName(evoName, true) != true) {
                    srCount++;
                    localLocal[6][2] = srCount;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    console.log( '[FAILED] :: ' + evoName + ' :: SR Count: ' + srCount + ' :: Stone: ' + evoUse + ' - Needed: ' + evoDone );
                    location.reload();
                } else {
                    console.log( '[CAUGHT] :: ' + evoName + ' :: SR Count: ' + srCount + ' :: Stone: ' + evoUse + ' - Needed: ' + evoDone );
                    localLocal[6][1] = '';
                    localLocal[6][2] = 0;
                    localSettings[2] = 0;
                    srCount = 0;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    localStorage.setItem(settingKey, JSON.stringify(localSettings));
                    evoUsed = 0;
                    evoName = '';
                    Save.store(player);
                }
            }
            break;
        case "fos":
            var fossilSR = Settings.getSetting('fossilOpts').observableValue();
            if (Settings.getSetting('fossilOpts').observableValue() == 'amber') {
                fossilSR = "Old Amber";
            } else {
                fossilSR = fossilSR.charAt(0).toUpperCase() + fossilSR.slice(1) + ' Fossil';
            }
            var fossilDeets = player.mineInventory().find(i => i.name == fossilSR);
            var fossilMon = GameConstants.FossilToPokemon[fossilSR];
            if ( fossilDeets.amount() >= 1 ) {
                if ( App.game.party.alreadyCaughtPokemonByName(fossilMon, true) != true ) {
                    if (App.game.breeding.eggList[0]().type == -1) {
                        Underground.sellMineItem(fossilDeets.id);
                        localLocal[6][1] = fossilMon;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    }
                }
            }
            if (App.game.breeding.eggList[0]().type != -1) {
                if (App.game.breeding.eggList[0]().steps() < App.game.breeding.eggList[0]().totalSteps) {
                    console.log( 'Waiting for steps - ' + App.game.breeding.eggList[0]().pokemon + ' - Shiny: ' + App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) );
                }
                if (App.game.breeding.eggList[0]().steps() >= App.game.breeding.eggList[0]().totalSteps) {
                    console.log( 'Hatching - ' + App.game.breeding.eggList[0]().pokemon + ' - Shiny: ' + App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) );
                    Save.store(player);
                    setTimeout(function(){
                        localLocal[6][1] = App.game.breeding.eggList[0]().pokemon;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
                        if(App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) != true) {
                            srCount++;
                            localLocal[6][2] = srCount;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                            console.log( 'SR Count: ' + srCount );
                            location.reload();
                        } else {
                            console.log( 'Got SR shiny - ' + localLocal[6][1] + ' - SR Count: ' + srCount );
                            localLocal[6][1] = '';
                            localLocal[6][2] = 0;
                            localSettings[2] = 0;
                            srCount = 0;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                            localStorage.setItem(settingKey, JSON.stringify(localSettings));
                            Save.store(player);
                        }
                    }, 1500);
                }
            }
            break;
        case "poke":
            var shopA = player.town().content;
            for (let x = 0; x < shopA.length; x++) {
                if (shopA[x].constructor.name == 'Shop') {
                    for (let y = 0; y < shopA[x].items.length; y++) {
                        if (shopA[x].items[y].constructor.name == 'PokemonItem') {
                            var sSName = shopA[x];
                        }
                    }
                }
            }
            ShopHandler.showShop(sSName);
            var smnList = ShopHandler.shopObservable().items;
            var smnNeed = 0;
            for (let x = 0; x < smnList.length; x++) {
                if (smnList[x].imageDirectory == 'pokemonItem' && App.game.party.alreadyCaughtPokemonByName(smnList[x].name, true) != true) {
                    smnNeed++;
                }
            }
            if (smnNeed >= 1 ) {
                for (let x = 0; x < smnList.length; x++) {
                    if (smnList[x].imageDirectory == 'pokemonItem' &&  App.game.party.alreadyCaughtPokemonByName(smnList[x].name, true) != true) {
                        if (App.game.wallet.currencies[ShopHandler.shopObservable().items[x].currency]() >= ShopHandler.shopObservable().items[x].price()) {
                            smnName = smnList[x].name;
                            ShopHandler.shopObservable().items[x].buy(1);
                            smnUsed = 1;
                            break;
                        }
                    }
                }
            }
            if (smnUsed == 1) {
                if (App.game.party.alreadyCaughtPokemonByName(smnName, true) != true) {
                    srCount++;
                    localLocal[6][2] = srCount;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    console.log( '[FAILED] :: ' + smnName + ' :: SR Count: ' + srCount + ' :: Needed: ' + smnNeed );
                    location.reload();
                } else {
                    smnNeed = smnNeed - 1;
                    console.log( '[CAUGHT] :: ' + smnName + ' :: SR Count: ' + srCount + ' :: Needed: ' + smnNeed );
                    localLocal[6][1] = '';
                    localLocal[6][2] = 0;
                    localSettings[2] = 0;
                    srCount = 0;
                    localStorage.setItem(saveKey, JSON.stringify(localLocal));
                    localStorage.setItem(settingKey, JSON.stringify(localSettings));
                    smnUsed = 0;
                    smnName = '';
                    Save.store(player);
                }
            }
            break;
        case "egg":
            if (document.querySelector("#breeding-filter > div.form-group.col-md-6.col-6 > input").value == ""){
                document.querySelector("#breeding-filter > div.form-group.col-md-6.col-6 > input").value = localSettings[3];
                BreedingFilters.search.value(new RegExp((document.querySelector("#breeding-filter > div.form-group.col-md-6.col-6 > input").value), 'i'));
            }
            if(document.querySelector("#breeding-filter > div.form-group.col-md-6.col-6 > input").value !== ""){
                localSettings[3] = document.querySelector("#breeding-filter > div.form-group.col-md-6.col-6 > input").value;
                localStorage.setItem(settingKey, JSON.stringify(localSettings));
            }
            PartyController.hatcherySortedList = [...App.game.party.caughtPokemon];
            var sortededHatcheryList = PartyController.hatcherySortedList.sort(PartyController.compareBy(Settings.getSetting('hatcherySort').observableValue(), Settings.getSetting('hatcherySortDirection').observableValue()));
            var filteredEggList = sortededHatcheryList.filter( (partyPokemon) => {
                if (partyPokemon.breeding || partyPokemon.level < 100) {
                    return false;
                }
                if (BreedingFilters.category.value() >= 0) {
                    if (partyPokemon.category !== BreedingFilters.category.value()) {
                        return false;
                    }
                }
                if (BreedingFilters.shinyStatus.value() == 0) {
                    if (+partyPokemon.shiny !== BreedingFilters.shinyStatus.value()) {
                        return false;
                    }
                }
                if (BreedingFilters.region.value() > -2) {
                    if (PokemonHelper.calcNativeRegion(partyPokemon.name) !== BreedingFilters.region.value()) {
                        return false;
                    }
                }
                if(localSettings[3] == ""){
                    if (!BreedingFilters.search.value().test(partyPokemon.name)) {
                        return false;
                    }
                }
                else{
                    if (BreedingFilters.search.value().test(partyPokemon.name)) {
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
                return true;
            });
            if(filteredEggList.length > 0){
                if(App.game.breeding.eggList[0]().type == -1){
                    App.game.breeding.addPokemonToHatchery(filteredEggList[0]);
                }
                localLocal[6][1] = App.game.breeding.eggList[0]().pokemon;
                localStorage.setItem(saveKey, JSON.stringify(localLocal));
            }

            if (localLocal[6][1] != '' && localLocal[6][1] != "MissingNo." && App.game.breeding.eggList[0]().type != -1) {
                if (App.game.breeding.eggList[0]().steps() < App.game.breeding.eggList[0]().totalSteps) {
                    console.log( 'Waiting for steps - ' + App.game.breeding.eggList[0]().pokemon + ' - Shiny: ' + App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) );
                }
                if (App.game.breeding.eggList[0]().steps() >= App.game.breeding.eggList[0]().totalSteps) {
                    console.log( 'Hatching - ' + App.game.breeding.eggList[0]().pokemon + ' - Shiny: ' + App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) );
                    Save.store(player);
                    setTimeout(function(){
                        localLocal[6][1] = App.game.breeding.eggList[0]().pokemon;
                        localStorage.setItem(saveKey, JSON.stringify(localLocal));
                        [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
                        if(App.game.party.alreadyCaughtPokemonByName(localLocal[6][1], true) != true) {
                            srCount++;
                            localLocal[6][2] = srCount;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                            console.log( 'SR Count: ' + srCount );
                            location.reload();
                        } else {
                            console.log( 'Got SR shiny - ' + localLocal[6][1] + ' - SR Count: ' + srCount );
                            localLocal[6][1] = '';
                            localLocal[6][2] = 0;
                            localSettings[2] = 0;
                            srCount = 0;
                            localStorage.setItem(saveKey, JSON.stringify(localLocal));
                            localStorage.setItem(settingKey, JSON.stringify(localSettings));
                            Save.store(player);
                        }
                    }, 1500);
                }
            }
            break;
    }
}

async function plantBot() {
    var selectedBerry = document.querySelector("#autoPlant").selectedIndex - 1;
    if ( selectedBerry <= 65 ) {
        if ( selectedBerry <= App.game.farming.highestUnlockedBerry() ) {
            if (App.game.farming.plotList[12].isEmpty() == true){
                if (App.game.farming.berryList[selectedBerry]() > 1) {
                    if (App.game.farming.plotList[12].isEmpty() == true) {
                        FarmController.selectedBerry(selectedBerry);
                        App.game.farming.plantAll(FarmController.selectedBerry());
                    } else if (App.game.farming.plotList[12].age > App.game.farming.berryData[b].growthTime[3]) {
                        App.game.farming.harvestAll();
                    }
                }
            } else if (App.game.farming.plotList[12].age > App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[3]) {
                App.game.farming.harvestAll();
            }
        }
    } else if ( selectedBerry > 65 ) {
        switch(selectedBerry) {
            case 66:
                //Starf 65 + Chople 40
                if (App.game.farming.plotList[5].berry == -1) {
                    App.game.farming.plant(5,65)
                    App.game.farming.plant(6,65)
                    App.game.farming.plant(7,65)
                    App.game.farming.plant(8,65)
                    App.game.farming.plant(9,65)
                    App.game.farming.plant(15,65)
                    App.game.farming.plant(16,65)
                    App.game.farming.plant(17,65)
                    App.game.farming.plant(18,65)
                    App.game.farming.plant(19,65)

                    setTimeout(() => {
                        App.game.farming.plant(0,40);
                        App.game.farming.plant(1,40);
                        App.game.farming.plant(2,40);
                        App.game.farming.plant(3,40);
                        App.game.farming.plant(4,40);
                        App.game.farming.plant(10,40);
                        App.game.farming.plant(11,40);
                        App.game.farming.plant(12,40);
                        App.game.farming.plant(13,40);
                        App.game.farming.plant(14,40);
                        App.game.farming.plant(20,40);
                        App.game.farming.plant(21,40);
                        App.game.farming.plant(22,40);
                        App.game.farming.plant(23,40);
                        App.game.farming.plant(24,40);
                    }, 50400000);
                }
                if (App.game.farming.plotList[5].age >= 50400){
                    if (App.game.farming.plotList[0].age >= 71940){
                        App.game.farming.harvestAll();
                    }
                }
                break;
            case 67:
                //Starf 65 + Chople 40 + Petaya 62
                if (App.game.farming.plotList[5].berry == -1) {
                    App.game.farming.plant(5,65);
                    App.game.farming.plant(6,65);
                    App.game.farming.plant(7,62);
                    App.game.farming.plant(8,65);
                    App.game.farming.plant(9,65);
                    App.game.farming.plant(15,65);
                    App.game.farming.plant(16,65);
                    App.game.farming.plant(17,65);
                    App.game.farming.plant(18,65);
                    App.game.farming.plant(19,65);
                    setTimeout(() => {
                        App.game.farming.plant(0,40);
                        App.game.farming.plant(1,40);
                        App.game.farming.plant(2,40);
                        App.game.farming.plant(3,40);
                        App.game.farming.plant(4,40);
                        App.game.farming.plant(10,40);
                        App.game.farming.plant(11,40);
                        App.game.farming.plant(12,40);
                        App.game.farming.plant(13,40);
                        App.game.farming.plant(14,40);
                        App.game.farming.plant(20,40);
                        App.game.farming.plant(21,40);
                        App.game.farming.plant(22,40);
                        App.game.farming.plant(23,40);
                        App.game.farming.plant(24,40);
                    }, 50400000);
                }
                if (App.game.farming.plotList[5].age >= 50400){
                    if (App.game.farming.plotList[7].age >= 345600){
                        App.game.farming.harvest(7);
                        App.game.farming.plant(7,62);
                    }
                }
                break;
            case 68:
                //Starf 65 + Lum 19
                if (App.game.farming.plotList[5].berry == -1) {
                    [0,1,2,3,4,5,7,9,10,11,12,13,14,15,17,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,65));
                    setTimeout(() => {
                        [6,8,16,18].forEach(item => App.game.farming.plant(item,19));
                    }, 82800000);
                }
                if (App.game.farming.plotList[6].age >= 41400){
                    if (App.game.farming.plotList[0].age >= 343800){
                        App.game.farming.harvestAll();
                    }
                }
                break;
            case 69:
                //Starf 65 + Lum 19 + Petaya 62
                if(App.game.farming.plotList[17].berry == 62 && App.game.farming.plotList[17].age < 90000 && App.game.farming.plotList[17].age >= 86400 && App.game.farming.plotList[7].berry == 62 && App.game.farming.plotList[7].age >= 340000){
                    App.game.farming.harvest(7);
                    App.game.farming.plant(7,65);
                }
                else if(App.game.farming.plotList[7].berry == 62 && App.game.farming.plotList[7].age < 90000 && App.game.farming.plotList[7].age >= 86400 && App.game.farming.plotList[17].berry == 62 && App.game.farming.plotList[17].age >= 340000){
                    App.game.farming.harvest(17);
                    App.game.farming.plant(17,65);
                }
                else if(App.game.farming.plotList[17].age >= 340000){
                    App.game.farming.harvest(7);
                    App.game.farming.plant(7,62);
                }
                else if(App.game.farming.plotList[7].age >= 340000){
                    App.game.farming.harvest(17);
                    App.game.farming.plant(17,62);
                }
                break;
            case 70:
                //Starf 65 + Lum 19 + Chople 40
                break;
            case 71:
                //Starf 65 + Lum 19 + Chople 40 + Petaya 62
        }
    }
}

async function mutateBot() {
    var selectedBerry = document.querySelector("#autoMutate").value;

    switch (selectedBerry) {
        case "Persim":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,6);
                setTimeout(() => {
                    App.game.farming.plant(6,2);
                }, 240000);
            }
            if (App.game.farming.plotList[12].berry == 6) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 8) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].berry != -1) {
                if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                    App.game.farming.harvestAll();
                }
            }
            break;
        case "Razz":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,5);
                setTimeout(() => {
                    App.game.farming.plant(6,0);
                }, 210000);
            }
            if (App.game.farming.plotList[12].berry == 5) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 9) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Bluk":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,5);
                setTimeout(() => {
                    App.game.farming.plant(6,1);
                }, 200000);
            }
            if (App.game.farming.plotList[12].berry == 5) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 10) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Nanab":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,4);
                setTimeout(() => {
                    App.game.farming.plant(6,2);
                }, 60000);
            }
            if (App.game.farming.plotList[12].berry == 4) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 11) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Wepear":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,6);
                setTimeout(() => {
                    App.game.farming.plant(6,3);
                }, 220000);
            }
            if (App.game.farming.plotList[12].berry == 6) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 12) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Pinap":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,7);
                setTimeout(() => {
                    App.game.farming.plant(12,4);
                }, 480000);
            }
            if (App.game.farming.plotList[6].berry == 7) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 13) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Figy":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(7,0);
                App.game.farming.plant(11,0);
                App.game.farming.plant(12,0);
            }
            if (App.game.farming.plotList[12].berry == 0) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 14) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Wiki":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(7,1);
                App.game.farming.plant(11,1);
                App.game.farming.plant(12,1);
            }
            if (App.game.farming.plotList[12].berry == 1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 15) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Mago":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(7,2);
                App.game.farming.plant(11,2);
                App.game.farming.plant(12,2);
            }
            if (App.game.farming.plotList[12].berry == 2) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 16) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Aguav":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(7,3);
                App.game.farming.plant(11,3);
                App.game.farming.plant(12,3);
            }
            if (App.game.farming.plotList[12].berry == 3) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 17) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Iapapa":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(7,4);
                App.game.farming.plant(11,4);
                App.game.farming.plant(12,4);
            }
            if (App.game.farming.plotList[12].berry == 4) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 18) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Lum":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,7);
                setTimeout(() => {
                    App.game.farming.plant(7,6);
                }, 300000);
                setTimeout(() => {
                    App.game.farming.plant(11,5);
                }, 360000);
                setTimeout(() => {
                    App.game.farming.plant(8,4);
                }, 480000);
                setTimeout(() => {
                    App.game.farming.plant(16,3);
                }, 520000);
                setTimeout(() => {
                    App.game.farming.plant(13,2);
                }, 540000);
                setTimeout(() => {
                    App.game.farming.plant(17,1);
                }, 560000);
                setTimeout(() => {
                    App.game.farming.plant(18,0);
                }, 570000);
            }
            if (App.game.farming.plotList[6].berry == 7) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 19) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[18].age > (App.game.farming.berryData[App.game.farming.plotList[18].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        // 3x3 throigh Grepa, then 5x5
        case "Pomeg":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,18);
                setTimeout(() => {
                    App.game.farming.plant(6,16);
                }, 10000);
            }
            if (App.game.farming.plotList[12].berry == 18) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 20) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Kelpsy":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,8);
                setTimeout(() => {
                    App.game.farming.plant(6,1);
                }, 50000);
            }
            if (App.game.farming.plotList[12].berry == 8) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 21) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Qualot":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,16);
                setTimeout(() => {
                    App.game.farming.plant(6,13);
                }, 130000);
            }
            if (App.game.farming.plotList[12].berry == 16) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 22) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Hondew":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,15);
                setTimeout(() => {
                    App.game.farming.plant(13,17);
                    App.game.farming.plant(8,14);
                }, 10000);
            }
            if (App.game.farming.plotList[12].berry == 15) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 23) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[13].age > (App.game.farming.berryData[App.game.farming.plotList[13].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Grepa":
            if (App.game.farming.plotList[12].berry == -1) {
                App.game.farming.plant(12,17);
                App.game.farming.plant(6,14);
            }
            if (App.game.farming.plotList[12].berry == 17) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 24) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Tamato":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,20);
                App.game.farming.plant(9,20);
                App.game.farming.plant(21,20);
                App.game.farming.plant(24,20);
                setTimeout(function(){
                    [0,1,2,3,4,5,7,8,10,11,12,13,14,15,16,17,18,19,20,22,23].forEach(item => App.game.farming.plant(item,9));
                }, 5150000);
            }
            if (App.game.farming.plotList[6].berry == 20) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 25) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[12].age > (App.game.farming.berryData[App.game.farming.plotList[12].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Cornn":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,15);
                App.game.farming.plant(9,15);
                App.game.farming.plant(21,15);
                App.game.farming.plant(24,15);
                setTimeout(function(){
                    App.game.farming.plant(5,10);
                    App.game.farming.plant(8,10);
                    App.game.farming.plant(20,10);
                    App.game.farming.plant(23,10);
                }, 30000);
                setTimeout(function(){
                    App.game.farming.plant(1,5);
                    App.game.farming.plant(4,5);
                    App.game.farming.plant(16,5);
                    App.game.farming.plant(19,5);
                }, 120000);
            }
            if (App.game.farming.plotList[6].berry == 15) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 26) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[1].age > (App.game.farming.berryData[App.game.farming.plotList[1].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Magost":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,16);
                App.game.farming.plant(9,16);
                App.game.farming.plant(21,16);
                App.game.farming.plant(24,16);
                setTimeout(function(){
                    App.game.farming.plant(5,11);
                    App.game.farming.plant(8,11);
                    App.game.farming.plant(20,11);
                    App.game.farming.plant(23,11);
                }, 120000);
                setTimeout(function(){
                    App.game.farming.plant(1,2);
                    App.game.farming.plant(4,2);
                    App.game.farming.plant(16,2);
                    App.game.farming.plant(19,2);
                }, 310000);
            }
            if (App.game.farming.plotList[6].berry == 16) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 27) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[1].age > (App.game.farming.berryData[App.game.farming.plotList[1].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Rabuta":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,17);
                App.game.farming.plant(9,17);
                App.game.farming.plant(21,17);
                App.game.farming.plant(24,17);
                setTimeout(function(){
                    [0,1,2,3,4,5,7,8,10,11,12,13,14,15,16,17,18,19,20,22,23].forEach(item => App.game.farming.plant(item,4));
                }, 230000);
            }
            if (App.game.farming.plotList[6].berry == 17) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 28) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[1].age > (App.game.farming.berryData[App.game.farming.plotList[1].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Nomel":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,13);
                App.game.farming.plant(9,13);
                App.game.farming.plant(21,13);
                App.game.farming.plant(24,13);
            }
            if (App.game.farming.plotList[6].berry == 13) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 29) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Spelon":
            if (App.game.farming.plotList[6].berry == -1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,25);
                }
            }
            if (App.game.farming.plotList[6].berry == 25) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 30) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Pamtre":
            if (App.game.farming.plotList[6].berry == -1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,26);
                }
            }
            if (App.game.farming.plotList[6].berry == 26) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 31) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Watmel":
            if (App.game.farming.plotList[6].berry == -1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,27);
                }
            }
            if (App.game.farming.plotList[6].berry == 27) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 32) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Durin":
            if (App.game.farming.plotList[6].berry == -1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,28);
                }
            }
            if (App.game.farming.plotList[6].berry == 28) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 33) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Belue":
            if (App.game.farming.plotList[6].berry == -1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,29);
                }
            }
            if (App.game.farming.plotList[6].berry == 29) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 34) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Occa":
            if (App.game.farming.plotList[5].berry == -1) {
                App.game.farming.plant(5,30);
                App.game.farming.plant(9,30);
                App.game.farming.plant(22,30);
                setTimeout(function(){
                    App.game.farming.plant(0,25);
                    App.game.farming.plant(4,25);
                    App.game.farming.plant(17,25);
                }, 6840000);
                setTimeout(function(){
                    App.game.farming.plant(2,14);
                    App.game.farming.plant(15,14);
                    App.game.farming.plant(19,14);
                }, 15130000);
                setTimeout(function(){
                    App.game.farming.plant(7,9);
                    App.game.farming.plant(20,9);
                    App.game.farming.plant(24,9);
                }, 15230000);
            }
            if (App.game.farming.plotList[5].berry == 30) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 35) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[7].age > (App.game.farming.berryData[App.game.farming.plotList[7].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Passho":
            if (App.game.farming.plotList[7].berry == -1) {
                App.game.farming.plant(7,43);
                App.game.farming.plant(20,43);
                App.game.farming.plant(24,43);
                setTimeout(function(){
                    App.game.farming.plant(2,21);
                    App.game.farming.plant(15,21);
                    App.game.farming.plant(19,21);
                }, 13800000);
                setTimeout(function(){
                    App.game.farming.plant(0,6);
                    App.game.farming.plant(4,6);
                    App.game.farming.plant(17,6);
                }, 19500000);
                setTimeout(function(){
                    App.game.farming.plant(5,1);
                    App.game.farming.plant(9,1);
                    App.game.farming.plant(22,1);
                }, 19760000);
            }
            if (App.game.farming.plotList[7].berry == 30) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 36) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[5].age > (App.game.farming.berryData[App.game.farming.plotList[5].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Wacan":
            if (App.game.farming.plotList[7].berry == -1) {
                App.game.farming.plant(7,24);
                App.game.farming.plant(20,24);
                App.game.farming.plant(24,24);
                setTimeout(function(){
                    App.game.farming.plant(5,22);
                    App.game.farming.plant(9,22);
                    App.game.farming.plant(22,22);
                }, 2400000);
                setTimeout(function(){
                    App.game.farming.plant(0,18);
                    App.game.farming.plant(4,18);
                    App.game.farming.plant(17,18);
                }, 6820000);
                setTimeout(function(){
                    App.game.farming.plant(2,13);
                    App.game.farming.plant(15,13);
                    App.game.farming.plant(19,13);
                }, 6960000);
            }
            if (App.game.farming.plotList[7].berry == 24) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 37) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[2].age > (App.game.farming.berryData[App.game.farming.plotList[2].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Rindo":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,17);
                App.game.farming.plant(9,17);
                App.game.farming.plant(21,17);
                App.game.farming.plant(24,17);
                App.game.farming.plant(0,14);
                App.game.farming.plant(3,14);
                App.game.farming.plant(15,14);
                App.game.farming.plant(18,14);
            }
            if (App.game.farming.plotList[6].berry == 17) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 38) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Yache":
            if (App.game.farming.plotList[0].berry == -1) {
                App.game.farming.plant(0,36);
                App.game.farming.plant(2,36);
                App.game.farming.plant(4,36);
                App.game.farming.plant(10,36);
                App.game.farming.plant(12,36);
                App.game.farming.plant(14,36);
                App.game.farming.plant(20,36);
                App.game.farming.plant(22,36);
                App.game.farming.plant(24,36);
            }
            if (App.game.farming.plotList[0].berry == 36) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 39) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Chople":
            if (App.game.farming.plotList[0].berry == -1 && OakItem["Blaze_Cassette"].isActive == true) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,30);
                }
            }
            if (App.game.farming.plotList[0].berry == 30) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 40) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Kebia":
            if (App.game.farming.plotList[0].berry == -1 && OakItem["Poison_Barb"].isActive == true) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,31);
                }
            }
            if (App.game.farming.plotList[0].berry == 31) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 41) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Shuca":
            if (App.game.farming.plotList[0].berry == -1 && OakItem["Sprinklotad"].isActive == true) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,32);
                }
            }
            if (App.game.farming.plotList[0].berry == 32) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 42) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Coba":
            if (App.game.farming.plotList[0].berry == -1) {
                App.game.farming.plant(0,15);
                App.game.farming.plant(3,15);
                App.game.farming.plant(15,15);
                App.game.farming.plant(18,15);
                setTimeout(function(){
                    App.game.farming.plant(6,17);
                    App.game.farming.plant(9,17);
                    App.game.farming.plant(21,17);
                    App.game.farming.plant(24,17);
                }, 10000);
            }
            if (App.game.farming.plotList[0].berry == 15) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 43) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[6].age > (App.game.farming.berryData[App.game.farming.plotList[6].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Payapa":
            if (App.game.farming.plotList[7].berry == -1) {
                App.game.farming.plant(7,31);
                App.game.farming.plant(20,31);
                App.game.farming.plant(24,31);
                setTimeout(function(){
                    App.game.farming.plant(2,26);
                    App.game.farming.plant(15,26);
                    App.game.farming.plant(19,26);
                }, 9000000);
                setTimeout(function(){
                    App.game.farming.plant(0,15);
                    App.game.farming.plant(4,15);
                    App.game.farming.plant(17,15);
                }, 17640000);
                setTimeout(function(){
                    App.game.farming.plant(5,10);
                    App.game.farming.plant(9,10);
                    App.game.farming.plant(22,10);
                }, 17670000);
            }
            if (App.game.farming.plotList[7].berry == 31) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 44) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[5].age > (App.game.farming.berryData[App.game.farming.plotList[5].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Tanga":
            if (App.game.farming.plotList[0].berry == -1) {
                [0,1,2,3,4,5,7,9,10,11,12,13,14,15,17,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,38));
            }
            if (App.game.farming.plotList[0].berry == 38) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 45) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Charti":
            if (App.game.farming.plotList[0].berry == -1 && OakItem["Cell_Battery"].isActive == true) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,26);
                }
            }
            if (App.game.farming.plotList[0].berry == 26) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 46) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Kasib":
            if (App.game.farming.plotList[0].berry == -1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,0);
                }
            }
            if (App.game.farming.plotList[0].berry == 26) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 47) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            break;
        case "Haban":
            if (App.game.farming.plotList[1].berry == -1) {
                App.game.farming.plant(1,38);
                App.game.farming.plant(9,38);
                App.game.farming.plant(15,38);
                App.game.farming.plant(23,38);
                setTimeout(function(){
                    App.game.farming.plant(12,35);
                }, 6840000);
                setTimeout(function(){
                    App.game.farming.plant(3,36);
                    App.game.farming.plant(5,36);
                    App.game.farming.plant(19,36);
                    App.game.farming.plant(21,36);
                }, 7200000);
                setTimeout(function(){
                    App.game.farming.plant(2,37);
                    App.game.farming.plant(10,37);
                    App.game.farming.plant(14,37);
                    App.game.farming.plant(22,37);
                }, 27000000);
            }
            if (App.game.farming.plotList[1].berry == 38) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 48) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[2].age > (App.game.farming.berryData[App.game.farming.plotList[2].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Colbur":
            if (App.game.farming.plotList[6].berry == -1) {
                App.game.farming.plant(6,44);
                App.game.farming.plant(9,44);
                App.game.farming.plant(21,44);
                App.game.farming.plant(24,44);
                setTimeout(function(){
                    App.game.farming.plant(1,28);
                    App.game.farming.plant(4,28);
                    App.game.farming.plant(16,28);
                    App.game.farming.plant(19,28);
                }, 21960000);
                setTimeout(function(){
                    App.game.farming.plant(5,47);
                    App.game.farming.plant(8,47);
                    App.game.farming.plant(20,47);
                    App.game.farming.plant(23,47);
                }, 33900000);
            }
            if (App.game.farming.plotList[6].berry == 44) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 49) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[1].age > (App.game.farming.berryData[App.game.farming.plotList[1].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Babiri":
            if (App.game.farming.plotList[0].berry == -1) {
                [0,1,2,3,4,7,17,20,21,22,23,24].forEach(item => App.game.farming.plant(item,42));
                setTimeout(function(){
                    [5,9,10,11,12,13,14,15,19].forEach(item => App.game.farming.plant(item,47));
                }, 1800000);
            }
            if (App.game.farming.plotList[0].berry == 42) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 50) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Chilan":
            if (App.game.farming.plotList[0].berry == -1) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++){
                    App.game.farming.plant(berryIt,40);
                }
            }
            if (App.game.farming.plotList[0].berry == 40) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 51) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Roseli":
            if (App.game.farming.plotList[7].berry == -1) {
                App.game.farming.plant(7,32);
                App.game.farming.plant(20,32);
                App.game.farming.plant(24,32);
                setTimeout(function(){
                    App.game.farming.plant(2,27);
                    App.game.farming.plant(15,27);
                    App.game.farming.plant(19,27);
                }, 2160000);
                setTimeout(function(){
                    App.game.farming.plant(0,16);
                    App.game.farming.plant(4,16);
                    App.game.farming.plant(17,16);
                }, 16190000);
                setTimeout(function(){
                    App.game.farming.plant(5,11);
                    App.game.farming.plant(9,11);
                    App.game.farming.plant(22,11);
                }, 16310000);
            }
            if (App.game.farming.plotList[7].berry == 32) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 52) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[5].age > (App.game.farming.berryData[App.game.farming.plotList[5].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Micle":
            if (App.game.farming.plotList[0].berry == -1) {
                [0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,31));
            }
            if (App.game.farming.plotList[0].berry == 31) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 53) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Custap":
            if (App.game.farming.plotList[0].berry == -1) {
                [0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,32));
            }
            if (App.game.farming.plotList[0].berry == 32) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 54) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Jaboca":
            if (App.game.farming.plotList[0].berry == -1) {
                [0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,33));
            }
            if (App.game.farming.plotList[0].berry == 33) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 55) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Rowap":
            if (App.game.farming.plotList[0].berry == -1) {
                [0,1,2,3,4,5,7,9,10,11,13,14,15,17,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,34));
            }
            if (App.game.farming.plotList[0].berry == 34) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 56) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Kee":
            if (App.game.farming.plotList[0].berry == -1) {
                [0,3,15,18].forEach(item => App.game.farming.plant(item,59));
                [6,9,21,24].forEach(item => App.game.farming.plant(item,60));
            }
            if (App.game.farming.plotList[0].berry == 59) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 57) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Maranga":
            if (App.game.farming.plotList[0].berry == -1) {
                App.game.farming.plant(0,61);
                App.game.farming.plant(3,61);
                App.game.farming.plant(15,61);
                App.game.farming.plant(18,61);
                setTimeout(function(){
                    App.game.farming.plant(6,62);
                    App.game.farming.plant(9,62);
                    App.game.farming.plant(21,62);
                    App.game.farming.plant(24,62);
                }, 86400000);
            }
            if (App.game.farming.plotList[0].berry == 61) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 58) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Liechi":
            if (App.game.farming.plotList[0].berry == -1 && App.game.party.alreadyCaughtPokemonByName("Kyogre") == true) {
                [0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,36));
            }
            if (App.game.farming.plotList[0].berry == 36) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 59) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Ganlon":
            if (App.game.farming.plotList[0].berry == -1 && App.game.party.alreadyCaughtPokemonByName("Groudon") == true) {
                [0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,42));
            }
            if (App.game.farming.plotList[0].berry == 42) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 60) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Salac":
            if (App.game.farming.plotList[0].berry == -1 && App.game.party.alreadyCaughtPokemonByName("Rayquaza") == true) {
                [0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,43));
            }
            if (App.game.farming.plotList[0].berry == 43) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 61) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Petaya":
            if (App.game.farming.plotList[24].berry == -1) {
                App.game.farming.plant(24,48);
                setTimeout(function(){
                    App.game.farming.plant(16,50);
                }, 21600000);
                setTimeout(function(){
                    App.game.farming.plant(14,39);
                }, 43200000);
                setTimeout(function(){
                    App.game.farming.plant(15,42);
                }, 46800000);
                setTimeout(function(){
                    App.game.farming.plant(10,46);
                }, 48600000);
                setTimeout(function(){
                    App.game.farming.plant(21,40);
                }, 50400000);
                setTimeout(function(){
                    App.game.farming.plant(12,44);
                }, 52200000);
                setTimeout(function(){
                    App.game.farming.plant(22,38);
                }, 57600000);
                setTimeout(function(){
                    App.game.farming.plant(4,49);
                }, 59400000);
                setTimeout(function(){
                    App.game.farming.plant(13,36);
                }, 61200000);
                setTimeout(function(){
                    App.game.farming.plant(17,52);
                }, 61200000);
                setTimeout(function(){
                    App.game.farming.plant(0,35);
                }, 64440000);
                setTimeout(function(){
                    App.game.farming.plant(11,43);
                }, 66600000);
                setTimeout(function(){
                    App.game.farming.plant(23,51);
                }, 77400000);
                setTimeout(function(){
                    App.game.farming.plant(18,45);
                }, 79800000);
                setTimeout(function(){
                    App.game.farming.plant(19,37);
                }, 82620000);
                setTimeout(function(){
                    App.game.farming.plant(2,41);
                }, 85800000);
                setTimeout(function(){
                    App.game.farming.plant(20,47);
                }, 86100000);
            }
            if (App.game.farming.plotList[24].berry == 48) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 62) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[19].age > (App.game.farming.berryData[App.game.farming.plotList[19].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Apicot":
            if (App.game.farming.plotList[0].berry == -1 && App.game.party.alreadyCaughtPokemonByName("Palkia") == true) {
                [0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,51));
            }
            if (App.game.farming.plotList[0].berry == 51) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 63) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
        case "Lansat":
            if (App.game.farming.plotList[0].berry == -1 && App.game.party.alreadyCaughtPokemonByName("Dialga") == true) {
                [0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].forEach(item => App.game.farming.plant(item,52));
            }
            if (App.game.farming.plotList[0].berry == 52) {
                for (let berryIt = 0; berryIt < App.game.farming.plotList.length; berryIt++) {
                    if (App.game.farming.plotList[berryIt].berry == 64) {
                        if (App.game.farming.plotList[berryIt].age > (App.game.farming.berryData[App.game.farming.plotList[berryIt].berry].growthTime[3])) {
                            App.game.farming.harvestAll();
                        }
                    }
                }
            }
            if (App.game.farming.plotList[0].age > (App.game.farming.berryData[App.game.farming.plotList[0].berry].growthTime[4] - 5)) {
                App.game.farming.harvestAll();
            }
            break;
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
            if (Settings.getSetting('fossilOpts').observableValue() == 'amber') {
                fossilU = "Old Amber";
            } else {
                fossilU = fossilU.charAt(0).toUpperCase() + fossilU.slice(1) + ' Fossil';
            }
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
    var purAmount = Number(Settings.getSetting('ballPurAmount').observableValue());
    var minAmount = Number(Settings.getSetting('minBallAmount').observableValue());

    if (App.game.badgeCase.hasBadge(26) == true) {
        ShopHandler.showShop(pokeMartShop);
        ShopHandler.shopObservable().items;
        if (Settings.getSetting('ballBuyOpts').observableValue() == 'pokeB') {
            if (App.game.pokeballs.pokeballs[0].quantity() <= minAmount) {
                ShopHandler.shopObservable().items[0].buy(purAmount);
            }
        }
        if (Settings.getSetting('ballBuyOpts').observableValue() == 'greatB') {
            if (App.game.pokeballs.pokeballs[1].quantity() <= minAmount && ShopHandler.shopObservable().items[1].price() == ShopHandler.shopObservable().items[1].basePrice) {
                ShopHandler.shopObservable().items[1].buy(purAmount);
            }
        }
        if (Settings.getSetting('ballBuyOpts').observableValue() == 'ultraB' ) {
            if (App.game.pokeballs.pokeballs[2].quantity() <= minAmount && ShopHandler.shopObservable().items[2].price() == ShopHandler.shopObservable().items[2].basePrice) {
                ShopHandler.shopObservable().items[2].buy(purAmount);
            }
        }
    } else {
        switch (player.region) {
            case 0:
                if (Settings.getSetting('ballBuyOpts').observableValue() == 'pokeB') {
                    if (MapHelper.accessToTown('Viridian City') == true) {
                        ShopHandler.showShop(ViridianCityShop);
                        ShopHandler.shopObservable().items;
                        if (App.game.pokeballs.pokeballs[0].quantity() <= minAmount) {
                            ShopHandler.shopObservable().items[0].buy(purAmount);
                        }
                    }
                }
                if (Settings.getSetting('ballBuyOpts').observableValue() == 'greatB') {
                    if (MapHelper.accessToTown('Lavender Town') == true) {
                        ShopHandler.showShop(LavenderTownShop);
                        ShopHandler.shopObservable().items;
                        if (App.game.pokeballs.pokeballs[1].quantity() <= minAmount && ShopHandler.shopObservable().items[1].price() == ShopHandler.shopObservable().items[1].basePrice) {
                            ShopHandler.shopObservable().items[1].buy(purAmount);
                        }
                    }
                }
                if (Settings.getSetting('ballBuyOpts').observableValue() == 'ultraB' ) {
                    if (MapHelper.accessToTown('Fuchsia City') == true) {
                        ShopHandler.showShop(FuchsiaCityShop);
                        ShopHandler.shopObservable().items;
                        if (App.game.pokeballs.pokeballs[2].quantity() <= minAmount && ShopHandler.shopObservable().items[2].price() == ShopHandler.shopObservable().items[2].basePrice) {
                            ShopHandler.shopObservable().items[2].buy(purAmount);
                        }
                    }
                }
                break;
            case 1:
                if (Settings.getSetting('ballBuyOpts').observableValue() == 'pokeB') {
                    if (MapHelper.accessToTown('New Bark Town') == true) {
                        ShopHandler.showShop(NewBarkTownShop);
                        ShopHandler.shopObservable().items;
                        if (App.game.pokeballs.pokeballs[0].quantity() <= minAmount) {
                            ShopHandler.shopObservable().items[0].buy(purAmount);
                        }
                    }
                }
                if (Settings.getSetting('ballBuyOpts').observableValue() == 'greatB' || Settings.getSetting('ballBuyOpts').observableValue() == 'ultraB') {
                    if (MapHelper.accessToTown('Goldenrod City') == true) {
                        ShopHandler.showShop(GoldenrodDepartmentStoreShop);
                        ShopHandler.shopObservable().items;
                        if (Settings.getSetting('ballBuyOpts').observableValue() == 'greatB') {
                            if (App.game.pokeballs.pokeballs[1].quantity() <= minAmount && ShopHandler.shopObservable().items[1].price() == ShopHandler.shopObservable().items[1].basePrice) {
                                ShopHandler.shopObservable().items[1].buy(purAmount);
                            }
                        } else if (Settings.getSetting('ballBuyOpts').observableValue() == 'ultraB') {
                            if (App.game.pokeballs.pokeballs[2].quantity() <= minAmount && ShopHandler.shopObservable().items[2].price() == ShopHandler.shopObservable().items[2].basePrice) {
                                ShopHandler.shopObservable().items[2].buy(purAmount);
                            }
                        }
                    }
                }
        }
    }
}

function setupShinyRequirements() {
    //#region End region conditions
        // replace ableToTravel
        const mapTravel = MapHelper.ableToTravel;
        MapHelper.ableToTravel = () => mapTravel() && MapHelper.isRegionCleared(player.highestRegion());
        MapHelper.isRegionCleared = (region) => {
            let check = App.game.party.caughtPokemon.every(pokemon => pokemon.shiny);
            for (let i = 0; check && i <= region; i++) {
                check = check && Routes.getRoutesByRegion(i).every(r => RouteHelper.routeCompleted(r.number, i, false));
                check = check && GameConstants.RegionDungeons[i].every(n => DungeonRunner.dungeonCompleted(dungeonList[n], false));
                check = check && RoamingPokemonList.list[i].every(p => App.game.party.alreadyCaughtPokemonByName(p.pokemon.name));
            }
            return check;
        }

        // replace Pokedex by Shiny pokedex in prof oak check
        const profDialog = Object.getOwnPropertyDescriptor(ProfNPC.prototype, 'dialogHTML').get
            .toString()
            .replace('get dialogHTML', 'function')
            .replace('html += `<p>${this.pokedexCompleteText}</p>`;',
                'html += `<p>${this.pokedexCompleteText}</p>`;\
                if (!MapHelper.isRegionCleared(this.region)) {\
                    html += `<p>But it seems you are still missing something</p>`;\
                }'
            )
            .replace('(?<!Shiny )Master', 'Shiny Master')
            .replace('nextRegionUnlocked && (', 'nextRegionUnlocked && MapHelper.isRegionCleared(this.region) && (')
        Object.defineProperty(ProfNPC.prototype, 'dialogHTML', {
            get: eval('(' + profDialog + ')')
        })
    //#endregion
    //#region once unlock, always unlock
        let cache = { dungeons : [], routes : [] }
        Requirement.prototype.deepScan = function (requirements) {
            let check = true;
            for (let rdx = 0; rdx < requirements.length && check; rdx++) {
                const req = requirements[rdx];
                if (req instanceof ClearDungeonRequirement) {
                    const id = req.dungeonIndex;
                    if (!cache.dungeons.includes(id)) {
                        cache.dungeons.push(id);
                        check = req.isCompleted();
                    }
                } else if (req instanceof RouteKillRequirement){
                    const id = `${req.region},${req.route}`;
                    if (!cache.routes.includes(id)) {
                        cache.routes.push(id);
                        check = req.isCompleted();
                    }
                } else {
                    check = req.isCompleted();
                }
            }
            return check;
        }

        const townUnlock = Town.prototype.isUnlocked;
        Town.prototype.isUnlocked = function () {
            cache.dungeons = [];
            cache.routes = [];

            if (!this.wasUnlock) {
                this.wasUnlock = townUnlock.call(this);
                if (this.dungeon || this.content.some(c => c instanceof MoveToDungeon)) {
                    const dungeon = this.dungeon?.name ?? this.content.find(c => c instanceof MoveToDungeon)?.name;
                    this.wasUnlock = this.wasUnlock || App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(dungeon)]();
                } 
                if (this.content.some(c => c instanceof Gym)) {
                    const badge = this.content.find(c => c instanceof Gym)?.badgeReward;
                    this.wasUnlock = this.wasUnlock || App.game.badgeCase.hasBadge(badge);
                }
            }
            return this.wasUnlock;
        }
        const routeUnlock = RegionRoute.prototype.isUnlocked;
        RegionRoute.prototype.isUnlocked = function () {
            cache.dungeons = [];
            cache.routes = [];
            
            if (!this.wasUnlock) {
                this.wasUnlock = App.game.statistics.routeKills[this.region][this.number]() ||  routeUnlock.call(this);
            }
            return this.wasUnlock;
        }
    //#endregion
    //#region CustomRequirements
        class RouteShinyRequirements extends RouteKillRequirement {
            constructor(region, route) {
                super(GameConstants.ROUTE_KILLS_NEEDED, region, route);
            }
            
            isCompleted() {
                return this.isCompletedLocaly() && this.deepScan(Routes.getRoute(this.region, this.route).requirements)
            }
            
            isCompletedLocaly() {
                return super.isCompleted() && RouteHelper.routeCompleted(this.route, this.region, true)
            }

            hint() {
                if (!this.isCompletedLocaly())
                    return super.hint()
                    
                for (const route of Routes.getRoutesByRegion(this.region)) {
                    let hints = route.requirements.filter(r => !r.isCompleted()).map(r => r.hint())
                    if (hints.length)
                        return hints.join('\n')
                }
            }
        }
        class ShinyDungeonRequirement extends ClearDungeonRequirement {
            constructor(dungeonName) {
                super(1, GameConstants.getDungeonIndex(dungeonName));
                this.town = TownList[dungeonName];
            }

            isCompleted() {
                return this.isCompletedLocaly() && this.deepScan(this.town.requirements)
            }
            
            isCompletedLocaly() {
                return super.isCompleted() && DungeonRunner.dungeonCompleted(this.town.dungeon, true)
            }
            
            hint() {
                if (!this.isCompletedLocaly())
                    return super.hint()

                for (const route of Routes.getRoutesByRegion(this.region)) {
                    let hints = route.requirements.filter(r => !r.isCompleted()).map(r => r.hint())
                    if (hints.length)
                        return hints.join('\n')
                }

                let hints = this.town.requirements.filter(r => !r.isCompleted()).map(r => r.hint())
                return hints.join('\n')
            }
        }
        class ShinySafariRequirement extends Requirement {
            constructor() {
                super(0, 2);
            }

            isCompleted() {
                return Safari.completed(true)
            }

            hint() {
                return 'Safari needs to be completed.'
            }
        }
        class CaughtIndicatingRequirement extends Requirement {
            constructor(item) {
                super(0, 2);
                this.item = item
            }

            isCompleted() {
                return this.item.getCaughtStatus() == CaughtStatus.CaughtShiny
            }

            hint() {
                return `${this.item.displayName} needs to be completed.`
            }
        }
        class ShinyShopRequirement extends MultiRequirement {
            constructor(shop) {
                let items = shop.items.filter(i => i instanceof CaughtIndicatingItem);
                super(items.map(i => new CaughtIndicatingRequirement(i)));
                this.shop = shop;
            }

            hint() {
                return `${ this.shop.displayName } needs to be completed.`
            }
        }
        class _GymBadgeRequirement extends GymBadgeRequirement {
            get gym() {
                return Object.values(GymList).find(({badgeReward}) => badgeReward == this.badge)
            }

            isCompleted() {
                return this.isCompletedLocaly() 
                    && (this.gym.parent.region != player.region || this.deepScan(this.gym.parent.requirements)) 
                    && this.deepScan(this.gym.requirements)
            }
            
            isCompletedLocaly() {
                return super.isCompleted()
            }
            
            hint() {
                if (!this.isCompletedLocaly())
                    return super.hint()

                let hints = this.gym.requirements.filter(r => !r.isCompleted()).map(r => r.hint())
                return hints.join('\n')
            }
        }
        class _TemporaryBattleRequirement extends TemporaryBattleRequirement  {
            get battle() {
                return TemporaryBattleList[this.battleName]
            }

            isCompleted() {
                return this.isCompletedLocaly() && this.deepScan(this.battle.requirements)
            }
            
            isCompletedLocaly() {
                return super.isCompleted()
            }
            
            hint() {
                if (!this.isCompletedLocaly())
                    return super.hint()

                let hints = this.battle.requirements.filter(r => !r.isCompleted()).map(r => r.hint())
                return hints.join('\n')
            }
        }
    //#endregion

    function replaceRequirements(requirements) {
        for (let reqIdx = 0; reqIdx <= requirements?.length; reqIdx++) {
            switch (requirements[reqIdx]?.constructor.name) {
                case "MultiRequirement":
                case "OneFromManyRequirement":
                    replaceRequirements(requirements[reqIdx].requirements);
                    break;
                case "RouteKillRequirement":
                    requirements[reqIdx] = new RouteShinyRequirements(requirements[reqIdx].region, requirements[reqIdx].route);
                    break;
                case "ClearDungeonRequirement":
                    requirements[reqIdx] = new ShinyDungeonRequirement(GameConstants.RegionDungeons.flat()[requirements[reqIdx].dungeonIndex]);
                    break;
                case "GymBadgeRequirement":
                    requirements[reqIdx] = new _GymBadgeRequirement(requirements[reqIdx].badge);
                    break;
                case "TemporaryBattleRequirement":
                    requirements[reqIdx] = new _TemporaryBattleRequirement(requirements[reqIdx].battleName);
                    break;
            }
        }
    }

    // Replace Requirement on Town and Dungeons
    for (let town of Object.values(TownList)) {
        replaceRequirements(town?.requirements);
    }
    // Replace Requirement on Temporary Battle
    for (let gym of Object.values(GymList).filter(g => !(g instanceof Champion))) {
        replaceRequirements(gym?.requirements);
    }
    // Replace Requirement on Temporary Battle
    for (let battle of Object.values(TemporaryBattleList)) {
        replaceRequirements(battle?.requirements);
        replaceRequirements(battle?.completeRequirements);
    }
    // Replace Requirement on Routes
    for (let region = 0; region < GameConstants.Region.final; region++) {
        for (let route of Routes.getRoutesByRegion(region)) {
            replaceRequirements(route?.requirements);
        }
    }

    //--- Split path requirements ---//
    //#region Kanto
        Routes.getRoute(0,2).requirements.push(new RouteShinyRequirements(0,22)) // route 2 require route 22
        Route3Shop.areaStatus = function() {
            if (this.items.length == this.items.filter(i=> !(i instanceof CaughtIndicatingItem) || i.getCaughtStatus() == CaughtStatus.CaughtShiny).length) {
                return areaStatus.completed;
            }
            return areaStatus.unlockedUnfinished;
        };
        TownList['Mt. Moon'].requirements.push(new ShinyShopRequirement(Route3Shop))
        Routes.getRoute(0,24).requirements.push(new _GymBadgeRequirement(BadgeEnums.Cascade));
        Routes.getRoute(0,6).requirements.push(
            new CaughtIndicatingRequirement(ItemList.Mystery_egg),
            new CaughtIndicatingRequirement(ItemList.Water_stone))
        GymList['Vermilion City'].requirements.push(new CaughtIndicatingRequirement(ItemList.Thunder_stone))
        TownList['Diglett\'s Cave'].requirements.push(new _GymBadgeRequirement(BadgeEnums.Thunder))
        Routes.getRoute(0,11).requirements.push(new ShinyDungeonRequirement('Diglett\'s Cave'))
        Routes.getRoute(0,9).requirements.push(new RouteShinyRequirements(0,11)) // route 9 require route 11
        GymList['Celadon City'].requirements.push(new ShinyShopRequirement(CeladonCityShop))
        TownList['Rocket Game Corner'].requirements.push(new _GymBadgeRequirement(BadgeEnums.Rainbow))
        TownList['Saffron City'].requirements.push(new ShinyDungeonRequirement('Rocket Game Corner'))
        TemporaryBattleList['Fighting Dojo'].requirements.push(
            new CaughtIndicatingRequirement(ItemList.Leaf_stone),
            new CaughtIndicatingRequirement(ItemList.Moon_stone)
        )
        TownList['Pokémon Tower'].requirements.push(...TemporaryBattleList['Fighting Dojo'].completeRequirements)
        TownList['Silph Co.'].requirements.push(new ShinyDungeonRequirement('Pokémon Tower'))
        Routes.getRoute(0,12).requirements.push(new _GymBadgeRequirement(BadgeEnums.Marsh))
        Routes.getRoute(0,13).requirements = [new RouteShinyRequirements(0,12)]
        Routes.getRoute(0,14).requirements = [new RouteShinyRequirements(0,13)]
        Routes.getRoute(0,15).requirements = [new RouteShinyRequirements(0,14)]
        Routes.getRoute(0,16).requirements = [new RouteShinyRequirements(0,15)] // route 16 only require route 15
        Routes.getRoute(0,17).requirements = [new RouteShinyRequirements(0,16)] // route 17 only require route 16
        Routes.getRoute(0,18).requirements = [new RouteShinyRequirements(0,17)] // route 18 only require route 17
        TownList['Fuchsia City'].requirements = [new RouteShinyRequirements(0,18)]
        GymList['Fuchsia City'].requirements = [
            new RouteShinyRequirements(0,18),
            new CaughtIndicatingRequirement(ItemList.Linking_cord)]
        TownList['Power Plant'].requirements.push(new ShinySafariRequirement())
        Routes.getRoute(0,19).requirements.push(new ShinyDungeonRequirement('Power Plant'))
        Routes.getRoute(0,20).requirements = [new ShinyDungeonRequirement('Seafoam Islands')]
        TownList['Cinnabar Island'].requirements = [new RouteShinyRequirements(0,20)]
        TownList['Pokémon Mansion'].requirements = [
            new RouteShinyRequirements(0,20),
            new CaughtIndicatingRequirement(ItemList.Fire_stone)]
        GymList['Viridian City'].requirements.push(new RouteShinyRequirements(0,21))
        // Sevii island    
        Routes.getRoute(0,26).requirements = [new QuestLineStepCompletedRequirement("Bill's Errand", 0)]
        Routes.getRoute(0,27).requirements = [new RouteShinyRequirements(0,26)]
        TownList['Two Island'].requirements = [new ShinyDungeonRequirement('Mt. Ember Summit')]
        Routes.getRoute(0,28).requirements = [new QuestLineStepCompletedRequirement("Bill's Errand", 1)]
        TownList['Three Island'].requirements = [new RouteShinyRequirements(0,28)]
        Routes.getRoute(0,21).requirements = [new QuestLineCompletedRequirement('Bill\'s Errand')]S
    //#endregion
    //#region Johto
        TownList['Cherrygrove City'].requirements = [new RouteShinyRequirements(1,46)]
        Routes.getRoute(1,30).requirements = [new RouteShinyRequirements(1,46)]
        TownList['Cherrygrove City'].requirements = [new RouteShinyRequirements(1,46)]
        TownList['Sprout Tower'].requirements.push(
            new CaughtIndicatingRequirement(ItemList.Togepi),
            new CaughtIndicatingRequirement(ItemList.Mystery_egg),
            // same as just doing (new ShinyShopRequirement(VioletCityShop))
        )
        TownList['Union Cave'].requirements.push(
            new ShinyDungeonRequirement('Ruins of Alph')
        )
        TownList['Azalea Town'].requirements.push(
            new ShinyDungeonRequirement('Slowpoke Well')
        )
        GymList['Azalea Town'].requirements.push(
            new CaughtIndicatingRequirement(ItemList.Leaf_stone),
            new CaughtIndicatingRequirement(ItemList.Kings_rock),
        )
        Routes.getRoute(1,35).requirements.push(new _GymBadgeRequirement(BadgeEnums.Plain))
        Routes.getRoute(1,36).requirements = [new RouteShinyRequirements(1,35)]
        GymList['Ecruteak City'].requirements.push(
            new CaughtIndicatingRequirement(ItemList.Fire_stone),
            new CaughtIndicatingRequirement(ItemList.Soothe_bell),
        )
        TownList['Burned Tower'].requirements.push(new _GymBadgeRequirement(BadgeEnums.Fog))
        Routes.getRoute(1,38).requirements = [new ShinyDungeonRequirement('Burned Tower')]
        Routes.getRoute(1,42).requirements = [new RouteShinyRequirements(1,48)]
        TownList['Mt. Mortar'].requirements = [new RouteShinyRequirements(1,42)]
        Routes.getRoute(1,40).requirements.push(
            new CaughtIndicatingRequirement(ItemList.Water_stone),
            new CaughtIndicatingRequirement(ItemList.Thunder_stone),
            new CaughtIndicatingRequirement(ItemList.Metal_coat),
            //TODO: require Kanto
        )
        GymList['Cianwood City'].requirements.push(
            new CaughtIndicatingRequirement(ItemList.Sun_stone),
            new CaughtIndicatingRequirement(ItemList.Moon_stone),
        )
        TownList['Mahogany Town'].requirements.push(new ShinyDungeonRequirement('Mt. Mortar'))
        Routes.getRoute(1,43).requirements.push(new CaughtIndicatingRequirement(ItemList.Upgrade))
        TownList['Tin Tower'].requirements = [
            new ShinyDungeonRequirement('Whirl Islands'),
            new ObtainedPokemonRequirement(pokemonNameIndex.entei),
            new ObtainedPokemonRequirement(pokemonNameIndex.suicune),
            new ObtainedPokemonRequirement(pokemonNameIndex.raikou),
        ]
        Routes.getRoute(1,44).requirements = [new ShinyDungeonRequirement('Tin Tower')]
        GymList['Blackthorn City'].requirements.push(new CaughtIndicatingRequirement(ItemList.Dragon_scale))
        Routes.getRoute(1,45).requirements = [new _GymBadgeRequirement(BadgeEnums.Rising)]
        Routes.getRoute(1,27).requirements = [new ShinyDungeonRequirement('Dark Cave')]
        Routes.getRoute(1,28).requirements.push(new RouteShinyRequirements(1,26))
    //#endregion
}
S