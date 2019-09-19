const tiles = document.querySelector('.tiles')
const userHand = document.querySelector('.user-hand')
//console.log(board.firstElementChild, board.lastElementChild)//outward domino tiles
function randomNumbers(min, max){
  let num = Math.floor(Math.random()*(max-min)+min)
  if(num < 100){
    return '0' + num
  }
  else{
    return num
  }
}
function randomTilesHorizontal(n){
  x = []
  for(let i=0;i<n;i++){
    x.push("&#127"+randomNumbers(25, 73))
  }
  return x
}
function randomTilesVertical(n){
  x = []
  for(let i=0;i<n;i++){
    x.push("&#127"+randomNumbers(75, 123))
  }
  return x
}

function setUserTiles(){
  let tiles = randomTilesVertical(7)
  for (i of tiles){
    userHand.innerHTML += `<span>${i}</span>`
  }
}

function htmlToValue(code){
  let z = '&#127123;'
  let x = code.split('#')[1].split(';')[0] //ugly as fuck but so far good
  return x
}
console.log(htmlToValue('&#127123;'))

//setting random domino tils for the user hand
setUserTiles()
//console.log(tiles.firstElementChild.innerHTML)
window.onclick = function(element){
  if(element.path[1] == userHand){
    console.log(element.target.innerHTML)
    //tiles.innerHTML += `<span> ${element.target.innerHTML} </span>`
  }
}
