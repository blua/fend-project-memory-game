// Create an array to hold the 16 cards: 2 of each icon.
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

// After shuffling, add each card to the game by adding a li element
// with the corresponding class to the deck ul.

const deck = document.querySelector('.deck');

for (let i = 0; i < shuffledCards.length; i++) {
    deck.insertAdjacentHTML('beforeend', '<li class="card"><i class="fa ' + cardArray[i] + '"></i></li>');
}

// Create variables that will be needed in more than one function.
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
    // Only works if target is a card (li element) and it's not open or matched.
    // Doesn't work if 2 cards are already open (i.e. if player clicks on 3rd card too quickly).
    if (event.target.nodeName === 'LI' && !event.target.classList.contains('open') && !event.target.classList.contains('match') && openCardList.length < 2) {
        // If it's the first move, start the counter
        if (moveCount === 0) {
            time = 0;
            timer = setInterval(changeTimer, 1000);
        }
        // Turn card and add it to list of open cards
        const card = event.target.firstChild.classList[1];
        turnCard(event.target);
        listAsOpen(card);
        // If there's already an open card, see if the two match and run a function accordingly.
        if (openCardList.length > 1) {
            if (openCardList.indexOf(card, 1) !== -1) {
                lockCard();
            } else {
                setTimeout(function() {noMatch()}, 600);
            }
        }
        incrementCounter();
        // If all cards have been matched, stop timer and end game.
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
    // Expire game if it's not completed in 10 minutes
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

// When cards match, change class to "match", increase count of matched cards and empty list.
function lockCard() {
    const openCards = document.querySelectorAll('.open');
    for (let i = 0; i < 2; i++) {
        openCards[i].classList.add('match');
        openCards[i].classList.remove('open');
    }
    matchedCards += 1;
    openCardList = [];
}

// When cards don't match, flip both over and empty list.
function noMatch(card) {
    const openCards = document.querySelectorAll('.open');
    for (let i = 0; i < openCards.length; i++) {
        openCards[i].classList.remove('open', 'show');
    }
    openCardList = [];
}

// Increment counter 0.5 per click, because a full move is comprised of
// 2 clicks, that open 2 cards.
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

// When game is own, remove the element that contains the game and replace it
// with another that congratulates the player.
function gameWon() {
    const finalScore = document.querySelector('.final-score');
    const containerWon = document.querySelector('.container-won');
    finalScore.textContent =  minutes + ':' + seconds.slice(-2) + ' and ' + moveCount;
    container.innerHTML = '';
    containerWon.setAttribute('style', 'display: table;');
    containerWon.children[2].append(stars);
}

// When game expires, remove the element that contains the game and replace it
// with another that suggests the player starts again.
function expire() {
    const containerExpire = document.querySelector('.container-expire');
    container.innerHTML = '';
    containerExpire.setAttribute('style', 'display: table;');
}
