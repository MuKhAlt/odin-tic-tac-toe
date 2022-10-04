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
    players.player1 = Player(player1Name, 'X')
    players.player2 = Player(player2Name, 'O')
    // link clicks to trigger makeMove
    for (let row in boxes) {
      for (let column in boxes[row]) {
        boxes[row][column].addEventListener('click', () => {
          gameController.makeMove(row, column)
        })
      }
    }
  }

  return {initialize}
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
 * The object responsible for changing the game state
 */
const gameController = (() => {
  /**
   * notifies the gameBoard to fill a box
   * 
   * @param {number} row     The row in which the player clicked
   * @param {number} column  The column in which the player clicked
   */
  const makeMove = (row, column) => {}

  return {makeMove}
})()