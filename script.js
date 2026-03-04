const wasteItems = {
  Wet: ["Banana Peel", "Vegetable Scraps", "Tea Leaves"],
  Dry: ["Plastic Bottle", "Newspaper", "Cardboard Box"],
  Hazardous: ["Battery", "Expired Medicine", "Broken Glass"],
  "E-Waste": ["Old Mobile Phone", "Laptop Charger", "Broken Keyboard"],
  Recycle: ["Glass Bottle", "Steel Can", "Paper Bag"],
};

let items = [],
  score = 0,
  combo = 0,
  lives = 3,
  timeLeft = 60;
let gameInterval;

const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const livesEl = document.getElementById("lives");
const timerEl = document.getElementById("timer");
const itemEl = document.getElementById("currentItem");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameArea = document.getElementById("gameArea");
const endScreen = document.getElementById("endScreen");
const bgMusic = document.getElementById("bgMusic");

const binMouth = document.getElementById("binMouth");
const binBody = document.getElementById("binBody");
const binLid = document.getElementById("binLid");

startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame() {
  bgMusic.volume = 0.2;
  bgMusic.play(); // Start music

  score = 0;
  combo = 0;
  lives = 3;
  timeLeft = 60;

  scoreEl.innerText = 0;
  comboEl.innerText = 0;
  livesEl.innerText = lives + " ❤️";
  timerEl.innerText = timeLeft;

  startBtn.classList.add("hidden");
  restartBtn.classList.add("hidden");
  gameArea.classList.remove("hidden");

  prepareItems();
  loadItem();
  startTimer();
}

function prepareItems() {
  items = [];
  for (let c in wasteItems)
    wasteItems[c].forEach((i) => items.push({ name: i, type: c }));
  items.sort(() => Math.random() - 0.5);
}

function loadItem() {
  if (!items.length) return endGame("Mission Complete!");
  const cur = items.pop();
  itemEl.innerText = cur.name;
  itemEl.dataset.type = cur.type;
}

document.querySelectorAll(".bin").forEach((bin) => {
  bin.addEventListener("dragover", (e) => e.preventDefault());

  bin.addEventListener("drop", (e) => {
    e.preventDefault();

    if (bin.dataset.bin === itemEl.dataset.type) {
      combo++;
      score += 1 + combo;
      loadItem();
    } else {
      combo = 0;
      lives--;
      if (lives <= 0) endGame("Mission Failed");
    }

    scoreEl.innerText = score;
    comboEl.innerText = combo;
    livesEl.innerText = lives + " ❤️";
  });
});

function startTimer() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;
    if (timeLeft <= 0) endGame("Time Up");
  }, 1000);
}

function endGame(msg) {
  clearInterval(gameInterval);
  endScreen.innerText = msg + " | Score: " + score;
  restartBtn.classList.remove("hidden");
}
