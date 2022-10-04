const X = 'X'
const O = 'O'

/**
 * The object responsible for screen management
 * 
 * @return screenManager object
 */
const screenManager = (() => {
  let screen = 'welcome'

  /**
   * Initializes the website,
   * 
   * Sets up the welcome page, hides other screens and switches to game screen when the start button is pressed.
   */
  const initialize = () => {
    // Switch to game screen when the start button is pressed
    document.getElementById('start-button').addEventListener('click', (e) => {
      switchScreens('game')
    })

    // Hide game screen
    document.getElementById('game-screen-container').style.display = "none"
  }

  /**
   * Switch the current screen to newScreen,
   * 
   * @param {string} newScreen name of the screen to be switched to
   * 
   */
  const switchScreens = (newScreen) => {
    if (screen === 'welcome') {
      // Get players names
      const p1Name = document.getElementById('player1-name').value ? document.getElementById('player1-name').value : 'X'
      const p2Name = document.getElementById('player2-name').value ? document.getElementById('player2-name').value : 'O'

      // Remove welcome page and display game screen
      document.getElementById('welcome-screen-container').remove()
      screen = 'game'
      document.getElementById('game-screen-container').style.display = "flex"

      // initialize gameBoard
      gameBoard.initialize(p1Name, p2Name)
    }
  }

  return {initialize, switchScreens}
})()

// Initialize the webpage
screenManager.initialize()

/**
 * The object responsible for maintaining track of the game, and rendering it
 * 
 */
const gameBoard = (() => {
  // Board boxes
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]
  // Players
  const players = {}
  const boardDiv = document.getElementById('board')
  // Div boxes
  const boxes = [
    [...document.getElementsByClassName('box')].slice(0, 3),
    [...document.getElementsByClassName('box')].slice(3, 6),
    [...document.getElementsByClassName('box')].slice(6, 9),
  ]

  /**
   * Initializes the game,
   * 
   * Creates two Player obejcts, sets up the gameController object and adds and event listener to listen for clicks to each div in the board
   *
   * @param {Player} player1Name    name of player 1
   * @param {Player} player2Name    name of player 2
   */
  const initialize = (player1Name, player2Name) => {
    // Create two players
    players.player1 = Player(player1Name, X)
    players.player2 = Player(player2Name, O)
    // Initializes the current turn
    players.currentTurn = players.player1

    // link clicks to trigger makeMove
    for (let row in boxes) {
      for (let column in boxes[row]) {
        boxes[row][column].addEventListener('click', () => {
          gameController.makeMove(row, column)
        })
      }
    }

    // link clicking the restart button to trigger restart()
    document.getElementById('restart-button').addEventListener('click', () => {
      restart()
    })
  }

  /**
   * Switches the turns
   */
  const switchTurns = () => {
    if (players.currentTurn === players.player1) {
      players.currentTurn = players.player2
    } else {
      players.currentTurn = players.player1
    }
  }

  /**
   * Fills a box with X or O based on currentTurn,
   * 
   * @param {number} row     The row at which the box is located
   * @param {number} column  The column at which the box is located
   */
  const fill = (row, column) => {
    // Update board
    board[row][column] = players.currentTurn.symbol

    // Update DOM
    const box = boxes[row][column]
    const p = document.createElement('p')
    p.innerHTML = players.currentTurn.symbol
    box.appendChild(p)
  }

  /**
   * Creates and renders the gameOver display,
   * 
   * Displays a paragraph according to the outcome of the match,
   * 
   * @param {string} winner   'X' if player 1 was the winner, 'O' if it was player 2 and 'XO' if it was a draw
   */
  const endGame = (winner) => {
    // Create p
    const gameOverDisplay = document.createElement('p')
    gameOverDisplay.id = 'game-over-display'
    if (winner === 'X') {
      gameOverDisplay.innerText = players.player1.name + ' WON!'
    } else if (winner === 'O') {
      gameOverDisplay.innerText = players.player2.name + ' WON!'
    } else {
      gameOverDisplay.innerText = 'DRAW!'
    }
    
    // Add p to game-screen-container
    document.getElementById('game-screen-container').insertBefore(gameOverDisplay, document.getElementById('game-screen-container').firstChild)
  }

  /**
   * Restarts the game,
   * 
   * reinitializes board and boxes
   */
  const restart = () => {
    // clean board
    for (let row in board) {
      for (let column in board) {
        board[row][column] = null
      }
    }

    // clean DOM
    for (let row in boxes) {
      for (let column in boxes) {
        if (boxes[row][column].firstChild) {
          boxes[row][column].firstChild.remove()
        }
      }
    }

    // Clean game over display
    if (document.getElementById('game-over-display')) {
      document.getElementById('game-over-display').remove()
    }
  }

  return {initialize, fill, switchTurns, endGame, board}
})()

/**
 * Creates and Player object,
 * 
 * @param {string} name 
 * @param {string} symbol 
 * @returns Player obejct with corrosponding name and symbol
 */
const Player = (name, symbol) => {
  return {name, symbol}
}

/**
 * The object responsible for changing the game state,
 */
const gameController = (() => {
  /**
   * Checks if the game has ended and returns a value based on the winner,
   * 
   * @return 'X' if player 1 is the winner, 'O' if player 2 is the winner, 'XO' is it's a draw and '' if the game hasn't ended
   */
  const isGameOver = () => {
    const checkRows = () => {
      let x
      let o
      for (let row in gameBoard.board) {
        x = 0
        o = 0
        for (let column in gameBoard.board) {
          if (gameBoard.board[row][column] === 'X') { x++ }
          if (gameBoard.board[row][column] === 'O') { o++ }
        }
        if (x === 3) { return 'X' }
        if (o === 3) { return 'O' }
      }
    }

    const checkColumns = () => {
      let x
      let o
      for (let column in gameBoard.board) {
        x = 0
        o = 0
        for (let row in gameBoard.board) {
          if (gameBoard.board[row][column] === 'X') { x++ }
          if (gameBoard.board[row][column] === 'O') { o++ }
        }
        if (x === 3) { return 'X' }
        if (o === 3) { return 'O' }
      }
    }

    const checkDiagonal = () => {
      let x
      let o
      const diagonal = [0, 1, 2]

      // for D1
      x = 0
      o = 0
      for (let i in diagonal) {
        if (gameBoard.board[i][i] === 'X') { x++ }
        if (gameBoard.board[i][i] === 'O') { o++ }
      }
      if (x === 3) { return 'X' }
      if (o === 3) { return 'O' }

      // for D2
      x = 0
      o = 0
      for (let i in diagonal) {
        if (gameBoard.board[i][2 - i] === 'X') { x++ }
        if (gameBoard.board[i][2 - i] === 'O') { o++ }
      }
      if (x === 3) { return 'X' }
      if (o === 3) { return 'O' }
    }

    const checkDraw = () => {
      for (row in gameBoard.board) {
        for (column in gameBoard.board) {
          if (gameBoard.board[row][column] === null) {
            return false
          }
        }
      }
      return true
    }

    const rowWinner = checkRows()
    if (rowWinner) {
      return rowWinner
    }
    const columnWinner = checkColumns()
    if (columnWinner) {
      return columnWinner
    }
    const diagonalWinner = checkDiagonal()
    if (diagonalWinner) {
      return diagonalWinner
    }
    if (checkDraw()) {
      return 'XO'
    }
  }

  /**
   * Notifies the gameBoard to fill a box,
   * 
   * Checks to see if the move is legal, updates gameBoard, switches the turns and checks to see if the game ended,
   * 
   * @param {number} row     The row in which the player clicked
   * @param {number} column  The column in which the player clicked
   */
  const makeMove = (row, column) => {
    // Checks if the move is legal (if the board is null at that box)
    if (!gameBoard.board[row][column]) {
      // Update gameBoard at that box
      gameBoard.fill(row, column)

      // Switches turns
      gameBoard.switchTurns()

      // If the game if over, manage the game ending (given the winner)
      const winner = isGameOver()
      if (winner) {
        console.log('winner is ' + winner);
        gameBoard.endGame(winner)
      }
    }
  }

  return {makeMove}
})()