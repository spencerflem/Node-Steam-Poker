//Thank you http://codereview.stackexchange.com/questions/71630/simple-poker-game I based much of this off of your code

var View = require('./FiveCardDrawView.js'); //CHECK SPELLING VIEW VS VIEW
var view = new View();

////console.log -> winston.log

//when is veiw invoked? Crashes!

//ENSURE PLAYERS CAN CHECK OR BET AND RETURN ERROR SOMEHOW!!!!!!!!!
//SEND ERRORS TO VIEW!

module.exports = Game;

evaluator = require('poker-evaluator');

function Game() {
	this.deck = new Deck();
	this.dealerPos = 0;
	this.turnPos = 0;
	this.players = [];
	this.awaitingPlayers = [];
}

Game.prototype.newRound = function() {
	
	allPlayers = this.players.concat(this.awaitingPlayers);
	newPlayers = [];
	newAwaitingPlayers = [];
	
	for(var i=0; i < allPlayers.length; i++) {
		if (allPlayers[i].wallet > 0) {
			newPlayers.push(allPlayers[i]);
		} else {
			newAwaitingPlayers.push(allPlayers[i])
		}
	}
	this.players = newPlayers;
	this.awaitingPlayers = newAwaitingPlayers;
	
	this.deck = new Deck();
	
	this.dealerPos = (this.dealerPos + 1) % this.players.length;
	this.turnPos = (this.dealerPos + 1) % this.players.length;
	
	for(var i =0; i < this.players.length; i++) {
		this.players[i].reset();
	}

	for(var i =0; i < this.players.length; i++) {
		for(var j=0; j<5; j++) {
			this.players[i].hand[j] = this.deck.deal();
		}
		this.players[i].updateView();
	}
	
	this.requireAction();
};

Game.prototype.addPlayer = function(id) {
	var newPlayer = new Player(id);
	newPlayer.game = this;
	newPlayer.wallet = 100;
	this.awaitingPlayers.push(newPlayer);
};

Game.prototype.getPlayerByID = function(id) {
	Player = this.players.filter(function(Player) {
		if(Player.id === id) {
			return true;
		} else {
			return false;
		}
	})[0];
	return Player;
}

Game.prototype.nextTurn = function() {
	for(i=0; i < this.players.length; i++) {
		newTurnPos = (this.turnPos + 1 + i) % this.players.length;
		targetedPlayer = this.players[newTurnPos];
		if(targetedPlayer.canPlay && targetedPlayer.mustAct) {
			this.turnPos = newTurnPos;
			return;
		}
	}
	this.showdown();
	return;
};

Game.prototype.getHighestBet = function() {
	var highestBet = 0;
	for(i=0; i < this.players.length;i++) {
		if (this.players[i].amountBet > highestBet) {
			highestBet = this.players[i].amountBet;
		}
	}
	return highestBet;
};

Game.prototype.getPot = function() {
	var pot = 0;
	for(i=0; i < this.players.length; i++) {
		pot += this.players[i].amountBet;
	}
	return pot;
};

Game.prototype.requireAction = function() {
	for(i=0; i < this.players.length;i++) {
		this.players[i].mustAct = true;
	}
};

Game.prototype.showdown = function() {
	while (this.getPot() > 0) {
		var highestAmount = -1;
		var highestPlayer = null;
		for (var i=0; i < this.players.length; i++) {
			currentPlayer = this.players[i];
			currentAmount = currentPlayer.getHandValue();
			if (currentAmount > highestAmount && currentPlayer.canWin === true) {
				highestAmount = currentAmount;
				highestPlayer = currentPlayer;
			}
		}
		highestPlayerAmountBet = highestPlayer.amountBet;
		for(var i=0; i < this.players.length; i++) {
			currentPlayer = this.players[i];
			if (currentPlayer.amountBet > highestPlayerAmountBet) {
				amountToGain = highestPlayer.amountBet;
			} else {
				amountToGain = currentPlayer.amountBet;
			}
			highestPlayer.wallet += amountToGain;
			currentPlayer.amountBet -= amountToGain;	
		}
		//controll.allowPlayersToShowOrNot
		//view.whateverBs
		view.updateView();
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
	if (this.game.players[this.game.turnPos] === this) { return true; }
	else { return false; }
};

Player.prototype.getAmountToCall = function() {
	return this.game.getHighestBet() - this.amountBet;
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
	this.wager(amount);
	this.game.requireAction();
	this.mustAct = false;
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.check = function() {
	this.mustAct = false;
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.allin = function() {
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
	this.wager(this.game.getHighestBet() - this.amountBet + amount);
	this.game.requireAction();
	this.mustAct = false;
	
	this.game.nextTurn();// should this be where updateView/next turn goes?	Why not?
	this.updateView();

};

Player.prototype.call = function() {
	this.mustAct = false;
	this.wager(this.game.getHighestBet() - this.amountBet);
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.fold = function() {
	this.canPlay = false;
	this.mustAct = false;
	this.canWin = false;
	
	this.game.nextTurn();
	this.updateView();
};

Player.prototype.wager = function(amount) {
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