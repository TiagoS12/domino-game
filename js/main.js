const tiles = document.querySelector('.tiles')
const userHand = document.querySelector('.user-hand')
//console.log(board.firstElementChild, board.lastElementChild)//outward domino tiles
const deck = document.querySelector('.deck')
const opponentHand = document.querySelector('.opponent-hand')
const msg = document.querySelector('.msg')

var n = 0

let allTiles = []
let userTiles = []
let opponentTiles = []
let board = []
var playUser
var playOpp
var moves //this is the variable responsible to display the possible moves the players can make. It will be an array with two numbers: the one in the left will be the number whose pieces can be inserted in the left and the other just the same thing but in the right.

setAllTiles()
setTiles()

//first move
let data = checkWhoGotBiggerDouble()//returns object with the player who has the biggest double with its position
if(data.player == 'opponent'){
  t = opponentTiles.splice(data.position, 1)
  updateOpponentTiles(opponentTiles)
  board.push(t[0])//adds the tile to the board variable
  for(i of board){
    tiles.innerHTML += `<span> ${valueToVerticalHtml(i)} </span>` //updates the front-end from the variable board
  }
  moves = t[0]//moves is set to the value of the tile (since both left and right are the same)
  n = 1
  playUser = nextPlayUser()//this keeps refreshing

}



window.onclick = function(element){

  if(n == 0){//first play by the user
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
      console.log(playUser)
      n = 2
    }
  }

  if(n == 1){
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

    }
    if(playUser.nextPiecesLeft.length == 0 && playUser.nextPiecesRight.length == 0 && allTiles.length == 0){
      alert('You passed')
    }

    n = 2
  }
  //WHEN THE USER WINS THE GAME
  if(userTiles.length == 0){
    alert('You won!')
    opponentTiles = []
    userTiles = []
    board = []
    userHand.innerHTML = ''
    opponentHand.innerHTML = ''
    board.innerHTML = ''
  }

  //Tile requested from DECK
  if(element.target == deck){//getting tile from deck
    if(allTiles.length == 0){
      alert('there are no more domino tiles in the deck!')
    }
    else{//it's working now. Added last statement because if the are no more tiles in the deck the while loop should stop
      let d = allTiles.shift()
      userTiles.push(d)
      updateUserTiles(userTiles)
      playUser = nextPlayUser()
      n = 1
    }
    console.log('you clicked in the deck')
  }


  if(n == 2){
    setTimeout(function(){//computer play
      playOpp = nextPlayOpponent()

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


      if(playOpp.nextPiecesLeft.length == 0 && playOpp.nextPiecesRight.length==0 && allTiles.length == 0){
        alert('computer passes')
      }
      if(playOpp.nextPiecesLeft.length == 0 && playOpp.nextPiecesRight.length==0 && playUser.nextPiecesLeft.length == 0 && playUser.nextPiecesRight.length == 0 && allTiles.length == 0){
        alert('Tied game!')
      }
      //WHEN THE COMPUTER WINS THE GAME
      if(opponentTiles.length == 0){
        alert('You lost!')
        opponentTiles = []
        userTiles = []
        board = []
        userHand.innerHTML = ''
        opponentHand.innerHTML = ''
        board.innerHTML = ''

      }

      n = 1
    }, 2000)
  }
}
