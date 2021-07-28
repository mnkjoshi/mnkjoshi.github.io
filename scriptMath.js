var inp;
var timer = [];
var disp = document.getElementById("tim")
var running = false;
var first = 0;
var second = 0;
var score = 0;
var mode = 0;
var predAns = 0;
var q1 = document.getElementById("question1")
var q2 = document.getElementById("question2")
var scoreDisp = document.getElementById("scoring")
for(var i = 60; i > -1; i--){
  timer.push(i)
}

document.addEventListener('keydown', function(event) {
    const key = event.key; // "a", "1", "Shift", etc.
  if(key == "Enter"){
    anss = document.getElementById("ans")
    inp = parseInt(document.getElementById("ans").value,10)
    if(running){
      if (mode == 0) {
        if(inp == predAns){
          score += 1;
          scoreDisp.innerHTML = "Score: " + score;
          rollQ();
        } 
        else {
          //WRONG ANSWER SOUND
          rollQ();
        }
      }
      anss.value = ''
    } else {
      alert("Press go to begin!");
    }
  } 
  
});

function rollQ(){
  first = Math.round(10 * Math.random())
  second = Math.round(10 * Math.random())
  q1.innerHTML = first;
  if(mode == 0){
    q2.innerHTML = "+ " + second;
    predAns = first + second;
  }
}


const run = async () => {
  for (const time of timer) {
    await new Promise(r => setTimeout(r, 1000));
    disp.innerHTML = time;
    console.log(time)
    if(time == 0){  
      running = false
    }
  }
  alert("Your final score was " + score + " points!")
  score = 0
  scoreDisp.innerHTML = "Your final score was " + score + " points!";
  first = 0;
  second = 0;
  disp.innerHTML = 60;
}


var button = document.getElementById("start").addEventListener("click",function(){
  running = true;
  score = 0;
  rollQ();
  run();
})
