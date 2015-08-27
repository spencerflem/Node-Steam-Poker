var util = require('util');
var fs = require('fs');

var ParentBot = require('steam-parentbot').ParentBot;
var FiveCardDraw = require('./FiveCardDraw.js');

var ChildBot = function() {
	ChildBot.super_.apply(this, arguments);
}

util.inherits(ChildBot, ParentBot);

var username = 'spencerflem';

var Bot = new ChildBot(username, fs.readFileSync('secrets/' + username + '.password', 'utf-8'), {
	sentryfile: 'secrets/' + username + '.sentry',
	logfile: 'secrets/' + username + '.log'
});

Bot.connect();

process.on('SIGINT', function() {
	//log off nicely?
	setTimeout(process.exit, 1000, 0);
});
