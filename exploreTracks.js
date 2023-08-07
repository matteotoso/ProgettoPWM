const xxsBreackPoint2 = 509;
const accessToken = localStorage.getItem("access_token");
const baseURL= "https://api.spotify.com/v1/"
var screenWidth = window.innerWidth;



function exploreTracks(){
          
    var searchTerm = document.getElementById("searchInput").value;
    
    var artistTerm = document.getElementById("artistInput").value;
    var genreTerm = document.getElementById("genreInput").value;

    var searchParams = new URLSearchParams();
    var queryString = '';

    // Aggiungi il filtro per il titolo della traccia solo se è stato inserito
    if (searchTerm.length > 1) {
        queryString = `${searchTerm}`;
    }
    // Aggiungi il filtro per l'artista solo se è stato inserito
    if (artistTerm.length > 1) {
        queryString += ` artist:${artistTerm}`;
    }

    // Aggiungi il filtro per il genere solo se è stato inserito
    if (genreTerm.length > 1) {
        
        queryString += ` genre:${genreTerm}`;
    }

    // Aggiungi il termine di ricerca "q" con tutti i filtri
    
      
  
    if (queryString == '') { // Se nessun termine di ricerca valido è disponibile, esci dalla funzione
        deleteShowedTracks();
      return;
    }
  
    searchParams.append('q', queryString);
    searchParams.append('type', 'track');
    searchParams.append('limit', 15);

    
 

    fetch(`${baseURL}search?${searchParams.toString()}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            }
            
    })
        .then((response)=> response.json())
        .then((data)=> showTracks(data))
        
            
        .catch((error) => {
                console.error('Errore durante la ricerca:', error);
              });
        
}

function showTracks(results){
    var card = document.getElementById("card-track");
    var container= document.getElementById("container-tracks");
    container.innerHTML="";
    container.append(card);

     // Termine di ricerca da confrontare
  var searchTerm = document.getElementById("searchInput").value.toLowerCase();

  // Ordina le tracce in base alla precisione nella corrispondenza con il termine di ricerca e popolarità
  results.tracks.items.sort((a, b) => {
    // Confronta la precisione della corrispondenza tra il termine di ricerca e il nome della traccia
    var aMatch = a.name.toLowerCase().includes(searchTerm);
    var bMatch = b.name.toLowerCase().includes(searchTerm);

    if (aMatch !== bMatch) {
      // Se la precisione della corrispondenza è diversa, metti prima quella con maggiore precisione
      if (aMatch) {
        return -1;
      } else {
        return 1;
      }
    } else {
      // Se la precisione della corrispondenza è la stessa, metti prima quella con maggiore popolarità
      return b.popularity - a.popularity;
    }
  });

  for (var i = 0; i < results.tracks.items.length; i++) {
    var clone = card.cloneNode(true);
    var duration = results.tracks.items[i].duration_ms;

    clone.id = 'card-track-' + i;
    clone.getElementsByClassName('card-track-title')[0].innerHTML = results.tracks.items[i].name;
    clone.getElementsByClassName('card-track-artist')[0].innerHTML = results.tracks.items[i].artists.map((artist) => artist.name);
    clone.getElementsByClassName('card-img')[0].src = results.tracks.items[i].album.images[0].url;
    clone.getElementsByClassName('card-track-time')[0].innerHTML =  msToMinutes(duration);
    clone.href = "ricerca.html/" + results.tracks.items[i].id;

    clone.classList.remove('d-none');

    container.appendChild(clone);
  }
}

function deleteShowedTracks() {
    var container = document.getElementById("container-tracks"); // Aggiungi questa riga per definire la variabile container
    var card = document.getElementById("card-track");

    
    if (container.childElementCount > 1) { // >1 in quanto è presente la card di riferimento con d-none
        
        while (container.firstChild) {  //fin tanto che il container ha un figlio
            container.removeChild(container.firstChild);
        }
        container.append(card);
    }
}

function showInfoTrack(){
  alert("Hai cliccato il bottone!");

}

function msToMinutes(duration_ms) {
  const minutes = Math.floor(duration_ms / 60000);
  const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
function showAdFilter(){
  var adFilter = document.getElementById("adFilter")
  adFilter.classList.toggle("d-none");
}
function setBodyPage(){
  screenWidth = window.innerWidth;
  var firstH1 = document.querySelector("h1");  
  var btnAdFilter = document.getElementById("btnAdFltr")
    if (screenWidth <= xxsBreackPoint2) {
      
      
        firstH1.style.fontSize = "20px";
        btnAdFilter.style.fontSize = "15px";
      
    }
    else{
      firstH1.style.fontSize = "30px";
      btnAdFilter.style.fontSize = "";
    }
}
window.addEventListener("resize", setBodyPage);
setBodyPage();