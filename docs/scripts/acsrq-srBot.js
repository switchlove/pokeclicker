/* eslint-disable no-sparse-arrays */
var srCount;
window.addEventListener('load', () => setTimeout(() => srBot.interval = setInterval(srBot, 3000), 3000));

//#region LocalSettings
const settingKey = 'acsrq-settings';
const localSettings = ko.observable(JSON.parse(localStorage.getItem(settingKey)) ?? {key: '', state: 0});
localSettings.subscribe(() => localStorage.setItem(settingKey, ko.toJSON(localSettings)));
window.addEventListener('storage', (e) => {
    if (e.key == settingKey) {
        if (JSON.parse(e.oldValue)?.state != JSON.parse(e.newValue)?.state) {
            location.reload();
        }
        localSettings(JSON.parse(e.newValue) ?? {key: '', state: 0});
    }
});
//#endregion

function srBot() {
    if (!clickEngagedSR) {
        return;
    }

    srCount = localLocal[5][2] ?? 0;
    sessionStorage.removeItem('reload');
    srBot[Settings.getSetting('srOpts').value]?.();

    localSettings({...localSettings()});
}

/** srBot option Pokemon shop */
srBot.poke = function () {
    const shops = player.town().content.filter(c => c instanceof Shop);
    if (player.route() || !shops.length) {
        return;
    }

    let smnUsed = false;
    const items = shops.map(shop => shop.items.filter(i => i instanceof PokemonItem && !App.game.party.alreadyCaughtPokemonByName(i.name, true)));
    for (let sdx = 0; sdx < shops.length && !smnUsed; sdx++) {
        ShopHandler.showShop(shops[sdx]);

        for (let idx = 0; idx < items[sdx].length && !smnUsed; idx++) {
            ShopHandler.setSelected(shops[sdx].items.indexOf(items[sdx][idx]));

            if (App.game.wallet.hasAmount(new Amount(items[sdx][idx].totalPrice(1), items[sdx][idx].currency))) {
                ShopHandler.buyItem();
                smnUsed = true;
            }
        }
    }

    localSettings().state = smnUsed;
    if (!smnUsed) {
        return;
    }

    const smnNeed = items.flat().length;
    const smnName = ShopHandler.shopObservable().items[ShopHandler.selected()].name;
    return srBot.log(smnName, `Needed - ${smnNeed}`);
};

/** srBot option Trades */
srBot.trade = function () {
    const tradeKey = [];
    const shops = player.town().content.filter(c => c instanceof BerryMasterShop);
    if (player.route() || !shops.length) {
        return;
    }

    let smnUsed = false;
    for (let sdx = 0; sdx < shops.length; sdx++) {
        for (let idx = 0; idx < BerryDeal.list[shops[sdx].location]().length; idx++) {
            tradeKey.push(BerryDeal.list[shops[sdx].location]()[idx].item.itemType.name)
        }
    }
    
    const items = shops.map( shop => BerryDeal.list[shop.location]().filter(i => i instanceof BerryDeal && !App.game.party.alreadyCaughtPokemonByName(i.item.itemType.name, true)));
    for (let sdx = 0; sdx < shops.length; sdx++) {
        ShopHandler.showShop(shops[sdx]);
    
        for (let idx = 0; idx < items[sdx].length; idx++) {
            if (BerryDeal.canUse(shops[sdx].location, idx)) {
                var smnName = items[sdx][idx].item.itemType.name;
                BerryDeal.use(shops[sdx].location, tradeKey.indexOf(items[sdx][idx].item.itemType.name), Number(Settings.getSetting('tradeItemCount').value));
                smnUsed = true;
                break;
            }
        }
    }
    
    localSettings().state = smnUsed;
    if (!smnUsed) {
        return;
    }

    const smnNeed = items.flat().length;
    return srBot.log(smnName, `Needed - ${smnNeed}`);
};

/** srBot option evolution stones */
srBot.evo = function () {
    const option = new RegExp(Settings.getSetting('evoOpts').value);
    const evoItems = Object.values(GameConstants.StoneType).filter((v) => option.test(v) && !Number.isInteger(v) && player.itemList[v]?.());
    const evoIds = evoItems.map(i => GameConstants.StoneType[i]);
    const needed = evoIds.flatMap(
        i => PokemonHelper.getPokemonsWithEvolution(i).flatMap(
            p => p.evolutions.filter(
                e => e.stone == i && EvolutionHandler.isSatisfied(e) && !App.game.party.alreadyCaughtPokemonByName(e.evolvedPokemon, true)
            )
        )
    );

    localSettings().state = needed.length;
    if (!needed.length) {
        return;
    }

    ItemHandler.stoneSelected(GameConstants.StoneType[needed[0].stone]);
    ItemHandler.pokemonSelected(needed[0].basePokemon);
    ItemHandler.amountSelected(Number(Settings.getSetting('evoItemCount').value));
    ItemHandler.useStones();

    return srBot.log(needed[0].evolvedPokemon, `Stone - ${GameConstants.StoneType[needed[0].stone]}`, `Needed - ${needed.length}`);
};

/** srBot option mystery eggs */
srBot.mys = function () {
    if (ItemList.Mystery_egg.getCaughtStatus() == CaughtStatus.CaughtShiny) {
        return;
    }

    if (App.game.breeding.eggList[0]().type < 0 && player.itemList.Mystery_egg() > 0) {
        ItemList.Mystery_egg.use();
        if (App.game.party.alreadyCaughtPokemonByName(App.game.breeding.eggList[0]().pokemon, true)) {
            console.log(`Already have - ${App.game.breeding.eggList[0]().pokemon} - Shiny: ${true}`);
            localSettings({ ...localSettings(), key: Save.key });
            sessionStorage.setItem('reload', true);
            return location.reload();
        }
    }

    return srBot.hatch();
};

/** srBot option fossils */
srBot.fos = function() {
    if (App.game.breeding.eggList[0]().type < 0) {
        const option = new RegExp(Settings.getSetting('fossilOpts').value);
        const fosItems = Object.keys(GameConstants.FossilToPokemon)
            .map(f => player.mineInventory().find(i => i.name == f))
            .filter((v) => v && option.test(v.name) && v.amount() && PartyController.getCaughtStatusByName(GameConstants.FossilToPokemon[v.name]) < CaughtStatus.CaughtShiny);

        if (!fosItems.length) {
            return;
        }

        const max = Settings.getSetting('maxEggs').value - 1;
        while (fosItems.length && fosItems[0].amount() && App.game.breeding.eggList[max]().type < 0) {
            Underground.sellMineItem(
                !!Settings.getSetting('fossilOpts').value
                    ? fosItems[0].id
                    : fosItems.shift().id
            );
        }
    }
    return srBot.hatch();
};

/** BreedingController overide shinyStatus for srBot option shiny breeding */
srBot.visible = eval(`(${
    BreedingController.visible.toString()
        .replace('visible', 'function')
        .replace(/BreedingFilters\.shinyStatus\.value\(\)/g, '0')
})`);
/** srBot option shiny breeding */
srBot.egg = function () {
    if (App.game.breeding.eggList[0]().type < 0) {
        const filteredEggList = [...App.game.party.caughtPokemon]
            .sort(PartyController.compareBy(Settings.getSetting('hatcherySort').value, Settings.getSetting('hatcherySortDirection').value))
            .filter(p => srBot.visible(p)());

        const max = Settings.getSetting('maxEggs').value - 1;
        while (filteredEggList.length && App.game.breeding.eggList[max]().type < 0) {
            App.game.breeding.addPokemonToHatchery(filteredEggList.shift());
        }
    }
    return srBot.hatch();
};

srBot.wasWaiting = false;
srBot.hatch = function () {
    const egg = App.game.breeding.eggList[0]();
    if (egg.type < 0) {
        return  localSettings().state = 0;
    }

    const shiny = App.game.party.alreadyCaughtPokemonByName(egg.pokemon, true);
    if (egg.steps() < egg.totalSteps) {
        srBot.wasWaiting = true;
        console.log(`Waiting for steps - ${egg.pokemon} - Shiny: ${shiny}`);
        return;
    }

    if (srBot.wasWaiting) {
        Save.store(player);
    }

    localSettings().state = 1;
    console.log(`Hatching - ${egg.pokemon} - Shiny: ${shiny}`);
    while (App.game.breeding.eggList[0]().pokemon == egg.pokemon) {
        App.game.breeding.hatchPokemonEgg(0);
    }

    localLocal[5][1] = egg.pokemon;
    return srBot.log(egg.pokemon);
};

srBot.log = function (pokeName, ...msgs) {
    const shiny = App.game.party.alreadyCaughtPokemonByName(pokeName, true);
    const log = [
        (shiny ? '[CAUGHT]' : '[FAILED]'),
        pokeName,
        `SR Count - ${srCount}`,
        ...msgs,
    ].join(' :: ');

    console.log(log);
    localSettings({
        key: Save.key,
        state: Math.max(0, localSettings().state - shiny),
    });

    if (shiny) {
        localLocal[5] = [,'', 0];
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
        Save.store(player);
    } else {
        localLocal[5][2] = ++srCount;
        localStorage.setItem(saveKey, JSON.stringify(localLocal));
        clearInterval(srBot.interval); // safe guard in case off lag.
        location.reload();
    }
};
