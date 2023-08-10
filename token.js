const client_id = "92af41600f8344d8aaa55983f964e4ad"
const client_secret = "fd78a2f16f8c4a7884d2b3853778e7c1"
var url = "https://accounts.spotify.com/api/token"



function fetchAndSaveNewToken() {
  // Controlla se c'è già un token di accesso nel Local Storage
  const existingToken = localStorage.getItem('access_token');

  if (existingToken) {
    // Se c'è già un token nel Local Storage, verifica se è scaduto o meno
    const expirationTime = localStorage.getItem('token_expiration_time');
    const currentTime = Date.now();

    if (expirationTime && parseInt(expirationTime) > currentTime) {
      // Se il token nel Local Storage non è scaduto, lo utilizziamo
      return;
    }
  }

  // Se non c'è un token nel Local Storage o è scaduto, richiedine uno nuovo
  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${client_id}:${client_secret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })
    .then((response) => response.json())
    .then((tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      const expirationTime = Date.now() + tokenResponse.expires_in * 1000;

      // Salva il nuovo token nel Local Storage insieme al tempo di scadenza
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('token_expiration_time', expirationTime);

      console.log('Nuovo token salvato:', accessToken);

      // Imposta un timer per rigenerare il token prima che scada (ad esempio, dopo 50 minuti)
      const tokenExpirationTime = tokenResponse.expires_in * 1000; // Il valore "expires_in" del token in millisecondi
      setTimeout(fetchAndSaveNewToken, tokenExpirationTime - 300000); // 300000 millisecondi = 5 minuti
    })
    .catch((error) => {
      console.error('Errore durante la richiesta del token:', error);
    });
}







    
    