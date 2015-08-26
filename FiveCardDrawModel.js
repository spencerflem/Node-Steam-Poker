//Thank you http://codereview.stackexchange.com/questions/71630/simple-poker-game I based much of this off of your code

var veiw = require('FiveCardDrawVeiw');

function Game() {
	this.deck = new Deck();
	this.dealerPos = 0;
	this.turnPos = 0;
	this.players = {};
	this.awaitingPlayers = {};
}

Game.prototype.newRound() {
	for (var i = 0; i < Object.keys(this.awaitingPlayers).length; i ++) {
		this.players[Object.keys(this.awaitingPlayers)[i]] = this.awaitingPlayers[Object.keys(this.awaitingPlayers)[i]];
	}
	
	this.deck = new Deck();
	
	this.dealerPos = (this.dealerPos + 1) % Object.keys(this.players).length;
	this.turnPos = (this.dealerPos + 1) % Object.keys(this.players).length;
	
	for (var i =0; i < Object.keys(this.players).length; i++) {
		this.players[Object.keys(this.players)[i]].reset();
	}
	
	for (var i =0; i < Object.keys(this.players).length; i++) {
		for (var j=0; j<5; j++) {
			this.players[Object.keys(this.players)].hand[j] = this.deck.deal();
		}
		this.players[Object.keys(this.players)].updateVeiw();
	}
	
}

Game.prototype.addPlayer = function(id) {
	var newPlayer = new Player(id);
	newPlayer.game = this;
	this.awaitingPlayers[id] = newPlayer;
}

Game.prototype.nextTurn() {
	for(i=0; i < Object.keys(this.players).length;i++) {
		targetedPlayer = this.players[Object.keys(this.players)[(this.turnPos + 1 + i) % Object.keys(this.players).length]];
		if(targetedPlayer.canPlay && targetedPlayer.mustAct) {
			this.turnPos = this.turnPos + 1 + i;
			return;
		}
	}
	this.showdown()
	return;
}

Game.prototype.getHighestBet() {
	var highestBet = 0;
	for(i=0; i < Object.keys(this.players).length;i++) {
		if (this.players[Object.keys(this.players)[i]].amountBet > higestBet) {
			highestBet = this.players[Object.keys(this.players)[i]].amountBet;
		}
	}
	return highestBet;
}

Game.prototype.getPots() { //Array of Pot objects that fill up one after the next
	//playername, max size, current size
	var pot = 0;
	for(i=0; i < Object.keys(this.players).length;i++) {
		pot += Object.keys(this.players)[i].amountBet;
	}
	return pot;
}

Game.prototype.requireAction() {
	for(i=0; i < Object.keys(this.players).length;i++) {
		this.players[Object.keys(this.players)[i]].mustAct = true;
	}
}

Game.prototype.showdown() {
	//if all checks?
	//SHOWDOWN HERE
	//show or not show hand
	//what hand comparator to use?
}

//Player object definitions
	
function Player(id) {
		this.id = id;
		this.game = null;
		this.hand = [];
		this.wallet = 0;
		this.canPlay = true;
		this.mustAct = true;
		this.amountBet = 0;
};

Player.prototype.getHandValue() {
	//TODO
}

Player.prototype.isCurrentPlayer() {
	if (this.game.players[ Object.keys(this.game.players)[this.game.turnPos] ] === this) { return true; }
	else { return false; }
}

Player.prototype.getAmountToCall() {
	return this.game.getHighestBet() - this.amountBet; //SIDE POT? -- MANDATORY!
}

Player.prototype.canAllIn() {
	if(this.isCurrentPlayer() && this.wallet >= this.getAmountToCall()) { return true; }
	else { return false; }
}

Player.prototype.canBet() {
	if(this.isCurrentPlayer() && this.game.getHighestBet() === 0) { return true; }
	else { return false; }
}

Player.prototype.canCheck() {
	if(this.isCurrentPlayer() && this.game.getHighestBet() === 0) { return true; }
	else { return false; }
}

Player.prototype.canRaise() {
	if(this.isCurrentPlayer() && this.wallet > this.getAmountToCall() && this.game.getHighestBet() > 0) { return true; }
	else { return false; }
}

Player.prototype.canCall() {
	if(this.isCurrentPlayer() && this.wallet > this.getAmountToCall() && this.game.getHighestBet() > 0) { return true; } //Can ALWAYS CALL (sidepots)
	else { return false; }
}

Player.prototype.canFold() {
	if(this.isCurrentPlayer()) { return true; }
	else { return false; }
}

Player.prototype.updateVeiw() {
	veiw.updateVeiw(this);
}

Player.prototype.reset() {
	this.hand = [];
	this.canPlay = true;
	this.mustAct = true;
	this.amountBet = 0;
}

Player.prototype.allin() {
	this.canPlay = false;
	if (this.wallet === this.game.getHighestBet) {
		//if it is a call (if faulty - sidepots - visalize?)
	}
	else {
		this.raise(this.wallet);
	}
}

Player.prototype.bet(amount) {
	this.raise(amount);
}

Player.prototype.check() {
	this.call();
}

Player.prototype.raise(amount) {
	this.mustAct = false;
	this.wager(this.game.getHighestBet() - this.amountBet + amount);
	this.game.requireAction();
	this.updateView();
	this.game.nextTurn();// should this be where updateVeiw/next turn goes?
}

Player.prototype.call() {
	this.mustAct = false;
	this.wager(this.game.getHighestBet() - this.amountBet);
	this.updateView();
	this.game.nextTurn();
}

Player.prototype.fold() {
	this.canPlay = false;
	this.updateView();
	this.game.nextTurn();
}

Player.prototype.wager(amount) {
	this.wallet -= amount;
	this.amountBet += amount;
}

//DECL PROTOTYPES!