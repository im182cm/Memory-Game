//Create a list that holds all of your cards
const cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
//An array to hold locked cards.
var openedCardArray = [];
//An array to hold a card during opening two cards.
var tempOpendCardArray = [];
//Count for moves.
var moveCount = 0;
//To save started time.
var startTime = 0;
//Variable to pervent race conditions.
var semaphore = false;

var notMatchedSrc = 'https://www.pngkey.com/png/detail/18-184185_meme-pepethefrog-pepe-frog-depressed-fat-ugly-memes.png';
var matchedSrc = 'https://i.imgflip.com/8uinm.jpg';
var popupImage = new Image(300, 300);
popupImage.style.cssText = "position: fixed; display: none; margin: auto; z-index: 2;"
document.body.querySelector('.container').appendChild(popupImage);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function init(){
	shuffle(cardArray);
	var cards = document.querySelectorAll('.card');
	for (var i = 0; i < cards.length; i++) {
		cards[i].classList = "card";
		cards[i].firstElementChild.classList = "fa " + cardArray[i];
		cards[i].addEventListener('click', function() {
			showCard(event)
		});
	}
	document.querySelector('.moves').textContent = moveCount;
}

init();
document.querySelector('.restart').addEventListener('click', function() {
	location.reload();
})

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Show the card is clicked.
 */
function showCard(event) {
	//If reversing the card.
	if(semaphore)
		return;

	//Set start time once.
	if(startTime == 0) {
		startTime = performance.now();
	}
	var target = event.target;

	//If a card which is already matched or the same card is clicked.
	if(openedCardArray.includes(target)
		|| (tempOpendCardArray.length > 0 && tempOpendCardArray[0] === target)) {
		return;
	}
	
	target.classList = "card show open";
	var targetClassName = target.firstElementChild.className;
	
	if(tempOpendCardArray.length > 0) {
		if(tempOpendCardArray[0].firstElementChild.className === targetClassName) {
			lockCardAsOpened(target);
			setTimeout(showPopupImage, 500, true);
		} else {
			semaphore = true;
			setTimeout(showPopupImage, 500, false);
			setTimeout(reverseCard, 500, target);
		}
		updateCountAndStars();
	} else {
		tempOpendCardArray.push(target);
	}
}

/*
 * Display selected card symbol.
 */
function lockCardAsOpened(target) {
	openedCardArray.push(target);
	openedCardArray.push(tempOpendCardArray.pop());
}

/*
 * Reverse the status of the card.
 */
function reverseCard(target) {
	tempOpendCardArray.pop().classList = "card";
	target.classList = "card";
	semaphore = false;
}

/*
 * Update move count and stars if more than 17 and 25.
 */
function updateCountAndStars() {
	moveCount++;
	document.querySelector('.moves').textContent = moveCount;
	if(moveCount === 17){
		document.querySelector('.stars').firstElementChild.remove();
	} else if(moveCount === 25) {
		document.querySelector('.stars').firstElementChild.remove();
	}

	if(checkGameFinishied()){
		setTimeout(showCongratsPopup, 500);
	}
}

/*
 * Check if all cards are matched.
 */
function checkGameFinishied() {
	return openedCardArray.length === 16;
}

/*
 * Change milisecond to readable time.
 */
function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

/*
 * Show modal popup.
 */
function showCongratsPopup() {
	var endTime = performance.now();
	var playTime = msToTime(endTime - startTime);
	var starsCount = document.querySelector('.stars').childElementCount;
	if (confirm("Congrats!\nYour Score :\nTime: "+playTime+"\nMoves: "+moveCount+"\nStars: "+starsCount+"\n\nDo you want to play again?")) {
		location.reload();
	} else {
	}
}

function showPopupImage(matched) {
	if(matched) {
		popupImage.src = matchedSrc;
	} else {
		popupImage.src = notMatchedSrc;
	}
	popupImage.style.display = "block";

	setTimeout(function() {
		popupImage.style.display = "none";
	}, 300);
}