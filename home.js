const mdBreackPoint = 768;
const xxsBreackPoint = 500;
var menu = document.getElementById("menu");
var mainPage = document.getElementById("mainPage");
var adFilter = document.getElementById("adFilter");
var btnLogin = document.getElementById("btnLogin");
var separator = document.getElementById("separator");
var newPlaylist = document.getElementById("newPlaylist");

var screenWidth = window.innerWidth;

    


function toggleMenu() {
    screenWidth = window.innerWidth;
    
    if (screenWidth < mdBreackPoint) {
        if (menu.classList.contains("d-none")) {

            menu.classList.remove("d-none");
            menu.style.position = "absolute";
            menu.style.borderRight = "0px";
            separator.classList.add("d-none");
            newPlaylist.classList.add("d-none");

        } else {
            menu.classList.add("d-none");
            menu.style.position = "relative";
            menu.style.borderRight = "6px solid #40d124";
            separator.classList.remove("d-none");
            newPlaylist.classList.remove("d-none");
        }
    }else{
      
        menu.classList.toggle("d-md-block");
        mainPage.classList.toggle("col-md-8");
        mainPage.classList.toggle("col-xl-9");
      }
      
        
      
}

function changeSettItems() {

    var imgBrand = document.getElementById("img");

    if (screenWidth <= xxsBreackPoint) {

        btnMenu.classList.remove("btnMnMax");
        btnMenu.classList.add("btnMnMin");
        btnLogin.classList.remove("btnLogMax");
        btnLogin.classList.add("btnLogMin");
        
        imgBrand.style.height = "60px"
    } else {
        if (btnLogin.classList.contains("btnLogMin")) {
            
            btnLogin.classList.remove("btnLogMin");
            btnLogin.classList.add("btnLogMax");
            btnMenu.classList.remove("btnMnMin");
            btnMenu.classList.add("btnMnMax");

            imgBrand.style.height = "70px"
        }

    }


}

function currentPage() {
    var currentPage = window.location.pathname
    var menuItem = document.getElementsByClassName("menu-item");

    for (let i = 0; i < menuItem.length; i++) {
         if (menuItem[i].href.includes(currentPage)) {
            menuItem[i].classList.add("currentPage");
            menuItem[i].classList.remove('a.menu-item:hover');
            
         }
    }
}
  

function screen() {
    screenWidth = window.innerWidth;
   

    if (screenWidth >= mdBreackPoint && !menu.classList.contains("d-none")) {
        // Ripristina il menu allo stato originale quando la larghezza supera il breakpoint
        menu.classList.add("d-none");
        menu.style.position = "relative";
        menu.style.borderRight = "6px solid #40d124";
        separator.classList.remove("d-none");
        newPlaylist.classList.remove("d-none");
    }
    changeSettItems();

}

window.addEventListener("resize", screen);

screen();
currentPage();