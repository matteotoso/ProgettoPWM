const xxsBreackPoint2 = 509;
const baseURL= "https://api.spotify.com/v1/"
const arraySize = 10;
var exploreSuc= false;


if (!localStorage.getItem("clkTracksArray")) {
  console.log("ciao");
  var tArray = new Array(arraySize).fill(null); // Inizializza l'array con elementi null
  localStorage.setItem("clkTracksArray", JSON.stringify(tArray)); // Converte in JSON e memorizza
}
  




function exploreTracks(){
    fetchAndSaveNewToken();
    var accessToken = localStorage.getItem("access_token");      
    
    var container= document.getElementById("container-tracks");
    var searchTerm = document.getElementById("searchInput").value.toLowerCase();
    
    var artistTerm = document.getElementById("artistInput").value.toLowerCase();
    var genreTerm = document.getElementById("genreInput").value.toLowerCase();

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
    
      
  
    if (queryString == '') {
      if (exploreSuc) {
          deleteShowedTracks();
          showHistoryClickedTrack();
          exploreSuc = false;
      }
      return;
    } else if (!exploreSuc) {
      exploreSuc = true;
      deleteShowedTracks();
  }
    
    
    searchParams.append('q', queryString);
    searchParams.append('type', 'track');
    searchParams.append('limit', 15);
    console.log(searchParams.toString())
    
 

  fetch(`${baseURL}search?${searchParams.toString()}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            }
            
    })
        .then((response)=> {
          if (!response.ok){
            response.json().then((data)=>alert("error "+data.error.status + ": "+data.error.message));
            return;
          }
          console.log("aggiorna schermo tracce")
          response.json().then((data)=> showTracks(data));
          }
        
        )            
        .catch(error => alert("error "+error));
        
}

function showTracks(results){
    var card = document.getElementById("card-track");
    var card2 = document.getElementById("card2-track")
    var container= document.getElementById("container-tracks");
    container.innerHTML = ""
    container.append(card);
    container.append(card2);
    

     // Termine di ricerca da confrontare
  var searchTerm = document.getElementById("searchInput").value.toLowerCase();

  // Ordina le tracce in base alla precisione nella corrispondenza con il termine di ricerca e popolarità
  if(searchTerm.length > 1){
    results.tracks.items.sort((a, b) => {
    // Confronta la precisione della corrispondenza tra il termine di ricerca e il nome della traccia
    var aMatch = a.name.toLowerCase().startsWith(searchTerm);
    var bMatch = b.name.toLowerCase().startsWith(searchTerm);

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
  }else{
    results.tracks.items.sort((a, b) => {
      return b.popularity - a.popularity;
    });
  }
  for (var i = 0; i < results.tracks.items.length; i++) {
    var clone = card.cloneNode(true);
    var duration = results.tracks.items[i].duration_ms;

    clone.id = 'card-track-' + i + "-" + results.tracks.items[i].id;
    clone.getElementsByClassName('card-track-title')[0].innerHTML = results.tracks.items[i].name;
    clone.getElementsByClassName('card-track-artist')[0].innerHTML = results.tracks.items[i].artists.map((artist) => artist.name);
    clone.getElementsByClassName('card-img')[0].src = results.tracks.items[i].album.images[0].url;
    clone.getElementsByClassName('card-track-time')[0].innerHTML =  msToMinutes(duration);
    
    clone.classList.remove('d-none');
    container.appendChild(clone);
  }
}

function deleteShowedTracks() {
    var container = document.getElementById("container-tracks"); // Aggiungi questa riga per definire la variabile container
    var card = document.getElementById("card-track");
    var card2 = document.getElementById("card2-track")

    
    if (container.childElementCount > 2) { // >1 in quanto è presente la card di riferimento con d-none
        
        while (container.firstChild) {  //fin tanto che il container ha un figlio
            container.removeChild(container.firstChild);
        }
        container.append(card);
        container.append(card2);
        console.log("Eseguita delete")
    }
}

function showInfoTrack(){
  alert("Hai cliccato il bottone!");

}

function msToMinutes(duration_ms) {
  const minutes = Math.floor(duration_ms / 60000);
  const seconds = ((duration_ms % 60000) / 1000).toFixed(0); //Calcola il numero di secondi rimanenti, arrotonda il valore a un numero intero.
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds; //Costruisci la stringa risultante nel formato "minuti:secondi"
}
function showAdFilter(){
  var adFilter = document.getElementById("adFilter")
  var container= document.getElementById("container-tracks");
  adFilter.classList.toggle("d-none");
  if(container.style.maxHeight == ""){
    container.style.maxHeight = "calc(100vh - 400px)"
  }
    
  else  
    container.style.maxHeight = ""
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


function addClickedTrack(card){
  var myArray = JSON.parse(localStorage.getItem("clkTracksArray"));
  var tId = card.id.split('-').pop();
  console.log(myArray)

  if (myArray[0] === null) {
    myArray = []; // Inizializza l'array vuoto se non ci sono dati nel localStorage
  }

  var existingIndex = myArray.findIndex(item => item.id === tId);

    if (shiftElementsIfNeeded(myArray, existingIndex)) {
        return;
    }

  if (myArray[0] !== undefined) {
    // Sposta solo gli elementi presenti in avanti nell'array
    for (var i = arraySize - 2; i >= 0; i--) {
        if (myArray[i] !== undefined) {
            myArray[i + 1] = myArray[i];
        }
    }
}

var trackInfo = {
  id: tId,
  title: card.getElementsByClassName('card-track-title')[0].innerHTML,
  artist: card.getElementsByClassName('card-track-artist')[0].innerHTML,
  img: card.getElementsByClassName('card-img')[0].src
};

// Inserisci il nuovo valore all'inizio dell'array
myArray[0] = trackInfo;
console.log(myArray);
 // Stampa l'array per verificarne il contenuto
localStorage.setItem("clkTracksArray",JSON.stringify(myArray)); 
showClickedTrack(tId);
}




function showClickedTrack(id){
  var newURL = window.location.origin + window.location.pathname + "?" + id;
    history.replaceState(null, null, newURL);
}

function showHistoryClickedTrack(){
    var card2 = document.getElementById("card2-track");
    var container= document.getElementById("container-tracks");
  var myArray = JSON.parse(localStorage.getItem("clkTracksArray"));
  if (!myArray) 
    return;
  console.log("mostra cronologia")
    var nElement = countLoadedElements(myArray)
  for (var i = 0; i < nElement ; i++) {
    var clone = card2.cloneNode(true);

    clone.id = 'card2-track-' + i + "-" + myArray[i].id;
    clone.getElementsByClassName('card-track-title')[0].innerHTML =myArray[i].title;
    clone.getElementsByClassName('card-track-artist')[0].innerHTML = myArray[i].artist;
    clone.getElementsByClassName('card-img')[0].src = myArray[i].img;
    
    clone.classList.remove('d-none');
    container.appendChild(clone);
  }
}



function countLoadedElements(array) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== undefined && array[i] !== null) {
      count++;
    }
  }
  return count;
}

function removeTrackArray(card){
  
  var myArray = JSON.parse(localStorage.getItem("clkTracksArray"));
  //lo rimuove dai visualizzati
  var container = document.getElementById("container-tracks");
  container.removeChild(card);
  //lo rimuove dall'array
  var idToRemove = card.id.split("-").pop();
  console.log(idToRemove)
  myArray = myArray.filter(item => item.id !== idToRemove);
  console.log(myArray)
  localStorage.setItem("clkTracksArray",JSON.stringify(myArray))

}
document.addEventListener("DOMContentLoaded", showHistoryClickedTrack);
window.addEventListener("resize", setBodyPage);
setBodyPage();



function shiftElementsIfNeeded(myArray, existingIndex) {
  if (existingIndex !== -1) {
      if (existingIndex !== 0) {
        for (var i = existingIndex; i > 0; i--) {
          var element = myArray[i - 1]
          myArray[i - 1] = myArray[i];
          myArray[i]= element;
        }
      }
      localStorage.setItem("clkTracksArray", JSON.stringify(myArray));
      return true;
  }
  return false;
}

