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


//#endregion

// //Test
// var hasRan = 0;

// window.addEventListener("load", function() {
//     setTimeout(function(){
//         catchTest();

//         setInterval(function(){
//             catchTest();
//         }, 500);
//     }, 1000);
// });

// function catchTest(){
//     var CharCard = document.querySelector("#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div");
//     if (CharCard == null && App.game != undefined) {
//         if (hasRan == 0) {
//             hasRan = 1;
//             setCatchFunctions();
// 			if(!App.game.keyItems.hasKeyItem(KeyItemType.Pokerus_virus)){
// 				App.game.keyItems.gainKeyItem(KeyItemType.Pokerus_virus);
// 			}
//         }
//     }
// }

// function setCatchFunctions(){
// 	//Hatching no longer gives attack bonus
// 	Egg.hatch = function(efficiency = 100, helper = false) {
//         if (!this.canHatch()) {
//             return false;
//         }
//         const shiny = PokemonFactory.generateShiny(this.shinyChance, true);
//         const partyPokemon = this.partyPokemon();
//         // If the party pokemon exist, increase it's damage output
//         const pokemonID = PokemonHelper.getPokemonByName(this.pokemon).id;
//         if (partyPokemon) {
//             // If breeding (not store egg), reset level, reset evolution check
//             if (partyPokemon.breeding) {
//                 if (partyPokemon.evolutions !== undefined) {
//                     partyPokemon.evolutions.forEach(evo => evo instanceof LevelEvolution ? evo.triggered = false : undefined);
//                 }
//                 partyPokemon.exp = 0;
//                 partyPokemon.level = 1;
//                 partyPokemon.breeding = false;
//                 partyPokemon.level = partyPokemon.calculateLevelFromExp();
//                 partyPokemon.checkForLevelEvolution();
//                 if (partyPokemon.pokerus == GameConstants.Pokerus.Infected) {
//                     partyPokemon.pokerus = GameConstants.Pokerus.Contagious;
//                 }
//                 if (partyPokemon.evs() >= 50 && partyPokemon.pokerus == GameConstants.Pokerus.Contagious) {
//                     partyPokemon.pokerus = GameConstants.Pokerus.Resistant;
//                 }
//             }
//         }
//         if (shiny) {
//             Notifier.notify({
//                 message: `✨ You hatched a shiny ${this.pokemon}! ✨`,
//                 type: NotificationConstants.NotificationOption.warning,
//                 sound: NotificationConstants.NotificationSound.General.shiny_long,
//                 setting: NotificationConstants.NotificationSetting.Hatchery.hatched_shiny,
//             });
//             App.game.logbook.newLog(LogBookTypes.SHINY, `You hatched a shiny ${this.pokemon}! ${App.game.party.alreadyCaughtPokemon(pokemonID, true) ? '(duplicate)' : ''}`);
//             GameHelper.incrementObservable(App.game.statistics.shinyPokemonHatched[pokemonID]);
//             GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonHatched);
//         }
//         else {
//             Notifier.notify({
//                 message: `You hatched ${GameHelper.anOrA(this.pokemon)} ${this.pokemon}!`,
//                 type: NotificationConstants.NotificationOption.success,
//                 setting: NotificationConstants.NotificationSetting.Hatchery.hatched,
//             });
//         }
//         App.game.party.gainPokemonById(pokemonID, shiny);
//         // Capture base form if not already caught. This helps players get Gen2 Pokemon that are base form of Gen1
//         const baseForm = App.game.breeding.calculateBaseForm(this.pokemon);
//         if (this.pokemon != baseForm && !App.game.party.alreadyCaughtPokemon(PokemonHelper.getPokemonByName(baseForm).id)) {
//             Notifier.notify({
//                 message: `You also found ${GameHelper.anOrA(baseForm)} ${baseForm} nearby!`,
//                 type: NotificationConstants.NotificationOption.success,
//                 sound: NotificationConstants.NotificationSound.General.new_catch,
//                 setting: NotificationConstants.NotificationSetting.General.new_catch,
//             });
//             App.game.party.gainPokemonById(PokemonHelper.getPokemonByName(baseForm).id);
//         }
//         // Update statistics
//         GameHelper.incrementObservable(App.game.statistics.pokemonHatched[pokemonID]);
//         GameHelper.incrementObservable(App.game.statistics.totalPokemonHatched);
//         App.game.oakItems.use(OakItemType.Blaze_Cassette);
//         return true;
//     }
	
// 	//Evs have no cap
// 	PartyPokemon.calculateEVAttackBonus = function() {
//         if (this.pokerus < GameConstants.Pokerus.Contagious) {
//             return 1 + (this.evs / 100);
//         }
//         return 1;
//     }
// }