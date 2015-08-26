//include whatevz

/*
Setting up
*/

//Adding and removing player etc. to come

var cards = {};
var rooms = {};

//these will be real values
rooms["103582791434524271"] = ["76561197999625756","76561198112412644"];
//rooms["76561197992656741"] = ["76561197999625756","76561198112412644"];

numberOfCards = 52;

for (var i = 0 ; i < Object.keys(rooms).length ; i++) { //cards.room.player.hand
	currentRoom = Object.keys(rooms)[i];
	cards[currentRoom] = {};
	cards[currentRoom].deck = [];
	cards[currentRoom].pot = [];
	cards[currentRoom].players = {};
	setupDeck(currentRoom, numberOfCards);
	cards[currentRoom].deck = shuffle(cards[currentRoom].deck);
	for (var j = 0 ; j < rooms[currentRoom].length ; j++) { //note: this doesn't use Object.keys
		currentPlayer = rooms[currentRoom][j];
		cards[currentRoom].players[currentPlayer] = {};
		cards[currentRoom].players[currentPlayer].hand = [];
		cards[currentRoom].players[currentPlayer].bet = [];
	}
}

function setupDeck(room, numberOfCards) {
	for (var i = 1 ; i <= numberOfCards ; i++) {
		cards[room].deck.push(i);
	}
	
}
	
function shuffle(deck) {
	var counter = deck.length, temp, index;
	while(counter--) {
		index = (Math.random() * counter) | 0 ;
		temp = deck[counter];
		deck[counter] = deck[index];
		deck[index] = temp;
	}
	return deck;
}

/*
Playing the game
*/

//deal 5 to everybody

function deal(room,player,number) {
	for (var i = 0 ; i < number ; i++) {
		cards[room].players[player].hand.push(cards[room].deck.pop());
		//console.log(JSON.stringify(cards, null, 4));
	}
}

//Collect Bets

/*
Deciding who wins
*/

if 3 5 8 0 
