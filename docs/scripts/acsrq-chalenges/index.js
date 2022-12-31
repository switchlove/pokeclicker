import './acsrq-movement.js';
import './acsrq-breeding.js';

//#region Add new Callenge
const challenges = Challenges;
Challenges = class Challenges extends challenges {
    constructor() {
        super();

        //TODO: ADD header to challenge mod to differetiate vanilla from acsrq

        const challenge = this.list.requireCompletePokedex.constructor;
        Object.assign(this.list, {
            'shinyMovement': new challenge('Shiny Movement', 'Restrict your movement as ACSRQ routing.', true),
            'noBreeding': new challenge('No Breeding (optional)', 'Breeding is innefective, you start with pokerus.', false),
        });
    }
};
//#endregion

//#region Trainer Card - One to govern them all
const trainerCard = Profile.getTrainerCard;
Profile.getTrainerCard = function (...args) {
    const vanilla = Object.entries(args[11]).filter(([k, _]) => !['shinyMovement', 'noBreeding'].includes(k));
    let card = trainerCard(...args);

    if (vanilla.every(([_,v]) => v)) {
        const badgeContainer = card.querySelector('.challenge-badges');
        for (let i = 0; i < vanilla.length; i++) {
            badgeContainer.removeChild(badgeContainer.children[0]);
        }
        const img = document.createElement('img');
        img.onerror = () => img.remove();
        img.className = 'm-1';
        img.width = 18 * 2;
        img.src = 'assets/images/challenges/acsrq.png';
        img.title = 'All Challenges Shiny Route Quest';
        img.dataset.toggle = 'tooltip';
        img.dataset.placement = 'top';
        badgeContainer.insertBefore(img, badgeContainer.firstChild);
    }
    return card;
};
//#endregion

//custom update code

const update = Update.prototype.check;
Update.prototype.check = function () {
    // Must modify these object when updating
    const playerData = this.getPlayerData();
    const saveData = this.getSaveData();
    const settingsData = this.getSettingsData();

    if (!playerData || !saveData) {
        return;
    }

    if (saveData.challenges.list.shinyMovement == undefined) {
        setTimeout(async () => {
            // Check if player wants to disable the new challenge modes
            if (await Notifier.confirm({ title: 'Shiny Movement', message: 'New challenge mode added: Shiny Movement.\n\nPrevent movement if you can obtain shinies.\n\nThis is an recommended challenge for ACSRQ.\n\nPlease choose if you would like this challenge mode to be disabled or enabled.\n\nCan be disabled later. Can NOT be enabled later!', confirm: 'Disable', cancel: 'Enable' })) {
                App.game.challenges.list.shinyMovement.active(false);
            }
        }, GameConstants.SECOND);
    }

    if (saveData.challenges.list.noBreeding == undefined) {
        setTimeout(async () => {
            // Check if player wants to activate the new challenge modes
            if (!await Notifier.confirm({ title: 'No Breeding', message: 'New challenge mode added: No Breeding.\n\nRemove bonus from breeding but you start with pokerus.\n\nThis is an optional challenge and is NOT the recommended way to play.\n\nPlease choose if you would like this challenge mode to be disabled or enabled.\n\nCan be disabled later. Can NOT be enabled later!', confirm: 'Disable', cancel: 'Enable' })) {
                App.game.challenges.list.noBreeding.activate();
            }
        }, GameConstants.SECOND);
    }

    update.call(this);
};
