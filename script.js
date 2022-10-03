// Screen management
const screenManager = (() => {
  /**
   * Initializes the website,
   * 
   * Sets up the welcome page, and switches to game screen when the start button is pressed,
   */
  let screen = 'welcome'

  const initialize = () => {
    document.getElementById('start-button').addEventListener('click', (e) => {
      switchScreens('game')
    })
  }

  const switchScreens = (screen) => {}

  return {initialize, switchScreens}
})()

screenManager.initialize()