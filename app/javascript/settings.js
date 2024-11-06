document.addEventListener('DOMContentLoaded', () => {
    const start_button = document.getElementById("start_button");
    const back_button = document.getElementById("back_button");
    const button_effect = new Audio("/assets/8-bit.mp3");

    function startGame() {
        console.log("Start Game button clicked");
        const player1Name = document.getElementById('player1-name').value;
        const player2Name = document.getElementById('player2-name').value;
        const pointsToWin = document.getElementById('points-to-win').value;

        localStorage.setItem('player1Name', player1Name);
        localStorage.setItem('player2Name', player2Name);
        localStorage.setItem('pointsToWin', pointsToWin);

        window.location.href = '/countdown';
    }

    start_button.addEventListener("click", (event) => {
        event.preventDefault();
        button_effect.play().catch((error) => {
            console.error("Error playing button sound effect:", error);
        });
        button_effect.onended = () => {
            startGame();
        };
    });

    back_button.addEventListener("click", (event) => {
        event.preventDefault();
        button_effect.play().catch((error) => {
            console.error("Error playing button sound effect:", error);
        });
        button_effect.onended = () => {
            window.location.href='/';
        };
    });
});