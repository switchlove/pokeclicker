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
    if (!clickEngagedD || !dungeonBot.isRunning()) {
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

    const max = DungeonRunner.map.size - 1;
    const playerPos = DungeonRunner.map.playerPosition();

    //Tiles interaction
    switch (DungeonRunner.currentTileType()()) {
        case GameConstants.DungeonTile.chest:
            if (Settings.getSetting('chestCollect').value && DungeonRunner.chestsOpened() < Settings.getSetting('maxChests').value) {
                return DungeonRunner.handleClick();
            }
            break;
        case GameConstants.DungeonTile.boss:
            dungeonBot.boss = playerPos;
            if (Settings.getSetting('botRush').value) {
                return DungeonRunner.handleClick();
            }
            break;
    }

    //handle flash for boss rush
    if (DungeonRunner.map.flash) {
        if (playerPos.y > 0 && DungeonRunner.map.board()[playerPos.y - 1][playerPos.x].type() == GameConstants.DungeonTile.boss) {
            return DungeonRunner.map.moveUp();
        }
        if (playerPos.x > 0 && DungeonRunner.map.board()[playerPos.y][playerPos.x - 1].type() == GameConstants.DungeonTile.boss) {
            return DungeonRunner.map.moveLeft();
        }
        if (playerPos.x < max && DungeonRunner.map.board()[playerPos.y][playerPos.x + 1].type() == GameConstants.DungeonTile.boss) {
            return DungeonRunner.map.moveRight();
        }
    }

    //Go to boss tile once everything is finished (or boss rush was enabled after the boss tile was found)
    if (dungeonBot.boss && Settings.getSetting('botRush').value
        || DungeonRunner.map.board().every(row => row.every(tile => tile.isVisited))) {
        DungeonRunner.map.moveToTile(dungeonBot.boss);
        return DungeonRunner.handleClick();
    }

    //Movement algorythme
    if (!DungeonRunner.map.board().every(row => row.every(tile => tile.isVisited))) {
        if (playerPos.y == max && !DungeonRunner.map.board()[max][0].isVisited) {
            return DungeonRunner.map.moveLeft();
        }
        if (playerPos.x == max) {
            return DungeonRunner.map.moveToCoordinates(0, playerPos.y - 1);
        }
        return DungeonRunner.map.moveRight();
    }
}

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
