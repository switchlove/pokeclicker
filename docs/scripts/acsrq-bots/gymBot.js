window.addEventListener('load', () => {
    setTimeout(() => gymBot.interval = setInterval(gymBot, 100), 100);
});

async function gymBot() {
    if (!clickEngagedG) {
        return;
    }

    if (App.game.gameState != GameConstants.GameState.town) {
        return;
    }

    const opts = Settings.getSetting('gymOpts').value;
    const gyms = player.town.content.filter(c => c instanceof Gym && c.isUnlocked());
    const idx = Settings.getSetting('gymE4Opts').value - 1;
    const gym = gyms[idx] || gyms[0];

    if (gym && opts == 'gymOptC' && (gym.clears() || 0) >= Settings.getSetting('maxClearsGym').value) {
        clickEngagedG = false;
        Settings.setSettingByName('botstate.gym', false);
        notifyBotComplete('Gym');
        return;
    }

    if (!gym) {
        return;
    }

    GymRunner.startGym(gym);
}
