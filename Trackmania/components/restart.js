AFRAME.registerComponent('restart', {
    init() {
        console.log('Game Restart!');
        document.addEventListener('keydown', event => {
            if (event.key === 'r') {
                console.log('Game Restart!', event.detail.else);
                window.location.reload();
            }
        });
    },

    restartGame() {
        console.log('Game Restart!', event.detail.els);
        const character = document.querySelector('#formule');
        character.setAttribute('position', '0 -14.7 0');
        character.setAttribute('rotation', '0 180 0');
        character.setAttribute('animation-mixer', 'clip: idle;');

        // Skryjte zprávu o konci hry
        const gameOverMessage = document.querySelector('#game-over');
        gameOverMessage.style.display = 'none';
    }
});