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

deck.addEventListener('click', cardClick)

function cardClick(event) {
    if (event.target.nodeName === 'LI') {
        if (openCardList.length > 1) {
            noMatch();
        }
       const card = event.target.firstChild.classList[1];
       turnCard(event.target);
       listAsOpen(card);
       if (openCardList.length > 1) {
           if (openCardList.indexOf(card, 1) !== -1) {
               lockCard();
           }
       }
    }
}

function turnCard(element) {
    element.classList.add('open', 'show');
}

function listAsOpen(card) {
    openCardList.unshift(card);
    console.log(openCardList);
}

function lockCard() {
    const openCards = document.querySelectorAll('.open');
    for (let i = 0; i < 2; i++) {
        openCards[i].classList.add('match');
        openCards[i].classList.remove('open');
        openCardList = [];
    }
}

function noMatch(card) {
    const openCards = document.querySelectorAll('.open');
    for (let i = 0; i < openCards.length; i++) {
        openCards[i].classList.remove('open', 'show');
    }
    openCardList = [];
}
