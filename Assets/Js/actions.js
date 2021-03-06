/** TODO

- add user input feedback
- button disabled should run just once


*/

/* * * * * * * * * * * * * * * * * * * * * * * 
    VARS
* * * * * * * * * * * * * * * * * * * * * * */

// Game settings
const timeLimit = 5
const colors = ['red', 'green', 'blue']; // web colors only
const numberOfWordsAtStart = 1 // start with three words

// Game elements
const start = document.getElementById('start-button');
const words = document.getElementById('words');
const progressBar = document.getElementById('progress');
const circle = document.getElementById('animated');
const instructions = document.getElementById('instructions');
const countDown = document.getElementById('count-down');
const soundwaveContainer = document.querySelector('#soundwave-container');
const answers = document.querySelector('.answers');

// Game variables
let challenge = ''; // This var holds the randomly generated color words
let gameStatus = 'not started';
let timeInterval;
let soundwaveInterval;

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


/* * * * * * * * * * * * * * * * * * * * * * * 
    GAME LOGIC
* * * * * * * * * * * * * * * * * * * * * * */

start.addEventListener('click', startGame);


function startGame(){
	let userInput = '';

	console.log(gameStatus);
	if ( gameStatus == 'game over' ){
		// reset things in case there is content from previous round
		challenge = ''; // reset internal variable with words
		words.innerHTML = ''; // clear actual words on the page
		console.log('apparently its game over now');
	}

	if ( gameStatus != 'game running' ){
		answers.innerHTML = ''; // clear input from previous round
		displayWords(numberOfWordsAtStart);
		timer();
		instructions.firstChild.data = 'Name the colors';
		animateSoundwaves('play');
		timerAnimation();
		recognition.start();
		progressBar.classList.add('start');
		updateGame('game running', timeLimit);
	}
}




function updateGame(g, gameTime){

	gameStatus = g;
	start.disabled = false;
	start.classList.remove('game-running');

	if ( gameStatus == 'game running' ) {
		console.log('game running');

		start.firstChild.data = 'game running';
		if ( progressBar.classList.contains('reset') ) {
			progressBar.classList.toggle('reset');
		}

		start.disabled = true;
		start.classList.add('game-running');
	}

	if ( gameStatus == 'game over' ) {
		recognition.stop();
		console.log('game over');

		progressBar.classList.add('reset');
		progressBar.classList.remove('start');
		animateSoundwaves('stop');

		start.firstChild.data = 'Play again';
		instructions.firstChild.data = 'Game over';
	}

	if ( gameStatus == 'next round' ) {
		
		console.log('next round');
		
		start.firstChild.data = 'Start next round';
	}

	// Update timer graphic
	countDown.innerHTML = gameTime;

	// Update button
}



function timerAnimation(){
	progressBar.classList.add('start');
}



function answer(userInput){
	if ( gameStatus == 'game running' ){
		const userInputArr = userInput.split(' ');
		const checkmarkImg = document.createElement('img');

		checkmarkImg.setAttribute('src', 'Assets/Images/checkmark.svg');
		checkmarkImg.classList.add('checkmark');
		
		userInputArr.forEach(function(userInputWord,i){
			const showUserInput = document.createElement('span');
			showUserInput.innerHTML = userInputWord;
			showUserInput.classList.add('word__label');
			answers.appendChild(showUserInput);	
		});
			
		animateSoundwaves('stop');

		if (challenge.trim().toLowerCase() == userInput.trim().toLowerCase()){
			updateGame('next round', timeLimit);
			clearInterval(timeInterval);
			answers.appendChild(checkmarkImg);		
			console.log(`Question: ${challenge}, Answer: ${userInput} Result: Corrent`);
		} else {				
			console.log(`Question: ${challenge}, Answer: ${userInput} Result: Wrong`);
		}
	} else {
		console.log('game has not yet started or has ended already');
	}
}



function timer(){
	let gameTime = timeLimit -1;

	timeInterval = setInterval(function() {
		if (gameTime < 1) {
			clearInterval(timeInterval);
			updateGame('game over', 0);
		} else {
			updateGame('game running', gameTime);
		}

		gameTime--;
	}, 1000);
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



function displayWords( input ){
	let i = 0;

	while( input > i ){
		const label = document.createElement('span');
		let wordColor = colorSelector();
		let labelColor = colorSelector(wordColor);

		challenge += `${labelColor} `;

		label.appendChild(document.createTextNode(wordColor));
		label.classList.add('word__label');
		label.classList.add(`word__label--${labelColor}`);
		words.appendChild(label);
		i++;
	}
}

// if you nested loop through a list it's slow, you probably should use map , hashmap



// User Feedback
function animateSoundwaves(status){
	const shortLine = document.getElementById('line-5');
	const shortLines = document.querySelectorAll('.soundwave-line');

	if ( status == 'play' ) {
		soundwaveInterval = setInterval(function(){
			shortLines.forEach(function(shortLine, i){
				const lineLength =  Math.round(Math.random()*3);
				shortLine.y1.baseVal.value = 8 - lineLength;
				shortLine.y2.baseVal.value = 8 + lineLength;
				shortLine.classList.add('active');
			});
		}, 100);
	}

	if ( status == 'stop' ) {
		clearInterval(soundwaveInterval);
		shortLines.forEach(function(shortLine, i){
			shortLine.y1.baseVal.value = 0;
			shortLine.y2.baseVal.value = 0;
			shortLine.classList.remove('active');
		});
	}

}




/* * * * * * * * * * * * * * * * * * * * * * * 
    VOICE SYNTH
* * * * * * * * * * * * * * * * * * * * * * */

recognition.onresult = function(e){
	const current = e.resultIndex;
	const transcript = e.results[current][0].transcript;

	answer(transcript);
}