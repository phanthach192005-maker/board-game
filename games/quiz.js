class QuizBattle {
    constructor(container, appInstance) {
        this.container = container;
        this.app = appInstance;
        this.scores = { 1: 0, 2: 0 };
        this.winningScore = 5;
        this.gameOver = false;
        this.currentQuestion = null;

        // Timer
        this.timeLimit = 15;
        this.timeLeft = 15;
        this._timerInterval = null;

        this.questions = [
            { q: "Em hãy cho biết USB Drive dùng để làm gì", options: ["Chụp ảnh", "Chơi game", "Gửi và nhận tin nhắn SMS", "Lưu trữ và truyền dữ liệu"], answer: 3 },
            { q: "Em hãy cho biết, cài đặt thiết bị di động nào cho phép ứng dụng theo dõi vị trí của em?", options: ["Cài đặt thông báo", "Cài đặt vị trí", "Cài đặt độ sáng màn hình", "Cài đặt Wifi"], answer: 1 },
            { q: "Em hãy cho biết, giao thức nào đảm bảo kết nối an toàn và được mã hoá giữa trình duyệt web và trang web?", options: ["FTP", "SMTP", "HTTP", "HTTPS"], answer: 3 },
            { q: "Em hãy cho biết, bước khắc phục sự cố cơ bản cần thử trên thiết bị âm thanh không hoạt động là gì?", options: ["Kiểm tra các điều khiển âm lượng", "Điều chỉnh độ sáng màn hình", "Cài đặt một card âm thanh mới", "Thay thế thiết bị"], answer: 0 },
            { q: "Em hãy cho biết, tuỳ chọn nào dưới đây không phải là một phần của URL?", options: ["Giao thức (Protocol)", "Tên miền phụ (Subdomain)", "Tên miền (Domain Name)", "Địa chỉ IP (IP Address)"], answer: 3 },
            { q: "Em hãy cho biết, mục đích của địa chỉ IP là gì?", options: ["Gửi và nhận email", "Xác định vị trí của một trang web", "Điều khiển các thiết bị ngoại vi của máy tính", "Chơi các tập tin âm nhạc"], answer: 1 },
            { q: "Em tin tưởng tên miền nào nhất khi tìm kiếm thông tin cập nhật về du lịch nước ngoài?", options: [".gov", ".net", ".com", ".xyz"], answer: 0 },
            { q: "Em không kết nối được với internet nhà mình, không ai khác trong nhà gặp vấn đề này. Em nên làm gì trước tiên để khắc phục?", options: ["Khởi động lại (Reset) bộ chuyển đổi không dây (Wireless Adapter) trên thiết bị của em", "Tắt hoặc vô hiệu hoá bluetooth trên thiết bị của em", "Thay pin cho thiết bị của em", "Di chuyển đến gần bộ định tuyến hơn"], answer: 0 },
            { q: "Em hãy cho biết, tuỳ chọn nào là khả năng tiếp cận trong công nghệ?", options: ["Sự dễ dàng sử dụng và sẵn có của công nghệ dành cho người khuyết tật", "Cách dữ liệu được gửi qua internet", "Quá trình lưu trữ dữ liệu trên đám mây", "Khả năng kết nối với mạng"], answer: 0 },
            { q: "Em hãy cho biết, mục đích cua địa chỉ IP (Internet Protocol) là gì?", options: ["Xác định các thiết bị hỗ trợ internet trên mạng máy tính", "Xác định vị trí địa chỉ vật lý của trang web", "Gửi và nhận email", "Xác định thông tin cá nhân của người dùng"], answer: 0 },
            { q: "Em hãy cho biết, internet là gì?", options: ["Một trình duyệt web", "Một mạng lưới toàn cầu gồm các thiết bị được kết nối", "Một thiết bị để thực hiện cuộc gọi điện thoại", "Một vị trí vật lí nơi dữ liệu được lưu trữ"], answer: 1 },
            { q: "Em hãy cho biết, lợi ích của việc lưu trữ đám mây là gì?", options: ["Thông tin chỉ có thể được truy cập bởi một thiết bị tại một thời điểm", "Bản in trên giấy của tài liệu được lưu trữ", "Bất kỳ ai cũng có thể truy cập vào dữ liệu mà không cần xin phép", "Dữ liệu được tự động đồng bộ hoá trên tất cả thiết bị"], answer: 3 },
            { q: "Em hãy cho biết, tuỳ chọn nào dưới đây là mô tả đúng về USB Drive?", options: ["Một thiết bị nhớ hoạt động trên đám mây", "Một cơ sở dữ liệu lưu trữ các tập tin trực tuyến", "Một thiết bị lưu trữ dạng cắm", "Một không gian lưu trữ trên một ổ cứng"], answer: 2 },
            { q: "Em hãy cho biết, thuật ngữ nào chỉ các bit dữ liệu nhỏ được thu thập bởi trang web mà em truy cập?", options: ["Bảng tính", "Cookies", "Dữ kiện", "Tấn công xâm nhập (Hacking)"], answer: 1 },
            { q: "Máy in của em ngừng in, em nên làm gì trước tiên để giải quyết vấn đề này", options: ["Kiểm tra dây cáp hoặc kết nối của máy in", "Dọn sạch hàng chờ máy in", "Khởi động lại máy tính", "Thay đổi trình điều khiển máy in"], answer: 0 },
            { q: "Máy tính của em bị chậm. Em nên làm gì trước tiên?", options: ["Rút phích cắm máy tính", "Cập nhật hệ điều hành", "Nhấp chuột liên tục", "Đóng các ứng dụng hoặc cửa sổ không sử dụng"], answer: 3 },
            { q: "Em hãy cho biết, URL (Uniform Resource Locator) là gì?", options: ["Tác giả của một trang web", "Tên của một trang web", "Nhà phát hành của một trang web", "Địa chỉ của một trang web"], answer: 3 },
            { q: "Khi tìm một nhà hàng bán thức ăn nhanh trên mạng, hành động nào sẽ có thể giúp ẩn vị trí của em?", options: ["Bật duyệt web ở chế độ riêng tư", "Xoá cookies của em", "Xoá cache (bộ đệm ẩn) sau khi ngừng duyệt web", "Tải phần mềm chặn quảng cáo"], answer: 0 },
            { q: "Orson là tài xế xe buýt của một trường học. Anh ấy đang chở một đoàn học sinh đi thực tế đến một nơi chưa từng đến. Anh ấy có thể sử dụng loại công nghệ nào để giúp mình mình định hướng được vị trí cần đến?", options: ["GPS (Global Poisitioning System)", "Quả địa cầu (Globe)", "Radio", "Máy phát MP3 (MP3 Player)"], answer: 0 },
            { q: "Em hãy cho biết địa chỉ URL nào có định dạng đúng?", options: ["https://www.companypro.net/test", "https://www.companypro/net/test", "http://www.companypro/test","https://.companypro.net/test"], answer: 0 },
        ];
    }

    init() {
        this.renderBoard();
        this.nextQuestion();
    }

    renderBoard() {
        const board = document.createElement('div');
        board.className = 'quiz-board';
        board.innerHTML = `
            <div class="quiz-scores">
                <div class="quiz-score-card p1-score">
                    <span class="score-name" id="qz-p1-name">${this.app.state.player1}</span>
                    <span class="score-num" id="qz-p1-score">0</span>
                </div>
                <div class="quiz-score-divider">/ ${this.winningScore}</div>
                <div class="quiz-score-card p2-score">
                    <span class="score-name" id="qz-p2-name">${this.app.state.player2}</span>
                    <span class="score-num" id="qz-p2-score">0</span>
                </div>
            </div>

            <div class="quiz-turn-info" id="qz-turn-info"></div>

            <div class="qz-timer-wrap" id="qz-timer-wrap">
                <div class="qz-timer-bar-track">
                    <div class="qz-timer-bar" id="qz-timer-bar"></div>
                </div>
                <span class="qz-timer-text" id="qz-timer-text">15</span>
            </div>

            <div class="quiz-question-card">
                <p class="quiz-question-text" id="qz-question">Loading...</p>
                <div class="quiz-options" id="qz-options"></div>
            </div>

            <div class="quiz-feedback hidden" id="qz-feedback"></div>
        `;
        this.container.appendChild(board);
    }

    nextQuestion() {
        if (this.gameOver) return;

        // Pick a random question
        const idx = Math.floor(Math.random() * this.questions.length);
        this.currentQuestion = this.questions[idx];

        const pName = this.app.state.currentPlayer === 1 ? this.app.state.player1 : this.app.state.player2;
        document.getElementById('qz-turn-info').textContent = `Đến lượt ${pName} trả lời!`;
        document.getElementById('qz-question').textContent = this.currentQuestion.q;
        document.getElementById('qz-feedback').classList.add('hidden');

        const optionsEl = document.getElementById('qz-options');
        optionsEl.innerHTML = '';

        const labels = ['A', 'B', 'C', 'D'];
        this.currentQuestion.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span class="opt-text">${opt}</span>`;
            btn.onclick = () => this.selectAnswer(i, optionsEl);
            optionsEl.appendChild(btn);
        });

        this.startTimer();
    }

    selectAnswer(selectedIndex, optionsEl) {
        if (this.gameOver) return;
        this.stopTimer();

        const correct = this.currentQuestion.answer;
        const buttons = optionsEl.querySelectorAll('.quiz-option-btn');

        // Disable all buttons
        buttons.forEach(b => b.disabled = true);

        // Highlight correct and wrong
        buttons[correct].classList.add('correct');
        if (selectedIndex !== correct) {
            buttons[selectedIndex].classList.add('wrong');
        }

        const feedbackEl = document.getElementById('qz-feedback');
        feedbackEl.classList.remove('hidden', 'feedback-correct', 'feedback-wrong');

        const p = this.app.state.currentPlayer;
        if (selectedIndex === correct) {
            this.scores[p]++;
            this.updateScores();
            feedbackEl.textContent = 'Chính xác! ✅';
            feedbackEl.classList.add('feedback-correct');

            if (this.scores[p] >= this.winningScore) {
                const winnerName = p === 1 ? this.app.state.player1 : this.app.state.player2;
                setTimeout(() => this.app.showMessage(`Chúc mừng ${winnerName} chiến thắng!`), 600);
                this.gameOver = true;
                return;
            }
        } else {
            feedbackEl.textContent = `Chưa chính xác! ❌`;
            feedbackEl.classList.add('feedback-wrong');
        }

        setTimeout(() => {
            this.app.switchTurn();
            this.nextQuestion();
        }, 1800);
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
        const textEl = document.getElementById('qz-timer-text');
        const barEl  = document.getElementById('qz-timer-bar');
        const wrapEl = document.getElementById('qz-timer-wrap');
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

        // Disable buttons and show correct answer
        const optionsEl = document.getElementById('qz-options');
        if (optionsEl) {
            const buttons = optionsEl.querySelectorAll('.quiz-option-btn');
            buttons.forEach(b => b.disabled = true);
            if (buttons[this.currentQuestion.answer]) {
                buttons[this.currentQuestion.answer].classList.add('correct');
            }
        }

        const feedbackEl = document.getElementById('qz-feedback');
        if (feedbackEl) {
            feedbackEl.classList.remove('hidden', 'feedback-correct', 'feedback-wrong');
            feedbackEl.textContent = '⏰ Hết giờ! Mất lượt.';
            feedbackEl.classList.add('feedback-wrong');
        }

        setTimeout(() => {
            if (!this.gameOver) {
                this.app.switchTurn();
                this.nextQuestion();
            }
        }, 1800);
    }

    updateScores() {
        document.getElementById('qz-p1-score').textContent = this.scores[1];
        document.getElementById('qz-p2-score').textContent = this.scores[2];
    }

    cleanup() {
        this.stopTimer();
    }
}
