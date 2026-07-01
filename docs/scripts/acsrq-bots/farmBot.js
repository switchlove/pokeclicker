window.addEventListener('load', () => {
    setTimeout(() => farmBot.interval = setInterval(farmBot, 1000), 1000);
});

function farmBot() {
    const plantSelect = document.getElementById('select-botstate.plant');
    if (plantSelect && !plantSelect.disabled && plantSelect.value != 'N/A') {
        if (plantSelect.value === 'Unlock') {
            unlockBot();
            return;
        }
        plantBot();
    }

    const mutateSelect = document.getElementById('select-botstate.mutate');
    if (mutateSelect && !mutateSelect.disabled && mutateSelect.value != 'N/A') {
        mutateBot();
    }
}

function plantLayout(layout) {
    const farming = App.game.farming;
    const berrieOrder = Object.keys(layout)
        .filter(key => key !== 'mulch')
        .sort((a, b) => farming.berryData[b].growthTime[3] - farming.berryData[a].growthTime[3]);

    const unlockedFor = id => layout[id].filter(p => farming.plotList[p].isUnlocked);

    for (let i = 0; i < berrieOrder.length; i++) {
        const plots = unlockedFor(berrieOrder[i]);
        if (plots.length === 0) continue;

        if (farming.plotList[plots[0]].berry == -1) {
            if (i > 0) {
                const anchorPlots = unlockedFor(berrieOrder[0]);
                if (anchorPlots.length > 0) {
                    const plot = farming.plotList[anchorPlots[0]];
                    if (plot?.berryData?.growthTime[3] - plot?.age > farming.berryData[berrieOrder[i]]?.growthTime[3]) {
                        continue;
                    }
                }
            }

            plots.forEach(plot => farming.plant(plot, berrieOrder[i]));
        }
    }

    if (layout.mulch && Settings.getSetting('botstate.mutateMulch').value) {
        Object.entries(layout.mulch).forEach(([mulchType, plots]) => {
            const mulch = Number(mulchType);
            if (!farming.hasMulch(mulch)) {
                return;
            }
            plots.filter(p => farming.plotList[p].isUnlocked).forEach(plot => {
                if (farming.plotList[plot].mulch != mulch) {
                    farming.addMulch(plot, mulch);
                }
            });
        });
    }
}

async function plantBot() {
    var selectedBerry = Settings.getSetting('botstate.plant').value;
    var berryId = BerryType[selectedBerry];

    if (berryId >= 0 && App.game.farming.unlockedBerries[berryId]()) {
        if (App.game.farming.plotList[12].isEmpty() == true) {
            if (App.game.farming.berryList[berryId]() > 1) {
                if (App.game.farming.plotList[12].isEmpty() == true) {
                    FarmController.selectedBerry(berryId);
                    App.game.farming.plantAll(FarmController.selectedBerry());
                } else if (App.game.farming.plotList[12].age > App.game.farming.berryData[b].growthTime[3]) {
                    App.game.farming.harvestAll();
                }
            }
        }

        if (App.game.farming.plotList.some(p => p.berry != -1 && (p.age > p.berryData.growthTime[3]))) {
            App.game.farming.harvestAll();
        }
    } else {
        const layouts = {
            'S+C': {
                65: [5, 6, 7, 8, 9, 15, 16, 17, 18, 19],
                40: [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24],
            },
            'S+L': {
                65: [0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23, 24],
                19: [6, 8, 16, 18],
            },
            'S+L+C': {
                65: [5, 7, 9, 15, 17, 19],
                19: [6, 8, 16, 18],
                40: [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24],
            },
        };

        if (selectedBerry.endsWith('+P')) {
            const tp = App.game.farming.plotList[7];
            const bp = App.game.farming.plotList[17];

            if (tp.berry == -1 || bp.berry == BerryType.Petaya && bp.age >= bp.berryData.growthTime[4] - 10 - bp.berryData?.growthTime[3] && tp.berry != BerryType.Petaya) {
                App.game.farming.harvest(7);
                App.game.farming.plant(7, BerryType.Petaya);
            } else if (tp.berry == BerryType.Petaya && tp.age > tp.berryData.growthTime[4] - 10) {
                App.game.farming.harvest(7);
                App.game.farming.plant(7, BerryType.Starf);
            }

            if (tp.berry == BerryType.Petaya && tp.age >= tp.berryData.growthTime[4] - 10 - tp.berryData?.growthTime[3] && bp.berry != BerryType.Petaya) {
                App.game.farming.harvest(17);
                App.game.farming.plant(17, BerryType.Petaya);
            } else if (bp.berry == -1 || bp.berry == BerryType.Petaya && bp.age > bp.berryData.growthTime[4] - 10) {
                App.game.farming.harvest(17);
                App.game.farming.plant(17, BerryType.Starf);
            }
        }

        const layout = layouts[selectedBerry.replace('+P', '')];
        const petayaPlots = [7, 17];

        // Harvest any ripe stray berries (e.g. mutations like Custap) sitting in layout
        // plots, otherwise the indicator-plot check in plantLayout gets stuck and the
        // area never gets replanted.
        Object.entries(layout).forEach(([berryId, plots]) => {
            plots.forEach(plot => {
                if (selectedBerry.endsWith('+P') && petayaPlots.includes(plot)) {
                    return;
                }
                const p = App.game.farming.plotList[plot];
                if (p.berry != -1 && p.berry != Number(berryId) && p.stage() == PlotStage.Berry) {
                    App.game.farming.harvest(plot);
                }
            });
        });

        plantLayout(layout);
        if (!App.game.farming.berryInFarm(BerryType.Petaya, PlotStage.Berry, true)
            && App.game.farming.plotList.some(p => p.berry != -1 && (p.age > p.berryData.growthTime[4] - 5))) {
            App.game.farming.harvestAll();
        }
    }
}

// 'BerryName': { BerryID:[PlotID], ..., mulch: { MulchType: [PlotID] } }
function getMutationLayouts() {
    const all = Array.from({ length: App.game.farming.plotList.length }, (_, i) => i);
    const SM = MulchType.Surprise_Mulch;
    const FM = MulchType.Freeze_Mulch;

    return {
        'Persim': { 2: [0, 3, 15, 18], 6: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Razz': { 0: [0, 3, 15, 18], 5: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Bluk': { 1: [0, 3, 15, 18], 5: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Nanab': { 2: [0, 3, 15, 18], 4: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Wepear': { 3: [0, 3, 15, 18], 6: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Pinap': { 4: [0, 3, 15, 18], 7: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Figy': { 0: [1, 4, 5, 6, 8, 9, 16, 19, 20, 21, 23, 24], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Wiki': { 1: [1, 4, 5, 6, 8, 9, 16, 19, 20, 21, 23, 24], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Mago': { 2: [1, 4, 5, 6, 8, 9, 16, 19, 20, 21, 23, 24], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Aguav': { 3: [1, 4, 5, 6, 8, 9, 16, 19, 20, 21, 23, 24], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Iapapa': { 4: [1, 4, 5, 6, 8, 9, 16, 19, 20, 21, 23, 24], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Lum': {
            0: [12], 1: [11, 13], 2: [7, 17], 3: [10, 14], 4: [2, 22], 5: [5, 9, 15, 19], 6: [1, 3, 21, 23], 7: [0, 4, 20, 24],
            mulch: {
                [FM]: [12, 11, 13, 7, 17, 10, 14, 2, 22, 5, 9, 15, 19, 1, 3, 21, 23, 0, 4, 20, 24],
                [SM]: [6, 8, 16, 18],
            },
        },
        'Pomeg': { 16: [0, 3, 15, 18], 18: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Kelpsy': { 1: [0, 3, 15, 18], 8: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Qualot': { 13: [0, 3, 15, 18], 16: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Hondew': { 14: [5, 8, 20, 23], 15: [6, 9, 21, 24], 17: [1, 4, 16, 19], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Grepa': { 14: [0, 3, 15, 18], 17: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Tamato': { 20: [6, 9, 21, 24], 9: [0, 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23], mulch: { [SM]: [0, 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23] } },
        'Cornn': { 15: [6, 9, 21, 24], 10: [5, 8, 20, 23], 5: [1, 4, 16, 19], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Magost': { 16: [6, 9, 21, 24], 11: [5, 8, 20, 23], 2: [1, 4, 16, 19], mulch: { [FM]: [1, 4, 16, 19], [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Rabuta': { 17: [6, 9, 21, 24], 4: [0, 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23], mulch: { [SM]: [0, 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23] } },
        'Nomel': { 12: [0, 3, 15, 18], 13: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Spelon': { 25: all, mulch: { [SM]: [6, 7, 8, 11, 12, 13, 16, 17, 18] } },
        'Pamtre': { 26: all, mulch: { [SM]: [6, 7, 8, 11, 12, 13, 16, 17, 18] } },
        'Watmel': { 27: all, mulch: { [SM]: [6, 7, 8, 11, 12, 13, 16, 17, 18] } },
        'Durin': { 28: all, mulch: { [SM]: [6, 7, 8, 11, 12, 13, 16, 17, 18] } },
        'Belue': { 29: all, mulch: { [SM]: [6, 7, 8, 11, 12, 13, 16, 17, 18] } },
        'Pinkan': {
            32: [12], 27: [11, 13], 22: [10, 14], 16: [5, 9, 15, 19], 11: [0, 4, 20, 24], 8: [7, 17], 2: [2, 22],
            mulch: { [FM]: [5, 9, 15, 19, 0, 4, 20, 24, 7, 17, 2, 22], [SM]: [6, 8, 16, 18] },
        },
        'Occa': { 14: [2, 15, 19], 25: [5, 9, 22], 30: [7, 20, 24], 9: [0, 4, 17], mulch: { [FM]: [2, 15, 19, 0, 4, 17], [SM]: [1, 3, 6, 8, 11, 13, 16, 18, 21, 23] } },
        'Passho': { 6: [2, 15, 19], 1: [0, 4, 17], 21: [5, 9, 22], 44: [7, 20, 24], mulch: { [FM]: [2, 15, 19, 0, 4, 17], [SM]: [1, 3, 6, 8, 11, 13, 16, 18, 21, 23] } },
        'Wacan': { 18: [2, 15, 19], 13: [0, 4, 17], 22: [5, 9, 22], 24: [7, 20, 24], mulch: { [FM]: [2, 15, 19, 0, 4, 17], [SM]: [1, 3, 6, 8, 11, 13, 16, 18, 21, 23] } },
        'Rindo': { 14: [0, 3, 15, 18], 17: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Yache': { 37: [0, 2, 4, 10, 12, 14, 20, 22, 24], mulch: { [SM]: [0, 2, 4, 10, 12, 14, 20, 22, 24] } },
        'Chople': { 30: all, mulch: { [SM]: all } },
        'Kebia': { 31: all, mulch: { [SM]: all } },
        'Shuca': { 32: all, mulch: { [SM]: all } },
        'Coba': { 15: [0, 3, 15, 18], 17: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Payapa': { 10: [5, 9, 22], 15: [0, 4, 17], 26: [2, 15, 19], 31: [7, 20, 24], mulch: { [FM]: [5, 9, 22, 0, 4, 17], [SM]: [1, 3, 6, 8, 11, 13, 16, 18, 21, 23] } },
        'Tanga': { 39: [0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [6, 8, 16, 18] } },
        'Charti': { 26: [0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23, 24] } },
        'Kasib': App.game.farming.hasBerry(BerryType.Kasib)
            ? { 0: all.filter(p => ![7, 9, 17, 19].includes(p)), [BerryType.Kasib]: [7, 9, 17, 19], mulch: { [SM]: all } }
            : { 0: all, mulch: { [SM]: all } },
        'Haban': { 36: [12], 39: [1, 9, 15, 23], 37: [3, 5, 19, 21], 38: [2, 10, 14, 22], mulch: { [SM]: [6, 7, 8, 11, 13, 16, 17, 18] } },
        'Colbur': { 45: [6, 9, 21, 24], 28: [1, 4, 16, 19], 48: [5, 8, 20, 23], mulch: { [SM]: [0, 2, 3, 7, 10, 11, 12, 13, 14, 15, 17, 18, 22] } },
        'Babiri': { 43: [0, 1, 2, 3, 4, 7, 17, 20, 21, 22, 23, 24], 47: [5, 9, 10, 11, 12, 13, 14, 15, 19], mulch: { [SM]: [6, 8, 16, 18] } },
        'Chilan': { 41: all, mulch: { [SM]: all } },
        'Roseli': { 11: [5, 9, 22], 16: [0, 4, 17], 27: [2, 15, 19], 32: [7, 20, 24], mulch: { [SM]: [1, 3, 6, 8, 11, 13, 16, 18, 21, 23] } },
        'Micle': { 31: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [7, 11, 12, 13, 17] } },
        'Custap': { 32: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [7, 11, 12, 13, 17] } },
        'Jaboca': { 33: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [7, 11, 12, 13, 17] } },
        'Rowap': { 34: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [7, 11, 12, 13, 17] } },
        'Kee': { 61: [0, 3, 15, 18], 62: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Maranga': { 63: [0, 3, 15, 18], 64: [6, 9, 21, 24], mulch: { [SM]: [1, 2, 4, 5, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23] } },
        'Liechi': { 37: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [12, 13] } },
        'Ganlon': { 43: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [12, 13] } },
        'Salac': { 44: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [12, 13] } },
        'Petaya': {
            48: [0], 45: [2], 40: [4], 43: [5], 38: [9], 41: [10], 44: [11], 42: [12], 49: [14], 50: [15], 51: [16], 47: [17], 36: [20], 39: [21], 53: [23], 37: [22], 46: [19], 52: [24],
            mulch: { [SM]: [1, 3, 6, 7, 8, 13, 18] },
        },
        'Apicot': { 52: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [12, 13] } },
        'Lansat': { 53: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], mulch: { [SM]: [12, 13] } },
        'Snover': { 51: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21], mulch: { [SM]: [24] } },
    };
}

// Plants a mutation layout, then harvests once it's done its job.
// 'Kasib' mutates from other Berries withering, so don't harvest them away before that can happen.
function plantAndHarvestLayout(layout, berryName) {
    plantLayout(layout);

    if (berryName === 'Kasib') {
        return;
    }

    App.game.farming.plotList.forEach((plot, index) => {
        if (plot.berry != -1 &&
            (plot.age > plot.berryData.growthTime[4] - 5 || plot.berry == BerryType[berryName] && plot.age > plot.berryData.growthTime[3])) {
            App.game.farming.harvest(index);
        }
    });
}

async function mutateBot() {
    const selectedBerry = Settings.getSetting('botstate.mutate').value;
    const layout = getMutationLayouts()[selectedBerry];
    if (!layout) {
        return;
    }

    if (App.game.farming.unlockedBerries[BerryType[selectedBerry]]()) {
        Settings.setSettingByName('botstate.mutate', 'N/A');
        notifyBotComplete('Mutate');
        return;
    }

    plantAndHarvestLayout(layout, selectedBerry);
}

// Returns the set of BerryType IDs that must be mutated (transitively) to produce targetBerryId.
// Only includes berries the player doesn't already own.
function getPrerequisiteChain(targetBerryId, mutationLayouts, farming) {
    const needed = new Set();
    function collect(berryId) {
        const layout = mutationLayouts[BerryType[berryId]];
        if (!layout) return;
        Object.keys(layout).filter(k => k !== 'mulch').forEach(key => {
            const b = Number(key);
            if (!farming.unlockedBerries[b]() && !needed.has(b)) {
                needed.add(b);
                collect(b);
            }
        });
    }
    collect(targetBerryId);
    if (!farming.unlockedBerries[targetBerryId]()) needed.add(targetBerryId);
    return needed;
}

// Returns true if each berry type in the layout has at least one unlocked plot to go in.
function isLayoutFeasible(layout) {
    return Object.entries(layout)
        .filter(([k]) => k !== 'mulch')
        .every(([, plots]) => plots.some(p => App.game.farming.plotList[p].isUnlocked));
}

// Farms whichever owned berry yields the most FP per second.
function farmBestAvailableBerry() {
    const farming = App.game.farming;
    const available = Array.from({ length: farming.berryData.length }, (_, i) => i)
        .filter(i => farming.unlockedBerries[i]() && farming.berryList[i]() > 0);
    if (available.length > 0) {
        const bestBerry = available.reduce((best, i) => {
            const eff = b => farming.berryData[b].farmValue / farming.berryData[b].growthTime[3];
            return eff(i) > eff(best) ? i : best;
        });
        farmBerry(bestBerry);
    }
}

// Farms a single berry type across all unlocked plots: harvest when ripe, replant when empty.
function farmBerry(berryId) {
    const farming = App.game.farming;
    if (farming.plotList.some(p => p.isUnlocked && p.berry != -1 && p.age > p.berryData.growthTime[3])) {
        farming.harvestAll();
    }
    if (farming.berryList[berryId]() > 0) {
        farming.plantAll(berryId);
    }
}

// Auto-purchases locked plots when affordable, then farms/mutates whichever Berry
// is needed next to unlock the next plot, in unlockMatrix order.
async function unlockBot() {
    const farming = App.game.farming;

    farming.plotList.forEach((plot, i) => {
        if (!plot.isUnlocked && farming.canBuyPlot(i)) {
            farming.unlockPlot(i);
        }
    });

    if (farming.allPlotsUnlocked()) {
        return;
    }

    const lockedPlots = farming.plotList
        .map((_, i) => i)
        .filter(i => !farming.plotList[i].isUnlocked && Farming.unlockMatrix[i] != BerryType.None);
    const targetPlot = lockedPlots.reduce((a, b) => Farming.unlockMatrix[a] <= Farming.unlockMatrix[b] ? a : b);
    const targetBerry = Farming.unlockMatrix[targetPlot];

    if (!farming.unlockedBerries[targetBerry]()) {
        const mutationLayouts = getMutationLayouts();
        const needed = getPrerequisiteChain(targetBerry, mutationLayouts, farming);
        for (const b of [...needed].sort((a, b) => a - b)) {
            if (!farming.unlockedBerries[b]() && mutationLayouts[BerryType[b]]) {
                const layout = mutationLayouts[BerryType[b]];
                if (isLayoutFeasible(layout)) {
                    plantAndHarvestLayout(layout, BerryType[b]);
                    return;
                }
            }
        }
        // No feasible mutation in the prerequisite chain — earn FP with best available berry instead.
        farmBestAvailableBerry();
        return;
    }

    // If we already have enough of the required berry, FP is the only remaining blocker.
    // Switch to the most FP-efficient berry we have in stock until the plot is affordable.
    const berryCost = farming.plotBerryCost(targetPlot);
    const hasEnoughBerries = farming.berryList[berryCost.type]() >= berryCost.amount;

    if (hasEnoughBerries && !farming.canBuyPlot(targetPlot)) {
        farmBestAvailableBerry();
        return;
    }

    farmBerry(targetBerry);
}
