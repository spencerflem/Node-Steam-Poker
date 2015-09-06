module.exports = Controller;

function Controller(model) {
	this.model = model;
}

Controller.prototype.evaluateInput = function(id, message, chatter, type) {
	var inputs = findInputs(message);
	this.model.useInputs(inputs, id, message, type, chatter);
}

function findInputs(message) {
	var MESSAGE = message.toUpperCase();
	var inputs = {};
	
	inputs.commands = [];
	var commandList = [["CHECK","CHECK"], ["BET","BET"], ["RAISE","RAISE"], ["CALL","CALL"], ["ALL IN","ALL IN"], ["ALL-IN","ALL IN"], ["FOLD","FOLD"], ["HIT ME","HIT ME"]]
	for (var i=0; i < commandList.length; i++) { //truly necessary for arrays? Enums?
		if (MESSAGE.indexOf(commandList[i][0]) !== -1) {
			console.log(commandList[i][0]);
			inputs.commands.push(commandList[i][1]);
		}
	}
	
	inputs.amounts = [];
	inputs.amounts = extractNumbers(MESSAGE);
	
	inputs.decisions = [];
	var decisionList = [["YES",true], ["NO", false], ["YEP", true], ["NOPE", false], ["NAH", false], ["CERTAINLY", true]];
	for (var i=0; i < decisionList.length; i++) {
		if (MESSAGE.indexOf(decisionList[i][0]) !== -1) {
			inputs.decisions.push(decisionList[i][1]);
		}
	}
	
	return inputs;
}


function extractNumbers(message) { //w/e fix l8r //old: /(-?\.?\d+\.?\d*)/g; or /[\d\-\.]*\d+/g <-- better?
	var numbersRegex = /(-?\.?\d+\.?\d*)/g;
	var commasRegex = /[,]/g; //_.pull works too
	var numbers = [];
	noCommasMessage = message.replace(commasRegex,'')
	numbers.concat(noCommasMessage.match(numbersRegex));
	for (var h=0; h < numbers.length || 0; h++) {
		numbers[h] = parseInt(numbers[h]);
	}
	
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
	return numbers; // Array should be in order of distance, right now is not due to copypasta
}