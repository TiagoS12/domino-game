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
//Initializing the username and password variables
let username
let password
let userTiles 
let gameId //game id
let eventMessage//Variable that stores the SSE from server.
let board
let oppName

registerForm.addEventListener('submit', function(event){
  event.preventDefault()
  username = usernameInput.value
  password = passwordInput.value
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

    async function updatePlay(response){
      gameId = await response.game
      userTiles = await response.hand
      console.log(response)
      fetch('http://twserver.alunos.dcc.fc.up.pt:8008/update?nick='+username+'&game='+gameId)
      const eventSource = new EventSource('http://twserver.alunos.dcc.fc.up.pt:8008/update?nick='+username+'&game='+gameId)
      eventSource.onmessage = function(event) {
          const data = JSON.parse(event.data);
          if(data.board){
            console.log(data)
            eventMessage = data
            //getting opp name
            for(i in eventMessage.board.count){
              if(i!=username){
                oppName = i
              }
            }
            board = eventMessage.board.line
            tiles.innerHTML = ''
            for (i of board){
              if(checkIfItIsDouble(i)){
                tiles.innerHTML += `<span>${valueToVerticalHtml(i)}</span>`
              }
              else{
                tiles.innerHTML += `<span>${valueToHorizontalHtml(i)}</span>`
              }
            }
            //updates on the front end the number of tiles the opponent has 
            opponentHand.innerHTML = ''
            for(let i=0;i<eventMessage.board.count[oppName];i++){
              opponentHand.innerHTML +=`<span>&#127074;</span>`
            }
            msgTurn.innerHTML = eventMessage.turn+"'s turn"
          }
          
          console.log(board)
      }
      for(let i = 0; i<userTiles.length;i++){
        userHand.innerHTML += `<span id="${i}" class="usr" >${valueToVerticalHtml(userTiles[i])}</span>`
      }
    }

    
  })
})


let classification = {user: 0, opp: 0}


const left = document.querySelector('.left')
const right = document.querySelector('.right')
const dashboard = document.querySelector('.dashboard')

window.onclick = function(element){
    if(element.target == deck){
      fetch("http://twserver.alunos.dcc.fc.up.pt:8008/notify",{
        method: "POST",
        body: JSON.stringify({nick: username, pass: password, game: gameId, piece: null})
      })
      .then(response=>response.json())
      .then(data=>console.log(data))
    }

    /*When domino tile is clicked */
    if(element.target.nodeName == 'SPAN' && element.target.className == 'usr'){
      const usrHand = document.querySelectorAll('.usr')
      for(i of usrHand){
        i.style.border = 'none'
      }
      dashboard.style.display = 'flex'
      const selectedTile = document.getElementById(element.srcElement.id)
      selectedTile.style.border = '2px solid black'

      //inserting position value in id of a tags. When clicked (right or left), the id will be selected.
      right.id = element.srcElement.id
      left.id = element.srcElement.id
  
    }

    if(element.target == document.querySelector('.cancel')){
      const usrHand = document.querySelectorAll('.usr')
      for(i of usrHand){
        i.style.border = 'none'
      }
      dashboard.style.display = 'none'
    }
  
    if(element.target == right){
      console.log('right')
      if(username == eventMessage.turn){
        fetch("http://twserver.alunos.dcc.fc.up.pt:8008/notify", {
          method: "POST",
          body: JSON.stringify({nick: username, pass: password, game: gameId, piece: userTiles[right.id], side: 'end'})
        })
        .then(response=>response.json())
        .then(data=>console.log(data))
        userTiles.splice(right.id, 1)
        userHand.innerHTML = ''
        for(let i = 0; i<userTiles.length;i++){
          userHand.innerHTML += `<span id="${i}" class="usr" >${valueToVerticalHtml(userTiles[i])}</span>`
        }
      }
      else{
        console.log("it's not your turn")
      }
    }
    if(element.target == left){
      console.log('left')
      if(username == eventMessage.turn){
        fetch("http://twserver.alunos.dcc.fc.up.pt:8008/notify", {
          method: "POST",
          body: JSON.stringify({nick: username, pass: password, game: gameId, piece: userTiles[right.id], side: 'start'})
        })
        .then(response=>response.json())
        .then(data=>console.log(data))
        userTiles.splice(left.id, 1)
        userHand.innerHTML = ''
        for(let i = 0; i<userTiles.length;i++){
          userHand.innerHTML += `<span id="${i}" class="usr" >${valueToVerticalHtml(userTiles[i])}</span>`
        }
      }
      else{
        console.log("it's not your turn")
      }
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
