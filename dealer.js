var util = require('util');
var fs = require('fs');

var ParentBot = require('steam-parentbot').ParentBot;
var FiveCardDraw = require('./FiveCardDraw.js');


var ChildBot = function() {
	ChildBot.super_.apply(this, arguments);
	
	var that = this;
	this.steamFriends.on('chatInvite', function (steamID, name, user) { that._onChatInvite(steamID, name, user) });
	this.steamFriends.on('chatMsg', function (steamID, name, type, chatter) { that._onChatMsg(steamID, name, type, chatter) });
	this.steamFriends.on('chatEnter', function (steamID, response) { that._onChatEnter(steamID, response) });
	
	this.fiveCardDraw = new FiveCardDraw(this);
}

util.inherits(ChildBot, ParentBot);

var username = 'spencerflem';

var Bot = new ChildBot(username, fs.readFileSync('secrets/' + username + '.password', 'utf-8'), {
	sentryfile: 'secrets/' + username + '.sentry',
	logfile: 'secrets/' + username + '.log'
});

Bot.connect();

ChildBot.prototype._onFriendMsg  = function(id, message, type, chatter) {
	this.logger.info(id + "-" + message + "-" + type + "-" + chatter);
	this.fiveCardDraw.evaluateInput(id, message, type, chatter);
};

ChildBot.prototype._onChatMsg = function(id, message, type, chatter) {
	this.logger.info(id + "-" + message + "-" + type + "-" + chatter);
	this.fiveCardDraw.evaluateInput(id, message, type, chatter);
}

ChildBot.prototype._onChatEnter = function(id, response) {
	playersList = Object.keys(this.steamFriends.chatRooms[id]);
	console.log(playersList);
	for (var i=0; i < playersList.length; i++) {
		if(playersList[i] !== this.steamClient.steamID) {
			console.log(playersList[i]);
			this.fiveCardDraw.addPlayer(playersList[i]);
			
		}
	}
	this.fiveCardDraw.startGame();
}

ChildBot.prototype._onChatInvite = function(id, name, user){
	console.log("ID-" + id);
	this.steamFriends.joinChat(id);
}

process.on('SIGINT', function() {
	//log off nicely?
	setTimeout(process.exit, 1000, 0);
});

//WHY PARENTBOT?
//COPY RELEVENT PEICES, PARENTBOT SUX?
//OR RATHER< WHY IS CHAT AND FRIEND MSG OBFUSCATED?