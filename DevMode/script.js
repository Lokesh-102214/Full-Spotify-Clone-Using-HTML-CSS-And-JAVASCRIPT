const songs = [
  {
    title: "No Love",
    artist: "Shubh",
    file: "Assets/Shubh - NO LOVE.mp3",
    image: "Assets/Shubh - Elevated.png"
  },
  {
    title: "Co2",
    artist: "Prateek Kuhad",
    file: "Assets/Co2.mp3",
    image: "Assets/Co2.png"
  },
  {
    title: "Aankhon Se Batana",
    artist: "Dikshant",
    file: "Assets/Aankhon Se Batana.mp3",
    image: "Assets/Aankhon Se Batana.png"
  },
  {
    title: "Humraah",
    artist: "Sachet Tandon, Jubin Nautiyal",
    file: "Assets/Humraah (From _Malang - Unleash The Madness_).mp3",
    image: "Assets/Aankhon Se Batana.png"
  },
  {
    title: "Illegal Weapon 2.0",
    artist: "Jasmine Sandlas, Garry Sandhu",
    file: "Assets/Illegal Weapon 2.0 (From _Street Dancer 3D_).mp3",
    image: "Assets/Illegal Weapon 2.0 (From _Street Dancer 3D_).png"
  },
  {
    title: "Elevated",
    artist: "Shubh",
    file: "Assets/Shubh - Elevated.mp3",
    image: "Assets/Shubh - NO LOVE.png"
  },
  {
    title: "Sooraj Dooba Hain",
    artist: "Amaal Mallik, Arijit Singh, Akriti Kakar",
    file: "Assets/Sooraj Dooba Hain.mp3",
    image: "Assets/Sooraj Dooba Hain.png"
  },
  {
    title: "Zinda",
    artist: "Shankar Ahsan Roy",
    file: "Assets/Zinda.mp3",
    image: "Assets/Zinda.png"
  }
];

let currentSongIndex = 0;
const playlistSection = document.getElementById('playlist-section');
const audio = document.getElementById('audio');
const playerImg = document.getElementById('player-img');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function loadSong(index) {
  const song = songs[index];
  playerImg.src = song.image;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  audio.src = song.file;
  audio.play();
  playBtn.innerHTML = '<span aria-label="Pause" role="img">⏸</span>'; // pause icon with ARIA label
  playBtn.setAttribute('aria-label', 'Pause');
  currentSongIndex = index;
}

console.log("Music Player Loaded");
function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<span aria-label="Pause" role="img">⏸</span>';
    playBtn.setAttribute('aria-label', 'Pause');
  } else {
    audio.pause();
    playBtn.innerHTML = '<span aria-label="Play" role="img">▶</span>';
    playBtn.setAttribute('aria-label', 'Play');
  }
}

function playNext() {
  let nextIndex = (currentSongIndex + 1) % songs.length;
  loadSong(nextIndex);
}

function playPrev() {
  let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex);
}

// Render song cards
songs.forEach((song, index) => {
  const card = document.createElement('div');
  card.classList.add('song-card');
  card.innerHTML = `
    <img src="${song.image}" alt="${song.title}" />
    <h4>${song.title}</h4>
    <p>${song.artist}</p>
    <button>Play</button>
  `;
  card.querySelector('button').addEventListener('click', () => loadSong(index));
  playlistSection.appendChild(card);
});

// Event listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

// Optional: Auto play next when current ends
audio.addEventListener('ended', playNext);
