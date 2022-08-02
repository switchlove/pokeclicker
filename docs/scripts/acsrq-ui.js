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

    let berries = Object.values(BerryType).filter(t => !Number.isInteger(t));
    berries.pop(); // remove None entry
    berries.pop(); // remove Enigma entry

    let content = [
        '<!-- ko if: Settings.getSetting(\'botOptions\').observableValue -->',
        '<tr><td colspan="2" class="card-header">Bots</td></tr>',
        acsrqInfo.Checkbox('breeding', 'Breeding Bot', 'App.game.breeding.canAccess() && App.game.party.hasMaxLevelPokemon()'),
        acsrqInfo.Checkbox('dungeon', 'Dungeon Bot', 'App.game.keyItems.hasKeyItem(KeyItemType.Dungeon_ticket)', '!player.route() && player.town()?.dungeon'),
        acsrqInfo.Checkbox('gym', 'Gym Bot', 'true', '!player.route() && player.town()?.content?.find(c => c instanceof Gym)'),
        acsrqInfo.Checkbox('safari', 'Safari Bot', 'App.game.keyItems.hasKeyItem(KeyItemType.Safari_ticket)', 'Safari.inProgress()'),
        acsrqInfo.Checkbox('bf', 'BF Bot', 'TownList[\'Battle Frontier\'].isUnlocked()', '!player.route() && player.town().name === \'Battle Frontier\''),
        acsrqInfo.Checkbox('sr', 'SR Bot', 'TownList[\'Route 3 Pokémon Center\'].isUnlocked()'),
        acsrqInfo.Select('plant', 'Planter Bot', ...berries, 'S+C', 'S+C+P', 'S+L', 'Perp. P'), //, 'S+L+P', 'S+L+C', 'S+L+C+P'),
        acsrqInfo.Select('mutate', 'Mutate Bot', ...berries.slice(8)),
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

acsrqInfo.Checkbox = (bot, label, visible = 'true', enable = 'true') => `
    <tr id="${bot}Bot" data-bind="visible: ${visible}">
        <td><input type="checkbox" id="${bot}Check" value=0 data-bind="enable: ${enable}"></td>
        <td>${label}</td>
    </tr>
`;

acsrqInfo.Select = (bot, label, ...options) => `
    <tr id="${bot}" data-bind="visible: App.game.farming.canAccess()">
        <td>
            <select id="${bot}Select">
                <option value="N/A" default>N/A</option>
                ${options.map(opt => `<option value="${opt}">${opt}</value>`).join('')}
            </select>
        </td>
        <td>${label}</td>
    </tr>
`;
//#endregion
