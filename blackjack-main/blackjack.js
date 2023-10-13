// Get player name from URL query parameter and display it in the 'player-name' element
const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get('name');
const playerNameSpan = document.getElementById('player-name');
playerNameSpan.textContent = playerName;

// Define an array of card values and suits
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['♠', '♥', '♣', '♦'];

// Initialize variables for the game state
let allDecks = [];
let dealerHand = [];
let playerHand = [];
let playerScore = 0;
let dealerScore = 0;
let ties = 0;

// Function to update the scoreboard 
const updateScoreboard = () => {
    document.getElementById("player-score").textContent = `Player: ${playerScore}`;
    document.getElementById("dealer-score").textContent = `Dealer: ${dealerScore}`;
    document.getElementById("tie-score").textContent = `Ties: ${ties}`;
};

// Create a card model as a div element with 'card' class
// Found this online and addapted to my game after failing to make it work with real cards/photos
//still trying to get it work with images/cards/card = value + suit.png
const cardModel = document.createElement('div');
cardModel.classList.add('card');

// Get necessary DOM elements
const dealer = document.getElementById("dealer");
const player = document.getElementById("player");
const hit = document.getElementById("hit");
const pass = document.getElementById("pass");
const buttonContainer = document.getElementById("button-container");
const notice = document.getElementById("notice");
const nextHand = document.getElementById("next-hand");

// Function to update the deck count displayed on the webpage
// I could use this later to have a reprezentation of what is left from the decks on the table
const updateDeckCount = () => {
    const deckCountElement = document.getElementById('deck-count');
    deckCountElement.textContent = `Cards left in deck before reshuffled: ${allDecks.length}`;
};

// Function to create deck of cards
const createDeck = () => {
    const deck = [];
    suits.forEach((suit) => {
        values.forEach((value) => {
            const card = value + suit;
            deck.push(card);
        });
    });
    return deck;
};

// Function to shuffle
const shuffleDecks = (num) => {
    for (let i = 0; i < num; i++) {
        const newDeck = createDeck();
        allDecks = [...allDecks, ...newDeck];
    }
};

// Function to choose a random card
const chooseRandomCard = () => {
    const totalCards = allDecks.length;
    let randomNumber = Math.floor(Math.random() * totalCards);
    const randomCard = allDecks[randomNumber];
    allDecks.splice(randomNumber, 1);
    updateDeckCount(); 
    return randomCard;
};

// Function to deal initial hands to the dealer and player
const dealHands = async () => {
    dealerHand = [await chooseRandomCard(), await chooseRandomCard()];
    playerHand = [await chooseRandomCard(), await chooseRandomCard()];
    return { dealerHand, playerHand };
};

// Function to calculate hand value including reduce Ace
const calcHandValue = (hand) => {
    let value = 0;
    let hasAce = false;
    hand.forEach((card) => {
        let cardValue = card.length === 2 ? card.substring(0, 1) : card.substring(0, 2);
        if (cardValue === 'A') hasAce = true;
        else if (cardValue === 'J' || cardValue === 'Q' || cardValue === 'K') value += 10;
        else value += Number(cardValue);
    });
    if (hasAce) value + 11 > 21 ? value += 1 : value += 11;
    return value;
};

// Function to show a notice message on the screen
//don't actually know how this works, found a model and was able to use it here.
const showNotice = (text) => {
    notice.children[0].children[0].innerHTML = text;
    notice.style.display = "flex";
    buttonContainer.style.display = "none";
};

// Function to determine the winner based on the hands Value
const determineWinner = async () => {
    let playerValue = calcHandValue(playerHand);
    let dealerValue = calcHandValue(dealerHand);
    if (dealerValue > 21) {
        showNotice(`Dealer's Busted! Hand value ${handValue}.You WIN!`);
        playerScore++;
    }
    let text = `
        Your hand value is ${playerValue}.
        Dealer's hand value is ${dealerValue}.
        ${playerValue > dealerValue ? "You WIN!" : playerValue < dealerValue ? "Dealer WINS!" : "It's a TIE!"}
        `;
    if (playerValue > dealerValue) {
        playerScore++;
    } else if (playerValue < dealerValue) {
        dealerScore++;
    } else {
        ties++;
    }
    updateScoreboard();
    showNotice(text);
};
// Function to simulate player's turn to draw a card
const hitPlayer = () => {
    const card = chooseRandomCard();
    playerHand.push(card);
    let handValue = calcHandValue(playerHand);
    const newCard = cardModel.cloneNode(true);
    newCard.innerHTML = card;
    player.append(newCard);
    if (handValue > 21) {
        let text = `You Busted! Hand value ${handValue}. Dealer WINS!`;
        showNotice(text);
        dealerScore++;
    }
    updateScoreboard();
};

// Function to simulate dealer's turn to draw cards
const hitDealer = async () => {
    // Unhide the first card of the dealer (initially hidden)
    // not sure how it works, found online but was able to make it work here
    const hiddenCard = dealer.children[0];
    hiddenCard.classList.remove('back');
    hiddenCard.innerHTML = dealerHand[0];
    const card = chooseRandomCard();
    dealerHand.push(card);
    const newCard = cardModel.cloneNode(true);
    newCard.innerHTML = card;
    dealer.append(newCard);
    // Draw cards for the dealer until the hand value is at least 17
    let handValue = calcHandValue(dealerHand);
    if (handValue <= 16) {
        hitDealer();
    } else if (handValue === 21) {
        showNotice("Dealer has 21! Dealer WINS!");
        dealerScore++;
    } else if (handValue > 21) {
        showNotice(`Dealer's Busted! Hand value ${handValue}.You WIN!`);
        playerScore++;
    } else {
        // Determine the winner after the dealer's turn
        determineWinner();
    }
    updateScoreboard();
};

// Function to clear hands on the screen
const clearHands = () => {
    dealer.innerHTML = '';
    player.innerHTML = '';
    return true;
};

// Function to initiate a new game
const play = async () => {
    // If there are fewer than 20 cards left in the deck, shuffle 1 additional deck
    if (allDecks.length < 20) shuffleDecks(1);
    // Clear hands from the previous game
    clearHands();
    // Deal initial hands to the dealer and player
    const { dealerHand, playerHand } = await dealHands();
    // Display the dealer's initial hand with one card hidden
    dealerHand.forEach((card, index) => {
        const newCard = cardModel.cloneNode(true);
        index === 0 ? newCard.classList.add('back') : newCard.innerHTML = card;
        dealer.append(newCard);
    });
    // Display the player's initial hand
    playerHand.forEach((card) => {
        const newCard = cardModel.cloneNode(true);
        newCard.innerHTML = card;
        player.append(newCard);
    });
    // Hide the notice message and show game buttons
    // not sure how it works, part of the solution found online and addapted here
    notice.style.display = "none";
    buttonContainer.style.display = "block";
};

// Event listeners for game buttons
hit.addEventListener('click', hitPlayer);
pass.addEventListener('click', hitDealer);
nextHand.addEventListener('click', play);

// Start a new game when the page loads with 3 decks.
shuffleDecks(3)
play();

