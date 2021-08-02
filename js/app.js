var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE'

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/banana.png" />';

var gGlue = false
var gBoard;
var gGamerPos;
var gBallInGame = 2
var gCountBall = 0
var sound = new Audio('pop.wav')
var gIntervalBall
var gIntervallGlue

function initGame() {
	gGamerPos = {
		i: 2,
		j: 9
	};
	gBoard = buildBoard();
	renderBoard(gBoard);

	gIntervalBall = setInterval(function () {
		addRandomBall()
	}, 3000)

	gIntervallGlue = setInterval(function () {
		addGLUE()
	}, 5000)
	//gIntervallGlue = setTimeout(gIntervallGlue, 1000);
	gCountBall = 0
	gBallInGame = 2

}




function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = {
				type: FLOOR,
				gameElement: null
			};

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			if (i === 0 && j === 5 || i === 5 && j === 0 || i === 9 && j === 5 || i === 5 && j === 11) {
				cell.type = FLOOR;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;
	return board;
}



// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({
				i: i,
				j: j
			})

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += `\t<td class="cell + ${cellClass}" +
				  onclick="moveTo(' + ${i}  + ${j} + ')" >\n`;


			// TODO - change to switch case statement
			switch (currCell.gameElement) {
				case 'GAMER':
					strHTML += GAMER_IMG;
					break;
				case 'BALL':
					strHTML += BALL_IMG;
					break;
				case 'GLUE':
					strHTML += GLUE_IMG;
					break;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	var elH2 = document.querySelector('h2')
	elH2.innerText = 'CountBall : ' + gCountBall
	var elH3 = document.querySelector('h3')
	elH3.innerText = 'Ball in Game : ' + gBallInGame

	var targetCell = gBoard[i][j];

	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if (gGlue) return
	if ((iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0) ||
		(gGamerPos.j === 0 && j === 9) ||
		(gGamerPos.j === 11 && j === 0) ||
		(gGamerPos.j === 5 && i === 5) ||
		(gGamerPos.j === 5 && j === 5)) {

		if (targetCell.gameElement === GLUE) {
			gGlue = true
			setTimeout(function () {
				gGlue = false
			}, 3000)
		}
		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
			sound.play()
			gCountBall++
			gBallInGame--
			if (gBallInGame === 0) {
				alert('Victory');
				clearInterval(gIntervalBall)
				clearInterval(gIntervallGlue)

			}
		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;
	console.log('ev', event);

	switch (event.key) {
		case 'ArrowLeft':
			if (i === 5 && j === 0) moveTo(5, 9)
			else moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			if (i === 5 && j === 11) moveTo(5, 0)
			else moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if (i === 0 && j === 5) moveTo(9, 5)
			else moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if (i === 9 && j === 5) moveTo(0, 5)
			else moveTo(i + 1, j);
			break;
	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function getEmptyCell(board) {
	var emptyCells = []
	var coord = {}
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			if (board[i][j].type === FLOOR && board[i][j].gameElement !== GAMER && board[i][j].gameElement !== BALL) {
				coord = {
					i,
					j,
				}
				emptyCells.push(coord)
			}
		}
	}
	return emptyCells
}

function addRandomBall() {
	var emptyCells = getEmptyCell(gBoard)
	var randomIdx = getRandomInt(0, emptyCells.length)
	var cellI = emptyCells[randomIdx].i
	var cellJ = emptyCells[randomIdx].j
	gBoard[cellI][cellJ].gameElement = BALL
	renderBoard(gBoard)
	gBallInGame++
}

function addGLUE() {
	var emptyCells = getEmptyCell(gBoard)
	var randomIdx = getRandomInt(0, emptyCells.length)
	var cellI = emptyCells[randomIdx].i
	var cellJ = emptyCells[randomIdx].j
	gBoard[cellI][cellJ].gameElement = GLUE
	var location = getClassName(emptyCells[randomIdx])
	var td = document.querySelector(`.${location}`)
	td.innerHTML = GLUE_IMG
	setTimeout(function () {
		if (gBoard[cellI][cellJ].gameElement = GLUE) {
			gBoard[cellI][cellJ].gameElement = ''
			renderBoard(gBoard)
		}
	}, 3000)
}

function restartGame() {
	initGame()
}