model = require('FiveCardDrawModel');

function extractNumbers(message) {
	var numbersRegex = /(-?\.?\d+\.?\d*)/g;
	var commasRegex = /[,]/g; //_.pull works too
	var numbers = [];
	noCommasMessage = message.replace(commasRegex,'')
	numbers = noCommasMessage.match(numbersRegex);
	for (var h = 0; h < numbers.length; h++) {
		numbers[h] = parseInt(numbers[h]);
	}
	console.log(numbers)
	
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
	
	console.log('NUMBERSNUMBERSNUMBERS---' + numbers);
	return numbers; // Array should be in order of distance, right now is not due to copypasta
}