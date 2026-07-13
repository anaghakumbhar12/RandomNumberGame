// 🎯 GAME SETTINGS
const minRange = 1;
const maxRange = 100; // ✅ FIXED RANGE

let maxAttempts = 5;
let attempts = maxAttempts;

let randomNumber = generateNumber();
let guessHistory = [];

let timer;
let timeLeft = 60;
let gameStarted = false;
let hintUsed = false;

// 📦 DOM
const input = document.getElementById('guessInput');
const message = document.getElementById('message');
const score = document.getElementById('score');
const progress = document.getElementById('progress');
const historyList = document.getElementById('historyList');

const submitBtn = document.getElementById('submitBtn');
const newGameBtn = document.getElementById('newGameBtn');

// ➕ Timer UI
const timerDisplay = document.createElement("p");
timerDisplay.innerText = "⏱ Time: 60s";
document.querySelector(".container").insertBefore(timerDisplay, input);

// ➕ Hint Button
const hintBtn = document.createElement("button");
hintBtn.innerText = "💡 Hint";
document.querySelector(".container").appendChild(hintBtn);

// 🎮 EVENTS
submitBtn.addEventListener('click', checkGuess);
newGameBtn.addEventListener('click', newGame);
hintBtn.addEventListener('click', giveHint);

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") checkGuess();
});

// 🎲 RANDOM NUMBER
function generateNumber() {
  return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
}

// ⏱ TIMER
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `⏱ Time: ${timeLeft}s`;

    if (timeLeft <= 10) timerDisplay.style.color = "red";

    if (timeLeft <= 0) {
      endGame(false, "⏰ Time's up!");
    }
  }, 1000);
}

// 🎯 CHECK GUESS
function checkGuess() {
  let guess = Number(input.value);

  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  if (!guess || guess < minRange || guess > maxRange) {
    showMessage(`⚠️ Enter between ${minRange}-${maxRange}`);
    shake();
    return;
  }

  if (guessHistory.includes(guess)) {
    showMessage("⚠️ Already guessed!");
    return;
  }

  guessHistory.push(guess);
  updateHistory();

  attempts--;
  updateProgress();

  let diff = Math.abs(guess - randomNumber);

  // 🎉 WIN
  if (guess === randomNumber) {
    endGame(true, "🎉 Perfect! You guessed it!");
    return;
  }

  // 🔥 CLOSENESS
  let feedback = "";
  if (diff <= 3) feedback = "🔥 Extremely close!";
  else if (diff <= 10) feedback = "😎 Close!";
  else feedback = "❄️ Far away!";

  // 📈 DIRECTION
  if (guess > randomNumber) {
    feedback += " 🔺 Too high!";
  } else {
    feedback += " 🔻 Too low!";
  }

  showMessage(feedback);

  // ❌ LOSE (attempts)
  if (attempts === 0) {
    endGame(false, "❌ Game Over!");
  }

  score.innerText = "Attempts left: " + attempts;
  input.value = "";
}

// 💡 HINT SYSTEM
function giveHint() {
  if (hintUsed) {
    showMessage("⚠️ Hint already used!");
    return;
  }

  hintUsed = true;

  let hints = [];

  hints.push(randomNumber % 2 === 0 ? "🔢 EVEN" : "🔢 ODD");

  if (randomNumber % 5 === 0) {
    hints.push("✋ Divisible by 5");
  }

  hints.push(randomNumber > 50 ? "📈 Greater than 50" : "📉 ≤ 50");

  showMessage("💡 Hint: " + hints.join(" | "));
}

// 🏁 END GAME (FIXED)
function endGame(win, msg) {
  clearInterval(timer);
  input.disabled = true;

  if (win) {
    // 🟢 WIN
    showMessage(msg);
    progress.style.width = "100%";
    progress.style.background = "linear-gradient(135deg, #28a745, #4dff88)";
  } else {
    // 🔴 LOSE (TIME UP / ATTEMPTS)
    showMessage(`${msg} ❌<br>🎯 Correct number: <b>${randomNumber}</b>`);
    progress.style.background = "linear-gradient(135deg, #ff4d4d, #ff0000)";
  }
}

// 📜 HISTORY
function updateHistory() {
  historyList.innerHTML = guessHistory
    .map(num => `<span>${num}</span>`)
    .join("");
}

// 📊 PROGRESS
function updateProgress() {
  progress.style.width = (attempts / maxAttempts) * 100 + "%";
}

// 🔄 NEW GAME
function newGame() {
  clearInterval(timer);

  randomNumber = generateNumber();
  attempts = maxAttempts;
  guessHistory = [];

  timeLeft = 60;
  gameStarted = false;
  hintUsed = false;

  showMessage("");
  score.innerText = "Attempts left: " + attempts;
  historyList.innerHTML = "None";

  timerDisplay.innerText = "⏱ Time: 60s";
  timerDisplay.style.color = "black";

  // 🔁 Reset progress bar
  progress.style.background = "linear-gradient(90deg, #ff758c, #ff7eb3, #ff4d6d)";

  input.disabled = false;
  input.value = "";

  updateProgress();
}

// 💬 MESSAGE
function showMessage(msg) {
  message.innerHTML = msg;
}

// 💥 SHAKE
function shake() {
  input.classList.add("shake");
  setTimeout(() => input.classList.remove("shake"), 300);
}