let buffer = null;
let isAnswered = false;

document.addEventListener('keydown', function(event) {
    console.log('Key pressed: ' + event.key);

    if (!isAnswered) {
        if (buffer === null) {
            let result = '';
            if (event.key === 'a' || event.key === 'A') {
                buffer = 'Player 1';
                result = 'Player 1 buzzed in!';
            } else if (event.key === 'l' || event.key === 'L') {
                buffer = 'Player 2';
                result = 'Player 2 buzzed in!';
            }

            if (result) {
                document.getElementById('result').textContent = result;
            }

        }
    }
});

