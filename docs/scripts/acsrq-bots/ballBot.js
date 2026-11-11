window.addEventListener('load', () => {
    setTimeout(() => ballBot.interval = setInterval(ballBot, 1000), 1000);
});

async function ballBot() {
    const ballBuyOpts = Settings.getSetting('ballBuyOpts');
    if (!ballBuyOpts) {
        return;
    }

    if ($('#shopModal')[0].classList.contains('show')) {
        return;
    }

    const buyOpts = ballBuyOpts.observableValue();
    const purAmount = Number(Settings.getSetting('ballPurAmount').observableValue());
    const minAmount = Number(Settings.getSetting('minBallAmount').observableValue());

    if (buyOpts == -1 || App.game.pokeballs.pokeballs[buyOpts].quantity() > minAmount) {
        return;
    }
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
        let item = shop.items.find(({ name }) => name == GameConstants.Pokeball[buyOpts]);

        if (!(item && item.isAvailable() && item.price() == item.basePrice)) {
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
