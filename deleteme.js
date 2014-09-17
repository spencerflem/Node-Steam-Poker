//include whatevz
/*
Setting up
*/
//Adding and removing player etc. to come
var symbolNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var symbolSuits = ['♣', '♦', '♥', '♠'];
var wordNumbers = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];
var wordSuits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

//these will be real values
var rooms = {};
rooms["room1"] = ["player1", "player2"];

var cards = {};
cards = setupCards(rooms);
var symbolLookup = [];
symbolLookup = setupLookup(symbolNumbers, symbolSuits);
var wordLookup = [];
wordLookup = setupLookup(wordNumbers, wordSuits);

function setupLookup(numbers, suits) {
    tempLookup = [];
    for (var j = 0; j < 13; j++) {
        for (var k = 0; k < 4; k++) {
            toPush = [];
            toPush.push(numbers[j], suits[k]);
            tempLookup.push(toPush);
        }
    }
    return tempLookup;
}

function setupCards(rooms) {
    tempCards = {};
    for (var i = 0; i < Object.keys(rooms).length; i++) {
        currentRoom = Object.keys(rooms)[i];
        tempCards[currentRoom] = {};
        tempCards[currentRoom].deck = [];
        tempCards[currentRoom].pot = [];
        tempCards[currentRoom].players = {};
        tempCards[currentRoom].deck = setupDeck();
        tempCards[currentRoom].deck = shuffle(tempCards[currentRoom].deck);
        for (var j = 0; j < rooms[currentRoom].length; j++) { //note: this doesn't use Object.keys
            currentPlayer = rooms[currentRoom][j];
            tempCards[currentRoom].players[currentPlayer] = {};
            tempCards[currentRoom].players[currentPlayer].hand = [];
            tempCards[currentRoom].players[currentPlayer].handValue = 0;
            tempCards[currentRoom].players[currentPlayer].bet = [];
        }
    }
    return tempCards;
}

//console.log(JSON.stringify(cards, null, 4));

function setupDeck() {
    tempDeck = [];
    for (var i = 0; i < 52; i++) {
        tempDeck.push(i);
    }
    return tempDeck;
}

function shuffle(deck) {
    var counter = deck.length,
        temp, index;
    while (counter--) {
        index = (Math.random() * counter) | 0;
        temp = deck[counter];
        deck[counter] = deck[index];
        deck[index] = temp;
    }
    return deck;
}

/*
Playing the game
*/

deal(cards["room1"].players["player1"].hand, cards["room1"].deck, 5);

function deal(hand, deck, number) {
    for (var i = 0; i < number; i++) {
        hand.push(deck.pop());
    }
}
console.log(getValue(cards["room1"].players["player1"].hand))

/*
var a = -1
var b = -1
var c = -1
var d = -1
var e = -1
var v = -1
var w = -1
var x = -1
var y = -1
var z = -1
*/

function getValue(hand) {
   	hand = hand.sort(function (a, b) {
        return parseInt(a) - parseInt(b);
    });
	
	aCard = Math.floor((hand[0]/4));
	bCard = Math.floor((hand[1]/4));
	cCard = Math.floor((hand[2]/4));
	dCard = Math.floor((hand[3]/4));
	eCard = Math.floor((hand[4]/4));
	
	vCard = hand[0] % 4;
	wCard = hand[1] % 4;
	xCard = hand[2] % 4;
	yCard = hand[3] % 4;
	zCard = hand[4] % 4;
  
  console.log(hand)
  console.log(aCard + ' ' + bCard + ' ' + cCard + ' ' + dCard + ' ' + eCard)
  console.log(vCard + ' ' + wCard + ' ' + xCard + ' ' + yCard + ' ' + zCard)
	
    if (hand.length != 5) {
        return 0; //not 5 cards
    } else if (vCard == wCard && vCard == xCard && vCard == yCard && vCard == zCard) {
        if (aCard + 1 == bCard && bCard + 1 == cCard && cCard + 1 == dCard && dCard + 1 == eCard) {
            if (eCard == 12) {
				return 1000; //royal straight flush
			} else {
				return 900 + eCard; //straight flush
			}
        } else {
            return 600 + eCard + dCard/100 + cCard/10000 + bCard/1000000 + aCard/100000000; //flush
        }
    } else if (aCard == bCard && bCard == cCard && cCard == dCard) {
        return 800 + dCard + eCard/100; //four of a kind
    } else if (bCard == cCard && cCard == dCard && dCard == eCard) {
        return 800 + eCard + aCard/100; //four of a kind
    } else if (aCard + 1 == bCard && bCard + 1 == cCard && cCard + 1 == dCard && dCard + 1 == eCard) {
        return 500 + eCard; //straight
    } else if (aCard == bCard && bCard == cCard) {
        if (dCard == eCard) {
            return 700 + cCard + eCard/100; //full house
        } else {
            return 400 + cCard + eCard/100 + dCard/10000; //three of a kind
        }
    } else if (cCard == dCard && dCard == eCard) {
        if (aCard == bCard) {
            return 600 + eCard + bCard/100; //full house
        } else {
            return 400 + eCard + bCard/100 + aCard/10000; //three of a kind
        }
    } else if (bCard == cCard && cCard == dCard) {
        return 400 + dCard + eCard/100 + aCard/10000; //three of a kind
    } else if (dCard == eCard) {
        if (bCard == cCard) {
            return 300 + eCard + cCard/100 + aCard/10000; //two pair
        } else if (aCard == bCard) {
            return 300 + eCard + bCard/100 + cCard/10000; //two pair
        } else {
            return 200 + eCard + cCard/100+ bCard/10000 + aCard/1000000; //one pair
        }
    } else if (cCard == dCard) {
        if (aCard == bCard) {
            return 300 + dCard + bCard/100 + eCard/1000; //two pair
        } else {
            return 200 + dCard + eCard/100 + bCard/10000 + aCard/1000000; //one pair
        }
    } else if (bCard == cCard) {
        return 200 + cCard + eCard/100 + dCard/10000 + aCard/1000000; //one pair
    } else if (aCard == bCard) {
		return 200 + bCard + eCard/100 + dCard/10000 + cCard/1000000; //one pair
    } else {
		return 100 + eCard + dCard/100 + cCard/10000 + bCard/1000000 + aCard/100000000; //high card
	}
}