//Test
var hasRan = 0;
// Save real Battle.generateNewEnemy function
let oldBattle = Battle.generateNewEnemy;
let oldEvent = SpecialEvents.prototype.initialize;

window.addEventListener("load", function() {
	// disable event to be sure there are not randomized
	SpecialEvents.prototype.initialize = function() {}
	// prevent from encountering pokemon until the randomizing is finished
	Battle.generateNewEnemy = function () {
		this.enemyPokemon(PokemonFactory.generateWildPokemon(-1, -1));
	}

    setTimeout(function(){
        rando();

        setInterval(function(){
            rando();
        }, 500);
    }, 1000);
});

function rando(){
    var CharCard = document.querySelector("#saveSelector > div > div.mb-3.col-lg-4.col-md-6.col-sm-12.xol-xs-12 > div");
    if (CharCard == null && App.game != undefined) {
        if (hasRan == 0) {
            hasRan = 1;
            makeRandom();
        }
    }
}

function makeRandom(){
    console.log("Randomizing...");
    declareRandomizer();
    RandomizeEncounters();
	setFunctions();

	// re-enable Event
	SpecialEvents.prototype.initialize = oldEvent;
	App.game.specialEvents.initialize();
	// re-enable Battle.generateNewEnemy
	Battle.generateNewEnemy = oldBattle;
	Battle.generateNewEnemy();
}
function RandomizeEncounters(){
	currentRoute = player.route();
	currentTown = player.town();
	MapHelper.moveToTown(GameConstants.StartingTowns[player.region]);

	for(var region = 0; region < 10; region++){
		//Overwrite Dungeon Pokemon
		Object.keys(TownList).forEach(town => {
			var hasTrainers = false;
			if(TownList[town] instanceof DungeonTown && TownList[town].region == region){
				//Dungeon Encounters & Trainers
				var dungeon = TownList[town].dungeon;
				if(dungeon !== undefined){
					if(dungeon.name !== undefined){
						for(var enemy = 0; enemy < dungeon.enemyList.length; enemy++){
							if(dungeon.enemyList[enemy] instanceof DungeonTrainer){
								hasTrainers = true;
							}
						}
						for(var enemy = 0; enemy < dungeon.enemyList.length; enemy++){
							if(dungeon.enemyList[enemy] instanceof DungeonTrainer){
								for(var poke = 0; poke < dungeon.enemyList[enemy].team.length; poke++){
									dungeon.enemyList[enemy].team[poke].name = getIndexValue(1);
								}
							}
							else{
								if(hasTrainers == true){
									dungeon.enemyList[enemy].pokemon = getIndexValue(0);
								}
								else{
									dungeon.enemyList[enemy] = getIndexValue(0);
								}

							}
						}
					}
					if(dungeon.name !== undefined){
						for(var enemy = 0; enemy < dungeon.bossList.length; enemy++){
							if(dungeon.bossList[enemy] instanceof DungeonTrainer){
								for(var poke = 0; poke < dungeon.bossList[enemy].team.length; poke++){
									dungeon.bossList[enemy].team[poke].name = getIndexValue(1);
								}
							}
							else{
								dungeon.bossList[enemy].name = getIndexValue(0);
							}
						}
					}
				}
			}
		});
		//Overwrite Routes
		var routes = Routes.getRoutesByRegion(region);
		for(var y = 0; y < routes.length; y++){
			//Land encounters
			for(var poke = 0; poke < routes[y].pokemon.land.length; poke++){
				routes[y].pokemon.land[poke] = getIndexValue(0);
			}
			//Headbutt encounters
			for(var poke = 0; poke < routes[y].pokemon.headbutt.length; poke++){
				routes[y].pokemon.headbutt[poke] = getIndexValue(0);
			}
			//Water encounters
			for(var poke = 0; poke < routes[y].pokemon.water.length; poke++){
				routes[y].pokemon.water[poke] = getIndexValue(0);
			}
			//Special encounters
			for(var poke = 0; poke < routes[y].pokemon.special.length; poke++){
				routes[y].pokemon.special[poke] = getIndexValue(0);
			}
		}
	}
	//Overwrite Eggs
	var eggArray = [];
	Object.keys(App.game.breeding.hatchList).every(eggs => eggArray.push(App.game.breeding.hatchList[eggs]));
	for(var x = 0; x < eggArray.length; x++){
		for(var y = 0; y < eggArray[x].length; y++){
			for(var z = 0; z < eggArray[x][y].length; z++){
				App.game.breeding.hatchList[x][y][z] = getIndexValue(0);
			}
		}
	}
	UpdateEggs();
	//Move player to starting town and back
	UpdateAreas();
}
function UpdateEggs(){
	//Update Eggs
	for(var x = 1; x < 8; x++){
		var queryString = "#breeding-eggs > ul > li:nth-child(" + x + ") > knockout > knockout";
		var queryStringEgg = "#breeding-eggs > ul > li:nth-child(" + x + ") > span";
		var hatcheryEgg = document.querySelector(queryString);
		if(hatcheryEgg !== null){
			var typeEggU = document.querySelector(queryStringEgg).innerText.split(" ")[0];
			typeEggU = typeEggU.charAt(0).toUpperCase() + typeEggU.slice(1) + '_egg';
			switch(ItemList[typeEggU].getCaughtStatus()){
				case 0:
					document.querySelector(queryString).innerHTML = "<img title=\"You have captured this Pokémon shiny!\" class=\"pokeball-smallest\" src=\"assets/images/pokeball/None.svg\">";
					break;
				case 1:
					document.querySelector(queryString).innerHTML = "<img title=\"You have captured this Pokémon!\" class=\"pokeball-smallest\" src=\"assets/images/pokeball/Pokeball.svg\">";
					break;
				case 2:
					document.querySelector(queryString).innerHTML = "<img title=\"You have captured this Pokémon shiny!\" class=\"pokeball-smallest\" src=\"assets/images/pokeball/Pokeball-shiny.svg\">";
					break;
			}
		}
	}
}
function UpdateAreas(){
	//Move across the routes
	for(var x = 0; x < Routes.getRoutesByRegion(0).length; x++){
		MapHelper.moveToRoute(Routes.getRoutesByRegion(0)[x].number, player.region);
	}
	//Move across the dungeons
	Object.keys(TownList).forEach(town => {
		if(TownList[town].region == player.region){
			MapHelper.moveToTown(TownList[town].name);
			}
		});
	//Move back to where you were
	if(currentRoute == 0){
		MapHelper.moveToTown(currentTown.name);
	}
	else{
		MapHelper.moveToRoute(currentRoute, player.region);
	}
}
function declareRandomizer(){
	//
	if(localStorage[`randomPokemonWild${Save.key}`] == null && localStorage[`randomPokemonTrainer${Save.key}`] == null){
		for(var x = 0; x < 2000; x++){
			getRandomPokemon();
		}
		localStorage[`randomPokemonWild${Save.key}`] = JSON.stringify(selectedPokemonWild);
		for(var x = 0; x < 2000; x++){
			getRandomTrainerPokemon();
		}
		localStorage[`randomPokemonTrainer${Save.key}`] = JSON.stringify(selectedPokemonTrainer);
		localStorage.setItem(`randomPokemonTrainer${Save.key}`, JSON.stringify(selectedPokemonTrainer));
		localStorage.setItem(`randomPokemonWild${Save.key}`, JSON.stringify(selectedPokemonWild));

	}
	else{
		selectedPokemonWild = JSON.parse(localStorage[`randomPokemonWild${Save.key}`] || '[]');
		selectedPokemonTrainer = JSON.parse(localStorage[`randomPokemonTrainer${Save.key}`] || '[]');
	}
}
var currentRoute = "";
var currentTown = "";
var alreadyRolledPokemon = [];
var selectedPokemonWild = [];
var selectedPokemonTrainer = [];
var selectedPokemonWildIndex = -1;
var selectedPokemonTrainerIndex = -1;
function getRandomTrainerPokemon(){
	var availablePokemon = pokemonList;
	var encounter = Rand.fromArray(availablePokemon);
	selectedPokemonTrainer.push(encounter.name);
	return encounter.name;
}
function getRandomPokemon(){
	var availablePokemon = pokemonList.filter((poke) => {
		if(alreadyRolledPokemon.includes(poke.name)){
			return false;
		}
		return true;
	});
	if(availablePokemon.length > 0){
		var encounter = Rand.fromArray(availablePokemon);
		alreadyRolledPokemon.push(encounter.name);
		selectedPokemonWild.push(encounter.name);
	}
	if(alreadyRolledPokemon.length == pokemonList.length){
		alreadyRolledPokemon = [];
	}
	return encounter.name;
}
function getIndexValue(arrayType){
	if(arrayType == 0){
		//Wild Pokemon
		selectedPokemonWildIndex++;
		if(selectedPokemonWildIndex == selectedPokemonWild.length){
			selectedPokemonWildIndex = 0;
		}
		return selectedPokemonWild[selectedPokemonWildIndex];
	}
	else{
		//Trainer Pokemon
		selectedPokemonTrainerIndex++;
		if(selectedPokemonTrainerIndex == selectedPokemonTrainer.length){
			selectedPokemonTrainerIndex = 0;
		}
		return selectedPokemonTrainer[selectedPokemonTrainerIndex];
	}
}

function setFunctions(){
	//Pokedex List
	PokedexHelper.getList = function() {
        const filter = PokedexHelper.getFilters();
        const highestEncountered = App.game.statistics.pokemonEncountered.highestID;
        const highestDefeated = App.game.statistics.pokemonDefeated.highestID;
        const highestCaught = App.game.statistics.pokemonCaptured.highestID;
        const highestDex = Math.max(highestEncountered, highestDefeated, highestCaught);
        return pokemonList.filter((pokemon) => {
            // Checks based on caught/shiny status
            const alreadyCaught = App.game.party.alreadyCaughtPokemon(pokemon.id);
            const alreadyCaughtShiny = App.game.party.alreadyCaughtPokemon(pokemon.id, true);
            // If the Pokemon shouldn't be unlocked yet
            const nativeRegion = PokemonHelper.calcNativeRegion(pokemon.name);
            if (nativeRegion > 9) {
                return false;
            }
            // If not showing this region
            const region = filter['region'] ? parseInt(filter['region'], 10) : null;
            if (region != null && region != nativeRegion) {
                return false;
            }
            // If we haven't seen a pokemon this high yet
            if (pokemon.id > highestDex) {
                return false;
            }
            // Check if the name contains the string
            if (filter['name'] && !pokemon.name.toLowerCase().includes(filter['name'].toLowerCase().trim())) {
                return false;
            }
            // Check if either of the types match
            const type1 = filter['type1'] ? parseInt(filter['type1'], 10) : null;
            const type2 = filter['type2'] ? parseInt(filter['type2'], 10) : null;
            if ([type1, type2].includes(PokemonType.None)) {
                const type = (type1 == PokemonType.None) ? type2 : type1;
                if (!PokedexHelper.isPureType(pokemon, type)) {
                    return false;
                }
            }
            else if ((type1 != null && !pokemon.type.includes(type1)) || (type2 != null && !pokemon.type.includes(type2))) {
                return false;
            }
            // Only uncaught
            if (filter['caught-shiny'] == 'uncaught' && alreadyCaught) {
                return false;
            }
            // All caught
            if (filter['caught-shiny'] == 'caught' && !alreadyCaught) {
                return false;
            }
            // Only caught not shiny
            if (filter['caught-shiny'] == 'caught-not-shiny' && (!alreadyCaught || alreadyCaughtShiny)) {
                return false;
            }
            // Only caught shiny
            if (filter['caught-shiny'] == 'caught-shiny' && !alreadyCaughtShiny) {
                return false;
            }
            // Only pokemon with a hold item
            if (filter['held-item'] && !BagHandler.displayName(pokemon.heldItem)) {
                return false;
            }
            return true;
        });
    }
	//Move to Region
	MapHelper.ableToTravel = function() {
        var _a, _b;
        // If player already reached highest region, they can't move on
        if (player.highestRegion() >= GameConstants.MAX_AVAILABLE_REGION) {
            return false;
        }
        // Check if player doesn't require complete dex to move on to the next region and has access to next regions starter town
        if (!App.game.challenges.list.requireCompletePokedex.active()) {
            return (_b = (_a = TownList[GameConstants.StartingTowns[player.highestRegion() + 1]]) === null || _a === void 0 ? void 0 : _a.isUnlocked()) !== null && _b !== void 0 ? _b : false;
        }
        // Check if Champion of Region
		if(App.game.badgeCase.badgeCount() == (player.highestRegion() + 1) * 13){
			return true;
		}
		else{
			return false;
		}
    }
	//Shiny Code
	App.game.redeemableCodes.codeList[1].rewardFunction = function(){
		const pokemon = pokemonMap.randomRegion(9);
		App.game.party.gainPokemonById(pokemon.id, true, true);
	}
}
