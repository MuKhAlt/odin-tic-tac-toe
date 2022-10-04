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

  return {initialize, fill, switchTurns, board}
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
  const isGameOver = () => {}

  /**
   * Ends the game given the winner
   * 
   * @param {string} winner    The winner, 'X' for player 1, 'O' for player 2 and 'XO' if it's a draw
   */
  const endGame = (winner) => {}

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
        endGame(winner)
      }
    }
  }

  return {makeMove}
})()