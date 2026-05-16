var app = {
    state: {
        gameSelected: null,
        player1: 'Player 1',
        player2: 'Player 2',
        currentPlayer: 1, // 1 or 2
        currentGameInstance: null
    },

    selectGame(gameId) {
        this.state.gameSelected = gameId;
        document.querySelector('.game-selection').classList.add('hidden');
        document.getElementById('player-setup').classList.remove('hidden');
    },

    backToSelection() {
        this.state.gameSelected = null;
        document.querySelector('.game-selection').classList.remove('hidden');
        document.getElementById('player-setup').classList.add('hidden');
    },

    startGame() {
        const p1Input = document.getElementById('player1-name').value;
        const p2Input = document.getElementById('player2-name').value;
        
        this.state.player1 = p1Input || 'Player 1';
        this.state.player2 = p2Input || 'Player 2';
        this.state.currentPlayer = 1;

        // Switch View
        document.getElementById('lobby-view').classList.remove('active');
        document.getElementById('game-view').classList.add('active');

        // Update Header Info
        document.getElementById('p1-display').textContent = this.state.player1;
        document.getElementById('p2-display').textContent = this.state.player2;
        this.updateActivePlayerUI();

        // Initialize Game
        const container = document.getElementById('game-container');
        container.innerHTML = ''; // clear old game
        document.getElementById('game-message').classList.add('hidden');

        if (this.state.gameSelected === 'math-tictactoe') {
            document.getElementById('current-game-title').textContent = 'Tic Tac Toe Toán Học';
            this.state.currentGameInstance = new MathTicTacToe(container, this);
        } else if (this.state.gameSelected === 'word-scramble') {
            document.getElementById('current-game-title').textContent = 'Sắp Xếp Từ';
            this.state.currentGameInstance = new WordScramble(container, this);
        } else if (this.state.gameSelected === 'quiz') {
            document.getElementById('current-game-title').textContent = 'Chọn Đáp Án Đúng';
            this.state.currentGameInstance = new QuizBattle(container, this);
        }

        this.state.currentGameInstance.init();
    },

    endGame() {
        if(this.state.currentGameInstance && this.state.currentGameInstance.cleanup) {
            this.state.currentGameInstance.cleanup();
        }
        this.state.currentGameInstance = null;
        document.getElementById('game-view').classList.remove('active');
        document.getElementById('lobby-view').classList.add('active');
        this.backToSelection();
    },

    switchTurn() {
        this.state.currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
        this.updateActivePlayerUI();
    },

    updateActivePlayerUI() {
        const p1 = document.getElementById('p1-display');
        const p2 = document.getElementById('p2-display');
        
        if (this.state.currentPlayer === 1) {
            p1.classList.add('active-player');
            p2.classList.remove('active-player');
        } else {
            p2.classList.add('active-player');
            p1.classList.remove('active-player');
        }
    },

    showMessage(msg) {
        const msgEl = document.getElementById('game-message');
        msgEl.textContent = msg;
        msgEl.classList.remove('hidden');
    }
};
