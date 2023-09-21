function showPass(passwordInput, icon) {
      
    if (passwordInput.type === "password") {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
          passwordInput.type = "text"; // Cambia il tipo a "text" per mostrare la password
      } else {
          passwordInput.type = "password"; // Cambia il tipo a "password" per nascondere la password
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
      }
}

function showErrMess(errorMessage, element){
    var prevContent = element.nextElementSibling.innerHTML
    var textInfo = element.nextElementSibling;
    textInfo.innerHTML = errorMessage;
    textInfo.style.maxHeight = "150px";
  
    element.style.outline = "2px solid #ff1919b7";
  
      element.addEventListener("focus", function() {
  
        textInfo.innerHTML = prevContent;
        textInfo.style.maxHeight = "";
          element.style.outline = "";
      });
  }