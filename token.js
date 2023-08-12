const client_id = "92af41600f8344d8aaa55983f964e4ad"
const client_secret = "fd78a2f16f8c4a7884d2b3853778e7c1"
var url = "https://accounts.spotify.com/api/token"



async function fetchAndSaveNewToken() {
  try {
    var existingToken = localStorage.getItem('access_token');

    if (existingToken) {
      var expirationTime = localStorage.getItem('token_expiration_time');
      var currentTime = Date.now();

      if (expirationTime && parseInt(expirationTime) > currentTime) {
        var elapsedTime = currentTime - parseInt(expirationTime);
        var remainingTime = Math.max(0, 3600000 - elapsedTime);

        setTimeout(fetchAndSaveNewToken, remainingTime);
        return;
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${client_id}:${client_secret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });

    if (!response.ok) {
      throw new Error('Errore nella richiesta del token');
    }

    var tokenResponse = await response.json();
    var accessToken = tokenResponse.access_token;
    var expirationTime = Date.now() + tokenResponse.expires_in * 1000;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('token_expiration_time', expirationTime);

    console.log('Nuovo token salvato:', accessToken);

    const tokenExpirationTime = tokenResponse.expires_in * 1000;
    setTimeout(fetchAndSaveNewToken, tokenExpirationTime);
  } catch (error) {
    console.error('Errore durante la richiesta del token:', error);
  }
}


fetchAndSaveNewToken();




    
    