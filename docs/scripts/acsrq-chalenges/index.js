import './acsrq-movement.js';
import './acsrq-breeding.js';

//#region Add new Callenge
const challenges = Challenges;
Challenges = class Challenges extends challenges {
    constructor() {
        super();
        const challenge = this.list.requireCompletePokedex.constructor;
        Object.assign(this.list, {
            shinyMovement: new challenge('Shiny Movement', 'Restrict your movement as ACSRQ routing.', true),
            noBreeding: new challenge('No Breeding', 'Breeding is innefective, you start with pokerus. (optional)', false),
        });
    }
};
//#endregion

//#region Trainer Card - One to govern them all
const trainerCard = Profile.getTrainerCard;
Profile.getTrainerCard = function (...args) {
    let card = trainerCard(...args);
    if (Object.values(args[10]).every(_ => _)) {
        const badgeContainer = card.querySelector('.challenge-badges');
        while (badgeContainer.hasChildNodes()) {
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
        badgeContainer.appendChild(img);
    }
    return card;
};
//#endregion
