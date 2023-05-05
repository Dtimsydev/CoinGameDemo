function isTouching(a, b) {
	const aRect = a.getBoundingClientRect();
	const bRect = b.getBoundingClientRect();

	return !(
		aRect.top + aRect.height < bRect.top ||
		aRect.top > bRect.top + bRect.height ||
		aRect.left + aRect.width < bRect.left ||
		aRect.left > bRect.left + bRect.width
	);
}

const gameboard = document.getElementById("game-board");
const avatar = document.querySelector("#player");
const coin = document.querySelector(".coin");
const point = document.querySelector("#points");
const miss = document.querySelector("#miss");
const difEasier = document.getElementById("dif1");
const difHarder = document.getElementById("dif2");
const timer = document.getElementById("timer");
const btn = document.querySelector("#reset");
var points = 0;
var misses = 0;
let intervalId = null;
var difficulty = 10000;
let speed = 50;
var coinCollect = new Audio("coin-collect.mp3");
var wallHit = new Audio("wall-hit.mp3");

const extractPos = (pos) => {
	if (!pos) return 0;
	return parseInt(pos.slice(0, -2));
};

//* Bu ikisini tek fonskiyon yapıp yapmaya çalıştım ama olmadı..
avatarStarter();
moveCoin();

function avatarStarter() {
	avatar.style.top = `${gameboard.getBoundingClientRect().top + Math.floor(Math.random() * (gameboard.clientHeight - 100))}px`;
	avatar.style.left = `${gameboard.getBoundingClientRect().left + Math.floor(Math.random() * (gameboard.clientWidth - 100))}px`;
}

function moveCoin() {
	let y = gameboard.getBoundingClientRect().top + Math.floor(Math.random() * (gameboard.clientHeight - 50));
	let x = gameboard.getBoundingClientRect().left + Math.floor(Math.random() * (gameboard.clientWidth - 50));
	coin.style.top = `${y}px`;
	coin.style.left = `${x}px`;

	if (intervalId !== null) {
		clearInterval(intervalId);
	}
	intervalId = setInterval(() => {
		moveCoin();
		missUp();
	}, difficulty);
}

window.addEventListener("keydown", function (e) {
	if (e.key === "ArrowDown") {
		downMove();
	} else if (e.key === "ArrowUp") {
		upMove();
	} else if (e.key === "ArrowRight") {
		rightMove();
	} else if (e.key === "ArrowLeft") {
		leftMove();
	}
	if (isTouching(avatar, coin)) {
		moveCoin();
		pointUp();
		coinCollect.play();
	}
});
btn.addEventListener("click", () => {
	moveCoin();
	point.innerText = `Points : 0`;
	miss.innerText = `Misses : 0`;
	misses = 0;
	points = 0;
});
difEasier.addEventListener("click", () => {
	difficulty += 1000;
	timer.innerText = ` ${difficulty / 1000} seconds`;
});
difHarder.addEventListener("click", () => {
	if (difficulty > 1000) {
		difficulty -= 1000;
		timer.innerText = ` ${difficulty / 1000} seconds`;
	} else {
		timer.innerText = `What are you trying to do ?`;
	}
});
function pointUp() {
	points++;
	point.innerText = `Points : ${points}`;
}
function missUp() {
	misses++;
	miss.innerText = `Misses : ${misses}`;
}
function downMove() {
	const currTop = extractPos(avatar.style.top);
	if (currTop + avatar.height + speed < gameboard.getBoundingClientRect().bottom) {
		avatar.style.top = `${currTop + speed}px`;
	} else {
		avatar.style.top = `${gameboard.getBoundingClientRect().bottom - avatar.height}px`;
		wallHit.play();
	}
}

function upMove() {
	const currTop = extractPos(avatar.style.top);
	if (currTop - speed > gameboard.getBoundingClientRect().top) {
		avatar.style.top = `${currTop - speed}px`;
	} else {
		avatar.style.top = `${gameboard.getBoundingClientRect().top}px`;
		wallHit.play();
	}
}

function rightMove() {
	const currLeft = extractPos(avatar.style.left);
	if (currLeft + avatar.width + speed < gameboard.getBoundingClientRect().right) {
		avatar.style.left = `${currLeft + speed}px`;
		avatar.style.transform = "scale(-1,1)";
	} else {
		avatar.style.left = `${gameboard.getBoundingClientRect().right - avatar.width}px`;
		avatar.style.transform = "scale(-1,1)";
		wallHit.play();
	}
}
function leftMove() {
	const currLeft = extractPos(avatar.style.left);
	if (currLeft - speed > gameboard.getBoundingClientRect().left) {
		avatar.style.left = `${currLeft - speed}px`;
		avatar.style.transform = "scale(1,1)";
	} else {
		avatar.style.transform = "scale(1,1)";
		avatar.style.left = `${gameboard.getBoundingClientRect().left}px`;
		wallHit.play();
	}
}
