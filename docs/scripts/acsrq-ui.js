window.addEventListener('load', () => {
    acsrqSettings();
    acsrqFooter();
    phaseModal();
    acsrqInfo();

    $('#toaster')[0].setAttribute('data-bind', 'hidden: Settings.getSetting(\'hideNoti\').observableValue');

    // execute once save is fully loaded
    const gameStart = Game.prototype.start;
    Game.prototype.start = function() {
        //#region Subscriptions
        //reset bot state when bot are disabled
        Settings.getSetting('botOptions').observableValue.subscribe((value) => {
            if (!value) {
                Settings.list.filter(s => s.name.startsWith('botstate.')).forEach(s => s.set(s.defaultValue));
            }
        });

        //Disable/Enable event
        Settings.getSetting('disEvent').observableValue.subscribe((disable) => {
            for (let event of SpecialEvents.events) {
                if (disable && event.hasStarted()) {
                    event.endFunction();
                    event.status = 2;
                } else if (!disable && event.hasEnded()) {
                    event.startFunction();
                    event.status = 1;
                }
            }
        });

        //prevent event to start if disEvent is enabled
        const eventStart = SpecialEvent.prototype.start;
        SpecialEvent.prototype.start = function() {
            eventStart.call(this);
            if (Settings.getSetting('disEvent').value) {
                this.endFunction();
                this.status = 2;
            }
        };
        //#endregion

        gameStart.call(this);
    };
});

//#region ACSRQ Settings
Settings.add(new BooleanSetting('hideNoti', 'Hide all notifications', false));
Settings.add(new BooleanSetting('disableSave', 'Prevent AutoSave', false));
Settings.add(new BooleanSetting('disEvent', 'Disable special events', false));
Settings.add(new BooleanSetting('noWander', 'Hide normal Wander log entries', false));
Settings.add(new BooleanSetting('showShiny', 'Show needed shinies', false));
Settings.add(new BooleanSetting('showLoot', 'Show possible dungeon loot', false));
Settings.add(new BooleanSetting('trackPhases', 'Track shiny phases and display below', false));
Settings.add(new Setting('phaseCount', 'phaseCount', [], 100));
//#endregion
//#region Scriped Settings
Settings.add(new BooleanSetting('botOptions', 'Enable bot options', false));
Settings.add(new BooleanSetting('botRush', 'Boss rush in dungeons', false));
Settings.add(new BooleanSetting('chestCollect', 'Open chests in dungeons', false));
Settings.add(new Setting('dungeOpts', 'Dungeon bot stop options', [
    new SettingOption('None', 'dungOptN'),
    new SettingOption('Clears', 'dungOptC'),
    new SettingOption('Shiny Check', 'dungOptSC'),
    new SettingOption('Dungeon Tokens Left', 'dungOptDT'),
], 'dungOptN'));
Settings.add(new Setting('gymOpts', 'Gym bot stop options', [
    new SettingOption('Clears', 'gymOptC'),
    new SettingOption('None', 'gymOptN'),
], 'gymOptN'));
Settings.add(new Setting('gymE4Opts', 'E4 Boss to fight', [
    new SettingOption('First', 1),
    new SettingOption('Second', 2),
    new SettingOption('Third', 3),
    new SettingOption('Fourth', 4),
    new SettingOption('Fifth', 5),
], 1));
Settings.add(new Setting('bfOpts', 'Battle Frontier stop options', [
    new SettingOption('None', 'bfOptN'),
    new SettingOption('Time', 'bfOptT'),
    new SettingOption('Level', 'bfOptL'),
], 'bfOptN'));
Settings.add(new Setting('maxChests', 'Number of chests to open', [], 1));
Settings.add(new Setting('maxClears', 'Maximum Clears', [], 1000));
Settings.add(new Setting('minDT', 'Minimum DT to retain', [], 10000));
Settings.add(new Setting('maxLvl', 'Battle Frontier stop Options', [], 100));
Settings.add(new Setting('maxTime', 'Time remaining to quit Battle Frontier at', [], 30));
Settings.add(new Setting('srOpts', 'Soft Reset Type', [
    new SettingOption('None', 'none'),
    new SettingOption('Mystery Eggs', 'mys'),
    new SettingOption('Evo Items', 'evo'),
    new SettingOption('Fossils', 'fos'),
    new SettingOption('Shop Mon', 'poke'),
    new SettingOption('Regular Eggs', 'egg'),
], 'none'));
Settings.add(new Setting('evoOpts', 'Soft Reset Evo Item',
    Object.values(ItemList).filter(i => i instanceof EvolutionStone).map(e => new SettingOption(e.displayName, e.name)),
    'Water_stone'));
Settings.add(new Setting('breedingOpts', 'Breeding options',[
    new SettingOption('None', 'none'),
    new SettingOption('Upto Attack', 'attack'),
    new SettingOption('Mystery Eggs', 'mystery'),
    new SettingOption('Typed Eggs', 'typed'),
    new SettingOption('Fossils', 'fossil'),
], 'none'));
Settings.add(new Setting('minBreedAttack', 'Breed each Pokemon up to this attack power', [], 1000));
Settings.add(new Setting('typedEggOpts', 'Typed egg to use', [
    new SettingOption('Fire', 'fire'),
    new SettingOption('Water', 'water'),
    new SettingOption('Grass', 'grass'),
    new SettingOption('Electric', 'electric'),
    new SettingOption('Fighting', 'fighting'),
    new SettingOption('Dragon', 'dragon'),
], 'fire'));
Settings.add(new Setting('fossilOpts', 'Fossil to use',
    UndergroundItem.list.filter(i => i.valueType == 'Mine Egg').map(f => new SettingOption(f.displayName, f.name)),
    'Dome Fossil'));
Settings.add(new Setting('evoItemCount', 'Evo items to use', [], 1));
Settings.add(new Setting('ballBuyOpts', 'Auto-purchase pokeballs?', [
    new SettingOption('None', 'none'),
    new SettingOption('Pokéball', 'pokeB'),
    new SettingOption('Greatball', 'greatB'),
    new SettingOption('Ultraball', 'ultraB'),
], 'none'));
Settings.add(new Setting('minBallAmount', 'Minimum amount of Pokéballs to keep', [], 0));
Settings.add(new Setting('ballPurAmount', 'Amount of Pokéballs to purchase', [], 1000));
Settings.add(new Setting('safariOpts', 'Safari bot stop options', [
    new SettingOption('None', 'safariOptN'),
    new SettingOption('Shiny Check', 'safariOptSC'),
], 'safariOptSC'));
//#endregion
//#region Bot state Settings
Settings.add(new BooleanSetting('botstate.breeding', 'Breeding Bot', false));
Settings.add(new BooleanSetting('botstate.dungeon', 'Dungeon Bot', false));
Settings.add(new BooleanSetting('botstate.gym', 'Gym Bot', false));
Settings.add(new BooleanSetting('botstate.safari', 'Safari Bot', false));
Settings.add(new BooleanSetting('botstate.bf', 'BF Bot', false));
Settings.add(new BooleanSetting('botstate.sr', 'SR Bot', false));
Settings.add(new Setting('botstate.plant', 'Plant Bot', [new SettingOption('N/A', 'N/A')], 'N/A'));
Settings.add(new Setting('botstate.mutate', 'Mutate Bot', [new SettingOption('N/A', 'N/A')], 'N/A'));
//#endregion

//#region Info / Bot menu
acsrqInfo = function () {
    document.getElementById('pokeballSelector').insertAdjacentHTML('afterend', `
    <div id="acsrqContainer" class="card sortable border-secondary mb-3">
        <div class="card-header p-0" data-toggle="collapse" href="#acsrqBody">
            <span>ACSRQ</span>
        </div>
        <div id="acsrqBody" class="card-body p-0 show table-responsive">
            <table id="acsrqTable" class="table table-sm m-0">
                <tbody></tbody>
            </table>
        </div>
    </div>
    `);

    let berries = Object.values(BerryType).filter(t => !Number.isInteger(t)).map(b => new SettingOption(b, b));
    berries.pop(); // remove None entry
    berries.pop(); // remove Enigma entry

    Settings.getSetting('botstate.mutate').options.push(...berries.slice(8));
    Settings.getSetting('botstate.plant').options.push(...berries,
        new SettingOption('S+C', 'S+C'),
        new SettingOption('S+C+P','S+C+P'),
        new SettingOption('S+L', 'S+L'),
        new SettingOption('Perp. P', 'Perp. P')
        // new SettingOption('S+L+P', 'S+L+P'),
        // new SettingOption('S+L+C', 'S+L+C'),
        // new SettingOption('S+L+C+P', 'S+L+C+P')
    );

    const content = [
        acsrqInfo.Checkbox('botOptions'),
        '<!-- ko if: Settings.getSetting(\'botOptions\').observableValue -->',
        '<tr><td colspan="2" class="card-header">Bots</td></tr>',
        acsrqInfo.Checkbox('botstate.breeding', 'App.game.breeding.canAccess() && App.game.party.hasMaxLevelPokemon()'),
        acsrqInfo.Checkbox('botstate.dungeon', 'App.game.keyItems.hasKeyItem(KeyItemType.Dungeon_ticket)', '!player.route() && player.town()?.dungeon'),
        acsrqInfo.Checkbox('botstate.gym', true, '!player.route() && player.town()?.content?.find(c => c instanceof Gym)'),
        acsrqInfo.Checkbox('botstate.safari', 'App.game.keyItems.hasKeyItem(KeyItemType.Safari_ticket)', 'Safari.inProgress()'),
        acsrqInfo.Checkbox('botstate.bf', 'TownList[\'Battle Frontier\'].isUnlocked()', '!player.route() && player.town().name === \'Battle Frontier\''),
        acsrqInfo.Checkbox('botstate.sr','TownList[\'Route 3 Pokémon Center\'].isUnlocked()'),
        acsrqInfo.Select('botstate.plant'),
        acsrqInfo.Select('botstate.mutate'),
        '<!-- /ko -->',
        '<tr><td colspan="2" class="card-header">Info</td></tr>',
        `<tr>
            <td><input type="text" size=6 id="phaseCount" style="text-align: center"></td>
            <td><a href="#phaseModal" data-toggle="modal">Phase</a></td>
        </tr>`,
        acsrqInfo.Info('lastEncounterPoke', 'Last Shiny'),
        acsrqInfo.Info('areaClears', 'Clears'),
        acsrqInfo.Info('lastEncounter', 'Since Last Shiny'),
        '<tr><td data-bind="text: acsrqInfo.boostedRoute"></td><td>Boosted Route</td></tr>',
        '<tr><td data-bind="text: acsrqInfo.regionShiny"></td><td>Region Shinies</td></tr>',
        '<tr><td data-bind="text: acsrqInfo.uniqueRegion"></td><td>Region Uniques</td></tr>',
        '<tr><td data-bind="text: acsrqInfo.uniqueEvent"></td><td>Event Uniques</td></tr>',
    ];
    $('#acsrqBody tbody')[0].insertAdjacentHTML('beforeend', content.join(''));
};

acsrqInfo.boostedRoute = ko.pureComputed(() => {
    return RoamingPokemonList.increasedChanceRoute[player.region]?.[player.subregion]?.().routeName
        || RoamingPokemonList.increasedChanceRoute[player.region][0]().routeName;
});

acsrqInfo.regionShiny = ko.pureComputed(() => {
    const regionPoke = App.game.party.caughtPokemon.filter(p => p.id > 0 && PokemonHelper.calcNativeRegion(p.name) === player.region)
    const shinyPoke = regionPoke.filter(p => p.shiny);
    return `${shinyPoke.length} / ${regionPoke.length}`;
});
acsrqInfo.uniqueRegion = ko.pureComputed(() => {
    const achievement = AchievementHandler.findByName(`${GameConstants.camelCaseToString(GameConstants.Region[player.region])} Master`);

    return `${achievement.getProgressText()}`;
});
acsrqInfo.uniqueEvent = ko.pureComputed(() => {
    const eventPoke = [
        //Lunar New Year
        'Vivillon (Fancy)',
        //Easter
        'Surprise Togepi',
        //Golden Week
        'Bulbasaur (Rose)',
        //Flying Pikachu
        'Flying Pikachu',
        'Red Spearow',
        //Armored Mewtwo
        'Armored Mewtwo',
        'Bulbasaur (clone)',
        'Ivysaur (clone)',
        'Venusaur (clone)',
        'Charmander (clone)',
        'Charmeleon (clone)',
        'Charizard (clone)',
        'Squirtle (clone)',
        'Wartortle (clone)',
        'Blastoise (clone)',
        //Halloween
        'Spooky Togepi',
        'Spooky Bulbasaur',
        'Pikachu (Gengar)',
        //Let's GO!
        'Let\'s Go Pikachu',
        'Let\'s Go Eevee',
        //Christmas
        'Santa Snorlax',
        'Elf Munchlax',
        'Grinch Celebi',
        //Discord
        'Unown (D)',
        'Unown (I)',
        'Unown (S)',
        'Unown (C)',
        'Unown (O)',
        'Unown (R)',
        'Surfing Pikachu',
        'Rotom (discord)',
    ];
    const eventCaught = eventPoke.filter(p => App.game.party.alreadyCaughtPokemonByName(p));
    return `${eventCaught.length} / ${eventPoke.length}`;
});

acsrqInfo.Info = (id, label) => `
    <tr id="${id}">
        <td></td>
        <td>${label}</td>
    </tr>
`;

acsrqInfo.Checkbox = (bot, visible = true, enable = true) => `
    <tr data-bind="visible: ${visible}, template: {data: Settings.getSetting('${bot}')}">
        <td class="p-2">
            <input class="clickable" type="checkbox"
                data-bind="checked: $data.observableValue(), attr: {name, id: 'checkbox-' + $data.name}, enable: ${enable}"
                onchange="Settings.setSettingByName(this.name, this.checked)"/>
        </td>
        <td class="p-2">
            <label class="m-0" data-bind="attr: { for: 'checkbox-' + $data.name }, text: $data.displayName">
                setting name
            </label>
        </td>
    </tr>
`;

acsrqInfo.Select = (bot) => `
    <tr data-bind="visible: App.game.farming.canAccess(), template: {data: Settings.getSetting('${bot}')}">
        <td>
            <select onchange="Settings.setSettingByName(this.name, this.value)" data-bind="foreach: $data.options, attr: {name, id: 'select-' + $data.name}">
                <option data-bind="text: $data.text, value: $data.value, attr:{ selected: $parent.observableValue() == $data.value}"></option>
            </select>
        </td>
        <td data-bind="text: $data.displayName">setting name</td>
    </tr>
`;
//#endregion
//#region Setting Modal
acsrqSettings = function () {
    const acsrq = [
        acsrqSettings.Section(
            null, [
                acsrqSettings.Template('BooleanSettingTemplate', 'botOptions'),
                acsrqSettings.Template('BooleanSettingTemplate', 'disableSave'),
                acsrqSettings.Template('BooleanSettingTemplate', 'disEvent'),
            ]),
        acsrqSettings.Section(
            'UI', [
                acsrqSettings.Template('BooleanSettingTemplate', 'hideNoti'),
                acsrqSettings.Template('BooleanSettingTemplate', 'showLoot'),
                acsrqSettings.Template('BooleanSettingTemplate', 'showShiny'),
                acsrqSettings.Template('BooleanSettingTemplate', 'noWander'),
            ]),
        acsrqSettings.Section(
            'Phases', [
                acsrqSettings.Template('BooleanSettingTemplate', 'trackPhases'),
                acsrqSettings.Number('phaseCount'),
            ]),
    ];
    $('#settingsModal .nav-tabs')[0].insertAdjacentHTML('beforeend', '<li class="nav-item"><a class="nav-link" href="#settings-acsrq" data-toggle="tab">ACSRQ</a></li>');
    $('#settingsModal .tab-content')[0].insertAdjacentHTML('beforeend', `<div class="tab-pane" id="settings-acsrq">${acsrq.join('')}</div>`);

    const acsrqScripting = [
        acsrqSettings.Section(
            'Dungeons', [
                acsrqSettings.Template('BooleanSettingTemplate', 'botRush'),
                acsrqSettings.Template('BooleanSettingTemplate', 'chestCollect'),
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'dungeOpts'),
                acsrqSettings.Number('maxChests', 'Settings.getSetting(\'chestCollect\').observableValue'),
                acsrqSettings.Number('maxClears', 'Settings.getSetting(\'dungeOpts\').observableValue() === \'dungOptC\''),
                acsrqSettings.Number('minDT', 'Settings.getSetting(\'dungeOpts\').observableValue() === \'dungOptDT\''),
            ], false),
        acsrqSettings.Section(
            'Gym', [
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'gymOpts'),
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'gymE4Opts'),
                acsrqSettings.Number('maxClears', 'Settings.getSetting(\'gymOpts\').observableValue() === \'gymOptC\''),
            ], false),
        acsrqSettings.Section(
            'BattleFrontier', [
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'bfOpts'),
                acsrqSettings.Number('maxTime', 'Settings.getSetting(\'bfOpts\').observableValue() === \'bfOptT\''),
                acsrqSettings.Number('maxLvl', 'Settings.getSetting(\'bfOpts\').observableValue() === \'bfOptL\''),
            ], false),
        acsrqSettings.Section(
            'SoftReset', [
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'srOpts'),
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'fossilOpts', 'Settings.getSetting(\'srOpts\').observableValue() === \'fos\''),
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'evoOpts', 'Settings.getSetting(\'srOpts\').observableValue() === \'evo\''),
                acsrqSettings.Number('evoItemCount', 'Settings.getSetting(\'srOpts\').observableValue() === \'evo\''),
            ], false),
        acsrqSettings.Section(
            'Breeding', [
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'breedingOpts'),
                acsrqSettings.Number('minBreedAttack', 'Settings.getSetting(\'breedingOpts\').observableValue() === \'attack\''),
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'typedEggOpts', 'Settings.getSetting(\'breedingOpts\').observableValue() === \'typed\''),
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'fossilOpts', 'Settings.getSetting(\'breedingOpts\').observableValue() === \'fossil\''),
            ], false),
        acsrqSettings.Section(
            'Pokeball', [
                acsrqSettings.Template('MultipleChoiceSettingTemplate', 'ballBuyOpts'),
                acsrqSettings.Number('minBallAmount', 'Settings.getSetting(\'ballBuyOpts\').observableValue() !== \'none\''),
                acsrqSettings.Number('ballPurAmount', 'Settings.getSetting(\'ballBuyOpts\').observableValue() !== \'none\''),
            ], false),
        acsrqSettings.Section('Safari', [acsrqSettings.Template('MultipleChoiceSettingTemplate', 'safariOpts')], false),
    ];
    $('#settingsModal .nav-tabs')[0].insertAdjacentHTML('beforeend', '<li class="nav-item" data-bind="visible: Settings.getSetting(\'botOptions\').observableValue"><a class="nav-link" href="#settings-acsrq-script" data-toggle="tab">ACSRQ Scripting</a></li>');
    $('#settingsModal .tab-content')[0].insertAdjacentHTML('beforeend', `<div class="tab-pane" id="settings-acsrq-script">${acsrqScripting.join('')}</div>`);
};

acsrqSettings.Template = (template, setting, visible = true) => `<tr data-bind="template: { name: '${template}', data: Settings.getSetting('${setting}')}, visible: ${visible}"></tr>`;

acsrqSettings.Number = (setting, visible = true) => `
    <tr data-bind="template: { data: Settings.getSetting('${setting}') }, visible: ${visible}">
        <td class="p-2" data-bind="text: $data.displayName + ':'">setting name</td>
        <td class="p-0">
            <input class="form-control" type="number" min=0 step=1
                data-bind="value: $data.observableValue(), attr: {name}"
                onchange="Settings.setSettingByName(this.name, this.value)"/>
        </td>
    </tr>
`;

acsrqSettings.Section = (title, content, showByDefault = true) => {
    const table = `<table class="table table-striped table-hover m-0 mb-1" style="table-layout: fixed"><tbody>${content.join('')}</tbody></table>`;
    return !title ? table : `
        <span class="btn btn-block btn-dark clickable" data-toggle="collapse" href="#settingsAcsrq${title}" >${title}</span>
        <div class="collapse ${showByDefault ? 'show' : ''}" id="settingsAcsrq${title}">${table}</div>`;
};
//#endregion
//#region Footer
acsrqFooter = function () {
    $('#battleContainer .card-footer')[0].insertAdjacentHTML('beforebegin', `
        <div class="card-footer p-0" data-bind="visible: acsrqFooter.showLoot && acsrqFooter.showShiny">
            <table width="100%" class="table table-sm m-0">
                <colgroup>
                    <col width="40%">
                </colgroup>
                <tbody>
                    <tr data-bind="visible: acsrqFooter.showLoot">
                        <td>Possible Loot</td>
                        <td data-bind="text: acsrqFooter.missingLoot"></td>
                    </tr>
                    <tr data-bind="visible: acsrqFooter.showShiny">
                        <td>Needed Shiny</td>
                        <td data-bind="html: acsrqFooter.missingShinies"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `);
};

acsrqFooter.showLoot = ko.pureComputed(() => Settings.getSetting('showLoot').observableValue() && !player?.route() && player?.town()?.dungeon);
acsrqFooter.showShiny = ko.pureComputed(() => Settings.getSetting('showShiny').observableValue() && (
    player?.route() || //is route
    player?.town()?.dungeon || //is dungeon
    player.town().content.some(content => content instanceof Shop && content.items.some(item => item instanceof PokemonItem)) //does town have shop
));

acsrqFooter.missingLoot = ko.pureComputed(() => {
    const dungeon = player.town().dungeon;
    let loots = [];

    for (let key in dungeon?.lootTable) {
        loots.push(...dungeon.lootTable[key].map(({loot}) => GameConstants.humanifyString(loot)));
    }

    return [...new Set(loots)].join(', ');
});

acsrqFooter.missingShinies = ko.pureComputed(() => {
    const town = player.town();
    const route = player.route();
    const shops = town.content.filter(c => c instanceof Shop && c.items.some(i => i instanceof PokemonItem));
    let missing = [];

    if (route) { //Route poke
        const poke = RouteHelper.getAvailablePokemonList(route, player.region);
        missing.push(
            ...poke.filter(p => !App.game.party.alreadyCaughtPokemonByName(p, true)).sort()
        );
    } else if (shops.length) { //Shop poke
        missing.push(
            ...shops.map(({items}) => items
                .filter(i => i instanceof PokemonItem && !App.game.party.alreadyCaughtPokemonByName(i.name, true))
                .map(({name}) => name)
            ).flat()
        );
    } else if (town.dungeon) { //Dungeon poke
        const poke = town.dungeon.allAvailablePokemon();
        missing.push(
            ...poke.filter(p => !App.game.party.alreadyCaughtPokemonByName(p, true))
        );

        for (let key in town.dungeon.lootTable) {
            for (let {loot} of town.dungeon.lootTable[key]) {
                if (PokemonHelper.getPokemonByName(loot).id && !App.game.party.alreadyCaughtPokemonByName(loot, true)) {
                    missing.push(`<span style="line-height: normal; color:#D4AC0D;">${loot}</span>`);
                }
            }
        }

        missing.sort((a, b) => {
            if (a.startsWith('<')) {
                a = a.replace(/<[^\>]*>/g, '');
            }
            if (b.startsWith('<')) {
                b = b.replace(/<[^\>]*>/g, '');
            }
            return a.localeCompare(b);
        });
    }

    return missing.length
        ? [...new Set(missing)].join(', ')
        : 'N/A';
});

//#endregion
//#region Phase
phaseModal = function() {
    $('#logBookModal')[0].insertAdjacentHTML('afterend', `
        <!-- Phase Tracker Modal -->
        <div class="modal noselect fade show" id="phaseModal" tabindex="-1" role="dialog" aria-labelledby="phaseModalLabel">
            <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header" style='justify-content: space-between; align-items: center'>
                        <h5 class="modal-title">Phase Tracker</h5>
                        <div>
                            <button class="btn btn-secondary" type="button" onclick="removeAllPhases()">Remove All</button>
                            <button class="btn btn-secondary" type="button">Export</button>
                        </div>
                    </div>
                    
                    <div class="modal-body p-0">
                        <table class="table table-striped table-hover m-0" id="phaseTable">
                            <thead>
                                <tr>
                                    <td>Phase Count</td>
                                    <td>Location</td>
                                    <td>Encounter Type</td>
                                    <td>Pokemon Name</td>
                                    <td>Capture Status</td>
                                    <td>Clear Count</td>
                                    <td>Remove Phase?</td>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    $('#phaseModal .modal-header button')[1].addEventListener('click', (event) => {
        if (!event.detail || event.detail == 1) {
            if (hasExported == 0) {
                setTimeout(() => {
                    a6export();
                }, 2000);
                hasExported = 1;
            }
            return true;
        } else {
            return false;
        }
    });
};
//#endregion
