window.addEventListener('load', () => {
    setTimeout(() => safariBot.interval = setInterval(safariBot, 250), 250);
});


function safariBot() {
    if (!clickEngagedS) {
        return;
    } else if (!Safari.inProgress()) {
        // check if in safari town
        if (App.game.gameState == GameConstants.GameState.town) {
            let safariIdx = player.town().content.findIndex(o => o instanceof SafariTownContent);
            if (safariIdx >= 0) {
                player.town().content[safariIdx].onclick()
            }
            return;
        }
        // try starting safari
        if (safariBot.isRunning() && Safari.canPay() && Safari.sizeX() && Safari.sizeY()) {
            $('#paySafariButton').click();
            return;
        }
        return;
    } else if (!safariBot.isRunning()) {
        return;
    }


    // Movement algorithm
    if (!Safari.inBattle()) {
        const { x, y } = Safari.playerXY;
        let grid;

        if (safariBot.pokemonGrid()[y][x] < Infinity)
            grid = safariBot.pokemonGrid();
        else if (safariBot.itemGrid()[y][x] < Infinity)
            grid = safariBot.itemGrid();
        else if (safariBot.grassGrid[y][x] < Infinity)
            grid = safariBot.grassGrid;

        const d = grid[y][x];
        const direction = safariBot.dirOrder().map(dir => {
            let { x, y } = Safari.directionToXY(dir);
            x += Safari.playerXY.x;
            y += Safari.playerXY.y;

            if (y >= grid.length || y < 0 || x >= grid[y].length || x < 0 || grid[y][x] == Infinity) {
                return null;
            }
            return { dir, x, y, d: d - grid[y][x] };
        }).filter((n) => n).sort((a, b) => b.d - a.d);

        Safari.step(direction[0].dir);
    }
    // Battle algorithm
    else {

        // feed that pokemon
        if (!SafariBattle.enemy.eating) {
            if (App.game.farming.berryList[BerryType.Nanab]() > 25) {
                SafariBattle.selectedBait(BaitList['Nanab']);
                SafariBattle.throwBait();
                return;
            }
            else if (App.game.farming.berryList[BerryType.Razz]() > 25) {
                SafariBattle.selectedBait(BaitList['Razz']);
                SafariBattle.throwBait();
                return;
            }
        }

        // is shiny needed
        let shouldCapture = SafariBattle.enemy.shiny && !App.game.party.alreadyCaughtPokemon(SafariBattle.enemy.id, true);

        // does bot setting allow this capture
        if (!shouldCapture) {
            let safariCatch = Settings.getSetting('safariCatch').value;
            shouldCapture ||= safariCatch == 'safariCatchE';
            shouldCapture ||= safariCatch == 'safariCatchAC' && App.game.party.alreadyCaughtPokemon(SafariBattle.enemy.id);
        }

        if (shouldCapture) {
            SafariBattle.throwBall();
        } else {
            SafariBattle.run();
            setTimeout(() => {
                SafariBattle.busy(false);
            }, 1600); // anti soft lock
        }
    }
}

//Check for safariBot options
safariBot.isRunning = ko.pureComputed(() => {
    // prevent balls to become negative and lock safari
    if (Safari.balls() < 1) {
        return false;
    }

    // wait while battle is busy since action can't be performed
    if (SafariBattle.busy()) {
        return false;
    }

    // if safari close while in battle wait for the battle to finish
    if (Safari.inBattle()) {
        return true;
    }

    // check if modal open
    if (App.game.gameState != GameConstants.GameState.safari || !$('#safariModal')[0].classList.contains('show')) {
        return false;
    }

    switch (Settings.getSetting('safariOpts').observableValue()) {
        case 'safariOptSC':
            return !Safari.completed(true);
        default:
            return true;
    }
});

safariBot.dirOrder = () => {
    const lastDir = Safari.lastDirection;
    switch (lastDir) {
        case 'left': priority = 'right'; break;
        case 'up': priority = 'down'; break;
        case 'right': priority = 'left'; break;
        case 'down': priority = 'up'; break;
    }
    return [...new Set([priority, lastDir, 'up', 'down', 'left', 'right'])];
}

// Brackets are used to not expose walkGrid as function accessible from everywhere
{
    const walkGrid = function (grid, origin) {
        let points = [origin];

        while (points.length) {
            const p = points.shift();
            const baseCost = grid[p.y][p.x];
            const next = [
                { x: p.x - 1, y: p.y },
                { x: p.x + 1, y: p.y },
                { x: p.x, y: p.y - 1 },
                { x: p.x, y: p.y + 1 }
            ]

            for (const { x, y } of next) {
                if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length)
                    continue;

                let cost = safariBot.grid[y][x]
                if (baseCost + cost < grid[y][x]) {
                    grid[y][x] = baseCost + cost;
                    points.push({ x, y })
                }
            }
        }
    }

    safariBot.pokemonPos = ko.pureComputed(() => {
        return Safari.pokemonGrid().filter(p => p.shiny).map(({ x, y }) => { x, y })
    })

    safariBot.pokemonGrid = ko.pureComputed(() => {
        let grid = Safari.grid.map(_ => _.map(_ => Infinity));
        for (const pkm of safariBot.pokemonPos()) {
            grid[pkm.y][pkm.x] = 0;
            walkGrid(grid, pkm);
        }
        return grid;
    })

    safariBot.itemGrid = ko.pureComputed(() => {
        let grid = Safari.grid.map(_ => _.map(_ => Infinity));
        for (const item of Safari.itemGrid()) {
            grid[item.y][item.x] = 0;
            walkGrid(grid, item);
        }
        return grid;
    })

    safariBot.load = function () {
        let grassPos = [];

        // makeup movement grid
        safariBot.grid = Safari.grid.map((_, y) => _.map((c, x) => {
            switch (c) {
                case 0:
                    // ground (free movement)
                    return 1
                case 11:
                case 12:
                case 13:
                case 14:
                case 21:
                case 22:
                case 23:
                case 24:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                    //sand (free movement)
                    return 1
                case 10:
                    grassPos.push({ y, x });
                    //grass (chance of encounter)
                    return 2
                default:
                    return Infinity
            }
        }))

        // makeup grass grid
        let grid = Safari.grid.map(_ => _.map(c => c == 10 ? 0 : Infinity));
        for (const grass of grassPos) {
            grid[grass.y][grass.x] = 0;
            walkGrid(grid, grass);
        }
        safariBot.grassGrid = grid;
    }
}

// Brackets are used to not expose constants as global variable
{
    const safariLoad = Safari.load;
    Safari.load = function () {
        safariLoad.call(this);
        safariBot.load();
    }
}
