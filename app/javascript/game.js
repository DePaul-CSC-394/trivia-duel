let currentPlayer = null;
let otherPlayer = null;
let isAnswered = false;
let chanceToSteal = false;
let answerAttempts = 0;
let questionTimerInterval = null;

document.addEventListener('keydown', function(event) {
    if (currentPlayer === null) {
        if (event.key === 'a' || event.key === 'A') {
            questionTimer()
            currentPlayer = 'Player 1';
            otherPlayer = 'Player 2';
        } else if (event.key === 'l' || event.key === 'L') {
            questionTimer()
            currentPlayer = 'Player 2';
            otherPlayer = 'Player 1';
        }

        if (result) {
            document.getElementById('result').textContent = currentPlayer + ' buzzed in!';
        }
    }
});

function checkAnswer(selectedOption) {
    const correctAnswer = document.getElementById('correct-answer').value;
    if (!isAnswered) {
        clearInterval(questionTimerInterval);
        if (selectedOption === correctAnswer) {
            document.getElementById('result').textContent = currentPlayer + ' answered correctly!';
            isAnswered = true;
            document.getElementById('steal').textContent = '';
            questionCountdown();
        } else {
            document.getElementById('result').textContent = currentPlayer + ' answered incorrectly! ';
            answerAttempts++;
            if(answerAttempts < 2){
                stealQuestion();
            } else{
                document.getElementById('steal').textContent = '';
                questionCountdown();
            }
        }
    }
}

function stealQuestion(){
    if(!chanceToSteal && answerAttempts < 2){
        chanceToSteal = true;
        document.getElementById('steal').textContent = otherPlayer + ' can steal!';
        [currentPlayer, otherPlayer] = [otherPlayer, currentPlayer];
        isAnswered = false;
        questionTimer();
        answerAttempts++;
    } else {
        document.getElementById('steal').textContent = '';
        document.getElementById('result').textContent = currentPlayer + ' did not answer in time! ';
        questionCountdown();
    }
}

function questionCountdown(){
    let countdown = 3;
    document.getElementById('countdown').textContent = "";
    const countdownInterval = setInterval(() => {
        document.getElementById('countdown').textContent = "Question in " + countdown + "..."
        countdown--;
        if(countdown < 0){
            clearInterval(countdownInterval);
            resetRound();
        }
    }, 1000);
}

function questionTimer() {
    clearInterval(questionTimerInterval);
    let countdown = 10;
    document.getElementById('countdown').textContent = "";
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

function resetRound(){
    clearInterval(questionTimerInterval);
    currentPlayer = null;
    otherPlayer = null;
    isAnswered = false;
    chanceToSteal = false;
    document.getElementById('result').textContent = '';
    answerAttempts = 0;
    document.getElementById('result').textContent = '';
    document.getElementById('countdown').textContent = '';
    document.getElementById('steal').textContent = '';
    window.location.reload();
}

document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', function() {
        if (currentPlayer !== null && !isAnswered) {
            const selectedOption = this.getAttribute('data-answer');
            checkAnswer(selectedOption);
        }
    });
});
