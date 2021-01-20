const boxes = document.querySelectorAll('.box');
const cats = document.querySelectorAll('.cat');
const scoreBoard = document.querySelector('#score');
const btn = document.querySelector('#start');
let lastBox;
let timeUp = false;
let score = 0;
var meow = new Audio('./media/meow.mp3');
var bgm = new Audio('./media/bgm.mp3');
var bestScore = 0;

//random amount of time of cat popping up
function randTime(min, max){
  return Math.round(Math.random() * (max-min) + min);
}

//random box for the cat to pop up
function randBox(boxes){
  const index = Math.floor(Math.random() * boxes.length);
  const box = boxes[index];
  if (box === lastBox) {
    console.log('match');
    return randBox(boxes);
  }
  lastBox = box;
  return box;
}

//cat popping up
function pop(){
  const time = randTime(200, 900);
  const box = randBox(boxes);
  box.classList.add('up');
  setTimeout(() => {
    box.classList.remove('up');
    if (!timeUp) {pop();}
  }, time);
}

//start the game button
function startGame(){
  scoreBoard.textContent = 0;
  score = 0;
  timeUp = false;
  startMusic();
  pop();
  setTimeout(() => {
    timeUp = true;
    bgm.pause();
    compareScore(); // for best score
    result();
  }, 10000);
}

// when player catch the cat successfully
function hit(e){
  if (e.isTrusted) {
    score++;
    soundEffect();
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
  }
}

//meow when hit
function soundEffect(){
  meow.currentTime = 0;
  meow.play();
}

//start bgm when game start
function startMusic(){
  bgm.currentTime = 0;
  bgm.play();
  bgm.volume = 0.2;
  bgm.loop = true;
}

cats.forEach(cat => cat.addEventListener('click', hit));

// pop-up window to display player's final score
function result(){
  alert('You have caught '+ score +' cat(s) :3 \nYour best performance is '+ bestScore +' cat(s) :D \nPress Start button to play the game again!');
}

// retrieve player's bestscore in this game after checking localstorage is available
retrieveLocalStore();

function retrieveLocalStore(){
  if (typeof(window.localStorage) !== 'undefined') {
    let memory = localStorage.getItem('bestscore');
    if (memory !== null && memory !== NaN) {
      bestScore = parseInt(memory);
    } else {
      bestScore = 0;
    }
  } else {
    // local storage is unavailble in this browser
    console.log('cannot store best score in local storage');
  }
  return bestScore;
}

// compare for the best score, save bestscore in local storage after checking localstorage is available
function compareScore(){
  if (score > bestScore) {
    bestScore = score;
    if (typeof(window.localStorage) !== 'undefined') {
      localStorage.setItem('bestscore', bestScore.toString());
      console.log(bestScore.toString());
    } 
  }
}

