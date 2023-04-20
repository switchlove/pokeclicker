//#region KeyItem conditions
const keyItemsInitialize = KeyItems.prototype.initialize;
KeyItems.prototype.initialize = function () {
  keyItemsInitialize.call(this);

  const pkrus = this.itemList[KeyItemType.Pokerus_virus];

  pkrus.unlockReq.dispose();
  pkrus.unlockReq = ko.computed(
    () =>
      App.game.statistics.dungeonsCleared[
        GameConstants.getDungeonIndex("Distortion World")
      ]() > 0 ||
      (App.game?.challenges.list.noBreeding?.active() &&
        App.game.party.getPokemon(
          GameConstants.RegionalStarters[GameConstants.Region.kanto][
            player.regionStarters[GameConstants.Region.kanto]()
          ]
        ))
  );

  //Edit unlocker so the modal doesn't show
  pkrus.unlocker.dispose();
  pkrus.unlocker = pkrus.unlockReq.subscribe(() => {
    if (pkrus.unlockReq()) {
      App.game.keyItems.gainKeyItem(
        pkrus.name,
        App.game?.challenges.list.noBreeding?.active()
      );
    }
  });
  pkrus.unlockRewardOnUnlock = () => {
    if (App.game?.challenges.list.noBreeding?.active()) {
      pkrus.unlockRewardOnClose();
    }
  };

  $("#starterCaughtModal .modal-body .row")[0].insertAdjacentHTML(
    "beforeend",
    `
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
    `
  );
};

//Ignore breeding bonus
PartyPokemon.prototype.calculateAttack = eval(
  `(${PartyPokemon.prototype.calculateAttack
    .toString()
    .replace("calculateAttack", "function")
    .replace(
      "this.attackBonusPercent",
      "(App.game?.challenges.list.noBreeding?.active() ? 0 : this.attackBonusPercent)"
    )
    .replace(
      "this.attackBonusAmount",
      "(App.game?.challenges.list.noBreeding?.active() ? 0 : this.attackBonusAmount)"
    )})`
);

//Evs have no cap
// PartyPokemon.prototype.calculateEVAttackBonus = eval(
//   `(${PartyPokemon.prototype.calculateEVAttackBonus
//     .toString()
//     .replace("calculateEVAttackBonus", "function")
//     .replace(
//       "(this.evs() < 50) ?",
//       "(this.evs() < 50 || App.game?.challenges.list.noBreeding?.active()) ?"
//     )})`
// );

PartyPokemon = eval(
  `${PartyPokemon.toString().replace(
    "(this.evs() < 50) ?",
    "(this.evs() < 50 || App.game?.challenges.list.noBreeding?.active()) ?"
  )}`
);

//Allow breeding from level 40
BreedingController.visible = eval(
  `(${BreedingController.visible
    .toString()
    .replace("visible", "function")
    .replace(
      "partyPokemon.level < 100",
      "partyPokemon.level < (App.game?.challenges.list.noBreeding?.active() ? 40 : 100)"
    )})`
);

const party = Party.prototype.constructor;
Party = class extends party {
  constructor(multiplier) {
    super(multiplier);

    this.hasMaxLevelPokemon = ko
      .pureComputed(() => {
        for (let i = 0; i < this.caughtPokemon.length; i++) {
          if (
            this.caughtPokemon[i].level >=
            (App.game?.challenges.list.noBreeding?.active() ? 40 : 100)
          ) {
            return true;
          }
        }
        return false;
      })
      .extend({ rateLimit: 1000 });
  }
};
