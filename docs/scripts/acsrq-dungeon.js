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
    if (!DungeonRunner.map || !clickEngagedD || !dungeonBot.isRunning()) {
        return;
    }

    //Start dungeon if needed - by clicking on the button
    if ( App.game.gameState == GameConstants.GameState.town) {
        $('#townView button.btn-success')?.click();
        dungeonBot.boss = undefined;
    }

    //Skip if in combat, catching or if the dungeon is not started yet
    if (DungeonRunner.dungeonFinished() || DungeonRunner.fighting() || DungeonBattle.catching()) {
        return;
    }

    const playerPos = DungeonRunner.map.playerPosition();
    const max = DungeonRunner.map.floorSizes[playerPos.floor] - 1;

    //Tiles interaction
    switch (DungeonRunner.currentTileType()()) {
        case GameConstants.DungeonTile.chest:
            if (Settings.getSetting('chestCollect').value && DungeonRunner.chestsOpened() < Settings.getSetting('maxChests').value) {
                return DungeonRunner.handleClick();
            }
            break;
        case GameConstants.DungeonTile.boss:
        case GameConstants.DungeonTile.ladder:
            dungeonBot.boss = playerPos;
            if (Settings.getSetting('botRush').value) {
                return DungeonRunner.handleClick();
            }
            break;
    }

    //handle flash for boss rush
    if (DungeonRunner.map.flash && Settings.getSetting('botRush').value) {
        if (playerPos.y > 0 &&
            (DungeonRunner.map.board()[playerPos.floor][playerPos.y - 1][playerPos.x].type() == GameConstants.DungeonTile.boss
            || DungeonRunner.map.board()[playerPos.floor][playerPos.y - 1][playerPos.x].type() == GameConstants.DungeonTile.ladder)) {
            return DungeonRunner.map.moveUp();
        }
        if (playerPos.x > 0 &&
            (DungeonRunner.map.board()[playerPos.floor][playerPos.y ][playerPos.x - 1].type() == GameConstants.DungeonTile.boss
            || DungeonRunner.map.board()[playerPos.floor][playerPos.y ][playerPos.x - 1].type() == GameConstants.DungeonTile.ladder)) {
            return DungeonRunner.map.moveLeft();
        }
        if (playerPos.x < max &&
            (DungeonRunner.map.board()[playerPos.floor][playerPos.y][playerPos.x + 1].type() == GameConstants.DungeonTile.boss
            || DungeonRunner.map.board()[playerPos.floor][playerPos.y][playerPos.x + 1].type() == GameConstants.DungeonTile.ladder)) {
            return DungeonRunner.map.moveRight();
        }
    }

    //Go to boss tile once everything is finished (or boss rush was enabled after the boss tile was found)
    if (dungeonBot.boss?.floor == playerPos.floor && (Settings.getSetting('botRush').value || DungeonRunner.map.isFloorComplete())) {
        if (DungeonRunner.map.hasAccessToTile(dungeonBot.boss)) {
            DungeonRunner.map.moveToTile(dungeonBot.boss);
            return DungeonRunner.handleClick();
        }

        for (let y = dungeonBot.boss.y; y <= max; y++) {
            let pos = {x:dungeonBot.boss.x, y, floor: playerPos.floor};
            if (DungeonRunner.map.hasAccessToTile(pos)) {
                return DungeonRunner.map.moveToTile(pos);
            }
        }
    }

    //Movement algorythme
    if (!DungeonRunner.map.isFloorComplete()) {
        if (playerPos.y == max && !DungeonRunner.map.board()[playerPos.floor][max][0].isVisited) {
            return DungeonRunner.map.moveLeft();
        }
        if (playerPos.x == max) {
            return DungeonRunner.map.moveToCoordinates(0, playerPos.y - 1);
        }
        return DungeonRunner.map.moveRight();
    }
}

DungeonMap.prototype.isFloorComplete = function() {
    return this.board()[this.playerPosition().floor].every(row => row.every(tile => tile.isVisited));
};

//Check for dungeon options
dungeonBot.isRunning = ko.pureComputed(() => {
    if (!(player.town() instanceof DungeonTown)) {
        return false;
    }
    if (App.game.gameState == GameConstants.GameState.dungeon) {
        return true;
    }

    switch (Settings.getSetting('dungeOpts').observableValue()) {
        case 'dungOptSC':
            return !DungeonRunner.dungeonCompleted(player.town().dungeon, true);
        case 'dungOptC':
            return App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().dungeon.name)]() < Settings.getSetting('maxClears').observableValue();
        case 'dungOptDT':
            return App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() >= Settings.getSetting('minDT').observableValue();
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
            if (this.board()[floor][y][x].type() == GameConstants.DungeonTile.boss
            || this.board()[floor][y][x].type() == GameConstants.DungeonTile.ladder) {
                dungeonBot.boss = {x, y, floor};
            }
        }
    }
};
