function createPlaylist(){
    localStorage.setItem('showContent', 'true');
}



document.addEventListener("DOMContentLoaded", function() {
    // Recupera il valore dalla localStorage
    const showContent = localStorage.getItem('showContent');

    // Se il valore è presente e true, mostra il contenuto sulla pagina
    if (showContent === 'true') {
        document.getElementById("boxCrtPlylst").classList.remove("d-none");

      // Rimuovi il valore dalla localStorage per evitare che venga mostrato nuovamente dopo il refresh della pagina
      localStorage.removeItem('showContent');
    }
  });