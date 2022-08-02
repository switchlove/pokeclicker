window.addEventListener('load', () => {
    acsrqInfo();

    setTimeout(() => {
        Settings.getSetting('menuPlace').observableValue.subscribe((value) => {
            document.getElementById('acsrqBody').appendAfter(document.getElementById(value));
            document.querySelectorAll('#acsrqBody input[type=checkbox]').forEach(i => i.checked = false);
            document.querySelectorAll('#acsrqBody select').forEach(i => i.value = 'N/A');
        });

        //#region Event
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

        const eventStart = SpecialEvent.prototype.start;
        SpecialEvent.prototype.start = function() {
            eventStart.call(this);
            if (Settings.getSetting('disEvent').value) {
                this.endFunction();
                this.status = 2;
            }
        };
        //#endregion
    }, 1100);
});

//#region Settings
//ACSRQ
Settings.add(new Setting('menuPlace', 'Place ACSRQ window after this', [
    new SettingOption('Achievement Tracker', 'achivementTrackerContainer'),
    new SettingOption('Battle Items', 'battleItemContainer'),
    new SettingOption('Hatchery', 'breedingDisplay'),
    new SettingOption('Oak Items', 'oakItemsContainer'),
    new SettingOption('Pokémon List', 'pokemonListContainer'),
    new SettingOption('Quests', 'questDisplayContainer'),
    new SettingOption('Town Map', 'townMap'),
    new SettingOption('Pokéballs', 'pokeballSelector'),
], 'pokeballSelector')); //Obsolete
Settings.add(new BooleanSetting('hideNoti', 'Hide all notifications', false));
Settings.add(new BooleanSetting('hideBItem', 'Hide Battle Item window', false)); //Obsolete
Settings.add(new BooleanSetting('hideOak', 'Hide Oak Item window', false)); //Obsolete
Settings.add(new BooleanSetting('disableSave', 'Prevent AutoSave', false));
Settings.add(new BooleanSetting('disEvent', 'Disable special events', false));
Settings.add(new BooleanSetting('noWander', 'Hide normal Wander log entries', false));
Settings.add(new BooleanSetting('showShiny', 'Show needed shinies', false));
Settings.add(new BooleanSetting('showLoot', 'Show possible dungeon loot', false));
Settings.add(new BooleanSetting('trackPhases', 'Track shiny phases and display below', false));
Settings.add(new Setting('phaseCount', 'phaseCount', [], '100'));
//ACSRQ - Scripted
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
    new SettingOption('First', '1'),
    new SettingOption('Second', '2'),
    new SettingOption('Third', '3'),
    new SettingOption('Fourth', '4'),
    new SettingOption('Fifth', '5'),
], '1'));
Settings.add(new Setting('bfOpts', 'Battle Frontier stop options', [
    new SettingOption('None', 'bfOptN'),
    new SettingOption('Time', 'bfOptT'),
    new SettingOption('Level', 'bfOptL'),
], 'bfOptN'));
Settings.add(new Setting('maxChests', 'maxChests', [], '1'));
Settings.add(new Setting('maxClears', 'maxClears', [], '1000'));
Settings.add(new Setting('minDT', 'minDT', [], '10000'));
Settings.add(new Setting('maxLvl', 'maxLvl', [], '100'));
Settings.add(new Setting('maxTime', 'maxTime', [], '30'));
Settings.add(new Setting('srOpts', 'Soft Reset Type:', [
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
Settings.add(new Setting('minBreedAttack', 'minBreedAttack', [], '1000'));
Settings.add(new Setting('typedEggOpts', 'Typed egg to use:', [
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
Settings.add(new Setting('evoItemCount', 'evoItemCount', [], '1'));
Settings.add(new Setting('ballBuyOpts', 'Auto-purchase pokeballs?', [
    new SettingOption('None', 'none'),
    new SettingOption('Pokéball', 'pokeB'),
    new SettingOption('Greatball', 'greatB'),
    new SettingOption('Ultraball', 'ultraB'),
], 'none'));
Settings.add(new Setting('minBallAmount', 'minBallAmount', [], '0'));
Settings.add(new Setting('ballPurAmount', 'ballPurAmount', [], '1000'));
Settings.add(new Setting('safariOpts', 'Safari bot stop options', [
    new SettingOption('None', 'safariOptN'),
    new SettingOption('Shiny Check', 'safariOptSC'),
], 'safariOptSC'));
//Bot state
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

    let content = [
        '<!-- ko if: Settings.getSetting(\'botOptions\').observableValue -->',
        '<tr><td colspan="2" class="card-header">Bots</td></tr>',
        acsrqInfo.Checkbox('breeding', 'App.game.breeding.canAccess() && App.game.party.hasMaxLevelPokemon()'),
        acsrqInfo.Checkbox('dungeon', 'App.game.keyItems.hasKeyItem(KeyItemType.Dungeon_ticket)', '!player.route() && player.town()?.dungeon'),
        acsrqInfo.Checkbox('gym', 'true', '!player.route() && player.town()?.content?.find(c => c instanceof Gym)'),
        acsrqInfo.Checkbox('safari', 'App.game.keyItems.hasKeyItem(KeyItemType.Safari_ticket)', 'Safari.inProgress()'),
        acsrqInfo.Checkbox('bf', 'TownList[\'Battle Frontier\'].isUnlocked()', '!player.route() && player.town().name === \'Battle Frontier\''),
        acsrqInfo.Checkbox('sr','TownList[\'Route 3 Pokémon Center\'].isUnlocked()'),
        acsrqInfo.Select('plant'),
        acsrqInfo.Select('mutate'),
        '<!-- /ko -->',
        '<tr><td colspan="2" class="card-header">Info</td></tr>',
        `<tr id="areaPhase">
            <td><input type="text" size=6 id="phaseCount" style="text-align: center"></td>
            <td><a href="#">Phase</a></td>
        </tr>`,
        acsrqInfo.Info('lastEncounterPoke', 'Last Shiny'),
        acsrqInfo.Info('areaClears', 'Clears'),
        acsrqInfo.Info('lastEncounter', 'Since Last Shiny'),
        acsrqInfo.Info('boostedRoute', 'Boosted Route'),
        acsrqInfo.Info('uniquePokeShiny', 'Region Shinies'),
        acsrqInfo.Info('uniquePoke', 'Region Uniques'),
        acsrqInfo.Info('uniquePokeEvent', 'Event Uniques'),
    ];
    $('#acsrqBody tbody')[0].insertAdjacentHTML('beforeend', content.join(''));
};

acsrqInfo.Info = (id, label) => `
    <tr id="${id}">
        <td></td>
        <td>${label}</td>
    </tr>
`;

acsrqInfo.Checkbox = (bot, visible = 'true', enable = 'true') => `
    <tr id='${bot}Bot' data-bind="visible: ${visible}, template: {data: Settings.getSetting('botstate.${bot}')}">
        <td class="p-2">
            <input class="clickable" type="checkbox"
                data-bind="checked: $data.observableValue(), attr: {name, id: '${bot}Check'}, enable: ${enable}"
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
    <tr id="${bot}Bot" data-bind="visible: App.game.farming.canAccess(), template: {data: Settings.getSetting('botstate.${bot}')}">
        <td>
            <select id="${bot}Select" onchange="Settings.setSettingByName(this.name, this.value)" data-bind="foreach: $data.options, attr: {name}">
                <option data-bind="text: $data.text, value: $data.value, attr:{ selected: $parent.observableValue() == $data.value}"></option>
            </select>
        </td>
        <td data-bind="text: $data.displayName">setting name</td>
    </tr>
`;
//#endregion
