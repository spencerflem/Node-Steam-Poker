function updateVeiw(Player) { //unfinshed //Also, add if increase

	var optionsList = formatOptionsList(player); //Show side pots as Pot:300(20) <- side pots added together
	var shortHand = formatShortHand(player);
	var shortOptions = formatShortOptions(optionsList);
	var longHand = formatLongHand(player);
	var statusBar = formatStatusBar(player);
	var longOptions = formatLongOptions(optionsList);
	
	var specialMessage = '.'; //do something with this?
	
	message = shortHand + '\n' + shortOptions + '\n' + '———————————————————————————' + '\n' + '.' + '\n' + longHand + '\n' + '.' + '\n' + 
	'———————————————————————————' + '\n' + statusBar + '\n' + '———————————————————————————' + '\n' + specialMessage + '\n' + longOptions;
	return message;
}

function formatOptionsList(player) {

	var mustSpecifyBetAmountMessage = 'SAY HOW MUCH YOU BET';
	var mustSpecifyRaiseAmountMessage = 'SAY HOW MUCH YOU RAISE';
	var betOptionMessage = 'Bet';
	var checkOptionMessage = 'Check';
	var allInOptionMessage = 'All In (' + Player.wallet + ')';
	var raiseOptionMessage = 'Raise (#)';
	var callOptionMessage = 'Call (' + (roomData.currentBet - playerData[player].amountBet) + ')';
	var foldOptionMessage = 'Fold';
	var yesOptionMessage = 'Yes';
	var noOptionMessage = 'No';
	var awaitTurnMessage = 'AWAIT YOUR TURN';
	var emptyOptionsListMessage = 'BE PATIENT';

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
		shortHand += symbolLookup[ playerData[player].hand[i] ][0];
		shortHand += symbolLookup[ playerData[player].hand[i] ][1];
		if (i !== playerData[player].hand.length - 1) {
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