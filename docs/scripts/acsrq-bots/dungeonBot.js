window.addEventListener('load', () => {
    setTimeout(() => dungeonBot.interval = setInterval(dungeonBot, 100), 100);

    // Reset boss position
    const initializeDungeon = DungeonRunner.initializeDungeon;
    DungeonRunner.initializeDungeon = function (dungeon) {
        initializeDungeon.call(this, dungeon);
        dungeonBot.boss = undefined;
    };
});

function dungeonBot() {
    if (!clickEngagedD) {
        return;
    }

    if (player.town instanceof DungeonTown && dungeonBot.stopConditionMet()) {
        clickEngagedD = false;
        Settings.setSettingByName('botstate.dungeon', false);
        notifyBotComplete('Dungeon');
        return;
    }

    if (!dungeonBot.isRunning()) {
        return;
    }

    //Start dungeon if needed - by clicking on the button
    if (App.game.gameState == GameConstants.GameState.town) {
        $('#townView button.btn-success')?.click();
        dungeonBot.boss = undefined;
        return;
    }

    if (!DungeonRunner.map) {
        return;
    }

    //Skip if in combat, catching or if the dungeon is not started yet
    if (DungeonRunner.dungeonFinished() || DungeonRunner.fighting() || DungeonBattle.catching()) {
        return;
    }

    const playerPos = DungeonRunner.map.playerPosition();
    const max = DungeonRunner.map.floorSizes[playerPos.floor] - 1;

    //Tiles interaction
    switch (DungeonRunner.currentTileType()()) {
        case GameConstants.DungeonTileType.chest:
            if (Settings.getSetting('chestCollect').value
                && DungeonRunner.chestsOpened() < dungeonBot.chestLimit()
                && Settings.getSetting('chestQualityTiers').value.includes(DungeonRunner.map.currentTile().metadata.tier)) {
                return DungeonRunner.handleInteraction();
            }
            break;
        case GameConstants.DungeonTileType.boss:
        case GameConstants.DungeonTileType.ladder:
            dungeonBot.boss = playerPos;
            if (Settings.getSetting('botRush').value) {
                return DungeonRunner.handleInteraction();
            }
            break;
    }

    //Chest rush - prioritize moving to known, eligible, accessible chests
    if (Settings.getSetting('chestRush').value
        && Settings.getSetting('chestCollect').value
        && DungeonRunner.chestsOpened() < dungeonBot.chestLimit()) {
        const target = dungeonBot.findAccessibleChest(playerPos.floor);
        if (target) {
            return DungeonRunner.map.moveToTile(target);
        }
    }

    //handle flash for boss rush
    if (DungeonRunner.map.flash && Settings.getSetting('botRush').value) {
        if (playerPos.y > 0 &&
            (DungeonRunner.map.board()[playerPos.floor][playerPos.y - 1][playerPos.x].type() == GameConstants.DungeonTileType.boss
                || DungeonRunner.map.board()[playerPos.floor][playerPos.y - 1][playerPos.x].type() == GameConstants.DungeonTileType.ladder)) {
            return DungeonRunner.map.moveUp();
        }
        if (playerPos.x > 0 &&
            (DungeonRunner.map.board()[playerPos.floor][playerPos.y][playerPos.x - 1].type() == GameConstants.DungeonTileType.boss
                || DungeonRunner.map.board()[playerPos.floor][playerPos.y][playerPos.x - 1].type() == GameConstants.DungeonTileType.ladder)) {
            return DungeonRunner.map.moveLeft();
        }
        if (playerPos.x < max &&
            (DungeonRunner.map.board()[playerPos.floor][playerPos.y][playerPos.x + 1].type() == GameConstants.DungeonTileType.boss
                || DungeonRunner.map.board()[playerPos.floor][playerPos.y][playerPos.x + 1].type() == GameConstants.DungeonTileType.ladder)) {
            return DungeonRunner.map.moveRight();
        }
    }

    //Go to boss tile once everything is finished (or boss rush was enabled after the boss tile was found, or chest rush has collected its share of chests)
    const chestRushDone = Settings.getSetting('chestRush').value
        && (!Settings.getSetting('chestCollect').value || DungeonRunner.chestsOpened() >= dungeonBot.chestLimit());
    if (dungeonBot.boss?.floor == playerPos.floor && (Settings.getSetting('botRush').value || chestRushDone || DungeonRunner.map.isFloorComplete())) {
        if (DungeonRunner.map.hasAccessToTile(dungeonBot.boss)) {
            DungeonRunner.map.moveToTile(dungeonBot.boss);
            return DungeonRunner.handleInteraction();
        }

        for (let y = dungeonBot.boss.y; y <= max; y++) {
            let pos = { x: dungeonBot.boss.x, y, floor: playerPos.floor };
            if (DungeonRunner.map.hasAccessToTile(pos)) {
                return DungeonRunner.map.moveToTile(pos);
            }
        }
    }

    //Movement algorythme - move to any accessible, unvisited tile
    if (!DungeonRunner.map.isFloorComplete()) {
        const target = dungeonBot.findAccessibleTile(playerPos.floor);
        if (target) {
            return DungeonRunner.map.moveToTile(target);
        }
    }
}

DungeonMap.prototype.isFloorComplete = function () {
    return this.board()[this.playerPosition().floor].every(row => row.every(tile => tile.isVisited));
};

//Number of chests the bot should open, based on the chest limit type (count or percent of floor total)
dungeonBot.chestLimit = function () {
    if (Settings.getSetting('chestLimitOpts').value === 'chestLimitPercent') {
        return Math.ceil(DungeonRunner.map.totalChests() * Settings.getSetting('maxChestsPercent').value / 100);
    }
    return Settings.getSetting('maxChests').value;
};

//Find the first unopened, quality-eligible, accessible chest on the given floor
dungeonBot.findAccessibleChest = function (floor) {
    const tiers = Settings.getSetting('chestQualityTiers').value;
    const board = DungeonRunner.map.board()[floor];
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const tile = board[y][x];
            if (tile.type() == GameConstants.DungeonTileType.chest
                && tiers.includes(tile.metadata.tier)
                && DungeonRunner.map.hasAccessToTile({ x, y, floor })) {
                return { x, y, floor };
            }
        }
    }
    return undefined;
};

//Find the first unvisited, accessible tile on the given floor
dungeonBot.findAccessibleTile = function (floor) {
    const board = DungeonRunner.map.board()[floor];
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const tile = board[y][x];
            if (!tile.isVisited && DungeonRunner.map.hasAccessToTile({ x, y, floor })) {
                return { x, y, floor };
            }
        }
    }
    return undefined;
};

//Whether the configured dungeOpts stop-condition has actually been met (as opposed to
//isRunning's transient "not in a dungeon town" / "not yet in this dungeon" false cases)
dungeonBot.stopConditionMet = () => {
    switch (Settings.getSetting('dungeOpts').observableValue()) {
        case 'dungOptSC':
            return DungeonRunner.dungeonCompleted(player.town.dungeon, true);
        case 'dungOptC':
            return App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town.name)]() >= Settings.getSetting('maxClears').observableValue();
        case 'dungOptDT':
            return App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() < Settings.getSetting('minDT').observableValue();
        case 'dungOptPR':
            return RouteHelper.minPokerus(player.town.dungeon.allAvailablePokemon()) >= GameConstants.Pokerus.Resistant;
        case 'dungOptRSC':
            return App.game.party.caughtPokemon.filter(p => p.shiny && pokemonMap[p.name]?.nativeRegion === player.region).length >= Settings.getSetting('maxRegionShinies').observableValue();
        default:
            return false;
    }
};

//Check for dungeon options
dungeonBot.isRunning = ko.pureComputed(() => {
    if (!(player.town instanceof DungeonTown)) {
        return false;
    }
    if (App.game.gameState == GameConstants.GameState.dungeon) {
        return true;
    }

    switch (Settings.getSetting('dungeOpts').observableValue()) {
        case 'dungOptSC':
            return !DungeonRunner.dungeonCompleted(player.town.dungeon, true);
        case 'dungOptC':
            return App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town.dungeon.name)]() < Settings.getSetting('maxClears').observableValue();
        case 'dungOptDT':
            return App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() >= Settings.getSetting('minDT').observableValue();
        case 'dungOptPR':
            return RouteHelper.minPokerus(player.town.dungeon.allAvailablePokemon()) < GameConstants.Pokerus.Resistant;
        case 'dungOptRSC':
            return App.game.party.caughtPokemon.filter(p => p.shiny && pokemonMap[p.name]?.nativeRegion === player.region).length < Settings.getSetting('maxRegionShinies').observableValue();
        default:
            return true;
    }
});

const showAllTiles = DungeonMap.prototype.showAllTiles;
DungeonMap.prototype.showAllTiles = function () {
    showAllTiles.call(this);
    const floor = this.playerPosition().floor;

    for (let y = 0; y < this.board()[floor].length; y++) {
        for (let x = 0; x < this.board()[floor][y].length; x++) {
            if (this.board()[floor][y][x].type() == GameConstants.DungeonTileType.boss
                || this.board()[floor][y][x].type() == GameConstants.DungeonTileType.ladder) {
                dungeonBot.boss = { x, y, floor };
            }
        }
    }
};
