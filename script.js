const allQuestions = {
  easy: [
    {
      text: "？？？？？？カオスマントラ",
      image: {
        question: "images/dm25rp1S01_q.png",
        answer: "images/dm25rp1S01_a.png"
      },
      yomi: "ふぉーちゅん"
    }
  ],
  normal: [],
  hard: []
};

let questions = [];
let currentIndex = 0;
let missCount = 0;
let timer = 15;
let timerId = null;
let isWaiting = false;

const difficultySelect = document.getElementById("difficultySelect");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const cardImage = document.getElementById("cardImage");
const cardText = document.getElementById("cardText");
const furigana = document.getElementById("furigana");

const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

const questionCount = document.getElementById("questionCount");
const missCountText = document.getElementById("missCount");
const timerText = document.getElementById("timer");

function startGame(level) {
  questions = shuffle([...allQuestions[level]]).slice(0, 10);
  currentIndex = 0;
  missCount = 0;

  difficultySelect.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);
  timer = 15;
  timer--;
timerText.textContent = timer;

if (timer <= 5) {
  timerText.classList.add("warning");
} else {
  timerText.classList.remove("warning");
}


  isWaiting = false;
  message.textContent = "";
  furigana.classList.add("hidden");

  answerInput.disabled = false;
  answerInput.value = "";
  answerInput.focus();

  const q = questions[currentIndex];
  cardImage.src = q.image.question;
  cardText.textContent = q.text;

  updateStatus();

  timerId = setInterval(() => {
    timer--;
    timerText.textContent = timer;
    if (timer <= 0) {
      clearInterval(timerId);
      nextQuestion();
    }
  }, 1000);
}

function checkAnswer() {
  if (isWaiting) {
    nextQuestion();
    return;
  }

  const input = answerInput.value.trim();
  const correct = questions[currentIndex].yomi;

  if (input === correct) {
    correctAnswer();
  } else {
    wrongAnswer();
  }
}

function correctAnswer() {
  clearInterval(timerId);
  isWaiting = true;

  const q = questions[currentIndex];
  cardImage.src = q.image.answer;
  furigana.textContent = q.yomi;
  furigana.classList.remove("hidden");

  message.textContent = "正解！";
  answerInput.disabled = true;

  setTimeout(() => {
    if (isWaiting) nextQuestion();
  }, 4000);
}

function wrongAnswer() {
  missCount++;
  missCountText.textContent = `ミス: ${missCount} / 5`;
  message.textContent = "不正解！Enterで再挑戦";

  if (missCount >= 5) endGame();
}

function nextQuestion() {
  clearInterval(timerId);
  isWaiting = false;
  currentIndex++;

  if (currentIndex >= questions.length) {
    endGame();
  } else {
    showQuestion();
  }
}

function endGame() {
  clearInterval(timerId);
  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  document.getElementById("resultText").textContent =
    `${currentIndex}問正解！`;
}

function updateStatus() {
  questionCount.textContent = `${currentIndex + 1} / 10`;
  missCountText.textContent = `ミス: ${missCount} / 5`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

submitBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
});
