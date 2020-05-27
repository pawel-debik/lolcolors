const start = document.getElementById('start-button');
const colors = ['red', 'green', 'blue'];
const words = document.getElementById('words');

start.addEventListener('click', startGame);

function startGame(){
	let userInput = '';

	showChallenge(3);
	// listen for user input callback function?
	userInput = "red green blue"; //placeholder

	validateAnswer(userInput);
}

function validateAnswer(){

}

// This function selects a random color
function colorSelector() {
	return colors[Math.floor(Math.random() * colors.length)];
	// but not if it's the same as the color
}

// This function creates the elements and updates the DOM
function showChallenge( input ){
	let i = 0;
	const label = document.createElement('span');

	while( input > i ){

		label.appendChild(document.createTextNode(colorSelector()));
		words.appendChild(label);
		i++;
	}

}



/*

listen

*/