/* 
THIS IS A GAME MADE BY LUIS (LAM09) AS PASSTIME 

I DECIDED TO COMMENT SOME THING CUZ IF I COME IN 
THE FUTURE I COULD FORGET A LOT OF THING THAT MAKE 
THIS GAME WORK! SO WITH MY COMMENT I'LL UNDERSAND
HOW I DO IT.

*/

//* ELEMENTS
let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
let scoreBoard = document.getElementById('scoreBoard');
let lifeBoard = document.getElementById('lifeBoard');
let missileBoard = document.getElementById('missileNum');
let newGunBoard = document.getElementById('newGunBoard');
let GameLevel = document.getElementById('GameLevel');
let bestScore = document.getElementById('bestScore');
let playerName = document.getElementById('playerName');
let restartGame = document.getElementById('restartGame');
let controlGame = document.getElementById('controlGame');
let button = document.getElementById('button');

let userName = prompt('Whats your name?');

//* VARIABLES
let cw = canvas.width;
let ch = canvas.height;
let pause = false;
let score = 0;
let movement = 25;
let bulletNum = 20;
let userAk47 = false;
let gameLevel = 1;
let passBestScore = false;
let instruction = false;
var breakout = true;


//* OBJECTS
const Key = {
	RIGHT: 37,
	UP: 38,
	LEFT: 39,
	DONW: 40,
	SPACE: 32,
	ESC: 27,
	L: 76,
	Q: 81
};
const Letter = {
	A: 65,
	W: 87,
	D: 68,
	S: 83
};
const colors = [
	'#2185C5',
	'#7ECEFD',
	'#F26D85',
	'#BF214B',
	'#C1D0D9',
	'#0E6973',
	'#0E7373',
	'#547C8C',
	'#6FB7BF',
	'#D96704',
	'#D9A679',
	'#8C4C46',
	'#FF7F66'
];
let EnemyInf = {
	w: 45,
	h: 40,
	x: GetRandom(450),
	y: -20,
	c: '👾',
	s: 4
};
//* ** To get a random color
let rgb;

class Sprite {
	constructor(x, y, w, h, c, size) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
		this.size = size;
		this.radius = this.w;
		this.dx = this.size;
		this.dy = this.size;
	}

	draw = () => {
		c.beginPath();
		c.fillStyle = this.c;
		c.fillRect(this.x, this.y, this.w, this.h);
		c.fill();
		c.closePath();
	};
	drawCircle = () => {
		c.beginPath();
		c.fillStyle = this.c;
		c.arc(this.x, this.y, this.w, 0, Math.PI * 2);
		c.fill();
		c.closePath();
	};
	drawHero = () => {
		c.beginPath();
		let heroShape = this.c;
		c.font = '' + this.size + 'em monospace';
		c.fillText(heroShape, this.x, this.y);
		c.fill();
		c.closePath();
	};
	drawEnemy = () => {
		c.beginPath();
		let heroShape = this.c;
		c.font = '' + this.size + 'em monospace';
		c.fillText(heroShape, this.x, this.y);
		c.fill();
		c.closePath();
	};
	updateFire = () => {
		this.y -= movement;
	};
	updateMonster = () => {
		if (this.x + this.w > cw || this.x < 0) {
			this.size = -this.size;
		}
		if (this.y + this.w > ch || this.y < 0) {
			this.size = -this.size;
		}
		this.x += this.size;
		this.y += this.size;
	};
	//* CIRCLE UPDATE EN COLLISION
	updateBigMonster = () => {
		//*WALL COLLISION
		if (this.x + this.radius > cw || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}
		if (this.y - this.radius < 0) {
			this.dy = -this.dy;
		}
		if (this.y + this.radius > ch) {
			this.dy = -this.dy;
		}
		if (
			this.x + this.radius > hero.x &&
			this.x - this.radius < hero.x + hero.w &&
			this.y + this.radius > hero.y &&
			this.y - this.radius < hero.y + hero.h
		) {
			this.dy = -this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;
	};
}

//* SPRITES
let hero = new Sprite(400, ch - 10, 40, 40, '🛸', 4);
let fire = new Sprite(0, 0, 4, 60, 'green');
let missile = new Sprite(0, 0, 4, 60, '🧨', 4);
let lifeBar = new Sprite(325, 200, 150, 6, 'blue', 4);

//* ARRAYS
let ak47 = [];
let enemies = [];
let giveLife = [];
let giveMissile = [];
let giveAk47 = [];
let points = [];
let monsters = [];
let monsterLife = [];

//* GIFTS ARRAYS
let life = [ '❤️', '❤️', '❤️' ];
let missileNum = [ '🧨', '🧨', '🧨' ];

// Audios
let backgroundSound = new Audio('audio/ActionMenu.mp3');
let fireSound = new Audio('audio/fire.mp3');
let crash = new Audio('audio/crash.mp3');
let bound = new Audio('audio/rebound.mp3');
let gift = new Audio('audio/gift.mp3');
let looseLIFE = new Audio('audio/looseLIFE.mp3');
let GAMEOVER = new Audio('audio/Game Over.ogg');

let HandlerMouse = () => {
	//**! Move the hero with the mouse
	const mouse = {
		x: 10,
		y: 10
	};
	addEventListener('mousemove', (event) => {
		mouse.x = event.clientX;
		mouse.y = event.clientY;
	});
};
let UpdateEnemies = () => {
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].y += 4;
		enemies[i].x += GetRandom(7) - 3;

		if (enemies[i].y > ch) {
			enemies.splice(i, 1);
		}
	}
};
let UpdateGifts = (giftName) => {
	for (let i = 0; i < giftName.length; i++) {
		giftName[i].y += 4;

		if (giftName[i].y > ch) {
			giftName.splice(i, 1);
		}
	}
};
let AddEnemyToGame = () => {
	if (GetRandom(50) == 0) {
		for (let i = 0; i < 1; i++) {
			enemies.push(new Sprite(GetRandom(750), EnemyInf.y, EnemyInf.w, EnemyInf.h, EnemyInf.c, EnemyInf.s));
		}
	}
};
let AddGiftToGame = () => {
	if (GetRandom(1000) == 0) {
		for (let i = 0; i < 1; i++) {
			giveLife.push(new Sprite(GetRandom(cw), EnemyInf.y, EnemyInf.w, EnemyInf.h, '❤️'));
			giveMissile.push(new Sprite(GetRandom(cw), EnemyInf.y, EnemyInf.w, EnemyInf.h, '🧨'));
			giveAk47.push(new Sprite(GetRandom(cw), EnemyInf.y, EnemyInf.w, EnemyInf.h, '🔫'));
		}
	}
};
let AddMonsterToGame = () => {
	if (monsters.length == 0) {
		monsters.push(new Sprite(cw / 2, 200, 100, 150, 'rgb(223,102,39)', 10));

		for (let i = 0; i < 15; i++) {
			monsterLife.push(new Sprite(325 + i * 10, 200, 10, 4, 'white', 7));
		}
		monsterLife.reverse();
	}
};
let ReceiveGift = (giftName, addGiftTo, giftIcon, giftMsg) => {
	for (let i = 0; i < giftName.length; i++) {
		if (Intersects(hero, giftName[i])) {
			points.push(new Sprite(giftName[i].x, giftName[i].y, 4, 60, giftMsg));

			giftName.splice(0, 1);
			addGiftTo.push(giftIcon);
			gift.currentTime = 1;
			gift.play();
		}
	}
};
function Intersects(a, b) {
	return a.x < b.x + b.w + 5 && a.x + a.w > b.x + 5 && a.y < b.y + b.h + 5 && a.y + a.h > b.y + 5;
}
function IntersectsC(a, b, i) {
	return (
		a[i].x + a[i].radius > b.x &&
		a[i].x - a[i].radius < b.x + b.w &&
		a[i].y + a[i].radius > b.y &&
		a[i].y - a[i].radius < b.y + b.h
	);
}
function CheckCollision() {
	for (let i = 0; i < enemies.length; i++) {
		if (Intersects(fire, enemies[i])) {
			points.push(new Sprite(enemies[i].x, enemies[i].y, 4, 60, '100+'));
			enemies.splice(i, 1);
			fire.x = -150;
			score += 100;

			// sound
			crash.currentTime = 0.5;
			crash.play();
			crash.volume = 0.5;

			if (score > BESTSCORE && passBestScore == false) {
				points.push(new Sprite(cw / 2 - 200, 0, 4, 60, '🎊NEW BESTSCORE🎊'));
				passBestScore = true;
			}
		}
		if (Intersects(missile, enemies[i])) {
			enemies.splice(i, 5);
			missile.x = -150;
			score += 500;
			// sound
			crash.play();
			crash.volume = 0.8;

			if (score > BESTSCORE && passBestScore == false) {
				points.push(new Sprite(cw / 2 - 200, 0, 4, 60, '🎊NEW BESTSCORE🎊'));
				passBestScore = true;
			}
		}

		if (Intersects(hero, enemies[i])) {
			if (life.length != 0) {
				if (life.length != 1 && life.length != 0) {
					points.push(new Sprite(enemies[i].x, enemies[i].y, 4, 60, 'life-'));
				}

				enemies.splice(i, 1);

				life.splice(0, 1);

				looseLIFE.play();
			}
		}
		for (let j = 0; j < ak47.length; j++) {
			if (Intersects(enemies[i], ak47[j])) {
				points.push(new Sprite(enemies[i].x, enemies[i].y, 4, 60, '100+'));
				enemies.splice(i, 1);
				ak47.splice(j, 1);
				score += 100;

				// sound
				crash.currentTime = 0.5;
				crash.play();
				crash.volume = 0.5;

				if (score > BESTSCORE && passBestScore == false) {
					points.push(new Sprite(cw / 2 - 200, 0, 4, 60, '🎊NEW BESTSCORE🎊'));
					passBestScore = true;
				}
			}
		}
	}

	for (let i = 0; i < monsters.length; i++) {
		if (IntersectsC(monsters, fire, i)) {
			monsterLife.splice(i, 1);
			fire.x = -150;
			bound.play();
			bound.volume = 0.5;

			if (monsterLife.length <= 10) {
				monsters[i].c = 'orange';
				lifeBar.c = 'orange';
			}
			if (monsterLife.length <= 5) {
				monsters[i].c = 'red';
				lifeBar.c = 'red';
			}
			if (monsterLife.length == 0) {
				points.push(new Sprite(monsters[i].x, monsters[i].y, 4, 60, 'Level Up ↑'));
				points.push(new Sprite(monsters[i].x, monsters[i].y + 50, 4, 60, '1000+'));
				monsters.splice(i, 1);
				gameLevel += 1;
				score += 1000;
			}
		}
		if (IntersectsC(monsters, hero, i)) {
			life.splice(0, 1);
			looseLIFE.play();

			if (life.length != 1 && life.length != 0) {
				points.push(new Sprite(monsters[i].x, 100, 4, 60, 'life-'));
			}
		}
		if (IntersectsC(monsters, missile, i)) {
			monsterLife.splice(i, 3);
			missile.x = -150;

			if (monsterLife.length <= 10) {
				monsters[i].c = 'orange';
				lifeBar.c = 'orange';
			}
			if (monsterLife.length <= 5) {
				monsters[i].c = 'red';
				lifeBar.c = 'red';
			}
			if (monsterLife.length == 0) {
				monsters.splice(i, 1);
				gameLevel += 1;
			}
		}
	}

	ReceiveGift(giveLife, life, '❤️', 'life+');
	ReceiveGift(giveMissile, missileNum, '🧨', 'missile+');

	for (let i = 0; i < giveAk47.length; i++) {
		if (Intersects(hero, giveAk47[i])) {
			points.push(new Sprite(giveAk47[i].x, giveAk47[i].y, 4, 60, '50bullets+'));

			giveAk47.splice(0, 1);
			bulletNum += 50;
		}
	}
}
function GetRandom(maxSize) {
	return parseInt(Math.random() * maxSize);
}
let ToggleControls = (ev) => {
	if (ev.keyCode == Key.RIGHT && hero.x > 0) {
		hero.x -= movement;
	}
	if (ev.keyCode == Key.LEFT && hero.x + hero.w < cw) {
		hero.x += movement;
	}
	if (ev.keyCode == Key.UP && hero.y > 0) {
		hero.y -= movement;
	}
	if (ev.keyCode == Key.DONW && hero.y + hero.h < ch) {
		hero.y += movement;
	}
	if (ev.keyCode == Letter.A && hero.x > 0) {
		hero.x -= movement;
	}
	if (ev.keyCode == Letter.D && hero.x + hero.w < cw) {
		hero.x += movement;
	}
	if (ev.keyCode == Letter.W && hero.y > 0) {
		hero.y -= movement;
	}
	if (ev.keyCode == Letter.S && hero.y + hero.h < ch) {
		hero.y += movement;
	}
	if (ev.keyCode == Key.SPACE) {
		ShootMissile();
	}
	if (ev.keyCode == Key.L) {
		SwapGun();
	}
	if (ev.keyCode == Key.Q) {
		ChargeGun();
	}
	if (ev.keyCode == Key.ESC) {
		if (pause == false) {
			pause = true;
		} else {
			pause = false;
		}
	}
};
let AutomaticShoot = () => {
	if (bulletNum != 0) {
		ak47.push(new Sprite(hero.x + 30, hero.y - 40, 4, 60, 'red'));
		for (let i = 0; i < ak47.length; i++) {
			ak47[i].y -= movement;
		}
		bulletNum = bulletNum - 1;
	}
	if (bulletNum == 0) {
		points.push(new Sprite(cw / 2, ch / 2, 4, 60, 'NO-BULLETS!'));

		for (let i = 0; i < ak47.length; i++) {
			points[i].y -= movement;
		}
	}
};
let ShootMissile = () => {
	if (missileNum.length != 0) {
		missile.x = hero.x + 30;
		missile.y = hero.y - 40;
		missile.y -= movement;
		missileNum.splice(0, 1);
	}
	if (missileNum.length == 0) {
		points.push(new Sprite(cw / 2 - 100, ch / 2 - 20, 4, 60, 'NO-MISSILES!'));

		for (let i = 0; i < missileNum.length; i++) {
			points[i].y -= movement;
		}
	}
};
let Shoot = () => {
	fire.x = hero.x + 30;
	fire.y = hero.y - 40;
	fire.y -= movement;
};
let SetMenu = () => {
	scoreBoard.innerHTML = 'SCORE : ' + score + '';
	lifeBoard.innerHTML = 'LIFE : ' + life + '';
	missileBoard.innerHTML = 'MISSILES : ' + missileNum + '';
	newGunBoard.innerHTML = 'GUN🔫 : ' + bulletNum + ' bullets';
	GameLevel.innerHTML = 'LEVEL : ' + gameLevel + '';
	bestScore.innerHTML = 'BESTSCORE : ' + BESTSCORE + '';
	playerName.innerHTML = 'PLAYER : ' + userName + '';
	restartGame.innerHTML = 'RESTART!';

	if (life.length == 0) {
		points.push(new Sprite(200, ch / 2 - 100, 4, 60, 'GAME OVER!', 7));
		DrawArray(points);

		RandomColor();
		backgroundSound.volume = 0.1;
		GAMEOVER.play();

		hero.c = '👽';

		restartGame.style.visibility = 'visible';
		restartGame.style.color = rgb;

		pause = true;

		// UPDATE THE TABLE'S CONTENT
		if(breakout==true){
			saveScore();
			breakout = false;
		}
	}

	if (instruction == false) {
		controlGame;

		controlGame.style.visibility = 'visible';
		button.style.visibility = 'visible';
	} else {
		controlGame.style.visibility = 'hidden';
		button.style.visibility = 'hidden';
	}
};
let DrawArray = (x) => {
	for (let i = 0; i < x.length; i++) {
		x[i].drawEnemy();
	}
};
let SwapGun = () => {
	if (userAk47) {
		AutomaticShoot();
		fireSound.currentTime = 0.1;
		fireSound.play();
	} else {
		Shoot();
		fireSound.currentTime = 0.1;
		fireSound.play();
	}
};
let ChargeGun = () => {
	if (userAk47) {
		userAk47 = false;
		points.push(new Sprite(cw / 2 - 100, ch / 2 - 20, 4, 60, 'GUN SWAPPED!'));

		for (let i = 0; i < missileNum.length; i++) {
			points[i].y -= movement;
		}
	} else {
		userAk47 = true;
		points.push(new Sprite(cw / 2 - 100, ch / 2 - 20, 4, 60, 'GUN SWAPPED!'));

		for (let i = 0; i < missileNum.length; i++) {
			points[i].y -= movement;
		}
	}
};
let Events = () => {
	document.onselectstart = () => {
		return false;
	};
	document.onmousedown = () => {
		return false;
	};
	document.addEventListener('keydown', ToggleControls);
	canvas.addEventListener('click', SwapGun);

	canvas.onwheel = ChargeGun;

	canvas.onmouseleave = () => {
		return (pause = true);
	};

	restartGame.onclick = () => {
		document.location.reload();
	};

	button.addEventListener('click', swapMenu);
};
var swapMenu = () => {
	instruction = true;
};
let RandomColor = () => {
	rgb =
		'rgb(' +
		Math.floor(Math.random() * 256) +
		',' +
		Math.floor(Math.random() * 256) +
		',' +
		Math.floor(Math.random() * 256) +
		')';
};
let SetLevel = (x) => {
	if (x == 1000) {
		if (gameLevel == 1) {
			for (let i = 0; i < 1; i++) {
				//* HERE I DRAW ADD  MONSTERS
				AddMonsterToGame();
				monsters[i].drawCircle();
				monsters[i].updateBigMonster();

				lifeBar.x = monsters[i].x - 75;
				lifeBar.y = monsters[i].y;
			}

			for (let i = 0; i < monsterLife.length; i++) {
				monsterLife[i].x = lifeBar.x + i * 10;
				monsterLife[i].y = lifeBar.y;
				monsterLife[i].draw();
			}
		}
	}
};
//* THIS FUNCION CONTAIN ALL DETAILS THAT I WANT TO BE IN THE GAME
score = 3500;
let Int = () => {
	
		drawScore();

	Events();
	if (!pause && instruction) {
		backgroundSound.play();
		backgroundSound.loop = true;
		backgroundSound.volume = 0.5;

		//* HERE I DRAW THE MAIN CARACTER (THE NAVE)
		hero.drawHero();
		//* HERE I CALL  EVENTS IN THE GAME

		//* GET  A RANDOM COLOR
		RandomColor();
		fire.c = rgb;

		SetLevel(score);

		if (score != 1000) {
			//* HERE I ADD ENEMIES AND GIFTS
			AddEnemyToGame();
			AddGiftToGame();
			// DrawArray(enemies);
		} else {
			enemies.splice(0, enemies.length);
		}

		//* HERE I UPDATE ENEMIES AND GIFTS
		UpdateGifts(giveLife);
		UpdateGifts(giveAk47);
		UpdateGifts(giveMissile);
		UpdateGifts(points);
		UpdateEnemies();

		//* HERE I DRAW AND UPDATE SHOOTS
		fire.draw();
		fire.updateFire();
		missile.drawEnemy();
		missile.updateFire();

		//* THIS IS FOR SHOOTING WITH THE AK47 (LOL)
		for (let i = 0; i < ak47.length; i++) {
			ak47[i].draw();
			ak47[i].updateFire();
		}
		//* Here I draw all the array on the canvas
		DrawArray(enemies);
		DrawArray(points);
		DrawArray(giveLife);
		DrawArray(giveAk47);
		DrawArray(giveMissile);

		//* HERE I CHECK  COLLISIONS BETWEEN OBJECTS
		CheckCollision();

		//* HERE I SET ALL MENUS
	} else {
		if (life.length != 0) {
			DrawArray(points);

			points.push(new Sprite(280, ch / 2, 40, 60, 'PAUSE!', 7));
			backgroundSound.pause();
		}
	}
	SetMenu();
};
//* THIS FUNCTION RUN THE GAME!
function Loop() {
	requestAnimationFrame(Loop);
	c.clearRect(0, 0, cw, ch);

	Int();
}

Loop();
