
document.getElementById("pass").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        if(document.getElementById("pass").value == "bob"){
          window.open("page.html","_self")
        }
    }
});