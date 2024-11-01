let currentPlayer = null;
let otherPlayer = null;
let isAnswered = false;
let chanceToSteal = false;
let answerAttempts = 0;
let questionTimerInterval = null;
let player1Score = 0;
let player2Score = 0;
let gameOver = false;
let shownQuestionIds = [];
let player1Name = localStorage.getItem('player1Name') || 'Player 1';
let player2Name = localStorage.getItem('player2Name') || 'Player 2';
let pointsToWin = parseInt(localStorage.getItem('pointsToWin')) || 10;

function updateScoreDisplay() {
    document.getElementById('player1-score').textContent = player1Name + ': ' + player1Score;
    document.getElementById('player2-score').textContent = player2Name + ': ' + player2Score;
}

document.addEventListener('keydown', function(event) {
    if (currentPlayer === null && (event.key === 'a' || event.key === 'A' || event.key === 'l' || event.key === 'L')) {
        playBuzzerSoundEffect();
        enableAnswerButtons();
        if (event.key === 'a' || event.key === 'A') {
            questionTimer()
            currentPlayer = player1Name;
            otherPlayer = player2Name;
        } else if (event.key === 'l' || event.key === 'L') {
            questionTimer()
            currentPlayer = player2Name;
            otherPlayer = player1Name;
        }

        document.getElementById('result').textContent = currentPlayer + ' buzzed in!';
    }
});

function checkAnswer(selectedOption) {
    const correctAnswer = document.getElementById('correct-answer').value;
    if (!isAnswered) {
        clearInterval(questionTimerInterval);
        if (selectedOption === correctAnswer) {
            playCorrectAnswerSoundEffect();
            document.getElementById('steal').textContent = '';
            document.getElementById('result').textContent = currentPlayer + ' answered correctly!';
            isAnswered = true;
            if (currentPlayer === player1Name) {
                player1Score++;
            } else if (currentPlayer === player2Name) {
                player2Score++;
            }

            updateScoreDisplay();
            if (player1Score >= pointsToWin || player2Score >= pointsToWin) {
                declareWinner(currentPlayer);
            } else {
                disableAnswerButtons();
                questionCountdown();
            }
        } else {
            playWrongAnswerSoundEffect();
            document.getElementById('result').textContent = currentPlayer + ' answered incorrectly!';
            answerAttempts++;
            disableAnswerButtons();
            if (answerAttempts < 2) {
                stealQuestion();
            } else {
                document.getElementById('steal').textContent = '';
                questionCountdown();
            }
        }
    }
}

function declareWinner(winner) {
    gameOver = true;
    document.getElementById('result').textContent = '';
    document.getElementById('countdown').textContent = '';
    document.getElementById('steal').textContent = '';
    document.getElementById('result').textContent = winner + ' wins the game!';
    clearInterval(questionTimerInterval);
}

function stealQuestion() {
    if (!chanceToSteal && answerAttempts < 2) {
        chanceToSteal = true;
        document.getElementById('steal').textContent = otherPlayer + ' can steal!';
        [currentPlayer, otherPlayer] = [otherPlayer, currentPlayer];
        isAnswered = false;
        enableAnswerButtons();
        questionTimer();
        answerAttempts++;
    } else {
        document.getElementById('steal').textContent = '';
        document.getElementById('result').textContent = currentPlayer + ' did not answer in time!';
        disableAnswerButtons();
        questionCountdown();
    }
}

function questionCountdown() {
    let countdown = 3;
    document.getElementById('countdown').textContent = '';
    const countdownInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(countdownInterval);
            return;
        }
        document.getElementById('countdown').textContent = "Next question in " + countdown + "...";
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            loadNewQuestion();
        }
    }, 1000);
}

function questionTimer() {
    clearInterval(questionTimerInterval);
    let countdown = 10;
    document.getElementById('countdown').textContent = '';
    questionTimerInterval = setInterval(() => {
        if (isAnswered) {
            clearInterval(questionTimerInterval);
            return;
        }
        document.getElementById('countdown').textContent = countdown + " seconds left to answer...";
        countdown--;
        if (countdown < 0) {
            playWrongAnswerSoundEffect()
            clearInterval(questionTimerInterval);
            document.getElementById('result').textContent = currentPlayer + ' did not answer in time!';
            isAnswered = true;
            stealQuestion();
        }
    }, 1000);
}

function resetRound() {
    document.getElementById('result').textContent = '';
    document.getElementById('countdown').textContent = '';
    document.getElementById('steal').textContent = '';

    clearInterval(questionTimerInterval);
    currentPlayer = null;
    otherPlayer = null;
    isAnswered = false;
    chanceToSteal = false;
    answerAttempts = 0;
    document.getElementById('skip-button').disabled = false;
}

function loadNewQuestion() {
    if (!gameOver) {
        fetch('/questions/next', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            if(shownQuestionIds.includes(data.id)) {
                loadNewQuestion();
                return;
            }

            shownQuestionIds.push(data.id);

            document.querySelector('h2').textContent = data.content;

            const optionButtons = document.querySelectorAll('.option-button');
            optionButtons[0].textContent = "A. " + data.option1;
            optionButtons[0].setAttribute('data-answer', data.option1);
            optionButtons[1].textContent = "B. " + data.option2;
            optionButtons[1].setAttribute('data-answer', data.option2);
            optionButtons[2].textContent = "C. " + data.option3;
            optionButtons[2].setAttribute('data-answer', data.option3);
            optionButtons[3].textContent = "D. " + data.option4;
            optionButtons[3].setAttribute('data-answer', data.option4);

            document.getElementById('correct-answer').value = data.solution;

            resetRound();
        })
        .catch(error => console.error('Error fetching new question:', error));
    }
}

function skipQuestion(){
    document.getElementById('result').textContent = 'Question skipped!';
    document.getElementById('countdown').textContent = '';
    document.getElementById('steal').textContent = '';
    clearInterval(questionTimerInterval);
    disableAnswerButtons();
    questionCountdown();
}

function startNewGame() {
    localStorage.removeItem('player1Name');
    localStorage.removeItem('player2Name');
    localStorage.removeItem('pointsToWin');
    player1Score = 0;
    player2Score = 0;
    gameOver = false;
    currentPlayer = null;
    otherPlayer = null;
    isAnswered = false;
    chanceToSteal = false;
    answerAttempts = 0;
    shownQuestionIds = [];
    clearInterval(questionTimerInterval);

    document.getElementById('result').textContent = '';
    document.getElementById('countdown').textContent = '';
    document.getElementById('steal').textContent = '';

    updateScoreDisplay();
    disableAnswerButtons();
    document.getElementById('skip-button').disabled = false;
    
    loadNewQuestion();
}

function playBuzzerSoundEffect() {
    const buzzer = new Audio('/assets/bellding-254774.mp3');
    buzzer.play();
}
function playCorrectAnswerSoundEffect() {
    const correctSound = new Audio('/assets/chime.mp3');
    correctSound.play();
}
function playWrongAnswerSoundEffect() {
    const wrongSound = new Audio('/assets/negative_beeps-6008.mp3');
    wrongSound.play();
}


document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', function() {
        if (currentPlayer !== null && !isAnswered) {
            const selectedOption = this.getAttribute('data-answer');
            checkAnswer(selectedOption);
        }
    });
});

function disableAnswerButtons() {
    document.querySelectorAll('.option-button').forEach(button => {
        button.disabled = true;
    });
    document.getElementById('skip-button').disabled = true;
}

function enableAnswerButtons() {
    document.querySelectorAll('.option-button').forEach(button => {
        button.disabled = false;
    });
    document.getElementById('skip-button').disabled = false;
}

startNewGame();
updateScoreDisplay();