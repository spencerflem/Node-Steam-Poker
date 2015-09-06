//Thank you http://codereview.stackexchange.com/questions/71630/simple-poker-model I based much of this off of your code
//all view to be done with FiveCardDraw.js and returns?

//LOGGING! HOW?!
//Send logger instance to all?


// VALIDATE!!!!!


//ENSURE PLAYERS CAN CHECK OR BET AND RETURN ERROR SOMEHOW!!!!!!!!!
//SEND ERRORS TO VIEW!
//here or in input or both?

module.exports = Model;

evaluator = require('poker-evaluator');

function Model(view) {
	this.view = view;
	this.deck = new Deck();
	this.dealerPos = 0;
	this.turnPos = 0;
	this.players = [];
	this.awaitingPlayers = [];
}

Model.prototype.useInputs = function(inputs, id, message, type, chatter) {
	var actingPlayer;
	console.log(inputs + "----" + id + "-s-s-s-" + chatter);
	if (typeof(chatter) === 'undefined') {
		actingPlayer = this.getPlayerByID(id);
	}
	else {
		actingPlayer = this.getPlayerByID(chatter);
	}
	console.log(actingPlayer);
	if (typeof(actingPlayer) !== 'undefined') {
		console.log(actingPlayer.id);
		if(inputs.commands.length > 1) {
			this.view.displayError('toomanyinputs');
		}
		else {
			if (inputs.commands[0] === "CHECK") {
				actingPlayer.check();
			}
			else if (inputs.commands[0] === "CALL") {
				actingPlayer.call();
			}
			else if (inputs.commands[0] === "ALL IN") {
				actingPlayer.allin();
			}
			else if (inputs.commands[0] === "FOLD") {
				actingPlayer.fold();
			}
			else if (inputs.commands[0] === "HIT ME") {
				actingPlayer.hitme();
			}
			else {
				if (inputs.amounts.length > 1) {
					this.view.displayError("screwynumbers");
				}
				else if (inputs.amounts.length < 1) {
					this.view.displayError("screwynumbersv2");
				}
				else {
					if (inputs.commands[0] === "RAISE") {
						actingPlayer.raise(inputs.amounts[0]);
					}
					else if (inputs.commands[0] === "BET") {
						actingPlayer.bet(inputs.amounts[0]);
					}
				}
			}
		}
	}
}

Model.prototype.newRound = function() {
	
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
		for(var j=0; j<5; j++) {
			this.players[i].hand[j] = this.deck.deal();
		}
	}

	this.updateAllViews();
	
	this.requireAction();
};

Model.prototype.updateAllViews = function() {
	for(var i =0; i < this.players.length; i++) {
		for(var j=0; j<5; j++) {
			this.players[i].hand[j] = this.deck.deal();
		}
		this.players[i].updateView();
	}
}

Model.prototype.addPlayer = function(id) {
	var newPlayer = new Player(id);
	newPlayer.model = this;
	newPlayer.wallet = 100;
	this.awaitingPlayers.push(newPlayer);
};

Model.prototype.getPlayerByID = function(id) {
	Player = this.players.filter(function(Player) {
		if(Player.id === id) {
			return true;
		} else {
			return false;
		}
	})[0];
	return Player;
}

Model.prototype.nextTurn = function() {
	for(i=0; i < this.players.length; i++) {
		newTurnPos = (this.turnPos + 1 + i) % this.players.length;
		targetedPlayer = this.players[newTurnPos];
		if(targetedPlayer.canPlay && targetedPlayer.mustAct) {
			this.turnPos = newTurnPos;
			this.updateAllViews();
			return;
		}
	}
	this.showdown(); //YES OR NO ROUNDS :D
	return;
};

Model.prototype.getHighestBet = function() {
	var highestBet = 0;
	for(i=0; i < this.players.length;i++) {
		if (this.players[i].amountBet > highestBet) {
			highestBet = this.players[i].amountBet;
		}
	}
	return highestBet;
};

Model.prototype.getPot = function() {
	var pot = 0;
	for(i=0; i < this.players.length; i++) {
		pot += this.players[i].amountBet;
	}
	return pot;
};

Model.prototype.requireAction = function() {
	for(i=0; i < this.players.length;i++) {
		this.players[i].mustAct = true;
	}
};

//show or not before and then update canWin dependently

Model.prototype.showdown = function() {
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
	}
	
	//update view junk
	this.newRound();
};
	
function Player(id) {
		this.id = id;
		this.model = null;
		this.hand = [];
		this.wallet = 0;
		this.canPlay = true; //make function, add isFolded and isAllin? or not?
		this.mustAct = true;
		this.mustDecide = false;
		this.amountBet = 0;
		this.canWin = true;
		//HAVE REQUIRE ACTION CLONE FOR REQUIRE DECISION: VALIDATE ALL INPUTS
}

Player.prototype.getHandValue = function() {
	return evaluator.evalHand(this.hand).value; //why 0?
};

Player.prototype.isCurrentPlayer = function() {
	if (this.model.players[this.model.turnPos] === this) { return true; }
	else { return false; }
};

Player.prototype.getAmountToCall = function() {
	return this.model.getHighestBet() - this.amountBet;
};

Player.prototype.canAllin = function() {
	if(this.isCurrentPlayer()) { return true; }
	else { return false; }
};

Player.prototype.canBet = function() {
	if(this.isCurrentPlayer() && this.model.getHighestBet() === 0) { return true; }
	else { return false; }
};

Player.prototype.canCheck = function() {
	if(this.isCurrentPlayer() && this.model.getHighestBet() === 0) { return true; }
	else { return false; }
};

Player.prototype.canRaise = function() {
	if(this.isCurrentPlayer() && this.wallet > this.getAmountToCall() && this.model.getHighestBet() > 0) { return true; }
	else { return false; }
};

Player.prototype.canCall = function() {
	if(this.isCurrentPlayer() && this.wallet > this.getAmountToCall() && this.model.getHighestBet() > 0) { return true; }
	else { return false; }
};

Player.prototype.canFold = function() {
	if(this.isCurrentPlayer()) { return true; }
	else { return false; }
};

Player.prototype.updateView = function() {
	this.model.view.updateView(this);
};

Player.prototype.reset = function() {
	this.hand = [];
	this.canPlay = true;
	this.mustAct = true;
	this.amountBet = 0;
	this.canWin = true;
	this.mustDecide = false;
};

Player.prototype.bet = function(amount) {
	//this.model.view.acnowledgeAction();
	console.log("BET");
	this.wager(amount);
	this.model.requireAction();
	this.mustAct = false;
	
	this.model.nextTurn();
	this.updateView();
};

Player.prototype.check = function() {
	console.log("CHECK");
	this.mustAct = false;
	
	this.model.nextTurn();
	this.updateView();
};

Player.prototype.allin = function() {
	console.log("ALLIN");
	if(this.wallet > this.model.getHighestBet()) {
		this.model.requireAction();
	}
	this.canPlay = false;
	this.mustAxt = false;
	this.wager(this.wallet);
	
	this.model.nextTurn();
	this.updateView();
};

Player.prototype.raise = function(amount) {
	console.log("RAISE");
	this.wager(this.model.getHighestBet() - this.amountBet + amount);
	this.model.requireAction();
	this.mustAct = false;
	
	this.model.nextTurn();// should this be where updateView/next turn goes?	Why not?
	this.updateView();

};

Player.prototype.call = function() {
	console.log("CALL");
	this.mustAct = false;
	this.wager(this.model.getHighestBet() - this.amountBet);
	
	this.model.nextTurn();
	this.updateView();
};

Player.prototype.fold = function() {
	console.log("FOLD");
	this.canPlay = false;
	this.mustAct = false;
	this.canWin = false;
	
	this.model.nextTurn();
	this.updateView();
};

Player.prototype.wager = function(amount) {
	this.wallet -= amount;
	this.amountBet += amount;
};

Player.prototype.agree = function() {
	//DO SOMETHING
}

Player.prototype.disagree = function() {
	//DO SOMETHING
}

Player.prototype.hitme = function() {
	this.wallet += 10;
}

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