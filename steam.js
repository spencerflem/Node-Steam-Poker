var fs = require('fs');
var Steam = require('steam');

/*
var playerList = []

function addPlayerToList(user, room) {
	playerList.push(user)
	if (playerList.room == undefined) {
		console.log('NOPE')
	}
	else {
		result = isInList(room, playerList.room)
		if (result == -1) {
			playerList.room = room
			console.log('-> ' + playerList.room)
		}
		else {
		console.log(result)
		}
	}
}

function isInList(object, list) {
	var loop = true
	var i = 0
	while (loop == true) {
		if (list[i] == object) {
			return i
			loop = false
		}
		else if (i == playerList.length) {
		return -1
			loop = false
		}
		else {
			i++
		}
	}
}
*/

function checkMessage(source, chatter, message, playerName) {
	if (message == 'Radish' && typeof chatter !== "undefined") {
		sendMessage(chatter, 'You said the R-word!', playerName)
	}
}

function joinChat(chatID, name, inviterID) {
	bot.joinChat(chatID);
	if (inviterID == '') {
		console.log('Joining chat: ' + name +  ' (' + chatID + ')')
	}
	else {
		playerName = (bot.users[inviterID].playerName)
		console.log('Joining chat: ' + name +  ' (' + chatID + ') ' + 'invited by: ' + playerName + ' (' + inviterID + ')');
	}
}

function sendMessage(source, message, playerName) {
	bot.sendMessage(source, message, Steam.EChatEntryType.ChatMsg)
	console.log('Sent messsage: ' + message + ' to: ' + playerName + ' (' + source + ')')
}

function shuffle(deck) {
	var counter = deck.length, temp, index
	while(counter--) {
		index = (Math.random() * counter) | 0 
		temp = deck[counter]
		deck[counter] = deck[index]
		deck[index] = temp
	}
	return deck
}

/*
var hands = []
function setHands(deck, number, roomList, playerList) {
	for (i=0;i<roomList.length;i++) {
		hands.push(roomList[i])
		//console.log(i)
		for (j=0;j<playerList.length;j++) {
			hands[i].push (playerList[j])
			var currentHand = []
			for (k=0;k<number;k++) {
				pushNum = k * playerList.length
				hands[i].push (deck[pushNum])
			}
			hands.push (currentHand)
		}		
	}
	//console.log(hands)
	return hands
}
*/

function setHands(deck, number) {
	console.log(Object.keys(bot.chatRooms))
	for (i=0;i<Object.keys(bot.chatRooms).length;i++) {
		console.log(Object.keys(bot.chatRooms).length)
		for (j=0;j<Object.keys(bot.chatRooms)[i].length;j++) {
			//deal(deck,bot.chatRooms[i],bot.chatRooms[i][j])
			//+console.log(Object.keys(bot.chatRooms)[i])
		}		
	}
}

function deal(deck, room, player) {
	console.log(bot.chatRooms[room][player])
}

function formatChat(hand, chips, pot, callAmount, actions) {
	chat = '______________________________________________·                                   Your Hand:                                    ·                                   PP'
}

// if we've saved a server list, use it
if (fs.existsSync('servers')) {
	Steam.servers = JSON.parse(fs.readFileSync('servers'));
}

var bot = new Steam.SteamClient();

bot.logOn({
	accountName: 'SpencerFlem',
	password: 'Ap3rtur3',
	shaSentryfile: fs.readFileSync('sentryfile')
});

bot.on('loggedOn', function() {
	var mainChat = '103582791434524271';
//  var mainChat = '76561197992656741';
	console.log('Logged in!');
	bot.setPersonaName('Dealer');
	bot.setPersonaState(Steam.EPersonaState.Online); // to display your bot's status as "Online"
	joinChat(mainChat,'','');//'' is to keep inviterID and name from screwing everything up
});

bot.on('servers', function(servers) {
	fs.writeFile('servers', JSON.stringify(servers));
});

bot.on('message', function(source, message, type, chatter) {
	if (message == '') {
	}
	else {
		if (typeof chatter == "undefined") {
			playerName = (bot.users[source].playerName)
			console.log('Received message: ' + message + ' from: ' + playerName + ' (' + source + ')');
		}
		else {
			bot.addFriend('76561197999625756')
			playerName = (bot.users[chatter].playerName)
			console.log('Received message: ' + message + ' in room: ' + 'FIND NAME' + ' (' + source + ') ' + 'from user: ' + playerName + ' (' + chatter + ')');
		}
	checkMessage(source, chatter, message, playerName);
  }
});

bot.on('chatInvite', function(chatID,name,inviterID) {
	joinChat(chatID, name, inviterID)
});

bot.on('relationships', function(userID, relationship) {
	//console.log(relationship)
	//console.log(bot.EFriendRelationship[userID])
}); //Get this to work, plz

bot.on('chatStateChange', function(type, user, room, moderator) {
/* EChatMemberStateChange
   type 1  = ENTERED
   type 2  = LEFT
   type 4  = DISONECTED
   type 8  = KICKED
   type 16 = BANNED */
	playerName = (bot.users[user].playerName)
	modName = (bot.users[moderator].playerName)
  //There has to be a shorter way, but not my top priority
	if (user == bot.steamID) {
		if (type == 1) {
			console.log('I have joined chat room: ' + '**FIND OUT NAME**' + ' (' + room + ')' )
		}
		else if (type == 2) {
			console.log('I have left chat room: ' + '**FIND OUT NAME**' + ' (' + room + ')' )
		}
		else if (type == 4) {
			console.log(' I have disconected from chat room: ' + '**FIND OUT NAME**' + ' (' + room + ')' )
		}
		else if (type == 8) {
			console.log(' I have been kicked from chat room: ' + '**FIND OUT NAME**' + ' (' + room + ') ' + 'by: ' + modName + ' (' + moderator + ')')
			console.log(bot.chatRooms)
		}
		else if (type == 16) {
			console.log(' I have been BANNED from chat room: ' + '**FIND OUT NAME**' + ' (' + room + ') ' + 'by: ' + modName + ' (' + moderator + ')')
		}
		else {
			console.log('ERROR: Something has gone very seriously wrong. type should be something else')	
		}
	}
	else {
		if (type == 1) {
			console.log(playerName + ' (' + user + ') ' + 'has joined chat room: ' + '**FIND OUT NAME**' + ' (' + room + ')' )
			/*
			result = isInList(user, playerList)
			if (result == -1) {
				addPlayerToList(user, room)
			}
			*/
			hands = setHands(deck,2); //deck, number of cards
		}
		else if (type == 2) {
			console.log(playerName + ' (' + user + ') ' + 'has left chat room: ' + '**FIND OUT NAME**' + ' (' + room + ')' )
			/*
			console.log('----> ' + playerList)
			console.log(bot.users)
			console.log(bot.chatRooms)
			*/
		}
		else if (type == 4) {
			console.log(playerName + ' (' + user + ') ' + 'has disconected from chat room: ' + '**FIND OUT NAME**' + ' (' + room + ')' )
		}
		else if (type == 8) {
			console.log(playerName + ' (' + user + ') ' + 'has been kicked from chat room: ' + '**FIND OUT NAME**' + ' (' + room + ') ' + 'by: ' + modName + ' (' + moderator + ')')
		}
		else if (type == 16) {
			console.log(playerName + ' (' + user + ') ' + 'has been BANNED from chat room: ' + '**FIND OUT NAME**' + ' (' + room + ') ' + 'by: ' + modName + ' (' + moderator + ')')
		}
		else {
			console.log('ERROR: Something has gone very seriously wrong. type should be something else')
		}
	}
});

//Order here is priority of suits/cards
var suits = [
['Spades','♠'],
['Hearts','♥'],
['Clubs','♣'],
['Diamonds','♦']
];
//Jokers will be tricky! So I will do that LATER
var cards = [	
['Ace','A'],
['King','K'],
['Queen','Q'],
['Jack','J'],
['Ten','10'],
['Nine','9'],
['Eight','8'],
['Seven','7'],
['Six','6'],
['Five','5'],
['Four','4'],
['Three','3'],
['Two','2']
];


//set up deck deck=[[['Ace','A']['Spades','♠']][['Ace','A']['Hearts','♥']]...] use --> console.log(deck); to see full list
// var card = 0 console.log(deck[card][0][0],' of ',deck[card][1][0]); to list Ace of Spades (Oth card)

var deck = [];
for (var i=0;i<cards.length;i++)
{
	for (var j=0;j<suits.length;j++)
	{
		deck.push([cards[i],suits[j]]);
	}
}

shuffle(deck);

console.log('Made deck!');