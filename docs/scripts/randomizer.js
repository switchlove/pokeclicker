//Test
var hasRan = 0;

window.addEventListener("load", function() {
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
}
function RandomizeEncounters(){
	currentRoute = player.route();
	currentTown = player.town();
	MapHelper.moveToTown(GameConstants.StartingTowns[player.region]);
	
	for(var region = 0; region < 10; region++){
		//Overwrite Dungeon Pokemon
		Object.keys(TownList).forEach(town => {
			if(TownList[town] instanceof DungeonTown && TownList[town].region == region){
				//Dungeon Encounters & Trainers
				var dungeon = TownList[town].dungeon;
				if(dungeon !== undefined){
					if(dungeon.name !== undefined){
						for(var enemy = 0; enemy < dungeon.enemyList.length; enemy++){
							if(dungeon.enemyList[enemy] instanceof DungeonTrainer){
								for(var poke = 0; poke < dungeon.enemyList[enemy].team.length; poke++){
									dungeon.enemyList[enemy].team[poke].name = getIndexValue(1);
								}
							}
							else{
								dungeon.enemyList[enemy].pokemon = getIndexValue(0);
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