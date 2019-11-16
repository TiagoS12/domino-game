const game = document.querySelector('.game')
const tiles = document.querySelector('.tiles')
const userHand = document.querySelector('.user-hand')
const deck = document.querySelector('.deck')
const opponentHand = document.querySelector('.opponent-hand')
const msgTurn = document.querySelector('.msg-turn')
const restart = document.querySelector('.restart')
const restartBtn = document.getElementById('restart')
const passTurn = document.querySelector('.pass')
const giveUp = document.querySelector('.giveup')
const quit = document.querySelector('.quit')
const playAgainBtn = document.getElementById('play-again')
const userScore = document.querySelectorAll('.userScore')
const opponentScore = document.querySelectorAll('.opponentScore')
/*Initial and authentication menu */
const initialMenu = document.querySelector('.initial')
const authMenu = document.querySelector('.authentication')
/*Register*/
const usernameInput = document.querySelector('.username')
const passwordInput = document.querySelector('.password')
const registerForm = document.querySelector('.register')
registerForm.addEventListener('submit', function(event){
  event.preventDefault()
  let username = usernameInput.value
  let password = passwordInput.value
  initialMenu.style.display = 'block'
  authMenu.style.display = 'none'

  /*register call to server*/
  fetch('http://twserver.alunos.dcc.fc.up.pt:8008/register', {
    method: 'POST',
    body:JSON.stringify({nick: username, pass: password})
  })
  .then(response=>response.json())
  .then(data=>console.log(data))
  

  /* Menu Interaction */
  const menu = document.querySelector('.start-menu')
  const playBtn = document.getElementById('play')
  const difficulty = document.querySelector('.difficulty')
  const difficultyForm = document.querySelector('.set-difficulty')

  playBtn.addEventListener('click', function(){
    initialMenu.style.display = 'none'
    difficulty.style.display = 'block'
  })
  document.querySelector('#back').onclick = function(e){
    e.preventDefault()
    initialMenu.style.display = 'block'
    difficulty.style.display = 'none'
  }
  difficultyForm.addEventListener('submit', function(e){
    e.preventDefault()
    game.style.display = 'block'
    menu.style.display = 'none'
    //console.log(username, password)
    
  
    //join match
    fetch('http://twserver.alunos.dcc.fc.up.pt:8008/join', {
      method: 'POST',
      body: JSON.stringify({group: 'w0=', nick: username, pass: password})
    })
    .then(response=>response.json())
    .then(updatePlay)

    
  })

  async function updatePlay(response){
      
    let game = await response.game
    let userTiles = await response.hand
    console.log(response)
    fetch('http://twserver.alunos.dcc.fc.up.pt:8008/update?nick='+username+'&game='+game)
    
     //setAllTiles()
    setTiles(userTiles)
    firstMoveComputer()
  }

 

})


let n = 0

let allTiles = []
let userTiles = []
let opponentTiles = []
let board = []
let playUser
let playOpp
let moves //this is the variable responsible to display the possible moves the players can make. It will be an array with two numbers: the one in the left will be the number whose pieces can be inserted in the left and the other just the same thing but in the right.
let classification = {user: 0, opp: 0}


window.onclick = function(element){

  if(n == 0){//first play by the user
    let data = checkWhoGotBiggerDouble()//returns object with the player who has the biggest double with its position
    let tile = '&#'+element.target.innerHTML.codePointAt(0)+';'//This was the answer!
    if(tile == valueToVerticalHtml(userTiles[data.position])){
      let t = userTiles.splice(data.position, 1)
      updateUserTiles(userTiles)
      tiles.innerHTML = ''
      board.push(t[0])
      for(i of board){
        if(checkIfItIsDouble(i)){
          tiles.innerHTML += `<span> ${valueToVerticalHtml(i)} </span>` //updates the front-end from the variable board (to vertical)
        }
        else{
          tiles.innerHTML += `<span> ${valueToHorizontalHtml(i)} </span>` //updates the front-end from the variable board (to horizontal)
        }
      }
      moves = t[0]
      playUser = nextPlayUser()//this keeps refreshing

      n = 2
      msgTurn.innerHTML = 'Opponent\'s turn'
    }
  }

  if(n == 1){

    //Tile requested from DECK
    if(element.target == deck){//getting tile from deck
      if(allTiles.length == 0){
        alert('There are no more domino tiles in the deck!')
      }
      else{
        let d = allTiles.shift()
        userTiles.push(d)
        updateUserTiles(userTiles)
        playUser = nextPlayUser()
        n = 1
      }
      console.log('you clicked in the deck')
    }

    if(element.target == passTurn){
      if(playUser.nextPiecesLeft.length == 0 && playUser.nextPiecesRight.length == 0 && allTiles.length == 0){
        alert('You passed your turn!')
        n=2
        msgTurn.innerHTML = 'Opponent\'s turn'
      }
      else{
        alert('You can\'t pass your turn. You have domino tiles to play.')
      }
    }


    let tile = '&#'+element.target.innerHTML.codePointAt(0)//codePointAt was the answer!
    pos = parseInt(element.target.id)

    if(playUser.nextPiecesRight.includes(pos)){
      let where = 'right'
      //if tile selected is a sutable piece for play on the right side:
      let t = userTiles.splice(pos,1)
      let code = t[0]
      //now it's the time for positioning the piece correctly in the horizontal.
      //console.log(verticalHtmlToValue(value))//t[0] is the value of the selected tile
      //then i need to add them to the board array and update the front-end
      board.push(orderHorizontalTilesForBoard(code, moves[1], where))
      //update userHand
      updateUserTiles(userTiles)
      //update tiles on board
      tiles.innerHTML = ''
      for(i of board){
        if(checkIfItIsDouble(i)){
          tiles.innerHTML += `<span> ${valueToVerticalHtml(i)} </span>` //updates the front-end from the variable board
        }
        else{
          tiles.innerHTML += `<span> ${valueToHorizontalHtml(i)} </span>` //updates the front-end from the variable board
        }
      }
      //then i have to update the moves variable
      moves = updateMoves(board)
      //update play variable
      playUser = nextPlayUser()//this keeps refreshing
      console.log(moves, playUser)
      n = 2
      msgTurn.innerHTML = 'Opponent\'s turn'
    }
    else if(playUser.nextPiecesLeft.includes(pos)){
      let where = 'left'
      //if tile selected is a sutable piece for play on the left side:
      let t = userTiles.splice(pos,1)
      let code = t[0]

      //then i need to add them to the board array and update the front-end
      board.unshift(orderHorizontalTilesForBoard(code, moves[0], where))

      //update userHand
      updateUserTiles(userTiles)
      //update tiles on board
      tiles.innerHTML = ''
      for(i of board){
        if(checkIfItIsDouble(i)){
          tiles.innerHTML += `<span> ${valueToVerticalHtml(i)} </span>` //updates the front-end from the variable board
        }
        else{
          tiles.innerHTML += `<span> ${valueToHorizontalHtml(i)} </span>` //updates the front-end from the variable board
        }
      }
      moves = updateMoves(board)
      playUser = nextPlayUser()//this keeps refreshing

      n=2
      msgTurn.innerHTML = 'Opponent\'s turn'
    }
  }
  //WHEN THE USER WINS THE GAME
  if(userTiles.length == 0 && n!=99){
    alert('You won!')
    userWon()
    opponentTiles = []
    userTiles = []
    board = []
    allTiles = []
    moves = []
    tiles.innerHTML = ''
    userHand.innerHTML = ''
    opponentHand.innerHTML = ''
    restart.style.display ='block'
    restartBtn.style.display = 'block'
    deck.style.display = 'none'
    passTurn.style.display = 'none'
    giveUp.style.display = 'none'
    msgTurn.innerHTML = ''
    //the second userScore and opponenScore [1] span tags are the ones in the restart section
    userScore[1].innerHTML = classification.user
    opponentScore[1].innerHTML = classification.opp

    n = 99//prevents any other event from the game to happen since the game was over
  }



  if(n == 2){
    n = 1
    setTimeout(function(){//computer play
      playOpp = nextPlayOpponent()

      if(playOpp.nextPiecesLeft.length == 0 && playOpp.nextPiecesRight.length==0 && allTiles.length == 0){
        alert('Your opponent just passed its turn!')
      }
      if(playOpp.nextPiecesRight.length == 0 && playOpp.nextPiecesLeft.length == 0){
        while(playOpp.nextPiecesRight.length == 0 || playOpp.nextPiecesLeft.length == 0){//it's working now. Added last statement because if the are no more tiles in the deck the while loop should stop
          if(allTiles.length == 0){
            break
          }
          let d = allTiles.shift()
          opponentTiles.push(d)
          updateOpponentTiles(opponentTiles)
          playOpp = nextPlayOpponent()
        }

      }
      if(playOpp.nextPiecesLeft.length != 0){//if there are possible plays in the left
        let where = 'left'
        let t = opponentTiles.splice(playOpp.nextPiecesLeft[0],1)
        let code = t[0]
        board.unshift(orderHorizontalTilesForBoard(code, moves[0], where))
        updateOpponentTiles(opponentTiles)
        tiles.innerHTML = ''
        for(i of board){
          if(checkIfItIsDouble(i)){
            tiles.innerHTML += `<span> ${valueToVerticalHtml(i)} </span>` //updates the front-end from the variable board
          }
          else{
            tiles.innerHTML += `<span> ${valueToHorizontalHtml(i)} </span>` //updates the front-end from the variable board
          }
        }
        moves = updateMoves(board)

      }
      else if(playOpp.nextPiecesRight.length != 0){//if there are possible plays in the right
        let where = 'right'
        let t = opponentTiles.splice(playOpp.nextPiecesRight[0],1)//right now the ia takes the first eligible tile to play. If I wanted to increase difficulty here is where I would change.
        let code = t[0]
        board.push(orderHorizontalTilesForBoard(code, moves[1], where))
        updateOpponentTiles(opponentTiles)
        tiles.innerHTML = ''
        for(i of board){
          if(checkIfItIsDouble(i)){
            tiles.innerHTML += `<span> ${valueToVerticalHtml(i)} </span>` //updates the front-end from the variable board
          }
          else{
            tiles.innerHTML += `<span> ${valueToHorizontalHtml(i)} </span>` //updates the front-end from the variable board
          }
        }
        moves = updateMoves(board)
      }

      //set the value of playOpp and playUser again so that when the user clicks on the tile the ia has a updated value for them.
      playOpp = nextPlayOpponent()
      playUser = nextPlayUser()
      console.log('computers play',playOpp,'user play' ,playUser,'moves', moves, 'board', board)


      //WHEN THE COMPUTER WINS THE GAME
      if(opponentTiles.length == 0 && n != 99){
        alert('You lost!')
        oppWon()
        opponentTiles = []
        userTiles = []
        board = []
        allTiles = []
        moves = []
        userHand.innerHTML = ''
        opponentHand.innerHTML = ''
        tiles.innerHTML = ''
        restart.style.display ='block'
        msgTurn.innerHTML = ''
        restartBtn.style.display = 'block'
        deck.style.display = 'none'
        passTurn.style.display = 'none'
        giveUp.style.display = 'none'
        //the second userScore and opponenScore [1] span tags are the ones in the restart section
        userScore[1].innerHTML = classification.user
        opponentScore[1].innerHTML = classification.opp
        n = 99//prevents any other event from the game to happen since the game was over
      }

      if(playOpp.nextPiecesLeft.length == 0 && playOpp.nextPiecesRight.length==0 && playUser.nextPiecesLeft.length == 0 && playUser.nextPiecesRight.length == 0 && allTiles.length == 0 && n!=99){
        alert('Tied game!')
        opponentTiles = []
        userTiles = []
        board = []
        allTiles = []
        moves = []
        tiles.innerHTML = ''
        userHand.innerHTML = ''
        opponentHand.innerHTML = ''
        restart.style.display ='block'
        msgTurn.innerHTML = ''
        deck.style.display = 'none'
        passTurn.style.display = 'none'
        giveUp.style.display = 'none'
        userScore[1].innerHTML = classification.user
        opponentScore[1].innerHTML = classification.opp
        n = 99//prevents any other event from the game to happen since the game was over
      }


      msgTurn.innerHTML = 'Your turn'
    }, 2000)
  }
}

restartBtn.onclick = function(){
  n = 0
  setAllTiles()
  setTiles()
  firstMoveComputer()
  restart.style.display = 'none'
  deck.style.display = 'flex'
  passTurn.style.display = 'block'
  giveUp.style.display = 'block'
}
giveUp.onclick = function(){
  if(confirm("Do you really want to quit the game?")){
    alert('You lost!')
    oppWon()
    opponentTiles = []
    userTiles = []
    board = []
    allTiles = []
    moves = []
    tiles.innerHTML = ''
    userHand.innerHTML = ''
    opponentHand.innerHTML = ''
    quit.style.display = 'block'
    deck.style.display = 'none'
    passTurn.style.display = 'none'
    giveUp.style.display = 'none'
    msgTurn.innerHTML = ''
    n=99 //prevents any other event from the game to happen since the game was over
  }
}
playAgainBtn.onclick = function(){
  n = 0
  setAllTiles()
  setTiles()
  firstMoveComputer()
  quit.style.display = 'none'
  deck.style.display = 'flex'
  passTurn.style.display = 'block'
  giveUp.style.display = 'block'
}

//events while playing (rules, classification, and so on)
const close = document.querySelector('.close')
const rulesBtn = document.getElementById('rules')
const scoreBtn = document.getElementById('score')
const rules = document.querySelector('.rules')
const score = document.querySelector('.score')
const modal = document.querySelector('.modal')

rulesBtn.onclick = function(){
  modal.style.display = 'block'
  rules.style.display = 'block'
}
scoreBtn.onclick = function(){
  modal.style.display = 'block'
  score.style.display = 'block'
  //the first userScore and opponenScore [1] span tags are the ones in the score modal section
  userScore[0].innerHTML = classification.user
  opponentScore[0].innerHTML = classification.opp
}
close.onclick = function(){
  modal.style.display = 'none'
  score.style.display = 'none'
  rules.style.display = 'none'
}
