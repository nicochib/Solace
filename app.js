const LASTFM_API_KEY = "927254e1cb27b3d6777a6ed810eea067";
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const SPOTIFY_CLIENT_ID = "e53b5a6cc52b4d33b99d4bca6abbc27a";
const SPOTIFY_CLIENT_SECRET = "166df699eecb4b2baf17122d84a764ae";

// =====================
// GENRE TAGS
// =====================
const genreTags = {

// afro
"amapiano": "amapiano",
"afrobeats": "afrobeats",
"afropop": "afropop",
"afroswing": "afroswing",
"gqom": "gqom",
"afrobashment": "afrobashment",
"highlife": "highlife",
"afrojuju": "afrojuju",
"afrofusion": "afrofusion",
"kuduro": "kuduro",
"kizomba": "kizomba",
"zouk": "zouk",
"afrohouse": "afrohouse",
"afrotech": "afrotech",
"bongo flava": "bongo flava",
"coupe decale": "coupe decale",
"ndombolo": "ndombolo",

// r&b and soul
"r&b": "r&b",
"neo soul": "neo soul",
"contemporary r&b": "contemporary r&b",
"alternative r&b": "alternative r&b",
"quiet storm": "quiet storm",
"new jack swing": "new jack swing",
"funk": "funk",
"soul": "soul",
"gospel": "gospel",
"bedroom pop": "bedroom pop",

// jazz
"jazz": "jazz",
"nu jazz": "nu jazz",
"jazz hop": "jazz hop",
"acid jazz": "acid jazz",
"jazz fusion": "jazz fusion",

"vocal jazz": "vocal jazz",
"smooth jazz": "smooth jazz",
"bossa nova": "bossa nova",
"soul jazz": "soul jazz",

// electronic
"electronic": "electronic",
"house": "house",
"deep house": "deep house",
"uk garage": "uk garage",
"garage": "garage",
"jungle": "jungle",
"drum and bass": "drum and bass",
"grime": "grime",
"techno": "techno",
"ambient": "ambient",
"lo fi": "lo-fi",
"lofi": "lo-fi",

// francophone
"francophone": "francophone",
"french": "french pop",
"french pop": "french pop",
"kompa": "kompa",
"makossa": "makossa",

// alternative
"indie": "indie",
"indie soul": "indie soul",
"art pop": "art pop",
"experimental": "experimental",
"dream pop": "dream-pop",
"shoegaze": "shoegaze",
"alternative": "alternative",

// caribbean
"dancehall": "dancehall",
"reggae": "reggae",
"soca": "soca",
"calypso": "calypso",
"reggaeton": "reggaeton",
"dembow": "dembow"
};

// =====================
// MOOD TAGS
// =====================
const moodTags = {
"sad": "heavy_sad",
"lonely": "heavy_sad",
"heartbreak": "heavy_sad",

"missing someone": "heavy_sad",
"happy": "euphoric_happy",
"joy": "euphoric_happy",
"euphoric": "euphoric_happy",
"uplifting": "euphoric_happy",
"summer": "euphoric_happy",
"day party": "euphoric_happy",
"chill": "warm_chill",
"peaceful": "warm_chill",
"dreamy": "warm_chill",
"nostalgic": "melancholic_chill",
"memories": "melancholic_chill",
"bittersweet": "melancholic_chill",
"melancholic": "melancholic_chill",
"late night": "melancholic_chill",
"2am": "melancholic_chill",
"dark": "heavy_sad",
"romantic": "warm_chill",
"love": "warm_chill",
"ethereal": "warm_chill",
"angry": "euphoric_happy",
"energetic": "euphoric_happy"
};
// =====================
// AMAPIANO MOOD MAP
// maps mood keywords to amapiano tiers
// =====================
const amapianoMoodMap = {
"chill": "chill",
"peaceful": "chill",
"calm": "chill",
"sad": "chill",
"slow": "chill",
"happy": "party",
"energetic": "party",
"party": "party",
"dance": "party",
"euphoric": "party"
// anything else defaults to mid
};
// =====================
// MOOD SONIC PROFILES (GENERAL)
// all values on 0-1 scale to match Spotify API
// =====================
const moodProfiles = {

euphoric_happy: {
tempo: { min: 110 },
energy: { min: 0.6 },
valence: { min: 0.4, max: 0.8 }
},
melancholic_chill: {
tempo: { min: 70, max: 110 },
energy: { min: 0.3, max: 0.65 },
valence: { min: 0.1, max: 0.45 }
},
warm_chill: {
tempo: { max: 100 },
energy: { max: 0.45 },
valence: { min: 0.6 }
},
heavy_sad: {
tempo: { max: 95 },
energy: { max: 0.5 },
valence: { max: 0.35 }
}
};
// =====================
// AMAPIANO SONIC PROFILES
// all values on 0-1 scale to match Spotify API
// tempo is BPM so stays as-is
// =====================
const amapianoProfiles = {
chill: {
tempo: { min: 110, max: 117 },
energy: { max: 0.45 },
danceability: { min: 0.65 },
valence: { max: 0.45 }
},
mid: {
tempo: { min: 110, max: 117 },
energy: { min: 0.45, max: 0.75 },
danceability: { min: 0.60 },
valence: { min: 0.33, max: 0.53 }
},
party: {
tempo: { min: 110, max: 117 },
energy: { min: 0.55 },
danceability: { min: 0.75 },
valence: { min: 0.52 }
}
};

// =====================
// GENERAL MOOD FILTER
// =====================
function filterByMoodProfile(tracks, mood) {
const profile = moodProfiles[mood];
return tracks.filter(track => {
const f = track.features;
if (!f) return false;
const tempoOk = (profile.tempo?.min === undefined || f.tempo >= profile.tempo.min) &&
(profile.tempo?.max === undefined || f.tempo <= profile.tempo.max);
const energyOk = (profile.energy?.min === undefined || f.energy >= profile.energy.min) &&
(profile.energy?.max === undefined || f.energy <= profile.energy.max);
const valenceOk = (profile.valence?.min === undefined || f.valence >= profile.valence.min) &&
(profile.valence?.max === undefined || f.valence <= profile.valence.max);
return tempoOk && energyOk && valenceOk;
});
}
// =====================
// AMAPIANO FILTER
// =====================
function filterAmapiano(tracks, tier = "mid") {
const profile = amapianoProfiles[tier];
return tracks.filter(track => {
const f = track.features;
if (!f) return false;
const tempoOk = f.tempo >= profile.tempo.min &&
f.tempo <= profile.tempo.max;
const energyOk = (profile.energy.min === undefined || f.energy >= profile.energy.min) &&
(profile.energy.max === undefined || f.energy <= profile.energy.max);
const danceOk = f.danceability >= profile.danceability.min;
const valenceOk = (profile.valence.min === undefined || f.valence >= profile.valence.min) &&
(profile.valence.max === undefined || f.valence <= profile.valence.max);
return tempoOk && energyOk && danceOk && valenceOk;
});

}
// =====================
// MOOD DETECTION
// =====================
function detectInput(input) {
const lower = input.toLowerCase();
// check for genre first
let detectedGenre = null;
for (const [keyword, genre] of Object.entries(genreTags)) {
if (lower.includes(keyword)) {
detectedGenre = genre;
break;
}
}
// check for mood second
let detectedMood = null;
for (const [keyword, mood] of Object.entries(moodTags)) {
if (lower.includes(keyword)) {
detectedMood = mood;
break;
}
}
// amapiano tier detection
let amapianoTier = "mid";
if (detectedGenre === "amapiano") {
for (const [keyword, tier] of Object.entries(amapianoMoodMap)) {
if (lower.includes(keyword)) {
amapianoTier = tier;
break;
}
}
}
return { detectedGenre, detectedMood, amapianoTier };
}
// =====================
// SPOTIFY AUTH
// =====================
async function getSpotifyToken() {
const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
const response = await fetch("https://accounts.spotify.com/api/token", {
method: "POST",

headers: {
"Authorization": `Basic ${credentials}`,
"Content-Type": "application/x-www-form-urlencoded"
},
body: "grant_type=client_credentials"
});
const data = await response.json();
return data.access_token;
}
// =====================
// SPOTIFY - SEARCH TRACKS
// =====================
async function searchSpotifyTracks(query, token) {
const response = await fetch(
`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`,
{
headers: {
"Authorization": `Bearer ${token}`
}
}
);
const data = await response.json();
return data.tracks.items || [];
}
// =====================
// SPOTIFY - GET AUDIO FEATURES IN BULK
// allows songs to be measured against sonic
// requirements of the user's preferred mood
// songs that meet requirements get listed
// lyrics will be a phase 2 feature (genius api)
// =====================
async function getAudioFeatures(trackIds, token) {
const ids = trackIds.join(",");
const response = await fetch(
`https://api.spotify.com/v1/audio-features?ids=${ids}`,
{
headers: {
"Authorization": `Bearer ${token}`
}
}
);
const data = await response.json();
return data.audio_features || [];
}

// =====================
// LAST.FM - GET SONGS BY TAG
// =====================
async function getSongsFromLastFM(tag) {
const response = await fetch(
`${LASTFM_BASE_URL}?method=tag.gettoptracks&tag=${tag}&api_key=${LASTFM_API_KEY}&format=json`
);
const data = await response.json();
return data.tracks.track || [];
}
// =====================
// DISPLAY SONGS ON PAGE
// =====================
function displaySongs(songs) {
const container = document.getElementById("results");
container.innerHTML = "";
if (songs.length === 0) {
container.innerHTML = "<p>No tracks found matching your mood</p>";
return;
}
songs.slice(0, 10).forEach(song => {
const div = document.createElement("div");
div.innerHTML = `<p><strong>${song.name}</strong> — ${song.artists[0].name}</p>`;
container.appendChild(div);
});
}
// =====================
// MAIN SEARCH FUNCTION
// =====================
async function search() {
const input = document.getElementById("moodInput").value;
const { detectedGenre, detectedMood, amapianoTier } = detectInput(input);
// get spotify token first
const token = await getSpotifyToken();
// build search query based on genre or mood
const searchQuery = detectedGenre || detectedMood || input;
// search spotify for tracks
const tracks = await searchSpotifyTracks(searchQuery, token);
if (tracks.length === 0) {

document.getElementById("results").innerHTML = "<p>No tracks found</p>";
return;
}
// get track IDs for bulk audio features call
const trackIds = tracks.map(t => t.id);
const audioFeatures = await getAudioFeatures(trackIds, token);
// attach features to each track
const tracksWithFeatures = tracks.map((track, i) => ({
...track,
features: audioFeatures[i]
}));
// route to correct filter
let filtered = [];
if (detectedGenre === "amapiano") {
// amapiano gets its own filter with tier
filtered = filterAmapiano(tracksWithFeatures, amapianoTier);
} else if (detectedMood && moodProfiles[detectedMood]) {
// general mood filter
filtered = filterByMoodProfile(tracksWithFeatures, detectedMood);
} else {
// no filter matched, return all tracks
filtered = tracksWithFeatures;
}
displaySongs(filtered);
}