//right now both of the files main.js and function.js are being loaded in the html file. I have to find a way to implemente the functions in this file into the main.js file.

function valueToVerticalHtml(value){
  let verticalStart = 127075
  let codeNum = parseInt(verticalStart)+7*parseInt(value[0])+parseInt(value[1])
  return '&#'+''+codeNum+';'
}

function verticalHtmlToValue(code){
  let verticalStart = 127075
  let codeNum = parseInt(code.split('#')[1].split(';')[0]) //ugly as fuck but so far good
  let diff = codeNum-verticalStart
  for(let a=0;a<=6;a++){
    for(let b=0;b<=6;b++){
      if((7*a+b) == diff){
        return [a, b]
      }
    }
  }
}

function valueToHorizontalHtml(arr){
  let a = arr[0]
  let b = arr[1]
  let horizontalStart = 127025
  let codeNum = horizontalStart + 7*a + b
  return '&#'+''+codeNum+';'
}
function orderHorizontalTilesForBoard(tile, valueToMatch, where){//I have to make this more readable
  let arr
  if(where == 'right'){//if the tile is going to the right, its leftward value must be equal to valueToMatch.
    if(tile[0] == valueToMatch){
      arr = tile
    }
    else{
      arr = [tile[1], tile[0]]
    }
  }
  else if(where == 'left'){//if the tile is going to the left, its rightward value must be equal to valueToMatch.
    if(tile[1] == valueToMatch){
      arr = tile
    }
    else{
      arr = [tile[1], tile[0]]
    }
  }
  let a = arr[0]
  let b = arr[1]
  return arr
}

//checks if a tile (or its reverse - [1,0] and [0,1]) is present in an array of tiles
function arePiecesEqual(tile, arr){
  valueTile = tile[0]+''+tile[1]
  reverseValueTile = tile[1]+''+tile[0]
  arr2 = []
  for(i of arr){
    arr2.push(i[0]+''+i[1])
  }
  if(arr2.includes(valueTile) || arr2.includes(reverseValueTile)){
    return true
  }
  else{
    return false
  }
}

function randomNumbers(min, max){
  let num = Math.floor(Math.random()*(max-min)+min)
  if(num < 100){
    return '0' + num
  }
  else{
    return num
  }
}

function setAllTiles(){ //Creates an array with all the domino tiles used in the game
  const n=28 //number or tiles for each player
  let i = 0
  while(i!=n){
    let r = verticalHtmlToValue("&#127"+randomNumbers(75, 124))
    if(!arePiecesEqual(r, allTiles) && !allTiles.includes(r)){
      i++
      allTiles.push(r) //now the allTiles, userTiles and opponentTiles variables have the value of the tiles [a,b]

    }
  }
}

function setTiles(){//sets the user hand (and right now it also sets the opponent hand only for testing purposes)
  for(let i = 0; i<7;i++){
    let t = allTiles.shift()
    userTiles.push(t)
  }
  for(let j = 7; j<14;j++){
    let t = allTiles.shift()
    opponentTiles.push(t)
  }

  for (let i=0;i<userTiles.length;i++){
    userHand.innerHTML += `<span id="${i}">${valueToVerticalHtml(userTiles[i])}</span>`
  }
  for (let i=0;i<opponentTiles.length;i++){
    opponentHand.innerHTML += `<span id="${i}">${valueToVerticalHtml(opponentTiles[i])}</span>`
  }
}

function checkIfItIsDouble(value){
  if(value[0] == value[1]){
    return true
  }
  else{
    return false
  }
}
function updateUserTiles(tiles){
  userHand.innerHTML = ''
  for (let i=0;i<userTiles.length;i++){
    userHand.innerHTML += `<span id="${i}">${valueToVerticalHtml(userTiles[i])}</span>`
  }


}
function updateOpponentTiles(tiles){
  opponentHand.innerHTML = ''
  for (let i=0;i<opponentTiles.length;i++){
    opponentHand.innerHTML += `<span id="${i}">${valueToVerticalHtml(opponentTiles[i])}</span>`
  }
}

function checkWhoGotBiggerDouble(){
  let j = 6
  while(j!=-1){
    for (let k = 0;k<userTiles.length;k++){
      let user = userTiles[k]
      let opp = opponentTiles[k]
      if(user[0]+''+user[1] == `${j}${j}`){
        return {player: 'user', tile: [j,j], position: k}
      }
      if(opp[0]+''+opp[1] == `${j}${j}`){
        return {player: 'opponent', tile: [j,j], position: k}
      }
    }
    j--
  }
  return false
}

function nextPlayUser(){//returns an object with the position of the tiles that can be played
  response = {nextPiecesLeft: [], nextPiecesRight: []}
  for(let m = 0;m<userTiles.length;m++){
    //checks if the player has the number on the left of the board.
    if(userTiles[m].includes(moves[0])){
      response.nextPiecesLeft.push(m)

    }
    //checks if the player has the number on the right of the board.
    if(userTiles[m].includes(moves[1])){
      response.nextPiecesRight.push(m)
    }
  }
  return response //returns the data
}
function nextPlayOpponent(){
  response = {nextPiecesLeft: [], nextPiecesRight: []}
  for(let m = 0;m<opponentTiles.length;m++){
    //checks if the opp has tiles with the number on the left of the board.
    if(opponentTiles[m].includes(moves[0])){
      response.nextPiecesLeft.push(m)

    }
    //checks if the player has  tiles with the number on the right of the board.
    if(opponentTiles[m].includes(moves[1])){
      response.nextPiecesRight.push(m)
    }
  }
  return response //returns the data
}

function updateMoves(board){
  return [board[0][0],board[board.length-1][1]]
}
