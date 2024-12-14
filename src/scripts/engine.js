


const gameState = {
    playerScore:0,
    computerScore:0,
    cardSprite: {
        cardImage: document.getElementById("card-image"),
        cardName:  document.getElementById("card-name"),
        cardType: document.getElementById("card-type"),
    },
    fieldCards:{
        playerFieldCard: document.querySelector(".player-cards"),
        playerCards: null,
        computerFieldCard: document.querySelector(".computer-cards"),
        computerCards: null
    },
    duelFieldCards: {
        playerFieldCard: document.querySelector("#player-field-card"),
        computerFieldCard: document.querySelector("#computer-field-card"),
    },
    action: {
        resetButton: document.getElementById("next-duel")
    },
    selectedCardImage: null,
    selectedCardName:  '',
    selectedCardType: '',
    playerTurn: true,
    scoreDisplay: document.getElementById("score_points"),
    totalOfCards: 5,
    cardBackImg: './src/assets/icons/card-back.png',
};

const imgPath = './src/assets/icons/'
const cardData = [
    {
        id:1,
        Name:'Blue-Eyes White Dragon',
        type:'Paper',
        img:`${imgPath}dragon.png`,
        winOf:2,
        loseOf:3
    },
    {
        id:2,
        Name:'Dark Magician',
        type:'Rock',
        img:`${imgPath}magician.png`,
        winOf:3,
        loseOf:1
    },
    {
        id:3,
        Name:'Exodia the Forbidden One',
        type:'Scissors',
        img:`${imgPath}exodia.png`,
        winOf:1,
        loseOf:2
    }
]

function choseComputerCard() {
    gameState.playerTurn = false;
    const cardsInHand = gameState.fieldCards.computerFieldCard.childElementCount;
    const randomComputerCardId = Math.floor(Math.random() * (cardsInHand -1));
    const computerSelectedCardId = gameState.fieldCards.computerFieldCard.children[randomComputerCardId].getAttribute('data-id');
    const computerSelectedCard= cardData[Number(computerSelectedCardId) -1];
    setCardsField(Number(computerSelectedCardId));
    return computerSelectedCard;
}

function resetDuel(){
    gameState.playerTurn = true;
    gameState.action.resetButton.style.display = 'none';

    const {playerFieldCard, computerFieldCard} = gameState.duelFieldCards;
    playerFieldCard.src = gameState.cardBackImg;
    computerFieldCard.src = gameState.cardBackImg;

    if(gameState.fieldCards.playerFieldCard.childElementCount <= 1){
        gameInit();
    }
    gameState.fieldCards.playerCards.remove();
    gameState.fieldCards.computerCards.remove();
    gameState.totalOfCards--;

    const cardsImages = document.querySelectorAll('.card');
    cardsImages.forEach(card => card.style.display = 'block');
};

function duelCards(playerCard) {
    const cardsImages = document.querySelectorAll('.card');
    cardsImages.forEach(card => card.style.display = 'none');
    
    const computerCard = choseComputerCard();
    let gameResult;
    if(playerCard.id === computerCard.winOf){
        gameState.playerScore++;
        gameState.scoreDisplay.textContent = `Player: ${gameState.playerScore} | NPC: ${gameState.computerScore}`;
        playAudio('win');
        gameResult = 'Ganhou';
    }else if(playerCard.id === computerCard.loseOf){
        gameState.computerScore++;
        gameState.scoreDisplay.textContent = `Player: ${gameState.playerScore} | NPC: ${gameState.computerScore}`;
        playAudio('lose');
        gameResult = 'Perdeu';
    }else {
        gameResult = 'Empatou';
    };

    gameState.action.resetButton.textContent = gameResult;
    gameState.action.resetButton.style.display = 'block';

    return
};

async function getRandomCardId() {
    return cardData[Math.floor(Math.random() * cardData.length)].id
};

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', gameState.cardBackImg);
    cardImage.setAttribute('data-id', cardId);
    cardImage.classList.add('card');

    if(fieldSide === gameState.fieldCards.playerFieldCard) {
        cardImage.addEventListener('click', () => {
        setCardsField(cardImage.getAttribute('data-id'));
        duelCards(cardData[Number(cardId) - 1])
    });
        cardImage.addEventListener('mouseover', () => {
        showCardDetails(cardId)
    });
};


    return cardImage;
}

function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function playbgm() {
    const audio = new Audio('./src/assets/audios/egyptian_duel.mp3');
    audio.loop = true;
    audio.play();
    const btnMusic = document.querySelector('.bgm');
    btnMusic.remove()
}

function setCardsField(cardId) {
    if(gameState.playerTurn){
        gameState.duelFieldCards.playerFieldCard.src = cardData[Number(cardId) - 1].img;
         const playerCardList = Array.from(gameState.fieldCards.playerFieldCard.children)
         gameState.fieldCards.playerCards = playerCardList.find(card => Number(card.getAttribute('data-id')) === Number(cardId));

}else {
    gameState.duelFieldCards.computerFieldCard.src = cardData[Number(cardId) - 1].img;
     const computerCardList = Array.from(gameState.fieldCards.computerFieldCard.children)
     gameState.fieldCards.computerCards = computerCardList.find(card => Number(card.getAttribute('data-id')) === Number(cardId));
}

    }

function showCardDetails(cardId) {
    gameState.selectedCardImage = cardData[Number(cardId) - 1].img;
    gameState.selectedCardName = cardData[Number(cardId) - 1].Name;
    gameState.selectedCardType = cardData[Number(cardId) - 1].type;
    gameState.cardSprite.cardImage.src = gameState.selectedCardImage;
    gameState.cardSprite.cardName.textContent = gameState.selectedCardName;
    gameState.cardSprite.cardType.textContent = gameState.selectedCardType;
}
async function dealCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomCardId = await getRandomCardId();
        const cardImage = await createCardImage(randomCardId, fieldSide);
        fieldSide.appendChild(cardImage);
};
};

function setDefaultGameState() {
    gameState.totalOfCards = 5;
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.selectedCardImage = '';
    gameState.selectedCardName =  '';
    gameState.selectedCardType = '';
    gameState.cardSprite.cardImage.src = gameState.selectedCardImage;
    gameState.cardSprite.cardName.textContent = gameState.selectedCardName;
    gameState.cardSprite.cardType.textContent = gameState.selectedCardType;
    
}

async function gameInit() {
    setDefaultGameState();
    gameState.scoreDisplay.textContent = `Player: ${gameState.playerScore} | NPC: ${gameState.computerScore}`;
    
    dealCards(gameState.totalOfCards, gameState.fieldCards.playerFieldCard);
    dealCards(gameState.totalOfCards, gameState.fieldCards.computerFieldCard);
    
};
gameInit();

// magician - rock | exodia - scissors | dragon - paper

