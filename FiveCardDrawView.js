module.exports = View; //correct syntax?

//TODO SIDEPOT
//TODO VALIDATION

function View() {
}

View.prototype.updateView = function(Player) { //unfinshed //Also, add if increase
	var optionsList = formatOptionsList(Player); //Show side pots as Pot:300(20) <- side pots added together
	var shortHand = formatShortHand(Player);
	var shortOptions = formatShortOptions(optionsList);
	var longHand = formatLongHand(Player);
	var statusBar = formatStatusBar(Player);
	var longOptions = formatLongOptions(optionsList);
	
	var specialMessage = '.'; //do something with this?
	
	message = shortHand + '\n' + shortOptions + '\n' + '———————————————————————————' + '\n' + '.' + '\n' + longHand + '\n' + '.' + '\n' + 
	'———————————————————————————' + '\n' + statusBar + '\n' + '———————————————————————————' + '\n' + specialMessage + '\n' + longOptions;
	/*
	console.log('////////////////////////////////////////////\n--------------------------------------------')
	console.log(message);
	console.log('--------------------------------------------\n////////////////////////////////////////////')
	*/
	return message;
};

function formatOptionsList(Player) {

	var betOptionMessage = 'Bet (#)';
	var checkOptionMessage = 'Check';
	var allInOptionMessage = 'All In (' + Player.wallet + ')';
	var raiseOptionMessage = 'Raise (#)';
	var callOptionMessage = 'Call (' + (Player.game.getHighestBet() - Player.amountBet) + ')';
	var foldOptionMessage = 'Fold';
	//var yesOptionMessage = 'Yes';
	//var noOptionMessage = 'No';
	var awaitTurnMessage = 'AWAIT YOUR TURN';

	optionsList = [];
	if (Player.isCurrentPlayer() === false) { optionsList.push(awaitTurnMessage); }
	else {
		if (Player.canAllin() === true) { optionsList.push(allInOptionMessage); }
		if (Player.canBet() === true) { optionsList.push(betOptionMessage); }
		if (Player.canCheck() === true) { optionsList.push(checkOptionMessage); }
		if (Player.canRaise() === true) { optionsList.push(raiseOptionMessage); }
		if (Player.canCall() === true) { optionsList.push(callOptionMessage); }
		if (Player.canFold() === true) { optionsList.push(foldOptionMessage); }
		//if (playerData[player].canShow === true) { optionsList.push(yesOptionMessage); optionsList.push(noOptionMessage); }
	}
	return optionsList; //returns a list of available options in their message form in order of the ifs above
}

function formatShortHand(Player) {
	var shortHand = '';
	for (var i=0; i < Player.hand.length; i++) {
		shorthand = '';
		shortHand += formatCard(Player.hand[i]);
		if (i !== Player.hand.length - 1) {
			shortHand += '  ';
		}
	}
	return shortHand; //Returns in the form of 'K♣  Q♠  J♦  10♥  A♣' etc...
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

function formatLongHand(Player) {
	var longHand = '   ';
	for (var i = 0; i < Player.hand.length; i++) {
		longHand += '         ';
		longHand += formatCard(Player.hand[i]);
	} //space at beginning?
	return longHand; //in the form of '            K♣         Q♠         J♦         10♥         A♣'
}

function formatStatusBar(Player) {

	var currentBetStatusMessage = 'CURRENT BET: ';
	var yourWalletStatusMessage = 'YOUR WALLET: ';
	var potStatusMessage = 'POT: ';

	var statusSpaces = '';
	
	var statusNumberList = '';
	statusNumberList += Player.game.getHighestBet().toString() + Player.game.getPot().toString() + Player.wallet.toString();
	var statusSpacesNumber = Math.floor((27 /* <- size of each row*/ -(statusNumberList.length * 2 /* <- size of each letter*/)) / 4); /* <-number of status spaces needed (one for each option + 1)*/ 
	for (var i = 0; i < statusSpacesNumber; i++ ) { //make ^ formula generic?
		statusSpaces += ' ';
	}
	
	var statusBar = '';
	statusBar = statusSpaces + currentBetStatusMessage + Player.game.getHighestBet() + statusSpaces + yourWalletStatusMessage + Player.wallet + statusSpaces + potStatusMessage + Player.game.getPot();

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

function formatCard(card) {
	formattedCard = '';
	
	formattedCard += card.slice(0,-1)
	
	if(card.slice(-1) === 'h') {
		formattedCard += '♥';
	} else if(card.slice(-1) === 'd') {
		formattedCard += '♦';
	} else if(card.slice(-1) === 's') {
		formattedCard += '♠';
	} else if(card.slice(-1) === 'c') {
		formattedCard += '♣';
	}
	
	return formattedCard;
}