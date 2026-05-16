class MathTicTacToe {
    constructor(container, appInstance) {
        this.container = container;
        this.app = appInstance;
        this.board = Array(9).fill(null); // null, 1 (P1), or 2 (P2)
        this.gameOver = false;

        // Modal elements
        this.modalOverlay = null;
        this.currentCellIndex = null;
        this.currentAnswer = null;
    }

    init() {
        this.renderBoard();
        this.createModal();
    }

    renderBoard() {
        const boardEl = document.createElement('div');
        boardEl.className = 'tictactoe-board';

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'tictactoe-cell';
            cell.dataset.index = i;
            cell.onclick = () => this.handleCellClick(i, cell);
            boardEl.appendChild(cell);
        }

        this.container.appendChild(boardEl);
    }

    createModal() {
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.className = 'modal-overlay hidden';

        const content = document.createElement('div');
        content.className = 'modal-content';

        const questionEl = document.createElement('h3');
        questionEl.id = 'math-question';

        const inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.id = 'math-answer';
        inputEl.placeholder = 'Your answer...';

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn-primary';
        submitBtn.textContent = 'Submit';
        submitBtn.onclick = () => this.checkAnswer();

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => this.closeModal();

        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });

        content.appendChild(questionEl);
        content.appendChild(inputEl);
        content.appendChild(submitBtn);
        content.appendChild(cancelBtn);
        this.modalOverlay.appendChild(content);

        document.body.appendChild(this.modalOverlay);
    }

    generateQuestion() {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, answer;

        if (op === '+') {
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            answer = a + b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 50) + 20;
            b = Math.floor(Math.random() * 20) + 1;
            answer = a - b;
        } else {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            answer = a * b;
        }

        return { text: `${a} ${op} ${b} = ?`, answer };
    }

    handleCellClick(index, cellEl) {
        if (this.gameOver || this.board[index] !== null) return;

        this.currentCellIndex = index;
        const q = this.generateQuestion();
        this.currentAnswer = q.answer;

        document.getElementById('math-question').textContent = q.text;
        document.getElementById('math-answer').value = '';
        this.modalOverlay.classList.remove('hidden');
        setTimeout(() => document.getElementById('math-answer').focus(), 100);
    }

    checkAnswer() {
        const inputEl = document.getElementById('math-answer');
        if (!inputEl.value.trim()) {
            return; // Do nothing if the input is empty
        }

        const userAns = parseInt(inputEl.value, 10);

        if (userAns === this.currentAnswer) {
            // Correct answer, claim cell
            this.board[this.currentCellIndex] = this.app.state.currentPlayer;
            this.updateCellUI(this.currentCellIndex);

            if (!this.checkWin()) {
                this.app.switchTurn();
            }
        } else {
            // Incorrect, lose turn
            alert(`Incorrect! The answer was ${this.currentAnswer}. Turn lost.`);
            this.app.switchTurn();
        }

        this.closeModal();
    }

    closeModal() {
        this.modalOverlay.classList.add('hidden');
        this.currentCellIndex = null;
        this.currentAnswer = null;
    }

    updateCellUI(index) {
        const cell = document.querySelector(`.tictactoe-cell[data-index="${index}"]`);
        const player = this.board[index];
        cell.classList.add('claimed');
        if (player === 1) {
            cell.classList.add('p1');
            cell.textContent = 'X';
        } else {
            cell.classList.add('p2');
            cell.textContent = 'O';
        }
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]           // diags
        ];

        for (let p of winPatterns) {
            const [a, b, c] = p;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                const winnerName = this.board[a] === 1 ? this.app.state.player1 : this.app.state.player2;
                this.app.showMessage(`${winnerName} wins! 🎉`);
                this.gameOver = true;
                return true;
            }
        }

        if (!this.board.includes(null)) {
            this.app.showMessage("It's a draw!");
            this.gameOver = true;
            return true;
        }

        return false;
    }

    cleanup() {
        if (this.modalOverlay) {
            this.modalOverlay.remove();
        }
    }
}
