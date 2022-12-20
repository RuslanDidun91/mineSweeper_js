/*----constant----*/
const bomb = 1;
const safe = 0;
const colors = {
    1: '#0a40f0',
    2: '#2ec015',
    3: '#FF0000FF',
    4: '#01015BFF',
    5: '#F09C0A',
    6: '#790AF0',
    7: '#A38A00',
    8: '#000000'
};
const AUDIO1 = new Audio('./sounds/mario2.wav');
const AUDIO2 = new Audio('./sounds/mario1.wav');

/*----state variables----*/
let win;
let lose;
let board;
let flags;
let boardSize;
let rows;
let cols;
let maxBombs;
let squareEls;

/*----cached elements----*/
const boardEl = document.querySelector('.board');
const boardSizeEl = document.querySelector('.board-sizes');
const msgEl = document.querySelector('.message');
const msgTextEl = document.querySelector('.message > p');

/*----Event Listeners----*/
boardSizeEl.addEventListener('click', init);
boardEl.addEventListener('contextmenu', handleRightClick);
boardEl.addEventListener('click', handleLeftClick);

/*----game functions----*/
// //initialize new board with clean tiles
function init(event) {
    //guard
    if (event.target.tagName !== 'BUTTON') return;
    //making buttons hidden
    boardSizeEl.style.visibility = 'hidden';
    //giving event to change board size
    changeBoardSize(event);
    win = false;
    lose = false;
    flags = 0;
    squareEls.forEach(sq => {
        sq.innerText = '';
        sq.id = 'hidden';
        sq.disabled = false;
    });
    msgEl.style.display = 'none';
    maxBombs = setBombs();
    boardEl.addEventListener('click', handleLeftClick);
    render();
}

//renders lose / win message and shows where all bombs were located
function render() {
    if (lose) {
        msgTextEl.innerText = 'Oops.. ☠️😵☠️ ';
        msgEl.style.color = 'black';
    }
    if (win) {
        msgEl.style.color = 'orange';
        msgTextEl.innerText = 'You Won! 🥳';
        AUDIO1.play().then(r => { return r});
    }
    if (lose || win) {
        //block any interactions if we lose or win
        boardEl.removeEventListener('click', handleLeftClick);
        squareEls.forEach(tile => {
            let x = parseInt(tile.getAttribute('data-x'));
            let y = parseInt(tile.getAttribute('data-y'));
            //set 'mine' value to each tile where located mine
            if (board[x][y] === bomb) {
                tile.id = 'bomb';
                tile.innerText = '💣';
            }
        });
        displayMessage();
    }
}

function changeBoardSize(event) {
    if (event.target.tagName === 'DIV') return;
    if (event.target.tagName === 'BUTTON') {
        boardEl.style.display = 'grid';
        if (event.target.innerText === 'Easy') {
            rows = 6;
            cols = 6;
        } else if (event.target.innerText === 'Medium') {
            rows = 8;
            cols = 8;
        } else if (event.target.innerText === 'Hard') {
            rows = 12;
            cols = 12;
        }
    }
    generateBoard();
}

//left click or touch to reveal either safe squares or bomb
function handleLeftClick(event) {
    let sq = event.target;
    //guard preventing unnecessary clicks within the board
    if (sq.tagName === 'SECTION') return;
    let x = parseInt(sq.getAttribute('data-x'));
    let y = parseInt(sq.getAttribute('data-y'));
    if (board[x][y] === bomb) {
        sq.id = 'bomb';
        lose = true;
        AUDIO2.play().then(r => {return r});
    } else {
        checkNeighbors(x, y);
    }
    getWinner();
    render();
}

function handleRightClick(event) {
    //preventing contextMenu
    event.preventDefault();
    let tile = event.target;
    let x = tile.getAttribute('data-x');
    let y = tile.getAttribute('data-y');
    //guard
    if (tile.tagName === 'SECTION') return;
    if (tile.id === 'safe') return;
    if (tile.id === 'hidden') {
        tile.id = 'flag';
        tile.disabled = true;
    } else {
        tile.id = 'hidden';
        tile.disabled = false;
        flags--;
    }
    if (tile.id === 'flag' && board[x][y] === bomb) {
        flags++;
    }
    getWinner();
    render();
}

//checks for winning logic
function getWinner() {
    let count = 0;
    squareEls.forEach(sq => {
        if (sq.id === 'safe') count++;
        if (flags === maxBombs) win = true;
    });
    if (count === (boardSize - maxBombs)) win = true;
}

// displays overlapping div with win / lose message
function displayMessage() {
    let width = boardEl.clientWidth;
    msgEl.style.display = 'block';
    msgEl.style.width = `${width}px`;
    msgEl.style.height = `${width}px`;
    boardSizeEl.style.visibility = '';
}

// creating new board
function generateBoard() {
    //empty array as init value
    board = [];
    //making array of arrays
    for (let i = 0; i < rows; i++) {
        board[i] = [];
    }
    //fill up tiles depending on game difficulty
    board.forEach(row => {
        for (let i = 0; i < rows; i++) {
            row.push(safe);
        }
    });
//make the board grid based on level of difficulty
    boardSize = rows * cols;
    //for columns& rows
    boardEl.style.gridTemplateColumns = `repeat(${rows}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${cols}, 1fr)`;
//creating more tiles when changing difficulty    
    if (boardEl.childElementCount === 0 || boardEl.childElementCount !== boardSize) {
        //childElementCount as return numbers of child in this el
        while (boardEl.firstChild) {
            boardEl.removeChild(boardEl.firstChild);
        }
        let x = 0;
        let y = 0;
        for (let i = 0; i < boardSize; i++) {
            //assign inner width 'clientWidth' i.e. offSetWidth
            let width = boardEl.clientWidth;
            //determine width in px
            let sqWidth = width / rows;
            const squareEl = document.createElement('button');
            squareEl.className = "square";
            squareEl.id = "hidden";
            squareEl.setAttribute('data-x', `${x}`);
            squareEl.setAttribute('data-y', `${y}`);
            squareEl.style.width = `${sqWidth}px`;
            squareEl.style.height = `${sqWidth}px`;
            boardEl.appendChild(squareEl);
            //make rows equal the cols
            if (y < (rows - 1)) {
                y++;
            } else {
                y = 0;
                x++;
            }
        }
        squareEls = document.querySelectorAll('.square');
    }
}

//randomly places mines onto the board
function setBombs() {
    let numOfBombs = 0;
    //looping through rows and cols
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            board[i][j] = safe;
        }
    }
    if (rows < 10) {
        //set mines with Math random
        for (let i = 0; i < (rows); i++) {
            let x = randomIndex();
            let y = randomIndex();
            if (board[x][y] === safe) {
                board[x][y] = bomb;
                numOfBombs++;
            }
        }
    } else {
//case for medium and hard levels
        for (let i = 0; i < (rows *2 ); i++) {
            let x = randomIndex();
            let y = randomIndex();
            if (board[x][y] === safe) {
                board[x][y] = bomb;
                numOfBombs++;
            }
        }
    }
    setNumbers();
    return numOfBombs;
}

//generating random number
function randomIndex() {
    return Math.floor(Math.random() * rows);
}

// displays correct number around adjacent bombs on safe squares to give player the right clues
function setNumbers() {
    for (let i = 0; i < boardSize; i++) {
        let bombCount = 0;
        let sq = squareEls[i];
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        //shortcuts
        let leftSide = i % rows === 0;
        let rightSide = i % rows === .875;
        let lastRow = rows - 1;
        let left = y - 1;
        let right = y + 1;
        let up = x - 1;
        let down = x + 1;
        if (board[x][y] === safe) {
            //bomb on the left
            if (board[x][left] === bomb && !leftSide) bombCount++;
            //bomb on the right
            if (!rightSide && board[x][right] === bomb) bombCount++;
            //bomb above
            if (x > 0 && board[up][y] === bomb) bombCount++;
            //bomb below
            if (x < lastRow && board[down][y] === bomb) bombCount++;
            //bomb upper left corner
            if (!rightSide && x > 0 && board[up][left] === bomb) bombCount++;
            //bomb upper right corner
            if (x > 0 && board[up][right] === bomb) bombCount++;
            //bomb lower left corner
            if (x < lastRow && board[down][left] === bomb) bombCount++;
            //bomb lower right corner
            if (x < lastRow && board[down][right] === bomb) bombCount++;
            if (bombCount > 0) {
                sq.innerText = `${bombCount}`;
                sq.style.color = `${colors[bombCount]}`;
            }
        }
    }
}

// check for safe squares next to the one that was clicked to reveal more safe squares
function checkNeighbors(cordX, cordY) {
    if (cordX < 0 || cordY < 0 || cordX > rows || cordY > cols) return;
    //shortcuts
    let rightNeighbor = cordY + 1;
    let leftNeighbor = cordY - 1;
    let upNeighbor = cordX - 1;
    let downNeighbor = cordX + 1;
    squareEls.forEach(sq => {
        let x = parseInt(sq.getAttribute('data-x'));
        let y = parseInt(sq.getAttribute('data-y'));
        if (cordX === x && cordY === y) sq.id = 'safe';
        if ((downNeighbor === x || upNeighbor === x) 
            && cordY === y && board[x][y] === safe) sq.id = 'safe';
        if ((rightNeighbor === y || leftNeighbor === y) 
            && cordX === x && board[x][y] === safe) sq.id = 'safe';
        if ((upNeighbor === x || downNeighbor === x) 
            && (leftNeighbor === y || rightNeighbor === y) 
            && board[x][y] === safe) sq.id = 'safe';
        if (sq.id === 'safe') sq.disabled = true;
    });
}
