//Thank you http://codereview.stackexchange.com/questions/71630/simple-poker-game I based much of this off of your code

var View = require('./FiveCardDrawView.js'); //CHECK SPELLING VIEW VS VIEW
var view = new View();
//Put Object.keys() in variables?


//Replace players with array and get by name?

////console.log -> winston.log

//ENSURE PLAYERS CAN CHECK OR BET AND RETURN ERROR SOMEHOW!!!!!!!!!
//SEND ERRORS TO VIEW!

module.exports = Game;

evaluator = require('poker-evaluator');

function Game() {
	this.deck = new Deck();
	this.dealerPos = 0;
	this.turnPos = 0;
	this.players = {};
	this.awaitingPlayers = {};
}

Game.prototype.newRound = function() {
	
	//console.log("NEW ROUND!");
	
	var awaitingPlayersKeys = Object.keys(this.awaitingPlayers);
	for (var i=0; i < awaitingPlayersKeys.length; i++) {
		awaitingPlayerKey = awaitingPlayersKeys[i];
		awaitingPlayer = this.awaitingPlayers[awaitingPlayerKey];
		this.players[awaitingPlayerKey] = awaitingPlayer;
		delete this.awaitingPlayers[awaitingPlayerKey];
		
	}
	
	var playersKeys = Object.keys(this.players);
	for (var i=0; i < playersKeys.length; i ++) {
		currentPlayerKey = playersKeys[i];
		currentPlayer = this.players[currentPlayerKey];
		//console.log(currentPlayer.id + "-" + currentPlayer.wallet)
		if (currentPlayer.wallet === 0) {
			this.awaitingPlayers[currentPlayerKey] = currentPlayer;
			delete this.players[currentPlayerKey];
		}
	}
	
	this.deck = new Deck();
	
	this.dealerPos = (this.dealerPos + 1) % Object.keys(this.players).length;
	this.turnPos = (this.dealerPos + 1) % Object.keys(this.players).length;
	
	for (var i =0; i < Object.keys(this.players).length; i++) {
		this.players[Object.keys(this.players)[i]].reset();
	}
	//todo objkeys
	for (var i =0; i < Object.keys(this.players).length; i++) {
		for (var j=0; j<5; j++) {
			this.players[Object.keys(this.players)[i]].hand[j] = this.deck.deal();
		}
		this.players[Object.keys(this.players)[i]].updateView();
	}
	
	this.requireAction();
};

Game.prototype.addPlayer = function(id) {
	var newPlayer = new Player(id);
	newPlayer.game = this;
	newPlayer.wallet = 100;
	this.awaitingPlayers[id] = newPlayer;
};

Game.prototype.getPlayerByID = function(id) {
	//TODO?
}

Game.prototype.nextTurn = function() {
	var playerKeys = Object.keys(this.players);
	for(i=0; i < playerKeys.length; i++) {
		newTurnPos = (this.turnPos + 1 + i) % Object.keys(this.players).length;
		targetedPlayer = this.players[playerKeys[newTurnPos]];
		if(targetedPlayer.canPlay && targetedPlayer.mustAct) {
			this.turnPos = newTurnPos;
			//console.log("it is " + this.players[playerKeys[this.turnPos]].id + "'s turn")
			return;
		}
	}
	//console.log("to showdown");
	this.showdown();
	return;
};

Game.prototype.getHighestBet = function() {
	var highestBet = 0;
	for(i=0; i < Object.keys(this.players).length;i++) {
		if (this.players[Object.keys(this.players)[i]].amountBet > highestBet) {
			highestBet = this.players[Object.keys(this.players)[i]].amountBet;
		}
	}
	return highestBet;
};

Game.prototype.getPot = function() {
	var pot = 0;
	for(i=0; i < Object.keys(this.players).length; i++) {
		pot += this.players[Object.keys(this.players)[i]].amountBet;
	}
	return pot;
};

Game.prototype.requireAction = function() {
	for(i=0; i < Object.keys(this.players).length;i++) {
		this.players[Object.keys(this.players)[i]].mustAct = true;
	}
};

Game.prototype.showdown = function() {
	//console.log("SHOWDOWN!")
	//console.log(this.getPot());
	while (this.getPot() > 0) {
		//console.log(this.getPot())
		var highestAmount = -5;
		var highestPlayer = null;
		for (var i=0; i < Object.keys(this.players).length; i++) {
			currentPlayer = this.players[Object.keys(this.players)[i]];
			currentAmount = currentPlayer.getHandValue();
			//console.log("currentPlayer: " + currentPlayer.id + "   currentAmount: " + currentAmount);
			if (currentAmount > highestAmount && currentPlayer.canWin === true) {
				highestAmount = currentAmount;
				highestPlayer = currentPlayer;
			}
		}
		highestPlayerAmountBet = highestPlayer.amountBet;
		//console.log(highestPlayer.id + " WINS!!!!!1!!")
		for(var i=0; i < Object.keys(this.players).length; i++) {
			currentPlayer = this.players[Object.keys(this.players)[i]];
			if (currentPlayer.amountBet > highestPlayerAmountBet) {
				//console.log("currentPlayer: " + currentPlayer.id + " = " + currentPlayer.amountBet + " --- highestPlayer: " + highestPlayer.id + " = " + highestPlayer.amountBet);
				amountToGain = highestPlayer.amountBet;
				highestPlayer.wallet += amountToGain;
				currentPlayer.amountBet -= amountToGain;
				//console.log(highestPlayer.id + " has " + highestPlayer.wallet);
			}
			else {
				//console.log("CurrentPlayer: " + currentPlayer.id + " = " + currentPlayer.amountBet + " --- highestPlayer: " + highestPlayer.id + " = " + highestPlayer.amountBet);
				//console.log(highestPlayer.id + " has " + highestPlayer.wallet);
				amountToGain = currentPlayer.amountBet;
				//console.log("snatching " + amountToGain);
				highestPlayer.wallet += amountToGain;
				currentPlayer.amountBet -= amountToGain;
				//console.log(highestPlayer.id + " now has " + highestPlayer.wallet);
			}	
		}
		//controll.allowPlayersToShowOrNot
		//view.whateverBs
		view.updateView
		this.newRound();
	}
};
	
function Player(id) {
		this.id = id;
		this.game = null;
		this.hand = [];
		this.wallet = 0;
		this.canPlay = true; //make function, add isFolded and isAllin?
		this.mustAct = true;
		this.amountBet = 0;
		this.canWin = true;
}

Player.prototype.getHandValue = function() {
	return evaluator.evalHand(this.hand).value; //why 0?
};

Player.prototype.isCurrentPlayer = function() {
	if (this.game.players[ Object.keys(this.game.players)[this.game.turnPos] ] === this) { return true; }
	else { return false; }
};

Player.prototype.getAmountToCall = function() {
	return this.game.getHighestBet() - this.amountBet; //SIDE POT? -- MANDATORY!
};

Player.prototype.canAllin = function() {
	if(this.isCurrentPlayer()) { return true; }
	else { return false; }
};

Player.prototype.canBet = function() {
	if(this.isCurrentPlayer() && this.game.getHighestBet() === 0) { return true; }
	else { return false; }
};

Player.prototype.canCheck = function() {
	if(this.isCurrentPlayer() && this.game.getHighestBet() === 0) { return true; }
	else { return false; }
};

Player.prototype.canRaise = function() {
	if(this.isCurrentPlayer() && this.wallet > this.getAmountToCall() && this.game.getHighestBet() > 0) { return true; }
	else { return false; }
};

Player.prototype.canCall = function() {
	if(this.isCurrentPlayer() && this.wallet > this.getAmountToCall() && this.game.getHighestBet() > 0) { return true; }
	else { return false; }
};

Player.prototype.canFold = function() {
	if(this.isCurrentPlayer()) { return true; }
	else { return false; }
};

Player.prototype.updateView = function() {
	view.updateView(this);
};

Player.prototype.reset = function() {
	this.hand = [];
	this.canPlay = true;
	this.mustAct = true;
	this.amountBet = 0;
	this.canWin = true;
};

Player.prototype.bet = function(amount) {
	//console.log(this.id + " bet " + amount);
	this.wager(amount);
	this.game.requireAction();
	this.mustAct = false;
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.check = function() {
	//console.log(this.id + " checked");
	this.mustAct = false;
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.allin = function() {
	//console.log(this.id + " went all in");
	if(this.wallet > this.game.getHighestBet()) {
		this.game.requireAction();
	}
	this.canPlay = false;
	this.mustAxt = false;
	this.wager(this.wallet);
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.raise = function(amount) {
	//console.log(this.id + " raised " + amount);
	this.wager(this.game.getHighestBet() - this.amountBet + amount);
	this.game.requireAction();
	this.mustAct = false;
	
	this.game.nextTurn();// should this be where updateView/next turn goes?	Why not?
	this.updateView();

};

Player.prototype.call = function() {
	//console.log(this.id + " called");
	this.mustAct = false;
	this.wager(this.game.getHighestBet() - this.amountBet);
	
	this.game.nextTurn();
	this.updateView();

};

Player.prototype.fold = function() {
	//console.log(this.id + " folded");
	this.canPlay = false;
	this.mustAct = false;
	this.canWin = false;
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.wager = function(amount) {
	//console.log(this.id + " wagered " + amount);
	this.wallet -= amount;
	this.amountBet += amount;
};

function Deck() {
	this.suits = ['d','h','s','c'];
	this.ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
	this.cards = [];
	
	this.init();
	this.shuffle();
}

Deck.prototype.init = function() {
	for (var i =0;i<this.suits.length; i++) {
		for (var j=0; j<this.ranks.length; j++) {
			this.cards.push(this.ranks[j] + this.suits[i]);
		}
	}
};

Deck.prototype.shuffle = function() {
	var currentIndex = this.cards.length;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		
		temp = this.cards[currentIndex];
		this.cards[currentIndex] = this.cards[randomIndex];
		this.cards[randomIndex] = temp;
	}
};

Deck.prototype.deal = function() {
	return this.cards.pop();
};