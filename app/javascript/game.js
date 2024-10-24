let currentPlayer = null;
let isAnswered = false;

document.addEventListener('keydown', function(event) {

    if (currentPlayer === null) {
        if (event.key === 'a' || event.key === 'A') {
            currentPlayer = 'Player 1';
        } else if (event.key === 'l' || event.key === 'L') {
            currentPlayer = 'Player 2';
        }

        if (result) {
            document.getElementById('result').textContent = currentPlayer + ' buzzed in!';
        }
    }
});

function checkAnswer(selectedOption) {
    const correctAnswer = document.getElementById('correct-answer').value;

    if (!isAnswered) {
        if (selectedOption === correctAnswer) {
            document.getElementById('result').textContent = currentPlayer + ' answered correctly!';
        } else {
            document.getElementById('result').textContent = currentPlayer + ' answered incorrectly!';
        }
        isAnswered = true;
    }
}

document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', function() {
        if (currentPlayer !== null && !isAnswered) {
            const selectedOption = this.getAttribute('data-answer');
            checkAnswer(selectedOption);
        }
    });
});
