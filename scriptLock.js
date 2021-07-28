var save = []

document.addEventListener('keydown', function(event) {
    const key = event.key; // "a", "1", "Shift", etc.
  if(key == "Backspace"){
    save = []
  } else {
    save.push(key)
  }
  if(save.join('') == "hhj1802"){
    document.body.style.color = "white";
  }
  
});
