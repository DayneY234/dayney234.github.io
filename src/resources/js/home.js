// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const isBrowser = () => ![typeof window, typeof document].includes('undefined');

if (isBrowser()) {
  // Code to execute only in a browser environment
  console.log("This is running in a web browser.");

  // Example: Manipulate the DOM
  document.body.style.backgroundColor = 'lightblue';
} else {
  // Code to execute in a non-browser environment (e.g., Node.js)
  console.log("This is running outside of a web browser.");
}


console.log("the script is working !!");
const token = 'BQA2jXRdcmEqIYcGNc5xajzau7uSG_dzUePvL3g4UaFLo3ghX4ZsltVwskvUPAbATiYxxq4MTgeNQR0bAcSg4vKhImYdOIrXnIovX8PsIA2y40I4vzQ9gdEQ1xx8cRu0bh1qilbl2heKHd0ukgJFRmiEihD1xM04bRtvWGCMVcakX9_DE06NYEiKWR35-EBAWxQE9zIdMNjlqntubUGJ8i-Ca8Fnc-ADNI0y6XGnWt03ZOY8QQwVHq5JormrOisP53BG6UL2hQ';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
      'v1/me/top/tracks?time_range=short_term&limit=10', 'GET'
    )).items;
  }

async function getRecommendations(){
  const topTracks = await getTopTracks();
  console.log(topTracks);
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=30&seed_tracks=${topTracks.id.join(',')}`, 'GET'
  )).tracks;
}

async function createPlaylist(){
  const { id: user_id } = await fetchWebApi('v1/me', 'GET')
  const tracks = await getRecommendations();

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`, 'POST', {
      "name": "My recommendation playlist",
      "description": "Playlist created by the tutorial on developer.spotify.com",
      "public": false
  })

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracks.uri.join(',')}`,
    'POST'
  );

  return playlist;
}

const createdPlaylist = createPlaylist();
console.log(createdPlaylist.name, createdPlaylist.id);

// window.onSpotifyIframeApiReady = (IFrameApi) => {
//   const element = document.getElementById("recommendations");
//   const options = {
//     title: "Spotify Embed: Recommendation Playlist ",
//     src: "https://open.spotify.com/embed/playlist/4h0HNF4wZa59M5Z4NUGMNK?utm_source=generator&theme=0",
//     width: "100%",
//     height: "100%",
//     style: "min-height: 360px;",
//     frameBorder: "0",
//     allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
//     loading: "lazy"
//   };
//   const callback = (EmbedController) => {};
//   IFrameApi.createController(element, options, callback);
// }

