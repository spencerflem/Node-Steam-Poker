/*

controller = require('FiveCardDrawController.js');

on message()
validate input with controller, which calls
Game.players[player].action();
this returns progress.
models data is stored in game object exclusively, which is saved in main file
game.respond(player, input); sets off the 

validate input in controller, senr generic message string which veiw sends to steam

*/

var Game = require('./FiveCardDrawModel.js');
var fs = require('fs');
var game = new Game();

console.log("=====================================");

game.addPlayer("Lloyd");
game.addPlayer("Frank");
game.addPlayer("Carl");

game.newRound();


var iter = 0;
var go = true;

while (go) {
	
	//console.log(game.players[Object.keys(game.players)[game.turnPos]].id);
	game.players["Carl"].allin();
	//console.log(game.players[Object.keys(game.players)[game.turnPos]].id);
	game.players["Lloyd"].call();
	//console.log(game.players[Object.keys(game.players)[game.turnPos]].id);
	game.players["Frank"].call();
	
	////console.log("After:  Lloyd:" + game.players.Lloyd.wallet + "   Frank:" + game.players.Frank.wallet + "   Carl:" + game.players.Carl.wallet + "\n");
	iter++;
	if (iter === 1) {
		go = false;
	}
}

