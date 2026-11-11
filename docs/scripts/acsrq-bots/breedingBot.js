function findFossilRevivalDeal(itemName) {
    var traderIDs = Object.keys(GenericDeal.list);
    for (var t = 0; t < traderIDs.length; t++) {
        var traderID = traderIDs[t];
        var deals = GenericDeal.list[traderID]?.() ?? [];
        for (var i = 0; i < deals.length; i++) {
            var matchesItem = deals[i].costs.some((cost) => cost.type == DealCostOrProfitType.Item && cost.item.name == itemName && cost.amount == 1);
            if (matchesItem) {
                return { traderID: traderID, index: i };
            }
        }
    }
    return undefined;
}

async function autoBreed() {
    if (Settings.getSetting('breedingOpts').observableValue() == 'fossil') {
        var fossilU = Settings.getSetting('fossilOpts').observableValue();
        var fossilItem = fossilU
            ? UndergroundItems.list.find((i) => i.valueType == UndergroundItemValueType.Fossil && i.name == fossilU)
            : UndergroundItems.list.find((i) => i.valueType == UndergroundItemValueType.Fossil && player.itemList[i.itemName]() >= 1);
        var fossilDeal = fossilItem && findFossilRevivalDeal(fossilItem.itemName);
        if (fossilDeal && GenericDeal.canUse(fossilDeal.traderID, fossilDeal.index)) {
            GenericDeal.use(fossilDeal.traderID, fossilDeal.index);
        } else {
            Settings.setSettingByName('breedingOpts', 'none');
            Notifier.notify({
                title: '[SCRIPT] ACSRQ',
                message: `You're out of ${fossilU || 'fossils'}!`,
                type: NotificationConstants.NotificationOption.warning,
                timeout: 5 * GameConstants.SECOND,
            });
            notifyBotComplete('Breeding');
        }
        [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
        return;
    }
    if (App.game.breeding.hasFreeEggSlot() == true) {
        if (Settings.getSetting('breedingOpts').observableValue() == 'none' || Settings.getSetting('breedingOpts').observableValue() == 'attack') {
            PartyController.hatcherySortedList = [...App.game.party.caughtPokemon];
            const region = App.game.challenges.list.regionalAttackDebuff.active() ? Settings.getSetting('breedingRegionalAttackDebuffSetting').observableValue() : -1;
            let sortededHatcheryList = PartyController.hatcherySortedList.sort(PartyController.compareBy(Settings.getSetting('hatcherySort').observableValue(), Settings.getSetting('hatcherySortDirection').observableValue(), region));
            let filteredEggList = sortededHatcheryList.filter(partyPokemon => {
                if (!partyPokemon.isHatchable()) {
                    return false;
                }
                if (Settings.getSetting('breedingOpts').observableValue() == 'attack') {
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
            } else if (Settings.getSetting('breedingOpts').observableValue() == 'attack') {
                Settings.setSettingByName('breedingOpts', 'none');
                notifyBotComplete('Breeding');
            }
        } else if (Settings.getSetting('breedingOpts').observableValue() == 'mystery') {
            if (player.itemList.Mystery_egg() >= 1) {
                ItemList.Mystery_egg.use();
            } else {
                Settings.setSettingByName('breedingOpts', 'none');
                Notifier.notify({
                    title: '[SCRIPT] ACSRQ',
                    message: 'You\'re out of eggs!',
                    type: NotificationConstants.NotificationOption.warning,
                    timeout: 5 * GameConstants.SECOND,
                });
                notifyBotComplete('Breeding');
            }
            [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
        } else if (Settings.getSetting('breedingOpts').observableValue() == 'typed') {
            var typeEggU = Settings.getSetting('typedEggOpts').observableValue();
            typeEggU = `${typeEggU.charAt(0).toUpperCase() + typeEggU.slice(1)}_egg`;
            if (player._itemList[typeEggU]() >= 1) {
                ItemList[typeEggU].use();
            } else {
                Settings.setSettingByName('breedingOpts', 'none');
                Notifier.notify({
                    title: '[SCRIPT] ACSRQ',
                    message: 'You\'re out of eggs!',
                    type: NotificationConstants.NotificationOption.warning,
                    timeout: 5 * GameConstants.SECOND,
                });
                notifyBotComplete('Breeding');
            }
            [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
        }
    } else {
        [3, 2, 1, 0].forEach((index) => App.game.breeding.hatchPokemonEgg(index));
    }
}
