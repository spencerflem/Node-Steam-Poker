var fs = require('fs')
var Steam = require('steam')
var _ = require('lodash')
var express = require('express')

var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.get('/', function(request, response) {
response.send('Hello World!')
})
app.listen(app.get('port'), function() {
console.log("Node app is running at localhost:" + app.get('port'))
})

var startedRooms = []

if (fs.existsSync('servers')) {
	Steam.servers = JSON.parse(fs.readFileSync('servers'))
}

var bot = new Steam.SteamClient()

bot.logOn({
	accountName: 'SpencerFlem', // MUST REMOVE THIS LATER! NOONE MAY SEE!
	password: 'Ap3rtur3',
	shaSentryfile: fs.readFileSync('sentryfile')
})

bot.on('loggedOn', function() {
	var mainChat = '103582791434524271'
	console.log('Logged in!')
	bot.setPersonaName('Dealer')
	bot.setPersonaState(Steam.EPersonaState.Online); // to display your bot's status as "Online"
	bot.joinChat(mainChat);
})

bot.on('servers', function(servers) {
	fs.writeFile('servers', JSON.stringify(servers))
})

bot.on('chatEnter', function(room, response) {
	console.log('entered')
	startupRoom(room)
})

// MAIN

var allData = {}

gameLookup = {
	'103582791434524271':'./Games/Poker/5 Card Draw/5 Card Draw.js' // This to the variable to use functions from?
}
var room103582791434524271 = require('./Games/Poker/5 Card Draw/5 Card Draw.js') // Object / array instead of variable? idk if possible 
// OR: require all by default and use its name as variable

function setupData(room) { //if data didn't change, not necessary?
	condensedUsers = {}
	for (var i = 0; i < Object.keys(bot.chatRooms[room]).length; i++ ) {
		condensedUsers[Object.keys(bot.chatRooms[room])[i]] = bot.users[Object.keys(bot.chatRooms[room])[i]]
	}
	
	allData[room].users = condensedUsers
	allData[room].steamID = bot.steamID
	allData[room].thisChatRoom = bot.chatRooms[room]
	allData[room].friends = 'NONEXISTANT' //Make this not so!
	allData[room].stored = {}
}

var players = []

function startupRoom(room) { // If went offline and rejoined done restart room?
	allData[room] = {}
	setupData(room)
	progress = room103582791434524271.startup(allData[room])
	applyProgress(progress, room)
	console.log('STARTY-STARTY')
}

function applyProgress(progress, room) {
	allData[room].stored = progress.storedData
	commandList = Object.keys(progress.commands)
	if (commandList.indexOf('sendMessage') !== -1) {
		for (var i = 0; i < progress.commands.sendMessage.length; i++) {
			if (progress.commands.sendMessage[i][0] === 'room') { //why cant it know its room?
				bot.sendMessage(room, progress.commands.sendMessage[i][1])
			}
			else {
				bot.sendMessage(progress.commands.sendMessage[i][0], progress.commands.sendMessage[i][1])
			}
		}
	}
	if (commandList.indexOf('lockChat') !== -1) {
		if (lockChat === true) {
			bot.lockChat(room)
		}
	}
	if (commandList.indexOf('unlockChat') !== -1) {
		if (unlockChat === true) {
			bot.unlockChat(room)
		}
	}
	if (commandList.indexOf('setModerated') !== -1) {
		if (setModerated === true) {
			bot.setModerated(room)
		}
	}
	if (commandList.indexOf('setUnmoderated') !== -1) {
		if (setUnmoderated === true) {
			bot.setUnmoderated(room)
		}
	}
	if (commandList.indexOf('kick') !== -1) {
		for (var i = 0; i < progress.commands.kick.length; i++) {
			bot.kick(room, progress.commands.kick[i])
		}
	}
	if (commandList.indexOf('ban') !== -1) {
		for (var i = 0; i < progress.commands.ban.length; i++) {
			bot.ban(room, progress.commands.ban[i])
		}
	}
	if (commandList.indexOf('unban') !== -1) {
		for (var i = 0; i < progress.commands.unban.length; i++) {
			bot.unban(room, progress.commands.unban[i])
		}
	}
}

bot.on('chatStateChange', function(type, player, room, agent) {
	//console.log(type + '-' + player + '-' + room + '-' + agent)
})

bot.on('chatMsg', function(room, message, type, player) {
	progress = room103582791434524271.checkMsg(allData[room], message, type, player)
	applyProgress(progress, room)
	// Do something with progress, prehaps an eval function
	
})


