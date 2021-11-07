let turns = 0
const gameContainer = document.getElementById("game");
const bestbtn = document.querySelector('.bestbtn');
const start = document.querySelector('button');
const score = document.querySelector('#score');
const record = document.querySelector('#best');
let COLORS = [];
let best = parseInt(localStorage.getItem('bestScore'));


if (localStorage.getItem('bestScore') === null) {
  record.innerText = ''
}
else {
  record.innerText = best;
}
turn.innerText = turns;

function randomColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`
}

function arrayBuilder() {
  for (let i = 0; i < 8; i++) {
    let color = randomColor();
    COLORS.push(color);
    COLORS.push(color);
  }
}

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function createDivsForColors(colorArray) {
  for (let i = 0; i < colorArray.length; i++) {
    const newDiv = document.createElement("article");
    newDiv.classList.add(colorArray[i]);
    newDiv.id = `a${i}`;
    newDiv.title = 'Inactive'
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

function handleCardClick(e) {
  let mClick = matchClick(e);
  if (mClick === true) {
    console.log(mClick)
    return
  }
  let second = secondCheck();
  if (second.secondCard === true) {
    let first = document.querySelector(`#${second.firstCard}`);
    if (e.target.id === first.id) {
      return
    }
    let match = matchCheck(e, second);
    isSecond(e, first, match);
  }
  else {
    isFirst(e);
  }
}

//checks to see if click is second of turn
function secondCheck() {
  let second = {
    secondCard: false
  }
  for (let i = 0; i < COLORS.length; i++) {
    let color = document.querySelector(`#a${i}`);
    if (color.title === 'Active') {
      second = {
        secondCard: true,
        firstCard: color.id
      }
      break
    }
  }
  return second
}

//checks for matching class names
function matchCheck(e, obj) {
  let match = false;
  if (e.target.className === document.querySelector(`#${obj.firstCard}`).className) {
    match = true
  }
  return match
}

//Turns card,changes div title to "Active" 
function isFirst(e) {
  e.target.style.backgroundColor = e.target.className;
  e.target.title = 'Active';
}


function isSecond(e, first, match) {
  first.title = 'Inactive';
  turns += 1;
  document.querySelector('#turn').innerText = turns;
  if (match) {
    e.target.style.backgroundColor = e.target.className;
    e.target.title = 'match';
    first.title = 'match';
    let message = document.createElement('h2');
    message.innerText = 'MATCH';
    gameContainer.appendChild(message);
    setTimeout(function(){
      message.remove()
    }, 1500);
  }
  else {
    e.target.style.backgroundColor = e.target.className;
    setTimeout(function () {
      e.target.style.backgroundColor = null;
      first.style.backgroundColor = null;

    }, 1000)
  }
  for (let i = 0; i < COLORS.length; i++) {
    let color = document.querySelector(`#a${i}`);
    if (color.title !== 'match') {
      return
    }
  }
  setTimeout(function(){
    gameOver();
  }, 1700)
}

function gameOver() {
  let winner = document.createElement('h2');
  let bestScore = JSON.parse(localStorage.getItem('bestScore'))
  if (bestScore === null) {
    localStorage.setItem('bestScore', JSON.stringify(turns));
    record.innerText = turns;
    best = turns;
    winner.innerText = `New Best: ${turns} Turns!`
  }
  else if (turns < bestScore) {
    localStorage.setItem('bestScore', JSON.stringify(turns));
    record.innerText = turns;
    best = turns;
    winner.innerText = `New Best: ${turns} Turns!`
  }
  else {
    winner.innerText = `You Won in ${turns} turns!`;
  }
  gameContainer.appendChild(winner);
}


start.addEventListener('click', function () {
  COLORS = [];
  document.querySelector("h1").className = 'gone';
  start.innerText = 'New Game'
  if (localStorage.getItem('bestScore') === null) {
    record.innerText = ''
  }
  else {
    record.innerText = best;
  }
  let current = gameInProgress();
  let winMessage = document.querySelector('h2');
  if (current && turns > 0) {
    if (confirm('Whoa there, partner! If you start a new game, progress in current game will be lost. Continue anyway?')) {
      smoothTransition();
    }
  }
  else {
    if (winMessage !== null) {
      winMessage.remove();
    }
    smoothTransition();
  }
})

function smoothTransition(){
  turns = 0
  turn.innerText = turns;
  let oldGame = document.querySelectorAll('article');
  for (let card of oldGame) {
    card.style.backgroundColor = 'lightskyblue';
    setTimeout(function(){
      card.remove()
    },750);
  }
  arrayBuilder();
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}

//checks if there is currently a game in progress
function gameInProgress() {
  let currentGame = document.querySelectorAll('article');
  for (let card of currentGame) {
    if (card.title !== 'match') {
      return true
    }
  }
  return false
}

function matchClick(e) {
  if (e.target.title === 'match') {
    return true
  }
  return false
}

bestbtn.addEventListener('click', function(){
  localStorage.clear();
  best = '';
  record.innerText = best;
})

bestbtn.addEventListener('mouseover', function(e){
  e.target.className = 'resetbtn';
  e.target.innerText = 'Reset';
})

bestbtn.addEventListener('mouseout', function(e){
  e.target.className = 'bestbtn';
  e.target.innerText = 'Best Score';
})

