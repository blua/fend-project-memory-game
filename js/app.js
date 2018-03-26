/*
* Create a list that holds all of your cards
*/

let cardArray = [
    "fa-anchor",
    "fa-anchor",
    "fa-bicycle",
    "fa-bicycle",
    "fa-bolt",
    "fa-bolt",
    "fa-bomb",
    "fa-bomb",
    "fa-cube",
    "fa-cube",
    "fa-diamond",
    "fa-diamond",
    "fa-leaf",
    "fa-leaf",
    "fa-paper-plane-o",
    "fa-paper-plane-o"
]

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

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

const shuffledCards = shuffle(cardArray);

const deck = document.querySelector('.deck');

for (let i = 0; i < shuffledCards.length; i++) {
    deck.insertAdjacentHTML('beforeend', '<li class="card"><i class="fa ' + cardArray[i] + '"></i></li>');
}

/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

let openCardList = [];
let moveCount = 0;
let matchedCards = 0;
let timer = {}
let time = 0;
let minutes = '00';
let seconds = '00';

const container = document.querySelector('.container');
const stars = document.querySelector('.stars');
const timerSpan = document.querySelector('.timer');

deck.addEventListener('click', cardClick)

function cardClick(event) {
    // Only works if the target is a card (li element) and it's not open or matched.
    // Doesn't work if 2 cards are already open (i.e. if player clicks on 3rd card too quickly).
    if (event.target.nodeName === 'LI' && !event.target.classList.contains('open') && !event.target.classList.contains('match') && openCardList.length < 2) {
        if (moveCount === 0) {
            time = 0;
            timer = setInterval(changeTimer, 1000);
        }
        const card = event.target.firstChild.classList[1];
        turnCard(event.target);
        listAsOpen(card);
        if (openCardList.length >1) {
            if (openCardList.indexOf(card, 1) !== -1) {
                lockCard();
            } else {
                setTimeout(function() {noMatch()}, 600);
            }
        }
        incrementCounter();
        if (matchedCards === 8) {
            clearInterval(timer);
            gameWon();
        }
    }
}

function changeTimer() {
    time++;
    minutes = '0' + Math.floor(time/60).toString();
    seconds = '0' + (time % 60).toString();
    timerSpan.textContent = minutes + ':' + seconds.slice(-2);
    if (time === 599) {
        clearInterval(timer);
        expire();
    }
}

function turnCard(element) {
    element.classList.add('open', 'show');
}

function listAsOpen(card) {
    openCardList.unshift(card);
}

function lockCard() {
    const openCards = document.querySelectorAll('.open');
    for (let i = 0; i < 2; i++) {
        openCards[i].classList.add('match');
        openCards[i].classList.remove('open');
    }
    openCardList = [];
    matchedCards += 1;
}

function noMatch(card) {
    const openCards = document.querySelectorAll('.open');
    for (let i = 0; i < openCards.length; i++) {
        openCards[i].classList.remove('open', 'show');
    }
    openCardList = [];
}

function incrementCounter() {
    const moves = document.querySelector('.moves');
    moveCount += 0.5;
    if (moveCount === 1) {
        moves.textContent = moveCount + ' move';
    }
    else if (moveCount % 1 === 0) {
        moves.textContent = moveCount + ' moves';
    }
    // Lose stars upon reaching a certain number of moves
    switch (moveCount) {
        case 15 : stars.children[2].firstChild.className ='fa fa-star-o';
        break;
        case 22: stars.children[1].firstChild.className ='fa fa-star-o';
    }
}

function gameWon() {
    const finalScore = document.querySelector('.final-score');
    const containerWon = document.querySelector('.container-won');
    finalScore.textContent =  minutes + ':' + seconds.slice(-2) + ' and ' + moveCount;
    container.innerHTML = '';
    containerWon.setAttribute('style', 'display: table;');
    containerWon.children[2].append(stars);
}

function expire() {
    const containerExpire = document.querySelector('.container-expire');
    container.innerHTML = '';
    containerExpire.setAttribute('style', 'display: table;');
}
