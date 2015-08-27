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
var game = new Game;

game.addPlayer("Lloyd");
game.addPlayer("Frank");
game.addPlayer("Carl");

game.newRound();


fs.writeFile('./LOGS/Lloyd.txt', JSON.stringify(game.awaitingPlayers["Lloyd"], null, 4));
fs.writeFile('./LOGS/Frank.txt', JSON.stringify(game.awaitingPlayers["Frank"], null, 4));
fs.writeFile('./LOGS/Carl.txt', JSON.stringify(game.awaitingPlayers["Carl"], null, 4));

var iter = 0;
var go = true;
while (go) {
	console.log("Before:  Lloyd:" + game.players.Lloyd.wallet + "   Frank:" + game.players.Frank.wallet + "   Carl:" + game.players.Carl.wallet);
	game.players["Lloyd"].check();
	game.players["Frank"].bet(20);
	game.players["Carl"].call();

	game.players["Lloyd"].raise(20);
	game.players["Frank"].call();
	game.players["Carl"].fold();
	
	console.log("After:  Lloyd:" + game.players.Lloyd.wallet + "   Frank:" + game.players.Frank.wallet + "   Carl:" + game.players.Carl.wallet + "\n");
	iter++;
	if (iter === 5) {
		go = false;
	}
}

