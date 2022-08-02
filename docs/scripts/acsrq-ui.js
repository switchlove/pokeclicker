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