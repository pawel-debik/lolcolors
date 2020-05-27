const start = document.getElementById('start-button');
const colors = ['red', 'green', 'blue'];
const words = document.getElementById('words');
const countDown = document.getElementById('count-down');
const timeLimit = 5
const circleMask = document.querySelector('.circle__mask--full');
const circleFills = document.querySelectorAll('.circle__fill');
let challenge = '';

start.addEventListener('click', startGame);

function startGame(){
	let userInput = '';

	showChallenge(3);
	placeHolderAnswer()
	timer();

	circleMask.classList.add('active');
	for (var i = 0; i < circleFills.length; i++) {
		circleFills[i].classList.add('active');
	}

}

function placeHolderAnswer(){
	let userAnswers = 1;

	var x = setInterval(function() {
		if (userAnswers < 0) {
			userInput = "red green blue"; //placeholder

			if (challenge == userInput){
				console.log('correct', challenge, ' ', userInput);
			} else {				
				console.log('wrong', challenge, ' ', userInput);
			}

			clearInterval(x);
		}
		userAnswers--;
	}, 1000);
}

function timer(){
	let gameTime = timeLimit;

	var x = setInterval(function() {
		if (gameTime < 1) {
			clearInterval(x);
			updateBoard('game over', 5);
		} else {
			updateBoard('game running', gameTime);
		}

		gameTime--;
	}, 1000);
}

function gameOver(){
	console.log('game over');

	updateBoard(timeLimit);
	// reset css animation
	// clear worlds (in v2 show which words were wrong)
}

function updateBoard(gameStatus, gameTime){

	if ( gameStatus == 'game over' ) {
		countDown.innerHTML = gameTime;
	}

	// Update timer
	countDown.innerHTML = gameTime;

	// Update button
	//
}

// This function selects a random color
function colorSelector(taken) {
	let randomColor = colors[Math.floor(Math.random() * colors.length)];
	
	if ( taken ) {
		while ( randomColor == taken){
			randomColor = colors[Math.floor(Math.random() * colors.length)]
		}
	}

	return randomColor;
	// but not if it's the same as the color
}

// This function creates the elements and updates the DOM
function showChallenge( input ){
	let i = 0;

	while( input > i ){
		const label = document.createElement('span');
		let wordColor = colorSelector();
		let labelColor = colorSelector(wordColor);

		challenge += `${wordColor} `;

		label.appendChild(document.createTextNode(wordColor));
		label.classList.add('word__label');
		label.classList.add(`word__label--${labelColor}`);
		words.appendChild(label);
		i++;
	}

}