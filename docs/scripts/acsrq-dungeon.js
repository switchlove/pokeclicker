window.addEventListener('load', () => {
    setTimeout(() => dungeonBot.interval = setInterval(dungeonBot, 100), 100);

    // Reset boss position
    const initializeDungeon = DungeonRunner.initializeDungeon;
    DungeonRunner.initializeDungeon = function (dungeon) {
        initializeDungeon.call(this, dungeon);
        dungeonBot.boss == undefined;
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

    //Tiles interaction
    switch (DungeonRunner.currentTileType()()) {
        case GameConstants.DungeonTile.chest:
            if (Settings.getSetting('chestCollect').value && DungeonRunner.chestsOpened() < Settings.getSetting('maxChests').value) {
                return DungeonRunner.handleClick();
            }
            break;
        case GameConstants.DungeonTile.boss:
            if (Settings.getSetting('botRush').value || DungeonRunner.encountersWon() == DungeonRunner.map.totalFights()) {
                return DungeonRunner.handleClick();
            }
            dungeonBot.boss = DungeonRunner.map.playerPosition();
            break;
    }

    if (dungeonBot.boss && Settings.getSetting('botRush').value
        || DungeonRunner.map.board().every(row => row.every(tile => tile.isVisited))) {
        return DungeonRunner.map.moveToTile(dungeonBot.boss);
    }

    const max = DungeonRunner.map.size - 1;
    if (!DungeonRunner.map.board().every(row => row.every(tile => tile.isVisited))) {
        if (DungeonRunner.map.playerPosition().y == max && !DungeonRunner.map.board()[max][0].isVisited) {
            return DungeonRunner.map.moveLeft();
        }
        if (DungeonRunner.map.playerPosition().x == max) {
            return DungeonRunner.map.moveToCoordinates(0, DungeonRunner.map.playerPosition().y - 1);
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


// async function dungeonBot() {
//     } else if ( DungeonRunner.timeLeft() != -10 && DungeonRunner.dungeonFinished() != true) {
//         for (let aa = 0; aa < DungeonRunner.map.board().length; aa++) {
//             for (let bb = 0; bb < DungeonRunner.map.board()[aa].length; bb++) {
//                 var cellType = DungeonRunner.map.board()[aa][bb].type();
//                 if (cellType == 4) {
//                     bossA = aa;
//                     bossB = bb;
//                 }
//             }
//         }
//         var pX = DungeonRunner.map.playerPosition().x;
//         var pY = DungeonRunner.map.playerPosition().y;
//         if ( Settings.getSetting('botRush').observableValue() == true) {
//             if (App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(DungeonRunner.dungeon.name)]() >= 200) {
//                 if (Math.abs(DungeonRunner.map.playerPosition().y - bossA) <= 1) {
//                     if (pX == bossB) {
//                         await DungeonRunner.map.moveToCoordinates(bossB,bossA);
//                         await DungeonRunner.handleClick();
//                     }
//                 }
//                 if (Math.abs(DungeonRunner.map.playerPosition().x - bossB) <= 1) {
//                     if (pY == bossA) {
//                         await DungeonRunner.map.moveToCoordinates(bossB,bossA);
//                         await DungeonRunner.handleClick();
//                     }
//                 }
//             }
//             if (pX == bossB && pY == bossA) {
//                 await DungeonRunner.handleClick();
//             }
//         }
//         if ( Settings.getSetting('chestCollect').observableValue() == true) {
//             if (DungeonRunner.map.currentTile().type() == 3) {
//                 if (chestOpened < Settings.getSetting('maxChests').observableValue()) {
//                     DungeonRunner.handleClick();
//                     chestOpened++
//                 }
//             }
//         }
//         var dClears = App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().dungeon.name)]();
//         var dSize = player.region;

//         if (started == 0){
//             moveBoss = 0;
//             if (dClears < 10) {
//                 dSize = player.region;
//                 dMax = 4 + player.region;
//             } else if (dClears < 100) {
//                 dSize = player.region - 1;
//                 dMax = 4 + player.region - 1;
//             } else if (dClears < 1000) {
//                 dSize = player.region - 2;
//                 dMax = 4 + player.region - 2;
//             } else if (dClears < 10000) {
//                 dSize = player.region - 3;
//                 dMax = 4 + player.region - 3;
//             } else if (dClears < 100000) {
//                 dSize = player.region - 4;
//                 dMax = 4 + player.region - 4;
//             } else {
//                 dSize = player.region - 5;
//                 dMax = 4 + player.region - 5;
//             }
//             if (dSize < 0) {
//                 dSize = 0;
//             }
//             if (dMax < 4) {
//                 dMax = 4;
//             }
//             dMaxY = dMax;
//             if (pY == dMax) {
//                 DungeonRunner.map.moveLeft();
//                 if (pX == 0 && pY == dMax) {
//                     started = 1;
//                 }
//             }
//         } else {
//             if (moveBoss == 1) {
//                 if (pX == bossB && pY == bossA) {
//                     await DungeonRunner.handleClick();
//                 }
//             } else {
//                 DungeonRunner.map.moveRight();
//                 if (pX == dMax && pY == dMaxY) {
//                     await DungeonRunner.map.moveToCoordinates(0,dMaxY);
//                     await DungeonRunner.map.moveUp();
//                     dMaxY = dMaxY - 1;
//                 } else if (pX == dMax && pY == 0) {
//                     await DungeonRunner.map.moveToCoordinates(bossB,bossA);
//                     moveBoss = 1;
//                 }
//             }
//         }
//     }
// }
