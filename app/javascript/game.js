let currentPlayer = null;
let otherPlayer = null;
let isAnswered = false;
let chanceToSteal = false;
let answerAttempts = 0;
let questionTimerInterval = null;
let player1Score = 0;
let player2Score = 0;
let gameOver = false;

function updateScoreDisplay() {
    document.getElementById('player1-score').textContent = 'Player 1 Score: ' + player1Score;
    document.getElementById('player2-score').textContent = 'Player 2 Score: ' + player2Score;
}

document.addEventListener('keydown', function(event) {
    if (currentPlayer === null && (event.key === 'a' || event.key === 'A' || event.key === 'l' || event.key === 'L')) {
        playBuzzerSoundEffect();
        if (event.key === 'a' || event.key === 'A') {
            questionTimer()
            currentPlayer = 'Player 1';
            otherPlayer = 'Player 2';
        } else if (event.key === 'l' || event.key === 'L') {
            questionTimer()
            currentPlayer = 'Player 2';
            otherPlayer = 'Player 1';
        }

        document.getElementById('result').textContent = currentPlayer + ' buzzed in!';
    }
});

function checkAnswer(selectedOption) {
    const correctAnswer = document.getElementById('correct-answer').value;
    if (!isAnswered) {
        clearInterval(questionTimerInterval);
        if (selectedOption === correctAnswer) {
            document.getElementById('steal').textContent = '';
            document.getElementById('result').textContent = currentPlayer + ' answered correctly!';
            isAnswered = true;
            if (currentPlayer === 'Player 1') {
                player1Score++;
            } else if (currentPlayer === 'Player 2') {
                player2Score++;
            }

            updateScoreDisplay();
            if (player1Score === 10 || player2Score === 10) {
                declareWinner(currentPlayer);
            } else {
                questionCountdown();
            }
        } else {
            document.getElementById('result').textContent = currentPlayer + ' answered incorrectly!';
            answerAttempts++;
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
        questionTimer();
        answerAttempts++;
    } else {
        document.getElementById('steal').textContent = '';
        document.getElementById('result').textContent = currentPlayer + ' did not answer in time!';
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
}

function loadNewQuestion() {
    if (!gameOver) {
        fetch('/questions/next', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
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
    questionCountdown();
}

function playBuzzerSoundEffect() {
    const buzzer = new Audio('/assets/buzzer1.mp3');
    buzzer.play();
}

function startNewGame() {
    player1Score = 0;
    player2Score = 0;
    gameOver = false;
    currentPlayer = null;
    otherPlayer = null;
    isAnswered = false;
    chanceToSteal = false;
    answerAttempts = 0;
    clearInterval(questionTimerInterval);

    document.getElementById('result').textContent = '';
    document.getElementById('countdown').textContent = '';
    document.getElementById('steal').textContent = '';

    updateScoreDisplay();
    loadNewQuestion();
}

document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', function() {
        if (currentPlayer !== null && !isAnswered) {
            const selectedOption = this.getAttribute('data-answer');
            checkAnswer(selectedOption);
        }
    });
});

startNewGame();
updateScoreDisplay();