/*

controller = require('FiveCardDrawController.js');

on message()
validate input with controller, which calls
Model.players[player].action();
this returns progress.
models data is stored in model object exclusively, which is saved in main file
model.respond(player, input); sets off the 

validate input in controller, send generic message string which view sends to steam

*/

module.exports = FiveCardDraw;

var Model = require('./FiveCardDrawModel.js');
var View = require('./FiveCardDrawView.js');
var Controller = require('./FiveCardDrawController.js');

function FiveCardDraw(bot) {
	this.bot = bot;
	this.view = new View(this.bot);
	this.model = new Model(this.view);
	this.controller = new Controller(this.model);
}

FiveCardDraw.prototype.evaluateInput = function(id, message, type, chatter) {
	this.controller.evaluateInput(id, message, type, chatter);
};

FiveCardDraw.prototype.addPlayer = function(id) {
	this.model.addPlayer(id)
}

FiveCardDraw.prototype.startGame = function() {
	this.model.newRound();
}
