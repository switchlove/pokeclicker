window.addEventListener('load', () => {
    setTimeout(() => boostedRouteBot.interval = setInterval(boostedRouteBot, 1000), 1000);
});

function boostedRouteBot() {
    if (!clickEngagedBRoute) {
        return;
    }

    if (App.game.gameState != GameConstants.GameState.fighting && App.game.gameState != GameConstants.GameState.town) {
        return;
    }

    const region = player.region;
    const subRegionGroup = RoamingPokemonList.findGroup(region, player.subregion);
    const boostedRoute = RoamingPokemonList.getIncreasedChanceRouteBySubRegionGroup(region, subRegionGroup)?.();

    if (!boostedRoute || boostedRoute.number === player.route) {
        return;
    }

    if (MapHelper.accessToRoute(boostedRoute.number, region)) {
        MapHelper.moveToRoute(boostedRoute.number, region);
    }
}
