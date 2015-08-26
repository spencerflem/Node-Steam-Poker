/// Invigorating Imports

var _ = require('lodash'); //Not necessary? //so?
var fs = require('fs')

/// Sumptuous Variables

var data = {};
var roomData = {};
var playerData = {};
playerData.hi = 'HI';

/// Delectable Settings


/// Useful Functions

/*

var symbolNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var symbolSuits = ['♣', '♦', '♥', '♠'];
var wordNumbers = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];
var wordSuits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

function setupLookup(numbers, suits) {
	var tempLookup = [];
	for (var i=0; i<numbers.length; i++) {
		for (var j=0; j<suits.length; j++) {
			tempLookup.push([numbers[i],suits[j]]);
		}
	}
	return tempLookup;
}

*/

var symbolLookup = [["2","♣"],["2","♦"],["2","♥"],["2","♠"],["3","♣"],["3","♦"],["3","♥"],["3","♠"],["4","♣"],["4","♦"],["4","♥"],["4","♠"],["5","♣"],["5","♦"],["5","♥"],["5","♠"],["6","♣"],["6","♦"],["6","♥"],["6","♠"],["7","♣"],["7","♦"],["7","♥"],["7","♠"],["8","♣"],["8","♦"],["8","♥"],["8","♠"],["9","♣"],["9","♦"],["9","♥"],["9","♠"],["10","♣"],["10","♦"],["10","♥"],["10","♠"],["J","♣"],["J","♦"],["J","♥"],["J","♠"],["Q","♣"],["Q","♦"],["Q","♥"],["Q","♠"],["K","♣"],["K","♦"],["K","♥"],["K","♠"],["A","♣"],["A","♦"],["A","♥"],["A","♠"]]
var wordLookup = [["Two","Clubs"],["Two","Diamonds"],["Two","Hearts"],["Two","Spades"],["Three","Clubs"],["Three","Diamonds"],["Three","Hearts"],["Three","Spades"],["Four","Clubs"],["Four","Diamonds"],["Four","Hearts"],["Four","Spades"],["Five","Clubs"],["Five","Diamonds"],["Five","Hearts"],["Five","Spades"],["Six","Clubs"],["Six","Diamonds"],["Six","Hearts"],["Six","Spades"],["Seven","Clubs"],["Seven","Diamonds"],["Seven","Hearts"],["Seven","Spades"],["Eight","Clubs"],["Eight","Diamonds"],["Eight","Hearts"],["Eight","Spades"],["Nine","Clubs"],["Nine","Diamonds"],["Nine","Hearts"],["Nine","Spades"],["Ten","Clubs"],["Ten","Diamonds"],["Ten","Hearts"],["Ten","Spades"],["Jack","Clubs"],["Jack","Diamonds"],["Jack","Hearts"],["Jack","Spades"],["Queen","Clubs"],["Queen","Diamonds"],["Queen","Hearts"],["Queen","Spades"],["King","Clubs"],["King","Diamonds"],["King","Hearts"],["King","Spades"],["Ace","Clubs"],["Ace","Diamonds"],["Ace","Hearts"],["Ace","Spades"]]

function extractNumbers(message) {
	var numbersRegex = /(-?\.?\d+\.?\d*)/g;
	var commasRegex = /[,]/g; //_.pull works too
	var numbers = [];
	noCommasMessage = message.replace(commasRegex,'')
	numbers = noCommasMessage.match(numbersRegex);
	for (var h = 0; h < numbers.length; h++) {
		numbers[h] = parseInt(numbers[h]);
	}
	console.log(numbers)
	
	// Copypasta from old bot incoming
	
	var numbersZeroToNine = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'];
	var numbersTenToNineteen = ['TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN'];
	var numbersTwentyToNinety = ['ZERO','TEN','TWENTY','THIRTY','FORTY','FIFTY','SIXTY','SEVENTY','EIGHTY','NINETY'];
	for (var i = 1 ; i < numbersTwentyToNinety.length ; i++) {
		if (message.indexOf(numbersTwentyToNinety[i]) != -1) {
			submessage = message.substr(message.indexOf(numbersTwentyToNinety[i]));
			for (j = 1 ; j < numbersZeroToNine.length ; j++) {
				if (submessage.indexOf(numbersZeroToNine[j]) != -1) {
					numberBet = i*10+j;
					numbers.push(numberBet); //numberBet is bad name
				}
				else if (j == numbersZeroToNine.length - 1) {
					numberBet = i*10;
					numbers.push(numberBet);
				}
			}
		}
	}
	for (k = 0 ; k < numbersTenToNineteen.length ; k++) {
		if (message.indexOf(numbersTenToNineteen[k]) != -1) {
			numberBet = k+10;
			numbers.push(numberBet);
		}
	}
	for (l = 0 ; l < numbersZeroToNine.length ; l++) {
		if (message.indexOf(numbersZeroToNine[l]) != -1) {
			numberBet = l;
			numbers.push(numberBet);
		}
	}
	// </copypasta>
	
	console.log('NUMBERSNUMBERSNUMBERS---' + numbers);
	return numbers; // Array should be in order of distance, right now is not due to copypasta
}

function formatHand(player) { //unfinshed //Also, add if increase

	var optionsList = formatOptionsList(player);
	var shortHand = formatShortHand(player);
	var shortOptions = formatShortOptions(optionsList);
	var longHand = formatLongHand(player);
	var statusBar = formatStatusBar(player);
	var longOptions = formatLongOptions(optionsList);
	
	var specialMessage = '.'; //do something with this?
	
	message = shortHand + '\n' + shortOptions + '\n' + '———————————————————————————' + '\n' + '.' + '\n' + longHand + '\n' + '.' + '\n' + 
	'———————————————————————————' + '\n' + statusBar + '\n' + '———————————————————————————' + '\n' + specialMessage + '\n' + longOptions;
	return [player, message];
}

function formatOptionsList(player) {

	var mustSpecifyBetAmountMessage = 'SAY HOW MUCH YOU BET';
	var mustSpecifyRaiseAmountMessage = 'SAY HOW MUCH YOU RAISE';
	var betOptionMessage = 'Bet';
	var checkOptionMessage = 'Check';
	var allInOptionMessage = 'All In (' + playerData[player].wallet + ')';
	var raiseOptionMessage = 'Raise (#)';
	var callOptionMessage = 'Call (' + (roomData.currentBet - playerData[player].amountBet) + ')';
	var foldOptionMessage = 'Fold';
	var yesOptionMessage = 'Yes';
	var noOptionMessage = 'No';
	var emptyOptionsListMessage = 'AWAIT YOUR TURN';
	var emptyOptionsListMessage = 'BE PATIENT';
//fix awaitturnmesagaeww
	optionsList = [];
	if (playerData[player].mustSpecifyBetAmount === true) {optionsList.push(mustSpecifyBetAmountMessage); }
	else if (playerData[player].mustSpecifyRaiseAmount === true) { optionsList.push(mustSpecifyRaiseAmountMessage); }
	else if (playerData[player].mustAwaitTurn === true) { optionsList.push(awaitTurnMessage); }
	else if (optionsList == []) { optionsList.push(emptyOptionsListMessage); } //not else ifs?
	
	else {
		if (playerData[player].canBet === true) { optionsList.push(betOptionMessage); }
		if (playerData[player].canCheck === true) { optionsList.push(checkOptionMessage); }
		if (playerData[player].canAllIn === true) { optionsList.push(allInOptionMessage); }
		if (playerData[player].canRaise === true) { optionsList.push(raiseOptionMessage); }
		if (playerData[player].canCall === true) { optionsList.push(callOptionMessage); }
		if (playerData[player].canFold === true) { optionsList.push(foldOptionMessage); }
		if (playerData[player].canShow === true) { optionsList.push(yesOptionMessage); optionsList.push(noOptionMessage); }
	}
	return optionsList; //returns a list of available options in their message form in order of the ifs above
}

function formatShortHand(player) {
	var shortHand = '';
	for (var i = 0; i < playerData[player].hand.length; i++); {
		# console.log('090909090-' + playerData[player].hand[i]); //why this?

		shortHand += symbolLookup[ playerData[player].hand[i] ][0];
		shortHand += symbolLookup[ playerData[player].hand[i] ][1];
		if (i !== playerData[player].hand.length - 1) {
			shortHand += '  ';
		}
	}
	return shortHand; // Returns in the form of 'K♣  Q♠  J♦  10♥  A♣' etc...
}

function formatShortOptions(optionsList) {
	var shortOptions = '';
	for (var i = 0; i < optionsList.length; i++) {
		shortOptions += optionsList[i];
		if (i !== optionsList.length - 1) {
			shortOptions += ' | ';
		}
	}
	return shortOptions; //in the form of 'Bet | Check | Fold' etc...
}

function formatLongHand(player) {
	var longHand = '   ';
	for (var i = 0; i < playerData[player].hand.length; i++) {
		longHand += '         ';
		longHand += symbolLookup[ playerData[player].hand[i] ][0];
		longHand += symbolLookup[ playerData[player].hand[i] ][1]	;	
	} //space at beginning?
	return longHand; //in the form of '            K♣         Q♠         J♦         10♥         A♣'
}

function formatStatusBar(player) {

	var currentBetStatusMessage = 'CURRENT BET: ';
	var yourWalletStatusMessage = 'YOUR WALLET: ';
	var potStatusMessage = 'POT: ';

	var statusSpaces = '';
	
	var statusNumberList = '';
	statusNumberList += roomData.currentBet.toString() + roomData.pot.toString() + playerData[player].wallet.toString();
	var statusSpacesNumber = Math.floor((27 /* <- size of each row*/ -(statusNumberList.length * 2 /* <- size of each letter*/)) / 4); /* <-number of status spaces needed (one for each option + 1*/ 
	for (var i = 0; i < statusSpacesNumber; i++ ) { //make ^ formula generic?
		statusSpaces += ' ';
	}
	
	var statusBar = '';
	statusBar = statusSpaces + currentBetStatusMessage + roomData.currentBet + statusSpaces + yourWalletStatusMessage + playerData[player].wallet + statusSpaces + potStatusMessage + roomData.pot;

	return statusBar; //in form of '     CURRENT BET: 15     YOUR WALLET: 15      POT: 15' with dynamic spaces
}

function formatLongOptions(optionsList) {
	var longOptions = '';
	
	var optionsSize = 0;
	for (var h = 0; h < optionsList.length; h++) {
		optionsSize += optionsList[h].length * 2;
	}
	
	var longOptionsSpaces = '';
	var longOptionsSpacesSize = Math.floor( (91 - optionsSize) / (optionsList.length * 2) ); //Generic?
	for (var i = 0; i < longOptionsSpacesSize; i++) {
		longOptionsSpaces += ' ';
	}
	
	for (var j = 0; j < (optionsList.length); j++ ) {
		if (j === 0) {
			longOptions += longOptionsSpaces + optionsList[j];
		}
		else {
			longOptions += longOptionsSpaces + '|' + longOptionsSpaces + optionsList[j];
		}
	}
	
	return longOptions; //in form of '     Bet     |     Check    |     Fold' with dynamic spaces
}

	/// PLAY FUNCTIONS BEGIN HERE
	
function check() {
	var messages = [];
	if (roomData.nextTurn === roomData.originalTurn) {
		messages.push(['room', 'Everybody loses. Try harder next time.']);
		
		//EVERYONE LOSES
		
	}
	else {
		messages.push(['room', data.users[roomData.turn].playerName + ' checked.']);
		roomData.advanceTurn();
	}
	messages.push(formatHand(roomData.turn));
	if (roomData.turn !== roomData.nextTurn) {
		messages.push(formatHand(roomData.nextTurn));
	}
	return messages;
}

function bet(amount) {
	var messages = []; // bet 0 is a thing
	if (amount.length === 0) {
		playerData[roomData.turn].mustSpecifyBetAmount = true;
		messages.push(['room', 'How much do you bet?']);
		messages.push(formatHand(roomData.turn));
	}
	else if (amount.length > 1) {
		playerData[roomData.turn].mustSpecifyBetAmount = true;
		var message = 'How much do you bet? You said ';
		if (amount.length === 2) {
			message += 'both ' + amount[0] + ' and ' + amount[1] + '.';
		}
		else {
			for (var h = 0; h < amount.length; h++) {
				if (h === amount.length - 1) {
					message += 'and ' + amount[h] + '.';
				}
				else {
					message += amount[h] + ', ';
				}
			}
		}
		messages.push(['room', message]);
		messages.push(formatHand(roomData.turn));
	}
	else {
		playerData[roomData.turn].mustSpecifyBetAmount = false;
		if (amount[0] === playerData[roomData.turn].wallet) {
			// ACTIVATE ALL IN
		}
		else if (amount[0] > playerData[roomData.turn].wallet) {
			messages.push(['room', 'You are too poor.']);
		}
		else {
			roomData.originalTurn = roomData.turn;
			playerData[roomData.turn].wallet -= amount[0];
			roomData.pot += amount[0];
			roomData.currentBet = amount[0];
			playerData[roomData.turn].amountBet = amount[0];
			for (var i = 0; i < roomData.remainingPlayers.length; i++) {
				playerData[roomData.remainingPlayers[i]].canCheck = false;
				playerData[roomData.remainingPlayers[i]].canBet = false;
				playerData[roomData.remainingPlayers[i]].canRaise = true;
				playerData[roomData.remainingPlayers[i]].canCall = true;
				playerData[roomData.remainingPlayers[i]].canFold = true;
			}
			messages.push(['room', data.users[roomData.turn].playerName + ' bet ' + amount[0] + '.']);
			messages.push(formatHand(roomData.turn));
			messages.push(formatHand(roomData.nextTurn));
			roomData.advanceTurn();
		}
	}
	return messages;
}

function validateAmount(amount) {
	var message = '';
	if (amount.length !== 1) {
			playerData[player].mustSpecifyRaiseAmount = true;
		
			if (amount.length === 0) {
				message = 'How much do you raise?';
				messages.push(['room', message]);
				messages.push(formatHand(player));
			}
			
			else if (amount.length === 2) {
				message = 'How much do you raise? You said both ' + amount[0] + ' and ' + amount[1] + '.';
				messages.push(['room', message]);
				messages.push(formatHand(player));
			}
			
			else if (amount.length > 2) {
				message = 'How much do you raise? You said ';
				for (var i = 0; i < amount.length; i++) {
					if (i === amount.length - 1) {
						message += 'and ' + amount[i] + '.';
					}
					else {
						message += amount[i] + ', ';
					}
				}
				messages.push(['room', message]);
				messages.push(formatHand(player));
			}
			
			else {
			
			}
		
		}
		
		else if (amount <= 0) {
			message = 'You must raise more than zero.';
			messages.push(['room', message]);
			messages.push(formatHand(player));
		}
	
	}  

function raise(amount, player) { // CANNOT CALL YOU OWN RAISE
	//note: amount is an array of all values given
	
	var messages = [];
	var message = '';
	
	if (amount.length !== 1) {
		playerData[player].mustSpecifyRaiseAmount = true;
	
		if (amount.length === 0) {
			message = 'How much do you raise?';
			messages.push(['room', message]);
			messages.push(formatHand(player));
		}
		
		else if (amount.length === 2) {
			message = 'How much do you raise? You said both ' + amount[0] + ' and ' + amount[1] + '.';
			messages.push(['room', message]);
			messages.push(formatHand(player));
		}
		
		else if (amount.length > 2) {
			message = 'How much do you raise? You said ';
			for (var i = 0; i < amount.length; i++) {
				if (i === amount.length - 1) {
					message += 'and ' + amount[i] + '.';
				}
				else {
					message += amount[i] + ', ';
				}
			}
			messages.push(['room', message]);
			messages.push(formatHand(player));
		}
	
	}
	
	else if (amount <= 0) {
		message = 'You must raise more than zero.';
		messages.push(['room', message]);
		messages.push(formatHand(player));
	}
	
	
	else if ((amount[0] + (roomData.currentBet - playerData[roomData.turn].amountBet)) > playerData[roomData.turn].wallet) {
		messages.push(['room', 'You are too poor.']) ;
	}
			
	else {
		playerData[player].mustSpecifyRaiseAmount = false;
		
		var amountToBeSpent = (amount[0] + (roomData.currentBet - playerData[roomData.turn].amountBet));
		
		if (amountToBeSpent === playerData[roomData.turn].wallet) {
			// ACTIVATE ALL IN
		}
		
		else {
			roomData.originalTurn = player;
			playerData[roomData.turn].wallet -= amountToBeSpent;
			roomData.pot += amountToBeSpent;
			roomData.currentBet += amount[0];
			playerData[roomData.turn].amountBet += amountToBeSpent;
			messages.push(['room', data.users[roomData.turn].playerName + ' raised ' + amount[0] + '.']);
			messages.push(formatHand(roomData.turn)); //needs if // function?
			messages.push(formatHand(roomData.nextTurn));
			roomData.advanceTurn();
		}
	
	}
	
	return messages;
}

function call() { 
	var messages = []; //these are all copypastas; smaller functions that differentiate?
	if ((roomData.currentBet - playerData[roomData.turn].amountBet) === playerData[roomData.turn].wallet) { //if you raised, call is negative, yet current bet increases
		// ACTIVATE ALL IN //could be a . . . function!
	}
	else if ((roomData.currentBet - playerData[roomData.turn].amountBet) > playerData[roomData.turn].wallet) {
		messages.push(['room', 'You are too poor.']);
	}
	else {
		playerData[roomData.turn].wallet -= (roomData.currentBet - playerData[roomData.turn].amountBet);
		roomData.pot += (roomData.currentBet - playerData[roomData.turn].amountBet);
		playerData[roomData.turn].amountBet += (roomData.currentBet - playerData[roomData.turn].amountBet);
		messages.push(['room', data.users[roomData.turn].playerName + ' called.']);
		messages.push(formatHand(roomData.turn));
		messages.push(formatHand(roomData.nextTurn)); //if not self //function?
		roomData.advanceTurn();
	}
	return messages;
}

function fold() {
	roomData.remainingPlayers.shift(); //dependant on being called this turn
	if (roomData.remainingPlayers.length === 1) {
		//you should have won already here
	}
	roomData.remainingPlayers.shift();
	var message = data.users[roomData.turn].playerName + ' folded.';
	messages.push(['room', message]);
	messages.push(roomData.turn, '———————————————————————————' + '\n' + '.' + '\n' + '.' + '\n' + '.' + '\n' + '                                     YOU HAVE FOLDED' +
	'\n' + '.' + '\n' + '.' + '\n' + '.' + '\n' + '.');
	roomData.advanceTurn();
}

/// Interesting Exports (allowed to affect the real messages)

exports.startup = function(givenData) {

	data = givenData;
	players = Object.keys(data.thisChatRoom); //shuffle?
	_.pull(players,data.steamID);

	
	/// OBJECT SETUP BEGINS HERE
	roomData = {
		deck: [],
		makeDeck: function() { roomData.deck = _.shuffle(_.range(0,52,1)); },
		pot: 0,
		currentBet: 0,
		players: players,
		remainingPlayers: players,
		get turn() {return roomData.remainingPlayers[0]; },
		originalTurn: players[0], //used to be defined lower. Breaks?
		get nextTurn() {return _.last(roomData.remainingPlayers); },
		advanceTurn: function() { roomData.remainingPlayers.unshift(roomData.remainingPlayers.pop()); }
	};

	playerData.addPlayer = function(player) {
		this[player] = {};
		this[player].hand = [];
		this[player].deal = function(amount) { // should this be here?
			for (var i = 0; i < amount; i++) { //could subtract for optimal awesome (var i = amount. . .)
				this.hand.push(roomData.deck.pop()); // check if possible 1st
			}
		};
		this[player].amountBet = 0;
		this[player].wallet = 0; // REMOVE?
		this[player].canCheck = true;
		this[player].canBet = true;
		this[player].mustSpecifyBetAmount = false;
		this[player].canCall = false;
		this[player].canRaise = false;
		this[player].mustSpecifyRaiseAmount = false;
		this[player].canFold = false;
		this[player].canAllIn = false;
		this[player].canShow = false; //put elsewhere use new
		this[player].mustSpecifyRaiseAmount = function() { if(this === roomData.turn()) { return true;} else {return false;} }
	};
	
	/// OBJECT SETUP ENDS HERE
	
	roomData.makeDeck();

	var messages = [];
	
	for(var i=0; i < players.length; i++) {
		playerData.addPlayer(players[i]);
		playerData[players[i]].deal(5);
		messages.push(formatHand(players[i]));
	}
	
	data.stored.roomData = roomData;
	data.stored.playerData = playerData;
	
	console.log('00000-' + JSON.stringify(playerData, null, 4))
	
	var commands = {};
	console.log('nn' + JSON.stringify(messages, null, 4));
	commands.sendMessage = messages;
	
	/*
	other commands:
	.addFirend = [player1, player2]
	.lockChat = true
	.unlockChat = true
	.setModerated = true
	.setUnmoderated = true
	.kick = [player1, ...]
	.ban = [player1 ...]
	.unban = [player1, ...]
	*/
	
	var progress = {};
	progress.storedData = data.stored;
	progress.commands = commands;
	
	return progress;
};

exports.checkMsg = function(givenData, receivedMessage, type, player) { //unfinished
	data = givenData;
	roomData = data.stored.roomData;
	playerData = data.stored.playerData;
	receivedMessage = receivedMessage.toUpperCase();
	var messages = [];
	var amount = extractNumbers(receivedMessage);
	var localMessages = [];
	
	// CHECK IF ONLY 1 PLAYER LEFT
	
	
	if (playerData[player].mustSpecifyBetAmount === true && roomData.turn === player) {
		if (receivedMessage.indexOf('CHECK') !== -1) { // better way than listing each one?
			messages.push(['room', 'Do you bet or check?']);
			playerData[player].mustSpecifyBetAmount = false;
		}
		else {
			localMessages = bet(amount);
			for (var h = 0; h < localMessages.length; h++) {
				messages.push(localMessages[h]);
			}
		}
		messages.push(formatHand(player));
	}
	
	else if (playerData[player].mustSpecifyRaiseAmount === true && roomData.turn === player) { // This else if is WRONG!
		if (receivedMessage.indexOf('CHECK') !== -1) { // List each one here . . . im not going to tho?
			messages.push(['room', 'Do you raise or check?']);
			playerData[player].mustSpecifyRaiseAmount = false;
		}
		// Ad Nauseum
		else {
			localMessages = raise(amount);
			for (var i = 0; i < localMessages.length; i++) {
				messages.push(localMessages[i]);
			}
		}
		messages.push(formatHand(player));
	}
	
	else {
		if (receivedMessage.indexOf('CHECK') !== -1 && roomData.turn === player && playerData[player].canCheck === true) { // if both?
			localMessages = check();
			for (var j = 0; j < localMessages.length; j++) { // Array holding each to its required values and its outcome? Would solve both problem and allow for similar values
				messages.push(localMessages[j]);
			}
		}
		if (receivedMessage.indexOf('BET') !== -1 && roomData.turn === player && playerData[player].canBet === true) {
			localMessages = bet(amount);
			for (var k = 0; k < localMessages.length; k++) {
				messages.push(localMessages[k]);
			}
		}
		if (receivedMessage.indexOf('CALL') !== -1 && roomData.turn === player && playerData[player].canCall === true) {
			localMessages = call();
			for (var l = 0; l < localMessages.length; l++) {
				messages.push(localMessages[l]);
			}
		}
		if (receivedMessage.indexOf('FOLD') !== -1 && roomData.turn === player && playerData[player].canFold === true) {
			localMessages = fold();
			for (var m = 0; m < localMessages.length; m++) {
				messages.push(localMessages[m]);
			}
		}
		if (receivedMessage.indexOf('RAISE') !== -1 && roomData.turn === player && playerData[player].canRaise === true) {
			localMessages = raise(amount, player);
			for (var n = 0; n < localMessages.length; n++) {
				messages.push(localMessages[n]);
			}
		}
	}
	
	if(receivedMessage.indexOf('HIT ME') !== -1) {
		playerData[player].wallet += 10;
		console.log(playerData[player].wallet);
		messages.push(formatHand(player));
	}
	
	console.log('mm' + JSON.stringify(messages, null, 4));
	data.stored.roomData = roomData;
	data.stored.playerData = playerData;
	var commands = {};
	commands.sendMessage = messages;
	var progress = {};
	progress.storedData = data.stored;
	progress.commands = commands;
	return progress;
};