//#region KeyItem conditions
const keyItemsInitialize = KeyItems.prototype.initialize;
KeyItems.prototype.initialize = function() {
    keyItemsInitialize.call(this);

    const pkrus = this.itemList[KeyItemType.Pokerus_virus];

    pkrus.unlockReq.dispose();
    pkrus.unlockReq = ko.computed(() =>
        App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Distortion World')]() > 0
        || App.game?.challenges.list.noBreeding?.active()
        && App.game.party.getPokemon(pokemonMap[(GameConstants.Starter[player.starter()])].id)
    );

    //Edit unlocker so the modal doesn't show
    pkrus.unlocker.dispose();
    pkrus.unlocker = pkrus.unlockReq.subscribe(() => {
        if (pkrus.unlockReq()) {
            App.game.keyItems.gainKeyItem(pkrus.name, App.game?.challenges.list.noBreeding?.active());
        }
    });
    pkrus.unlockRewardOnUnlock = () => {
        if (App.game?.challenges.list.noBreeding?.active()) {
            pkrus.unlockRewardOnClose();
        }
    };

    $('#starterCaughtModal .modal-body .row')[0].insertAdjacentHTML('beforeend', `
        <!-- ko if: App.game?.challenges.list.noBreeding?.active() -->
            <div class="col-sm-3">
                <img
                    title="${pkrus.description}"
                    class="key-item"
                    src="assets/images/keyitems/Pokerus_virus.png"/>
                <br>
                <p>${pkrus.displayName}</p>
            </div>
        <!-- /ko -->
    `);
};

//Ignore breeding bonus
PartyPokemon.prototype.calculateAttack = eval(`(${PartyPokemon.prototype.calculateAttack.toString()
    .replace('calculateAttack', 'function')
    .replace('this.attackBonusPercent', '(App.game?.challenges.list.noBreeding?.active() ? 0 : this.attackBonusPercent)')
    .replace('this.attackBonusAmount', '(App.game?.challenges.list.noBreeding?.active() ? 0 : this.attackBonusAmount)')
})`);

//Evs have no cap
PartyPokemon.prototype.calculateEVAttackBonus = function() {
    if (this.pokerus < GameConstants.Pokerus.Contagious) {
        return 1;
    }
    if (App.game?.challenges.list.noBreeding?.active()) {
        return 1 + (this.evs() / 100);
    } else {
        return (this.evs() < 50) ? (1 + 0.01 * this.evs()) : (1 + Math.min(1, Math.pow((this.evs() - 30),0.075) - 0.75));
    }
};
