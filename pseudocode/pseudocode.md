1. Build simple HTML markup.
   1.1 Semantic. Must include <main>, <section> etc.
2. Add some css styles to display buttons and text.

3. Create state variables.
   3.1 let bomb, safeTiles, colors.
   3.2 let win, lose, board, flags, boardSize, rows, cols, squareEls.
4. Build app skeleton.
5. Make cached elements and assign it to variables.
6. Create init() and render() functions.
7. Write buttons for game difficult.
   7.1 Add css styles for them.
8. Add some logic to init() fn.
  8.1 Should contain win/lose variables.
  8.2 Event listener.
  8.3 squareEl.forEach => to iterate through board.
  8.4 setBombs() fn.
9. createBoard() fn => Use empty array is initialize value.
  9.1 for loop inside for loop. 
  9.2 append buttons to row and col.
  9.3 assign each button 'hidden' value and 'square' className
10. render() function.
  10.1 must include win / lose logic. 
  10.2 display message to user.
11. displayMessage() function. 
12. Make "game difficult" buttons hidden or visible (depending on win/lose).
13. setMines() function. And case for medium and hard mode. (for rows * 2)
  13.1 Random index (Math floor + Math random).
14. changeGameDifficult() fn (6x6, 8x8, 12x12) game board.
  14.1 makeBoard(), render().
15. cached elements for left and right click. Event listeners.
16. handleLeftClick() function.
  16.1 event.target. If click === bomb => lose. 
  16.2 getWinner() fn.
  16.3 render().
  16.4 checkNeighbors.
17. checkNeighbors() fn. flood function to open nearby empty tiles and give player a clue where is safe.
  17.1 make clicked tiles disabled.
  17.2 forEach or map method.
  17.3 offsetX, offsetY.
  17.4 setNumbers() fn.
18. setNumbers() fn. For those empty numbers assign numbers from 1 to 5(depending on how many bombs around).
19. getWinner() fn. forEach method => to compare get the winner.
20. handleRightClick() => addEventListener (contextMenu).
  20.1 event.preventDefault() to prevent context menu.
  20.2 comparing target id with status of tiles if === 'hidden' => disable tile.
  20.3 write some css for flags 
  20.4 getWinner(), render().
21. add  sound effects for win / lose 
22. add styles and hints.



//////// contents  ////////////
* let bomb, sfeTile, colors, win, lose, board, flags, boardSize, rows, col, maxBombs


////// cached elements //////
* const boardEl, msgEl, boardSizeEl

//////// event listeners ////////
* addEventListeners ('click') for left click
* addEventListeners ('click') for right click. PreventDefault()
* startGame (init)

//////// functions //////////
* init();
* render();
* displayMessage();
* changeBoardSize();
* handleLeftClick(); handleRightClick();
* getWinner();
* makeBoard();
* setBombs();
* setNumbers();
* checkNeighbors();

