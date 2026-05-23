class PenaltyKick {
    constructor(container, appInstance) {
        this.container = container;
        this.app = appInstance;
        this.gameOver = false;

        // Shootout status
        this.shootoutRounds = 5;      // Standard 5 rounds
        this.currentShotIndex = 0;    // Tracks the total shots taken in the game
        this.scores = { 1: 0, 2: 0 };
        this.history = { 1: [], 2: [] }; // Stores 'goal' or 'miss' for each shot taken
        
        // Active shot state
        this.lastAnswerCorrect = false;
        this.isGoal = false;
        this.isMiss = false;
        this.activeKicker = 1; // Tracks who is currently kicking

        // Timer
        this.timeLimit = 15;
        this.timeLeft = 15;
        this._timerInterval = null;

        // Current question
        this.currentQuestion = null;

        this.questions = [
            { q: "Thiết bị nào sau đây được phân loại là Thiết bị đầu vào (Input device)?", options: ["Màn hình (Monitor)", "Máy in (Printer)", "Bàn phím (Keyboard)", "Loa (Speakers)"], answer: 2 },
            { q: "Thiết bị nào sau đây dùng để hiển thị thông tin hình ảnh từ máy tính?", options: ["Chuột (Mouse)", "Màn hình (Monitor)", "Bàn phím (Keyboard)", "Ổ cứng (Hard Drive)"], answer: 1 },
            { q: "Để lưu trữ tệp tin tạm thời khi máy tính đang chạy, thành phần nào được sử dụng?", options: ["ROM", "RAM", "CPU", "Ổ cứng (HDD)"], answer: 1 },
            { q: "Hệ điều hành phổ biến nhất trên các máy tính cá nhân hiện nay là gì?", options: ["Android", "iOS", "Windows", "Linux"], answer: 2 },
            { q: "Tổ hợp phím tắt nào được sử dụng để sao chép (Copy) đoạn văn bản?", options: ["Ctrl + V", "Ctrl + X", "Ctrl + C", "Ctrl + Z"], answer: 2 },
            { q: "Tổ hợp phím tắt nào được sử dụng để dán (Paste) đoạn văn bản đã sao chép?", options: ["Ctrl + V", "Ctrl + C", "Ctrl + A", "Ctrl + N"], answer: 0 },
            { q: "Đâu là phần mở rộng (Extension) phổ biến của một tài liệu văn bản Microsoft Word?", options: [".xlsx", ".docx", ".pptx", ".mp3"], answer: 1 },
            { q: "Khi duyệt web, biểu tượng chiếc ổ khóa ở thanh địa chỉ URL thể hiện điều gì?", options: ["Trang web bị chặn", "Kết nối an toàn được mã hóa (HTTPS)", "Trang web chứa virus", "Trang web miễn phí"], answer: 1 },
            { q: "Thiết bị nào có chức năng chuyển đổi tín hiệu mạng và cho phép kết nối Internet không dây?", options: ["Bàn phím không dây", "Cáp HDMI", "Modem / Router Wi-Fi", "Màn hình thông minh"], answer: 2 },
            { q: "Khi nhận được một email từ người lạ chứa liên kết lạ, hành động nào là an toàn nhất?", options: ["Nhấp vào liên kết ngay", "Chuyển tiếp cho tất cả bạn bè", "Xóa email và không nhấp vào liên kết", "Trả lời thư để hỏi người gửi là ai"], answer: 2 },
            { q: "Thuật ngữ 'Hacker' chỉ đối tượng nào?", options: ["Người sửa chữa phần cứng máy tính", "Người sử dụng lập trình để xâm nhập trái phép vào hệ thống", "Người bán thiết bị công nghệ", "Giáo viên dạy tin học"], answer: 1 },
            { q: "Dịch vụ nào sau đây là dịch vụ lưu trữ đám mây?", options: ["Google Drive", "Microsoft Word", "Windows Defender", "Google Chrome"], answer: 0 },
            { q: "Để bảo vệ máy tính khỏi các mã độc hại và phần mềm gián điệp, em nên dùng phần mềm nào?", options: ["Phần mềm diệt virus (Antivirus)", "Trình duyệt web", "Phần mềm nghe nhạc", "Phần mềm vẽ Paint"], answer: 0 },
            { q: "Địa chỉ nào sau đây có định dạng của một thư điện tử (Email) đúng?", options: ["username.gmail.com", "username@gmail.com", "http://username.gmail", "username@gmail@com"], answer: 1 },
            { q: "Để tìm kiếm thông tin trên Internet, em sử dụng công cụ nào phổ biến nhất?", options: ["Google Search", "Microsoft Excel", "Windows Media Player", "Adobe Photoshop"], answer: 0 },
            { q: "Phần mở rộng nào sau đây chỉ định một tệp tin hình ảnh?", options: [".mp3", ".avi", ".png", ".pdf"], answer: 2 },
            { q: "Khi muốn bảo mật tài khoản cá nhân, mật khẩu nào dưới đây là mạnh và an toàn nhất?", options: ["12345678", "password", "NguyenVanA2010", "P@ssw0rd2026!"], answer: 3 },
            { q: "Thuật ngữ 'Cookies' trong duyệt web dùng để làm gì?", options: ["Để diệt virus quảng cáo", "Để lưu trữ dữ liệu nhỏ về phiên làm việc của người dùng", "Để tăng tốc độ đường truyền mạng", "Để tải xuống hình ảnh tự động"], answer: 1 },
            { q: "Khi máy in không hoạt động, bước kiểm tra đầu tiên và cơ bản nhất là gì?", options: ["Cài đặt lại hệ điều hành", "Kiểm tra kết nối nguồn và dây cáp máy in", "Mua máy in mới", "Cài đặt phần mềm vẽ hình mới"], answer: 1 },
            { q: "Khi máy tính hoạt động quá chậm, hành động nào nên ưu tiên thực hiện trước?", options: ["Đóng các ứng dụng không dùng đến để giải phóng bộ nhớ", "Nhấp chuột liên tục vào màn hình", "Rút dây cắm nguồn điện ngay lập tức", "Mua thêm màn hình thứ hai"], answer: 0 },
            { q: "Trong trình duyệt web, tính năng 'Bookmark' dùng để làm gì?", options: ["Xóa lịch sử duyệt web", "Lưu lại địa chỉ trang web ưa thích để dễ truy cập sau này", "Tải xuống hình ảnh chất lượng cao", "Mở một tab ẩn danh mới"], answer: 1 },
            { q: "Phần mềm nào sau đây là trình duyệt web dùng để truy cập Internet?", options: ["Microsoft Excel", "Google Chrome", "Adobe Reader", "Skype"], answer: 1 },
            { q: "Internet là gì?", options: ["Một trò chơi trực tuyến", "Mạng lưới toàn cầu kết nối các máy tính và thiết bị công nghệ", "Một hệ điều hành dành cho điện thoại", "Một phần mềm soạn thảo văn bản"], answer: 1 },
            { q: "Thiết bị di động thông minh có thể xác định vị trí của bạn nhờ công nghệ nào?", options: ["MP3", "GPS", "Bluetooth", "RAM"], answer: 1 },
            { q: "Để tránh bị quấy rối hoặc bắt nạt trực tuyến, em nên thực hiện hành động nào?", options: ["Chia sẻ thông tin riêng tư rộng rãi", "Đặt cấu hình tài khoản ở chế độ riêng tư và báo cáo hành vi xấu", "Cãi nhau lại với người bắt nạt trên mạng", "Ẩn danh để đi bắt nạt người khác"], answer: 1 }
        ];
    }

    init() {
        this.renderBoard();
        this.startTurn();
    }

    renderBoard() {
        const board = document.createElement('div');
        board.className = 'pk-board';
        board.innerHTML = `
            <!-- Scoreboard -->
            <div class="pk-scoreboard">
                <div class="pk-player-panel" id="pk-p1-panel">
                    <span class="pk-player-name">${this.app.state.player1}</span>
                    <div class="pk-shootout-dots" id="pk-p1-dots">
                        <!-- Shootout dots will be injected here -->
                    </div>
                    <span class="pk-score-num" id="pk-p1-score">0</span>
                </div>
                <div class="pk-vs">VS</div>
                <div class="pk-player-panel" id="pk-p2-panel">
                    <span class="pk-player-name">${this.app.state.player2}</span>
                    <div class="pk-shootout-dots" id="pk-p2-dots">
                        <!-- Shootout dots will be injected here -->
                    </div>
                    <span class="pk-score-num" id="pk-p2-score">0</span>
                </div>
            </div>

            <!-- Stadium Arena -->
            <div class="pk-stadium">
                <!-- Goalpost and Goalkeeper -->
                <div class="pk-goal-area">
                    <div class="pk-goalpost" id="pk-goalpost">
                        <div class="pk-goal-net"></div>
                        <div class="pk-goalkeeper" id="pk-goalkeeper">🧤</div>
                        
                        <!-- Target Zones -->
                        <div class="pk-target tl" data-dir="top-left" title="Góc cao trái">🎯</div>
                        <div class="pk-target tr" data-dir="top-right" title="Góc cao phải">🎯</div>
                        <div class="pk-target c" data-dir="center" title="Chính giữa">🎯</div>
                        <div class="pk-target bl" data-dir="bottom-left" title="Góc thấp trái">🎯</div>
                        <div class="pk-target br" data-dir="bottom-right" title="Góc thấp phải">🎯</div>
                    </div>
                </div>

                <!-- Football Pitch -->
                <div class="pk-pitch">
                    <div class="pk-penalty-box"></div>
                    <div class="pk-penalty-spot"></div>
                    <div class="pk-ball" id="pk-ball">⚽</div>
                </div>

                <!-- Live Game Message Overlay (GOAL / SAVE / MISS) -->
                <div class="pk-stadium-overlay hidden" id="pk-stadium-overlay"></div>
            </div>

            <!-- Quiz / Control Panel -->
            <div class="pk-control-panel">
                <div class="pk-instructions" id="pk-turn-instruction">Chuẩn bị sút phạt...</div>
                
                <!-- Timer Bar -->
                <div class="qz-timer-wrap hidden" id="pk-timer-wrap">
                    <div class="qz-timer-bar-track">
                        <div class="qz-timer-bar" id="pk-timer-bar"></div>
                    </div>
                    <span class="qz-timer-text" id="pk-timer-text">15</span>
                </div>

                <!-- Question Card -->
                <div class="pk-question-card hidden" id="pk-question-card">
                    <p class="pk-question-text" id="pk-question-text">Đang tải câu hỏi...</p>
                    <div class="quiz-options" id="pk-options"></div>
                </div>

                <!-- Question Feedback -->
                <div class="quiz-feedback hidden" id="pk-feedback"></div>
            </div>
        `;
        this.container.appendChild(board);

        // Render initial dot grids
        this.updateDotGrid();

        // Add event listeners to targets
        const targets = this.container.querySelectorAll('.pk-target');
        targets.forEach(t => {
            t.onclick = () => this.handleTargetClick(t.dataset.dir);
        });
    }

    updateDotGrid() {
        const p1DotsEl = document.getElementById('pk-p1-dots');
        const p2DotsEl = document.getElementById('pk-p2-dots');
        if (!p1DotsEl || !p2DotsEl) return;

        // Render P1 dots
        p1DotsEl.innerHTML = '';
        const p1TotalDots = Math.max(5, this.history[1].length);
        for (let i = 0; i < p1TotalDots; i++) {
            const dot = document.createElement('span');
            dot.className = `pk-dot ${this.history[1][i] || 'empty'}`;
            p1DotsEl.appendChild(dot);
        }

        // Render P2 dots
        p2DotsEl.innerHTML = '';
        const p2TotalDots = Math.max(5, this.history[2].length);
        for (let i = 0; i < p2TotalDots; i++) {
            const dot = document.createElement('span');
            dot.className = `pk-dot ${this.history[2][i] || 'empty'}`;
            p2DotsEl.appendChild(dot);
        }
    }

    startTurn() {
        if (this.gameOver) return;

        // 1. Determine active kicker
        this.activeKicker = this.app.state.currentPlayer;

        // 2. Update UI panels to show who is active
        const p1Panel = document.getElementById('pk-p1-panel');
        const p2Panel = document.getElementById('pk-p2-panel');
        if (this.activeKicker === 1) {
            p1Panel.classList.add('active-kicker');
            p2Panel.classList.remove('active-kicker');
        } else {
            p2Panel.classList.add('active-kicker');
            p1Panel.classList.remove('active-kicker');
        }

        // 3. Reset stadium elements (remove shooting/goalkeeper diving classes)
        const goalkeeper = document.getElementById('pk-goalkeeper');
        const ball = document.getElementById('pk-ball');
        const goalpost = document.getElementById('pk-goalpost');
        const overlay = document.getElementById('pk-stadium-overlay');
        
        goalkeeper.className = 'pk-goalkeeper';
        ball.className = 'pk-ball';
        goalpost.classList.remove('pk-shooting-phase', 'pk-target-active', 'pk-net-bulge');
        overlay.classList.add('hidden');
        overlay.className = 'pk-stadium-overlay hidden';

        // Reset goal-area flash
        const goalArea = this.container.querySelector('.pk-goal-area');
        if (goalArea) goalArea.classList.remove('pk-goal-flash');

        // 4. Select random question
        const idx = Math.floor(Math.random() * this.questions.length);
        this.currentQuestion = this.questions[idx];

        // 5. Update instructions and show question cards
        const kickerName = this.activeKicker === 1 ? this.app.state.player1 : this.app.state.player2;
        document.getElementById('pk-turn-instruction').textContent = `Lượt sút của ${kickerName}. Trả lời câu hỏi dưới đây!`;
        
        const qCard = document.getElementById('pk-question-card');
        const tWrap = document.getElementById('pk-timer-wrap');
        const feedbackEl = document.getElementById('pk-feedback');

        qCard.classList.remove('hidden');
        tWrap.classList.remove('hidden');
        feedbackEl.classList.add('hidden');

        document.getElementById('pk-question-text').textContent = this.currentQuestion.q;

        const optionsEl = document.getElementById('pk-options');
        optionsEl.innerHTML = '';

        const labels = ['A', 'B', 'C', 'D'];
        this.currentQuestion.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span class="opt-text">${opt}</span>`;
            btn.onclick = () => this.selectAnswer(i, optionsEl);
            optionsEl.appendChild(btn);
        });

        // 6. Start Timer
        this.startTimer();
    }

    selectAnswer(selectedIndex, optionsEl) {
        if (this.gameOver) return;
        this.stopTimer();

        const correct = this.currentQuestion.answer;
        const buttons = optionsEl.querySelectorAll('.quiz-option-btn');

        // Disable options
        buttons.forEach(b => b.disabled = true);

        // Highlight correct and wrong answers
        buttons[correct].classList.add('correct');
        if (selectedIndex !== correct) {
            buttons[selectedIndex].classList.add('wrong');
        }

        const feedbackEl = document.getElementById('pk-feedback');
        feedbackEl.classList.remove('hidden', 'feedback-correct', 'feedback-wrong');

        if (selectedIndex === correct) {
            this.lastAnswerCorrect = true;
            feedbackEl.textContent = 'Chính xác! ✅ Bạn nhận được cú sút hiểm hóc!';
            feedbackEl.classList.add('feedback-correct');
        } else {
            this.lastAnswerCorrect = false;
            feedbackEl.textContent = 'Chưa chính xác! ❌ Bạn phải thực hiện cú sút khó khăn.';
            feedbackEl.classList.add('feedback-wrong');
        }

        // Wait 1.8 seconds, then trigger shooting phase
        setTimeout(() => {
            this.enterShootingPhase();
        }, 1800);
    }

    enterShootingPhase() {
        // Hide quiz interface
        document.getElementById('pk-question-card').classList.add('hidden');
        document.getElementById('pk-timer-wrap').classList.add('hidden');
        document.getElementById('pk-feedback').classList.add('hidden');

        // Enable targets in the goal
        const goalpost = document.getElementById('pk-goalpost');
        goalpost.classList.add('pk-shooting-phase', 'pk-target-active');

        // Set instruction
        const kickerName = this.activeKicker === 1 ? this.app.state.player1 : this.app.state.player2;
        if (this.lastAnswerCorrect) {
            document.getElementById('pk-turn-instruction').innerHTML = `<strong style="color: var(--success);">${kickerName} trả lời ĐÚNG!</strong> Chọn một góc để sút bóng! 🎯`;
        } else {
            document.getElementById('pk-turn-instruction').innerHTML = `<strong style="color: var(--danger);">${kickerName} trả lời SAI!</strong> Hãy chọn hướng sút (Cơ hội cản phá của thủ môn rất cao!).`;
        }
    }

    handleTargetClick(direction) {
        // Ensure they can't double-click targets
        const goalpost = document.getElementById('pk-goalpost');
        if (!goalpost.classList.contains('pk-target-active')) return;
        goalpost.classList.remove('pk-target-active');

        // Get goalie and ball elements
        const goalkeeper = document.getElementById('pk-goalkeeper');
        const ball = document.getElementById('pk-ball');

        // Available directions
        const dirs = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'];

        // Determine goalkeeper dive and ball success
        let goalieDir = '';
        let result = ''; // 'goal', 'save', 'miss'

        if (this.lastAnswerCorrect) {
            goalieDir = dirs[Math.floor(Math.random() * dirs.length)];
            result = (goalieDir === direction) ? 'save' : 'goal';
        } else {
            const rng = Math.random();
            if (rng < 0.5) {
                result = 'miss';
                goalieDir = dirs[Math.floor(Math.random() * dirs.length)];
            } else {
                result = 'save';
                goalieDir = direction;
            }
        }

        // ── Phase 1: Launch ball ──────────────────────────────────────
        // Goalkeeper dives immediately
        goalkeeper.classList.add(`dive-${goalieDir}`);

        // Add launch class (arc + spin)
        if (result === 'goal' || result === 'save') {
            ball.classList.add('pk-ball-launch', `shoot-${direction}`);
        } else {
            const missDirections = {
                'top-left': 'miss-left-high',
                'top-right': 'miss-right-high',
                'center': 'miss-high',
                'bottom-left': 'miss-left',
                'bottom-right': 'miss-right'
            };
            ball.classList.add('pk-ball-launch', `shoot-${missDirections[direction]}`);
        }

        // ── Phase 2: Ball hits net (only on goal) ─────────────────────
        if (result === 'goal') {
            setTimeout(() => {
                // Freeze ball in net
                ball.classList.remove('pk-ball-launch');
                ball.classList.add('pk-ball-in-net');

                // Net bulge ripple
                const goalpostEl = document.getElementById('pk-goalpost');
                goalpostEl.classList.add('pk-net-bulge');
                setTimeout(() => goalpostEl.classList.remove('pk-net-bulge'), 700);

                // Stadium green flash
                const goalArea = this.container.querySelector('.pk-goal-area');
                goalArea.classList.add('pk-goal-flash');
                setTimeout(() => goalArea.classList.remove('pk-goal-flash'), 600);
            }, 600);
        }

        // ── Phase 3: Show result overlay ──────────────────────────────
        setTimeout(() => {
            this.showShotResult(result);
        }, result === 'goal' ? 900 : 750);
    }

    showShotResult(result) {
        const overlay = document.getElementById('pk-stadium-overlay');
        overlay.classList.remove('hidden');

        const kicker = this.activeKicker;

        if (result === 'goal') {
            // Rich goal overlay: animated text + score badge
            const kickerName = kicker === 1 ? this.app.state.player1 : this.app.state.player2;
            overlay.innerHTML = `
                <div class="pk-goal-overlay-inner">
                    <div class="pk-result-text goal">VÀOOO!</div>
                    <div class="pk-goal-sub">⚽ ${kickerName} ghi bàn! 🎉</div>
                    <div class="pk-goal-sparkles">✨ ⭐ 🌟 ⭐ ✨</div>
                </div>
            `;
            this.scores[kicker]++;
            this.history[kicker].push('goal');
            this.triggerConfetti();
            // Second wave confetti burst
            setTimeout(() => this.triggerConfetti(), 400);
        } else if (result === 'save') {
            overlay.innerHTML = `
                <div class="pk-goal-overlay-inner">
                    <div class="pk-result-text save">CẢN PHÁ!</div>
                    <div class="pk-goal-sub">🧤 Thủ môn xuất sắc! ❌</div>
                </div>
            `;
            this.history[kicker].push('miss');
            this.triggerScreenShake();
        } else {
            overlay.innerHTML = `
                <div class="pk-goal-overlay-inner">
                    <div class="pk-result-text miss">SÚT TRƯỢT!</div>
                    <div class="pk-goal-sub">💨 Bóng bay ra ngoài! ❌</div>
                </div>
            `;
            this.history[kicker].push('miss');
            this.triggerScreenShake();
        }

        // Update score display
        document.getElementById(`pk-p1-score`).textContent = this.scores[1];
        document.getElementById(`pk-p2-score`).textContent = this.scores[2];

        // Update Shootout dots
        this.updateDotGrid();

        // Increment shot counter
        this.currentShotIndex++;

        // Wait 3 seconds, then check win or switch turns
        setTimeout(() => {
            this.checkShootoutStatus();
        }, 3000);
    }

    checkShootoutStatus() {
        if (this.gameOver) return;

        const p1Score = this.scores[1];
        const p2Score = this.scores[2];
        const p1Shots = this.history[1].length;
        const p2Shots = this.history[2].length;

        // In standard shootout (5 shots each)
        const p1Remaining = Math.max(0, 5 - p1Shots);
        const p2Remaining = Math.max(0, 5 - p2Shots);

        // Check if Player 1 cannot be caught
        if (p1Score > p2Score + p2Remaining) {
            this.endShootout(1);
            return;
        }

        // Check if Player 2 cannot be caught
        if (p2Score > p1Score + p1Remaining) {
            this.endShootout(2);
            return;
        }

        // If both finished 5 shots
        if (p1Shots >= 5 && p2Shots >= 5) {
            if (p1Score !== p2Score) {
                // Winner decided
                this.endShootout(p1Score > p2Score ? 1 : 2);
                return;
            } else {
                // Tied after 5 shots -> SUDDEN DEATH (Cái chết bất ngờ)
                // Sudden death continues shot-by-shot (every round we check if the tie is broken)
                if (p1Shots === p2Shots) {
                    // Both have taken equal number of sudden death shots. Start next round of sudden death.
                    this.app.switchTurn();
                    this.startTurn();
                } else {
                    // Player 2 needs to shoot to complete the sudden death round
                    this.app.switchTurn();
                    this.startTurn();
                }
                return;
            }
        }

        // Otherwise, regular game goes on: switch turns and start next kick!
        this.app.switchTurn();
        this.startTurn();
    }

    endShootout(winner) {
        this.gameOver = true;
        const winnerName = winner === 1 ? this.app.state.player1 : this.app.state.player2;
        this.app.showMessage(`🏆 CHIẾN THẮNG CHUNG CUỘC: ${winnerName}! 🏆`);
        
        // Disable everything
        document.getElementById('pk-turn-instruction').innerHTML = `🎉 Trò chơi đã kết thúc! Chúc mừng <strong>${winnerName}</strong> đã chiến thắng loạt sút luân lưu!`;
    }

    // ── Visual effects ──────────────────────────────────────────────
    triggerConfetti() {
        const stadium = this.container.querySelector('.pk-stadium');
        if (!stadium) return;

        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'pk-confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
            confetti.style.transform = `scale(${Math.random() * 0.6 + 0.4})`;
            confetti.style.animationDelay = Math.random() * 0.8 + 's';
            stadium.appendChild(confetti);

            // Clean up
            setTimeout(() => confetti.remove(), 2500);
        }
    }

    triggerScreenShake() {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.classList.add('pk-shake');
            setTimeout(() => appContainer.classList.remove('pk-shake'), 500);
        }
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
        const textEl = document.getElementById('pk-timer-text');
        const barEl  = document.getElementById('pk-timer-bar');
        const wrapEl = document.getElementById('pk-timer-wrap');
        if (!textEl || !barEl || !wrapEl) return;

        const pct = (this.timeLeft / this.timeLimit) * 100;
        barEl.style.width = pct + '%';
        textEl.textContent = this.timeLeft;

        // Colour states
        wrapEl.classList.remove('qz-timer-warn', 'qz-timer-danger');
        if (this.timeLeft <= 5) {
            wrapEl.classList.add('qz-timer-danger');
        } else if (this.timeLeft <= 8) {
            wrapEl.classList.add('qz-timer-warn');
        }
    }

    _onTimeout() {
        if (this.gameOver) return;

        // Disable quiz options
        const optionsEl = document.getElementById('pk-options');
        if (optionsEl) {
            const buttons = optionsEl.querySelectorAll('.quiz-option-btn');
            buttons.forEach(b => b.disabled = true);
            if (buttons[this.currentQuestion.answer]) {
                buttons[this.currentQuestion.answer].classList.add('correct');
            }
        }

        const feedbackEl = document.getElementById('pk-feedback');
        if (feedbackEl) {
            feedbackEl.classList.remove('hidden', 'feedback-correct', 'feedback-wrong');
            feedbackEl.textContent = '⏰ Hết giờ! Bạn sút phạt đền trong trạng thái bị áp lực.';
            feedbackEl.classList.add('feedback-wrong');
        }

        this.lastAnswerCorrect = false;

        // Move to shooting phase after 1.8s
        setTimeout(() => {
            this.enterShootingPhase();
        }, 1800);
    }

    cleanup() {
        this.stopTimer();
    }
}
