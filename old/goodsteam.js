var username = ';
var password = ';
var SteamGuard = require('fs').existsSync('sentryfile') ? require('fs').readFileSync('sentryfile')
    : ''; 
var fs = require('fs');

var Steam = require('Steam');
var SteamTradeOffers = require('Steam-tradeoffers');

var bot = new Steam.SteamClient();
var offers = new SteamTradeOffers();

var mainChat = '';

var symbolNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var symbolSuits = ['♣', '♦', '♥', '♠'];
var wordNumbers = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];
var wordSuits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

var cards = {};
//cards = setupCards(rooms,cards); FIND OUT WHEN YOU ENTER A CHAT ROOM!
var symbolLookup = [];
symbolLookup = setupLookup(symbolNumbers, symbolSuits);
var wordLookup = [];
wordLookup = setupLookup(wordNumbers, wordSuits);
var wallets = {}

bot.logOn({
  accountName: username,
  password: password,
  shaSentryfile: SteamGuard
});

bot.on('debug', console.log);

bot.on('loggedOn', function(result) {
  console.log('Logged in!');
  bot.setPersonaState(Steam.EPersonaState.Online);
  bot.joinChat(mainChat)
});

bot.on('relationships', function () {
  for(var friend in bot.friends) {
    if(bot.friends[friend] === Steam.EFriendRelationship.PendingInvitee) {
      bot.addFriend(friend);
    }
  }
});

bot.on('chatInvite', function(room,name,inviter) {
	bot.joinChat(room)
});

bot.on('webSessionID', function(sessionID) {
  bot.webLogOn(function(newCookie){
    offers.setup(sessionID, newCookie);
  });
});

bot.on('tradeOffers', function(number) {
  if (number > 0) {
    offers.getOffers({get_received_offers: 1}, function(error, body) {
      if(body.response.trade_offers_received){
        body.response.trade_offers_received.forEach(function(offer) {
          if (offer.trade_offer_state == 2){
            if(offer.botid_other == admin) {
              offers.acceptOffer(offer.tradeofferid);
            } else {
              offers.declineOffer(offer.tradeofferid);
            }
          }
        });
      }
    });
  }
});

function setupLookup(numbers, suits) {
    tempLookup = [];
    for (var j = 0; j < numbers.length; j++) {
        for (var k = 0; k < suits.length; k++) {
            toPush = [];
            toPush.push(numbers[j], suits[k]);
            tempLookup.push(toPush);
        }
    }
	console.log(tempLookup)
    return tempLookup;
}

function setupCards(rooms,cards) {
    tempCards = cards;
    for (var i = 0; i < Object.keys(rooms).length; i++) {
        currentRoom = Object.keys(rooms)[i];
        tempCards[currentRoom] = {};
        tempCards[currentRoom].deck = [];
        tempCards[currentRoom].pot = 0;
		tempCards[currentRoom].currentBet = 0;
		tempCards[currentRoom].players = {}
		tempCards[currentRoom].playersLeft = []
		tempCards[currentRoom].turn = ""
		tempCards[currentRoom].originalTurn = ""
		tempCards[currentRoom].winningHand = [0,""]
        tempCards[currentRoom].deck = setupDeck();
        tempCards[currentRoom].deck = shuffle(tempCards[currentRoom].deck);
        for (var j = 0; j < Object.keys(rooms[currentRoom]).length; j++) {
            currentPlayer = Object.keys(rooms[currentRoom])[j];
			if (currentPlayer != bot.steamID){
				tempCards[currentRoom].players[currentPlayer] = {};
				tempCards[currentRoom].players[currentPlayer].hand = [];
				tempCards[currentRoom].players[currentPlayer].currentBet = 0;
				tempCards[currentRoom].players[currentPlayer].options = [['AWAIT YOUR TURN'],['WAIT']];
			}
        }
    }
    return tempCards;
}

//console.log(JSON.stringify(cards, null, 4));

function setupDeck() { //ONLY DOES 52 CARD DECK, SHOULD USE LOOKUP low priority
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

function deal(hand, deck, number) {
    for (var i = 0; i < number; i++) {
        hand.push(deck.pop());
    }
}

handLookup = ['Nothing!','a high card.','one pair.','two pair.','three of a kind.','a straight!','a flush!','a full house!','a four of a kind!!','a STRAIGHT FLUSH!!','A ROYAL STRAIGHT FLUSH OMG OMG!!1!!']

function getValue(hand) { //FIND WAY TO COORECT FLOATING POINT ERROR ON 1 / 2 PAIR AND FLUSH
	temperHand = hand
   	tempHand = temperHand.sort(function (a, b) {
        return parseInt(a) - parseInt(b);
    });
	
	aCard = Math.floor((tempHand[0]/4));
	bCard = Math.floor((tempHand[1]/4));
	cCard = Math.floor((tempHand[2]/4));
	dCard = Math.floor((tempHand[3]/4));
	eCard = Math.floor((tempHand[4]/4));
	
	vCard = tempHand[0] % 4;
	wCard = tempHand[1] % 4;
	xCard = tempHand[2] % 4;
	yCard = tempHand[3] % 4;
	zCard = tempHand[4] % 4;
	
    if (tempHand.length != 5) {
        return 0 + ''; //not 5 cards
    } else if (vCard == wCard && vCard == xCard && vCard == yCard && vCard == zCard) {
        if (aCard + 1 == bCard && bCard + 1 == cCard && cCard + 1 == dCard && dCard + 1 == eCard) {
            if (eCard == 12) {
				return 1000 + ''; //royal straight flush
			} else {
				return 900 + eCard + ''; //straight flush
			}
        } else {
            return 600 + eCard + dCard/100 + cCard/10000 + bCard/1000000 + aCard/100000000 + ''; //flush
        }
    } else if (aCard == bCard && bCard == cCard && cCard == dCard) {
        return 800 + dCard + eCard/100 + ''; //four of a kind
    } else if (bCard == cCard && cCard == dCard && dCard == eCard) {
        return 800 + eCard + aCard/100 + ''; //four of a kind
    } else if (aCard + 1 == bCard && bCard + 1 == cCard && cCard + 1 == dCard && dCard + 1 == eCard) {
        return 500 + eCard + ''; //straight
    } else if (aCard == bCard && bCard == cCard) {
        if (dCard == eCard) {
            return 700 + cCard + eCard/100 + ''; //full house
        } else {
            return 400 + cCard + eCard/100 + dCard/10000 + ''; //three of a kind
        }
    } else if (cCard == dCard && dCard == eCard) {
        if (aCard == bCard) {
            return 700 + eCard + bCard/100 + ''; //full house
        } else {
            return 400 + eCard + bCard/100 + aCard/10000 + ''; //three of a kind
        }
    } else if (bCard == cCard && cCard == dCard) {
        return 400 + dCard + eCard/100 + aCard/10000 + ''; //three of a kind
    } else if (dCard == eCard) {
        if (bCard == cCard) {
            return 300 + eCard + cCard/100 + aCard/10000 + ''; //two pair
        } else if (aCard == bCard) {
            return 300 + eCard + bCard/100 + cCard/10000 + ''; //two pair
        } else {
            return 200 + eCard + cCard/100+ bCard/10000 + aCard/1000000 + ''; //one pair
        }
    } else if (cCard == dCard) {
        if (aCard == bCard) {
            return 300 + dCard + bCard/100 + eCard/10000 + ''; //two pair
        } else {
            return 200 + dCard + eCard/100 + bCard/10000 + aCard/1000000 + ''; //one pair
        }
    } else if (bCard == cCard) {
        return 200 + cCard + eCard/100 + dCard/10000 + aCard/1000000 + ''; //one pair
    } else if (aCard == bCard) {
		return 200 + bCard + eCard/100 + dCard/10000 + cCard/1000000 + ''; //one pair
    } else {
		return 100 + eCard + dCard/100 + cCard/10000 + bCard/1000000 + aCard/100000000 + ''; //high card
	}
}

function sendHand(room,player) {
	messageOptions = ''
	for (i = 0 ; i < cards[room].players[player].options[0].length ; i++) {
		messageOptions = messageOptions + '         ' + cards[room].players[player].options[0][i]
		if (i != cards[room].players[player].options[0].length - 1) {
			messageOptions = messageOptions + '         |'//SPACES MUST BE PRETTIER!
		}
	}
	if (wallets[player] == undefined) {
		wallets[player] = 0
	}
	message = 	symbolLookup[cards[room].players[player].hand[0]][0]+symbolLookup[cards[room].players[player].hand[0]][1]+ '  '+
	symbolLookup[cards[room].players[player].hand[1]][0]+symbolLookup[cards[room].players[player].hand[1]][1]+ '  '+
	symbolLookup[cards[room].players[player].hand[2]][0]+symbolLookup[cards[room].players[player].hand[2]][1]+ '  '+
	symbolLookup[cards[room].players[player].hand[3]][0]+symbolLookup[cards[room].players[player].hand[3]][1]+ '  '+
	symbolLookup[cards[room].players[player].hand[4]][0]+symbolLookup[cards[room].players[player].hand[4]][1]+'\n' +
	'———————————————————————————' + '\n'+'.'+'\n'+'         '+
	symbolLookup[cards[room].players[player].hand[0]][0]+symbolLookup[cards[room].players[player].hand[0]][1]+ '         '+
	symbolLookup[cards[room].players[player].hand[1]][0]+symbolLookup[cards[room].players[player].hand[1]][1]+ '         '+
	symbolLookup[cards[room].players[player].hand[2]][0]+symbolLookup[cards[room].players[player].hand[2]][1]+ '         '+
	symbolLookup[cards[room].players[player].hand[3]][0]+symbolLookup[cards[room].players[player].hand[3]][1]+ '         '+
	symbolLookup[cards[room].players[player].hand[4]][0]+symbolLookup[cards[room].players[player].hand[4]][1]+
	'\n'+'.'+'\n'+'———————————————————————————'+'\n'+'CURRENT BET: '+cards[room].currentBet+'      YOUR WALLET: '
	+wallets[player]+'        POT: '+cards[room].pot+'\n'+'———————————————————————————'+'\n'+'.'+'\n'+messageOptions;
	bot.sendMessage(player, message);
}

function dealAll(room) {
	for (var i = 0 ; i < Object.keys(cards[room].players).length ; i++) {
		player = Object.keys(cards[room].players)[i]
		deal(cards[room].players[player].hand,cards[room].deck,5)
		sendHand(room,player)
	}
}

var numbersZeroToNine = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE']
var numbersTenToNineteen = ['TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN']
var numbersTwentyToNinety = ['ZERO','TEN','TWENTY','THIRTY','FORTY','FIFTY','SIXTY','SEVENTY','EIGHTY','NINETY']

function isThisANumber(message){ //HANDLE 2 NUMBERS IN SAME CHAT lo priority
	for (i = 1 ; i < numbersTwentyToNinety.length ; i++) {
		if (message.indexOf(numbersTwentyToNinety[i]) != -1) {
			submessage = message.substr(message.indexOf(numbersTwentyToNinety[i]))
			for (j = 1 ; j < numbersZeroToNine.length ; j++) {
				if (submessage.indexOf(numbersZeroToNine[j]) != -1) {
					numberBet = i*10+j
					return numberBet
				}
				else if (j == numbersZeroToNine.length - 1) {
					numberBet = i*10
					return numberBet
				}
			}
		}
	}
	for (k = 0 ; k < numbersTenToNineteen.length ; k++) {
		if (message.indexOf(numbersTenToNineteen[k]) != -1) {
			numberBet = k+10
			return numberBet
		}
	}
	for (l = 0 ; l < numbersZeroToNine.length ; l++) {
		if (message.indexOf(numbersZeroToNine[l]) != -1) {
			numberBet = l
			return numberBet
		}		
	}
	for (m = 0 ; m < 10 ; m++) {
		if (message.indexOf(m) != -1) {
			submessage = message.substr(message.indexOf(m) + 1,2)
			for (n = 0 ; n < 10 ; n++){
				if (submessage.indexOf(n) != -1) {
					numberBet = m*10+n
					return numberBet
				}
				else if (n == 9) {
					numberBet = m
					return numberBet
				}
			}
		} // GIVE SETUP MESSAGES
	}
}

function bet(message,room,chatter) {
	numberBet = isThisANumber(message)
	if (numberBet == undefined) {
		bot.sendMessage(room,'How much do you bet?')
		cards[room].players[chatter].options = [['BET (#)','CHECK'],['BET-INC','CHECK']]
		sendHand(room,chatter)
	}
	else if (numberBet > wallets[chatter]) {
		bot.sendMessage(room,"You don't have enough cards to bet that much.")
	} else { //RESEND HAND AND SHOW MESSAGE TO TYPE IN CHAT ROOM
		cards[room].originalTurn = chatter
		wallets[chatter] = wallets[chatter] - numberBet
		bot.sendMessage(room,bot.users[player].playerName + ' bet ' + numberBet)
		cards[room].pot = cards[room].pot + numberBet 
		cards[room].currentBet = cards[room].currentBet + numberBet 
		cards[room].players[chatter].currentBet = cards[room].players[chatter].currentBet + numberBet 
		cards[room].players[chatter].options = [['AWAIT YOUR TURN'],['WAIT']]
		sendHand(room,chatter)
		theNextPlayer = nextPlayer(room)
		callAmount = cards[room].currentBet - cards[room].players[theNextPlayer].currentBet
		cards[room].players[theNextPlayer].options = [['RAISE (#)','CALL (' + callAmount + ')','FOLD'],['RAISE','CALL','FOLD']]
		sendHand(room,theNextPlayer)
	}
}

function showdown(room,show) {
	if (show == 1) { //SHOWS UNDEFINED
		if (getValue(cards[room].players[cards[room].turn].hand) > cards[room].winningHand[0]) {
			cards[room].winningHand[0] = getValue(cards[room].players[cards[room].turn].hand)
			cards[room].winningHand[1] = cards[room].turn
		}//JSON HAND SHOW SUCKS BUTT; SHOW KING HIGHT ETC
		handName = handLookup[Math.floor((getValue(cards[room].players[cards[room].turn].hand))/100)]
		bot.sendMessage(room,bot.users[cards[room].turn].playerName + ' has ' + handName + ' ' + JSON.stringify(cards[room].players[cards[room].turn].hand))
	}
	cards[room].playersLeft.splice(cards[room].playersLeft.indexOf(cards[room].turn))
	console.log(cards[room].playersLeft)
	theNextPlayer = nextPlayer(room)
	if (Object.keys(cards[room].players).length == 0){
		bot.sendMessage(room,bot.users[cards[room].winningHand[1]].playerName + ' wins ' + cards[room].pot)
		wallets[cards[room].winningHand[1]] = wallets[cards[room].winningHand[1]] + cards[room].pot
		cards[room].pot = 0
	} else {
		if (getValue(cards[room].players[theNextPlayer].hand) > cards[room].winningHand[0]){
			cards[room].players[theNextPlayer].options = [['YES SHOW (YOUR HAND IS WINNING)','NO SHOW'],['YESSHOW','NOSHOW']]
			sendHand(room,theNextPlayer)
		} else {
			cards[room].players[theNextPlayer].options = [['YES SHOW (YOUR HAND IS LOSING)','NO SHOW'],['YESSHOW','NOSHOW']]
			sendHand(room,theNextPlayer)
		}
	}
	
}

function raise(message,room,chatter) {
	callAmount = cards[room].currentBet - cards[room].players[chatter].currentBet
	numberRaised = isThisANumber(message)
	numberBet = numberRaised + callAmount
	if (numberRaised == undefined) {
		bot.sendMessage(room,'How much do you raise?')
		cards[room].players[chatter].options = [['RAISE (#)','CALL (' + callAmount + ')','FOLD'],['RAISE-INC','CALL','FOLD']]
		sendHand(room,chatter)
	}
	else if (numberBet > wallets[chatter]) {
		bot.sendMessage(room,"You don't have enough cards to raise that much.") 
	} else {
		cards[room].originalTurn = chatter
		wallets[chatter] = wallets[chatter] - numberBet
		bot.sendMessage(room,bot.users[player].playerName + ' raised ' + numberRaised)
		cards[room].pot = cards[room].pot + numberBet 
		cards[room].currentBet = cards[room].currentBet + numberRaised 
		cards[room].players[chatter].currentBet = cards[room].players[chatter].currentBet + numberRaised 
		cards[room].players[chatter].options = [['AWAIT YOUR TURN'],['WAIT']]
		sendHand(room,chatter)
		theNextPlayer = nextPlayer(room)
		callAmount = cards[room].currentBet - cards[room].players[theNextPlayer].currentBet
		cards[room].players[theNextPlayer].options = [['RAISE (#)','CALL (' + callAmount + ')','FOLD'],['RAISE','CALL','FOLD']]
		sendHand(room,theNextPlayer)
	}
}

function nextPlayer(room) {
	currentPlace = Object.keys(cards[room].players).indexOf(cards[room].turn) //POT LIMIT OF 50
	if (currentPlace == Object.keys(cards[room].players).length - 1) {
		currentPlace = 0
	} else {
		currentPlace++
	}
	player = Object.keys(cards[room].players)[currentPlace]
	cards[room].turn = player
	return player
}
// DONT FORGET TO FIGURE OUT ADDING NEW PLAYERS ETC.

bot.on('friendMsg',function() { //DO SOMETHING HERE
});

bot.on('chatMsg', function(room, message, type, chatter) {
	message = message.toUpperCase()
	if (message == 'START') {
		thisRoom = {}
		thisRoom[room]=bot.chatRooms[room]
		cards = setupCards(thisRoom,cards)
		dealAll(room) //RANDOM? MORE LIKE WHOEVER INVITED YOU BECAUSE THEY ROCK :P
		cards[room].playersLeft = Object.keys(cards[room].players)
		player = Object.keys(cards[room].players)[Math.floor(Math.random()*(Object.keys(cards[room].players).length))]
		cards[room].turn = player
		cards[room].players[player].options = [['BET (#)','CHECK'],['BET','CHECK']]
		sendHand(room,player)
	}
	if (message.indexOf('CHECK') != -1 && cards[room].players[chatter].options[1].indexOf('CHECK') != -1) {
		cards[room].players[chatter].options = [['AWAIT YOUR TURN'],['WAIT']]
		sendHand(room,chatter)
		if (cards[room].originalTurn == "") {
			cards[room].originalTurn = chatter
		}
		theNextPlayer = nextPlayer(room)
		if (theNextPlayer == cards[room].originalTurn) {
			bot.sendMessage(room,'Everybody checked. Starting a new round')
			console.log('clean up for end of turn') // MAKE THIS DO THINGS
		}
		else {
			cards[room].players[theNextPlayer].options = [['BET (#)','CHECK'],['BET','CHECK']]
			sendHand(room,theNextPlayer)
			bot.sendMessage(room,bot.users[chatter].playerName + ' checked.')
		}
	}
	if (message.indexOf('BET') != -1 && cards[room].players[chatter].options[1].indexOf('BET') != -1) {
		bet(message,room,chatter)
	}
	if (message.indexOf('HIT ME') != -1) {
		wallets[chatter] = 10
		sendHand(room,chatter)
		bot.sendMessage(room,bot.users[chatter].playerName + ' now has ' + wallets[chatter] + ' cards in his wallet.')
	}
	if (isThisANumber(message) != undefined && cards[room].players[chatter].options[1].indexOf('BET-INC') != -1) {
		bet(message,room,chatter)
	}
	if (message.indexOf('CALL') != -1 && cards[room].players[chatter].options[1].indexOf('CALL') != -1) {
		callAmount = cards[room].currentBet - cards[room].players[chatter].currentBet
		if (callAmount > wallets[chatter]) {
			bot.sendMessage(room,"You don't have enough to call") // SIDE POTS! (and say all in)
		} else {
			wallets[chatter] = wallets[chatter] - callAmount
			bot.sendMessage(room,bot.users[chatter].playerName + ' called.')
			cards[room].pot = cards[room].pot + callAmount
			cards[room].players[chatter].currentBet = cards[room].players[chatter].currentBet + callAmount
			cards[room].players[chatter].options = [['AWAIT YOUR TURN'],['WAIT']]
			sendHand(room,chatter)
			theNextPlayer = nextPlayer(room)
			if (theNextPlayer == cards[room].originalTurn) {
				bot.sendMessage(room,'SHOWDOWN BEGINS')
				showdown(room,1)
			} else {
				callAmount = cards[room].currentBet - cards[room].players[theNextPlayer].currentBet
				cards[room].players[theNextPlayer].options = [['RAISE (#)','CALL (' + callAmount + ')','FOLD'],['RAISE','CALL','FOLD']]
				sendHand(room,theNextPlayer)
			}
		}
	}
	if (message.indexOf('RAISE') != -1 && cards[room].players[chatter].options[1].indexOf('RAISE') != -1) {
		raise(message,room,chatter)
	}
	if (isThisANumber(message) != undefined && cards[room].players[chatter].options[1].indexOf('RAISE-INC') != -1) {
		raise(message,room,chatter)
	}
	if (message.indexOf('FOLD') != -1 && cards[room].players[chatter].options[1].indexOf('FOLD') != -1) {
		cards[room].playersLeft.splice(cards[room].playersLeft.indexOf(chatter))
		theNextPlayer = nextPlayer(room)
		if (Object.keys(cards[room].players).length == 1){
			bot.sendMessage(room,bot.users[theNextPlayer].playerName + ' wins ' + cards[room].pot)
			wallets[theNextPlayer] = wallets[theNextPlayer] + cards[room].pot
			cards[room].pot = 0
			sendHand(room,theNextPlayer)
			//AND CLEANUP DUTIES
		}
		else {
			callAmount = cards[room].currentBet - cards[room].players[theNextPlayer].currentBet
			cards[room].players[theNextPlayer].options = [['RAISE (#)','CALL (' + callAmount + ')','FOLD'],['RAISE','CALL','FOLD']]
			sendHand(room,theNextPlayer)
		}
	}
	if (message.indexOf('YES') != -1 && cards[room].players[chatter].options[1].indexOf('YESSHOW') != -1) {
		showdown(room,1)
	}
	if (message.indexOf('NO') != -1 && cards[room].players[chatter].options[1].indexOf('NOSHOW') != -1) {
		showdown(room,0)
	}
});