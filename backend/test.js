import fs from 'fs';

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQA4PNg9o8jTJpTpQQhxdP7fqPHEspkTzQJLb-1rQmlkTIaFqeoXT_d01ThUq-4xEYXPlYAbC6Nk15KXdYp7PmH0AHFPYz0ixCTDn8uHrhj081d14vW7fS-3E9mP1ifZFLiG2g5cDKIFE1UCpLxGkGivFzcBgWrGFxNc5Bq9b6cTL-Z9lsa5ZW-ER8oP9wR9PVQuLsM1mK98zn0D1KCkyPkpyXrYqHcA9V6rXbNNFGvExeO4aYrvDR55Yw_rJv6v_GcaZmf1R7za';

async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}

async function getPlaylistDetails(playlistId) {
    // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-playlist
    return await fetchWebApi(`v1/playlists/${playlistId}`, 'GET');
}

// Extract playlist ID from the Spotify link
// You'll need to follow the redirect or manually get the ID
const playlistId = '696hcUjGnATO9cy2dCT4gM'; // Replace with actual playlist ID

const playlistDetails = await getPlaylistDetails(playlistId);
fs.writeFileSync('playlist-details.json', JSON.stringify(playlistDetails, null, 2));
console.log('Playlist details written to playlist-details.json');
