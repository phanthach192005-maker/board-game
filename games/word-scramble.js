class WordScramble {
    constructor(container, appInstance) {
        this.container = container;
        this.app = appInstance;
        this.words = [
            'CON MEO', 'USB DRIVE', 'DAI DUONG', 'CONG DAN SO', 'CONG NGHE',  'GIAI TRI', 'BAT NAT TRUC TUYEN', 'CAI DAT VI TRI',
            'INTERNET', 'VIRUS', 'LUU TRU DAM MAY', 'COOKIES', 'HACKING', 'BOOKMARK', 'HACKER', 'DU LIEU'
        ];
        this.scores = { 1: 0, 2: 0 };
        this.winningScore = 10;
        this.currentWord = '';
        this.gameOver = false;
        this.timeLimit = 30;       // seconds per turn
        this.timeLeft = 30;
        this._timerInterval = null;
    }

    init() {
        this.renderBoard();
        this.nextWord();
    }

    renderBoard() {
        const board = document.createElement('div');
        board.className = 'scramble-board';

        const scoreBoard = document.createElement('div');
        scoreBoard.className = 'scores';
        scoreBoard.innerHTML = `
            <div id="ws-p1-score">${this.app.state.player1}: 0</div>
            <div id="ws-p2-score">${this.app.state.player2}: 0</div>
        `;

        const wordDisplay = document.createElement('div');
        wordDisplay.className = 'word-display';
        wordDisplay.id = 'scrambled-word';

        // ── Countdown Timer Ring ──
        const timerWrap = document.createElement('div');
        timerWrap.className = 'ws-timer-wrap';
        timerWrap.innerHTML = `
            <svg class="ws-timer-ring" viewBox="0 0 64 64" width="64" height="64">
                <circle class="ws-ring-bg" cx="32" cy="32" r="28" />
                <circle class="ws-ring-fill" id="ws-ring-fill" cx="32" cy="32" r="28" />
            </svg>
            <span class="ws-timer-text" id="ws-timer-text">30</span>
        `;

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'ws-answer';
        input.placeholder = 'Nhập đáp án.....';
        input.autocomplete = 'off';

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn-primary';
        submitBtn.textContent = 'Kiểm tra';
        submitBtn.onclick = () => this.checkAnswer();

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });

        const turnInfo = document.createElement('p');
        turnInfo.id = 'ws-turn-info';
        turnInfo.style.color = 'var(--text-muted)';

        inputGroup.appendChild(input);
        inputGroup.appendChild(submitBtn);

        board.appendChild(scoreBoard);
        board.appendChild(wordDisplay);
        board.appendChild(timerWrap);
        board.appendChild(turnInfo);
        board.appendChild(inputGroup);

        this.container.appendChild(board);
    }

    scramble(word) {
        let arr = word.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        // Ensure it's actually scrambled
        if (arr.join('') === word && word.length > 1) return this.scramble(word);
        return arr.join('');
    }

    nextWord() {
        if (this.gameOver) return;

        const idx = Math.floor(Math.random() * this.words.length);
        this.currentWord = this.words[idx];
        const scrambled = this.scramble(this.currentWord);

        document.getElementById('scrambled-word').textContent = scrambled;
        document.getElementById('ws-answer').value = '';
        
        const pName = this.app.state.currentPlayer === 1 ? this.app.state.player1 : this.app.state.player2;
        document.getElementById('ws-turn-info').textContent = `Đến lượt ${pName}`;
        
        setTimeout(() => document.getElementById('ws-answer').focus(), 100);
        this.startTimer();
    }

    // ── Timer helpers ──────────────────────────────────────────────
    startTimer() {
        this.stopTimer();
        this.timeLeft = this.timeLimit;
        this._updateTimerUI();

        this._timerInterval = setInterval(() => {
            this.timeLeft--;
            this._updateTimerUI();
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this._onTimeout();
            }
        }, 1000);
    }

    stopTimer() {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }

    _updateTimerUI() {
        const textEl  = document.getElementById('ws-timer-text');
        const ringEl  = document.getElementById('ws-ring-fill');
        const wrapEl  = document.querySelector('.ws-timer-wrap');
        if (!textEl || !ringEl || !wrapEl) return;

        const pct = this.timeLeft / this.timeLimit;          // 1 → 0
        const circumference = 2 * Math.PI * 28;              // r = 28
        const dashOffset = circumference * (1 - pct);

        ringEl.style.strokeDasharray  = circumference;
        ringEl.style.strokeDashoffset = dashOffset;
        textEl.textContent = this.timeLeft;

        // Colour states
        wrapEl.classList.remove('ws-timer-warn', 'ws-timer-danger');
        if (this.timeLeft <= 5) {
            wrapEl.classList.add('ws-timer-danger');
        } else if (this.timeLeft <= 10) {
            wrapEl.classList.add('ws-timer-warn');
        }
    }

    _onTimeout() {
        if (this.gameOver) return;
        // Flash the word reveal briefly, then move on
        const turnInfo = document.getElementById('ws-turn-info');
        if (turnInfo) turnInfo.textContent = `⏰ Hết giờ! Từ đúng: ${this.currentWord}`;
        setTimeout(() => {
            if (!this.gameOver) {
                this.app.switchTurn();
                this.nextWord();
            }
        }, 1500);
    }

    checkAnswer() {
        if (this.gameOver) return;

        const answer = document.getElementById('ws-answer').value.toUpperCase().trim();
        if (answer === this.currentWord) {
            // Correct
            this.stopTimer();
            const p = this.app.state.currentPlayer;
            this.scores[p]++;
            this.updateScores();
            
            if (this.scores[p] >= this.winningScore) {
                const winnerName = p === 1 ? this.app.state.player1 : this.app.state.player2;
                this.app.showMessage(`${winnerName} đã chiến thắng!`);
                this.gameOver = true;
                document.getElementById('ws-answer').disabled = true;
            } else {
                // Switch turn and next word
                this.app.switchTurn();
                this.nextWord();
            }
        } else {
            // Incorrect — lose turn
            this.stopTimer();
            alert(`Sai rồi. Hãy thử lại.`);
            document.getElementById('ws-answer').value = '';
            document.getElementById('ws-answer').focus();
            this.app.switchTurn();
            this.nextWord();
        }
    }

    updateScores() {
        document.getElementById('ws-p1-score').textContent = `${this.app.state.player1}: ${this.scores[1]}`;
        document.getElementById('ws-p2-score').textContent = `${this.app.state.player2}: ${this.scores[2]}`;
    }

    cleanup() {
        this.stopTimer();
    }
}
