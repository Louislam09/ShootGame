// let oldScore = [];
let tbody = document.querySelector('#table tbody');
let body = document.querySelector('body');

const Places = [ '1st🥇', '2nd🥈', '3th🥉', '4th🏅', '5th🏅', '6th🏅', '7th🏅', '8th🏅', '9th🏅' ];
let scoreList = [];
var BESTSCORE;
let scoreObj = {};

let addScoreToSystem = (s, n) => {
	let newScore = {
		score: s,
		name: n
	};

	scoreList.push(newScore);

	localStorageDataList(scoreList);
};
let getScoreFromSystem = () => {
	let storedScore = localStorage.getItem('List');
	if (storedScore == null) {
		scoreList = [];
	} else {
		scoreList = JSON.parse(storedScore);
	}
	return scoreList;
};
let localStorageDataList = (x) => {
	localStorage.setItem('List', JSON.stringify(x));
};
function saveScore() {
	scoreObj.score = score;
	scoreObj.name = userName;

	addScoreToSystem(scoreObj.score, scoreObj.name);
	drawScore();
}
function drawScore() {
	let oldScore = getScoreFromSystem();

	oldScore.sort(function(a, b) {
		if (a.score < b.score) {
			return 1;
		}
		if (a.score > b.score) {
			return -1;
		}
		// a must be equal to b
		return 0;
	});
	if (oldScore.length == 0) {
		BESTSCORE = 0;
	} else {
		BESTSCORE = oldScore[0].score;
	}

	oldScore.splice(10, 1);

	tbody.innerHTML = '';

	for (let i = 0; i < oldScore.length - 1; i++) {
		let row = tbody.insertRow(i);

		let place = row.insertCell(0);
		let score = row.insertCell(1);
		let name = row.insertCell(2);

		place.className = Places[i];
		score.className = Places[i];
		name.className = Places[i];

		if (i === 0) {
			place.style.color = 'goldenrod';
			score.style.color = 'goldenrod';
			name.style.color = 'goldenrod';
		} else if (i === 1) {
			place.style.color = 'black';
			score.style.color = 'black';
			name.style.color = 'black';
		} else if (i === 2) {
			place.style.color = 'orangered';
			score.style.color = 'orangered';
			name.style.color = 'orangered';
		} else {
			place.style.color = 'green';
			score.style.color = 'green';
			name.style.color = 'green';
		}

		place.innerHTML = Places[i];
		score.innerHTML = oldScore[i].score;
		name.innerHTML = oldScore[i].name;

		tbody.appendChild(row);
	}
}
