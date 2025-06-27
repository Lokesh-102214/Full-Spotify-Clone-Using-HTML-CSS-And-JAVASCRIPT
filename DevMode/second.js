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
    image: "Assets/Humraah (From _Malang - Unleash The Madness_).png"
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





// DOM elements
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const seek = document.getElementById("seek");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const playButtons = document.querySelectorAll('.playbutton-svg');
const pauseButtons = document.querySelectorAll('.pausebutton-svg');
const playlistCards = document.querySelectorAll('.playlist-card');
const downloadBtn = document.getElementById("download-btn");



// Scroll behavior for horizontal playlist arrows
const scrollContainer = document.querySelector('.scroll-container');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');

const scrollAmount = 350; // pixels to scroll on each click

leftBtn.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

rightBtn.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

// hovering effect for playlist cards display play buttons

playlistCards.forEach(card => {
  card.addEventListener('mouseover', () => {
    const playButton = card.querySelector('.playbutton-svg');
    const pauseButton = card.querySelector('.pausebutton-svg');
    if (playButton) playButton.style.display = 'inline';
    if (pauseButton) pauseButton.style.display = 'none';
  });

  card.addEventListener('mouseout', () => {
    const playButton = card.querySelector('.playbutton-svg');
    const pauseButton = card.querySelector('.pausebutton-svg');
    if (playButton) playButton.style.display = 'none';
    if (pauseButton) pauseButton.style.display = 'none';
  });
});


// State  
let currentSong = 0;

// Load and display current song
function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.image;
  audio.src = song.file;
  seek.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
}

// Format time
function formatTime(sec) {
  const min = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${min}:${s < 10 ? "0" + s : s}`;
}

// Load initial song
loadSong(currentSong);
// Helper to update play/pause button display for main and song cards
function updatePlayPauseDisplay(isPlaying, songIndex = null) {
  if (isPlaying) {
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline";
    if (songIndex !== null) {
      playButtons[songIndex].style.display = "none";
      pauseButtons[songIndex].style.display = "inline";
    }
  } else {
    playBtn.style.display = "inline";
    pauseBtn.style.display = "none";
    if (songIndex !== null) {
      playButtons[songIndex].style.display = "inline";
      pauseButtons[songIndex].style.display = "none";
    }
  }
}
// Helper function to handle play/pause logic for song cards
playButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const isSameSong = currentSong === index;

    if (isSameSong && !audio.paused) {
      audio.pause();
      updatePlayPauseDisplay(false, index);
    } else {
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      updatePlayPauseDisplay(true, index);
    }
  });
});

pauseButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    audio.pause();
    updatePlayPauseDisplay(false, index);

    if (currentSong === index) {
      updatePlayPauseDisplay(false, index);
    }
    else {
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      updatePlayPauseDisplay(true, index);
    }

  });
});


// Metadata loaded
audio.addEventListener("loadedmetadata", () => {
  seek.max = Math.floor(audio.duration);
  durationEl.textContent = formatTime(audio.duration);
});

// Play
playBtn.addEventListener("click", () => {
  audio.play();
  updatePlayPauseDisplay(true);
});

// Pause
pauseBtn.addEventListener("click", () => {
  audio.pause();
  updatePlayPauseDisplay(false);
});

// Time update
audio.addEventListener("timeupdate", () => {
  seek.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Seek
seek.addEventListener("input", () => {
  audio.currentTime = seek.value;
});

// Volume
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// Next
nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
  updatePlayPauseDisplay(true, currentSong);
});

// Prev
prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  audio.play();
  updatePlayPauseDisplay(true, currentSong);
});

// Autoplay next when ended
audio.addEventListener("ended", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
  updatePlayPauseDisplay(true, currentSong);
});


//Sidebar browse all button
function handleBrowseClick() {
  const libraryContent = document.getElementById("library-content");
  let libraryHTML = `<div class="library-container">`;
  songs.forEach(song => {
    libraryHTML += `
      <div class="library-item">
        <img src="${song.image}" alt="${song.title}">
        <div class="song-info">
          <h4>${song.title}</h4>
          <p>${song.artist}</p>
        </div>
        <button class="more-options">⋮</button>
      </div>
    `;
  });
  libraryHTML += `</div>
    <button id="back-button" style="margin-bottom: 20px; background: none; border: 1px solid white; color: white; padding: 5px 10px; cursor: pointer; border-radius: 5px;">← Back</button>`;
  // Save original content to restore later
  const originalContent = libraryContent.innerHTML;
  libraryContent.innerHTML = libraryHTML;

  // Add back button functionality after content is replaced
  document.getElementById("back-button").addEventListener("click", () => {
    libraryContent.innerHTML = originalContent;

    // Re-attach the event listener to the browse button
    const browseBtn = document.getElementById("white-btnbrowse");
    if (browseBtn) {
      browseBtn.addEventListener("click", handleBrowseClick);
    }
  });
}
document.getElementById("white-btnbrowse").addEventListener("click", handleBrowseClick);




