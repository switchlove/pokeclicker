window.addEventListener('load', () => {
    setTimeout(() => bfBot.interval = setInterval(bfBot, 100), 100);
});

async function bfBot() {
    if (!clickEngagedBF) {
        return;
    }

    if (App.game.gameState == 8) {
        switch (Settings.getSetting('bfOpts').observableValue()) {
            case 'bfOptL':
                if (BattleFrontierRunner.started() == true) {
                    if (BattleFrontierRunner.stage() >= Number(Settings.getSetting('maxLvl').observableValue())) {
                        BattleFrontierRunner.end();
                        clickEngagedBF = false;
                        Settings.setSettingByName('botstate.bf', false);
                        notifyBotComplete('BF');
                    }
                } else {
                    BattleFrontierRunner.checkpoint(0);
                    BattleFrontierRunner.start(false);
                }
                break;
            case 'bfOptT':
                if (BattleFrontierRunner.started() == true) {
                    if (Number(BattleFrontierRunner.timeLeftSeconds()) <= Number(Settings.getSetting('maxTime').observableValue())) {
                        BattleFrontierRunner.end();
                        clickEngagedBF = false;
                        Settings.setSettingByName('botstate.bf', false);
                        notifyBotComplete('BF');
                    }
                } else {
                    BattleFrontierRunner.checkpoint(0);
                    BattleFrontierRunner.start(false);
                }
                break;
            case 'bfOptN':
                if (BattleFrontierRunner.started() != true) {
                    BattleFrontierRunner.checkpoint(0);
                    BattleFrontierRunner.start(false);
                }
        }
    }
}
