/* * * * * * * * * * * * * * * * * * * * * * * 
    VARS
* * * * * * * * * * * * * * * * * * * * * * */

// Game settings
const timeLimit = 5
const colors = ['red', 'green', 'blue']; // web colors only
const startNumber = 1 // start with three words

// Game elements
const start = document.getElementById('start-button');
const words = document.getElementById('words');
const countDown = document.getElementById('count-down');
const circleMaskFull = document.querySelector('.circle__mask--full');
const circleMaskHalf = document.querySelector('.circle__mask--half');
const circleFills = document.querySelectorAll('.circle__fill');

// Game variables
let challenge = ''; // This var holds the randomly generated color words
let round = 1;

// Voice synth items
const talk = document.getElementById('talk');
const content = document.querySelector('.content');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
	recognition = new SpeechRecognition();
} else {
	console.log('speech recognition seems to be unsuported in this browser');
	recognition = "";
}

start.addEventListener('click', startGame);

function startGame(){
	let userInput = '';

	showChallenge(startNumber);
	placeHolderAnswer()
	timer();
    recognition.start();

	circleMaskFull.classList.add('active');
}

function updateGame(gameStatus, gameTime, round){
console.log('updateGame');
	if ( gameStatus == 'game over' ) {
		console.log('game over');
	}

	if ( gameStatus == 'next round' ) {
		
		console.log('next round');
	}

	// Update timer
	countDown.innerHTML = gameTime;

	// Update button
	start.firstChild.data = gameStatus;
}

function timerAnimation(){
	circleMaskFull.innerHTML = '';
	circleMaskHalf.innerHTML = '';

	const circleFill1 = document.createElement('div');
	circleFill1.classList.add('circle__fill');
	circleFill1.classList.add('active');
	circleMaskFull.appendChild(circleFill1);

	const circleFill2 = document.createElement('div');
	circleFill2.classList.add('circle__fill');
	circleFill2.classList.add('active');
	circleMaskHalf.appendChild(circleFill2);
}

function placeHolderAnswer(){
	let userAnswers = 1;

	var x = setInterval(function() {
		if (userAnswers < 0) {
			userInput = "red"; //placeholder

			if (challenge.trim() == userInput.trim()){
				updateGame('next round', timeLimit, round++);
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
	let gameTime = timeLimit -1;

	let x = setInterval(function() {
		if (gameTime < 1) {
			clearInterval(x);
			updateGame('game over', 0);
		} else {
			updateGame('game running', gameTime);
		}

		gameTime--;
	}, 1000);
}

function gameOver(){
	console.log('game over');

	updateGame(timeLimit);
	// reset css animation
	// clear worlds (in v2 show which words were wrong)
}

function colorSelector(taken) {
	let randomColor = colors[Math.floor(Math.random() * colors.length)];
	
	// See which color label is taken, and look for another color for the class
	if ( taken ) {
		while ( randomColor == taken){
			randomColor = colors[Math.floor(Math.random() * colors.length)]
		}
	}

	return randomColor;
}

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




/* * * * * * * * * * * * * * * * * * * * * * * 
    VOICE SYNTH
* * * * * * * * * * * * * * * * * * * * * * */


recognition.onresult = function(e){
	const current = e.resultIndex;
	const transcript = e.results[current][0].transcript;

	newToDo.value = transcript;
}