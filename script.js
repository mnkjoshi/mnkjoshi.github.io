
document.getElementById("pass").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      var inp = document.getElementById("pass").value
        if(inp == "q"){
          window.open("page.html","_self")
        } else if(inp == "math"){
          window.open("math.html","_self")
        }
    }
});
