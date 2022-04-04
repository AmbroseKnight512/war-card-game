const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♠", "♣", "♥", "♦"];
const aiCardDraw = document.querySelector(".ai-card-draw");
const playerCardDraw = document.querySelector(".player-card-draw");
const aiDeckElement = document.querySelector(".ai-deck");
const playerDeckElement = document.querySelector(".player-deck");
const text = document.querySelector(".text")

let playerDeck, aiDeck, inRound, stop
const VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

export default class Deck {
  constructor(cards = flipDeck()) {
    this.cards = cards;
  }

  get randomOfCards() {
    return this.cards.length;
  }

  pop() {
    return this.cards.shift();
  }

  push(card) {
    this.cards.push(card);
  }

  shuffler() {
    for (let i = this.randomOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red";
  }

  getHTML() {
    const cardDiv = document.createElement("div")
    cardDiv.innerText = this.suit;
    cardDiv.classList.add("card", this.color);
    cardDiv.dataset.value = `${this.value} ${this.suit}`;
    return cardDiv;
  }
}

function flipDeck() {
  return SUITS.flatMap(suit => {
    return VALUES.map(value => {
      return new Card(suit, value);
    })
  })
}

document.addEventListener("click", () => {
  if (stop) {
      startGame();
      return;
  }

  if (inRound) {
    cleanBeforeRound();
  } else {
    flipCards();
  }
})

startGame();
function startGame() {
  const deck = new Deck();
  deck.shuffler();

  const deckMidpoint = Math.ceil(deck.randomOfCards / 2);
  playerDeck = new Deck(deck.cards.slice(0, deckMidpoint));
  aiDeck = new Deck(deck.cards.slice(deckMidpoint, deck.randomOfCards));
  inRound = false;
  stop = false;

  cleanBeforeRound();
}

function cleanBeforeRound() {
  inRound = false;
  aiCardDraw.innerHTML = "";
  playerCardDraw.innerHTML = "";
  text.innerText = "";

  updateDeckCount()
}

function flipCards() {
  inRound = true;

  const playerCard = playerDeck.pop();
  const aiCard = aiDeck.pop();

  playerCardDraw.appendChild(playerCard.getHTML());
  aiCardDraw.appendChild(aiCard.getHTML());

  updateDeckCount();

  if (isRoundWinner(playerCard, aiCard)) {
    text.innerText = "Win";
    playerDeck.push(playerCard);
    playerDeck.push(aiCard);
  } else if (isRoundWinner(aiCard, playerCard)) {
    text.innerText = "Lose";
    aiDeck.push(playerCard);
    aiDeck.push(aiCard);
  } else {
    text.innerText = "Draw";
    playerDeck.push(playerCard);
    aiDeck.push(aiCard);
  }

  if (isGameOver(playerDeck)) {
    text.innerText = "You Lose!!";
    stop = true;
  } else if (isGameOver(aiDeck)) {
    text.innerText = "You Win!!";
    stop = true;
  }
}

function updateDeckCount() {
    aiDeckElement.innerText = aiDeck.randomOfCards;
    playerDeckElement.innerText = playerDeck.randomOfCards;
}

function isRoundWinner(cardOne, cardTwo) {
    return VALUE_MAP[cardOne.value] > VALUE_MAP[cardTwo.value];
}

function isGameOver(deck) {
    return deck.randomOfCards === 0;
}