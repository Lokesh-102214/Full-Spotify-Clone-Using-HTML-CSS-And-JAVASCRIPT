// Get the playlist name from URL
const params = new URLSearchParams(window.location.search);
let playlistName = params.get("name");

// If no name is provided, default to "Bollywood Workout"
if (!playlistName) {
  console.log("No playlist name provided in URL. Defaulting to 'Bollywood Workout'.");
  playlistName = "Bollywood Workout";
}

async function loadPlaylists() {
  const mainSection = document.querySelector('.main-section');
  let playlistall = [];
  let currentPlaylist = 0;
  let currentSong = 0;

  try {
    const indexResponse = await fetch('music/playlist-index.json');
    const playlistIndex = await indexResponse.json();
    console.log("Playlist Index:", playlistIndex);

    // Find the playlist that matches the playlistName
    const matchingPlaylist = playlistIndex.find(playlist => playlist.title === playlistName);
    
    if (matchingPlaylist) {
      const res = await fetch(matchingPlaylist.file);
      const songs = await res.json();
      
      // Store songs for the player
      playlistall = songs;
      console.log("Loaded playlist:", matchingPlaylist.title, songs);

      // Create playlist section for the matched playlist
      const playlistSection = document.createElement('div');
      playlistSection.className = 'playlist-wrapper';
      playlistSection.dataset.playlistIndex = 0; // Since we only have one playlist now

      // Title (remove the link since we're already on the playlist page)
      const title = document.createElement('h3');
      title.className = 'section-title';
      title.textContent = matchingPlaylist.title;
      playlistSection.appendChild(title);

      // Scrollable wrapper
      const scrollWrapper = document.createElement('div');
      scrollWrapper.className = 'playlist-scroll';

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'scroll-container';

      // Show all songs instead of limiting to 10 (since this is a dedicated playlist page)
      songs.forEach((song, songIdx) => {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        card.dataset.playlistIndex = 0; // Single playlist index
        card.dataset.songIndex = songIdx;

        card.innerHTML = `
            <div class="playbutton-svg">
              <button class="play-button" data-playlist="0" data-song="${songIdx}" style="display: none;">
                    <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" fill="#00C853" />
                        <polygon points="40,30 40,70 70,50" fill="#000000" />
                    </svg>
                </button>
            </div>
            <div class="pausebutton-svg">
              <button class="pause-button" data-playlist="0" data-song="${songIdx}" style="display: none;">
                    <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" fill="#00C853" />
                        <rect x="35" y="30" width="10" height="40" fill="#000000" />
                        <rect x="55" y="30" width="10" height="40" fill="#000000" />
                    </svg>
                </button>
            </div>
            <img src="${song.image}" alt="${song.title}">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
          `;

        scrollContainer.appendChild(card);
      });

      // Combine and append
      scrollWrapper.appendChild(scrollContainer);
      playlistSection.appendChild(scrollWrapper);
      mainSection.appendChild(playlistSection);

      // Setup player with the loaded playlist
      setupPlayer([playlistall]); // Wrap in array to maintain expected structure
      
    } else {
      console.log("Playlist not found:", playlistName);
      // Handle case where playlist is not found
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.innerHTML = `
        <h2>Playlist Not Found</h2>
        <p>The playlist "${playlistName}" could not be found.</p>
        <a href="browse.html">← Back to Home</a>
      `;
      mainSection.appendChild(errorMessage);
    }

  } catch (err) {
    console.error('Error loading playlist:', err);
    // Handle loading error
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
      <h2>Error Loading Playlist</h2>
      <p>There was an error loading the playlist. Please try again.</p>
      <a href="browse.html">← Back to Browse</a>
    `;
    mainSection.appendChild(errorMessage);
  }

  // Add footer to main section
  const footer = document.createElement('footer');
  footer.className = 'spotify-footer';
  footer.innerHTML = `
              <div class="footer-dividerup"></div>
                <div class="footer-columns">
                
                    <div class="footer-column">
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Jobs</a>
                        <a href="#">For the Record</a>
                    </div>

                    <div class="footer-column">
                        <h4>Communities</h4>
                        <a href="#">For Artists</a>
                        <a href="#">Developers</a>
                        <a href="#">Advertising</a>
                        <a href="#">Investors</a>
                        <a href="#">Vendors</a>
                    </div>

                    <div class="footer-column">
                        <h4>Useful links</h4>
                        <a href="#">Support</a>
                        <a href="#">Free Mobile App</a>
                        <a href="#">Popular by Country</a>
                    </div>

                    <div class="footer-column">
                        <h4>Spotify Plans</h4>
                        <a href="#">Premium Individual</a>
                        <a href="#">Premium Duo</a>
                        <a href="#">Premium Family</a>
                        <a href="#">Premium Student</a>
                        <a href="#">Spotify Free</a>
                    </div>

                    <div class="footer-socials">
                        <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/instagram-new.png"
                                alt="Instagram"></a>
                        <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/twitter--v1.png"
                                alt="Twitter"></a>
                        <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/facebook-new.png"
                                alt="Facebook"></a>
                    </div>
                </div>

                <div class="footer-dividerbottom"></div>
                </div>
            `;
  mainSection.appendChild(footer);
}


function setupPlayer(playlistall) {
  // DOM elements
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play");
  const pauseBtn = document.getElementById("pause");
  const seek = document.getElementById("seek");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const volumeSlider = document.getElementById("volume");
  const cover = document.getElementById("cover");
  const artist = document.getElementById("artist");
  const titleEl = document.getElementById("title");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const visualizationBars = document.querySelectorAll('.visualizer-bars');
  const searchBtn = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-bar input');
  const browseBtn = document.querySelector('.browse-button');

  // State
  let currentPlaylist = 0;
  let currentSong = 0;

  // Load and display current song
  function loadSong(songIndex = 0, playlistIndex = 0) {
    if (!playlistall[playlistIndex] || !playlistall[playlistIndex][songIndex]) {
      console.error('Invalid song or playlist index');
      return;
    }

    const song = playlistall[playlistIndex][songIndex];
    currentPlaylist = playlistIndex;
    currentSong = songIndex;

    if (titleEl) titleEl.textContent = song.title;
    if (artist) artist.textContent = song.artist;
    if (cover) cover.src = song.image;
    if (audio) audio.src = song.file;
    if (seek) seek.value = 0;
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (durationEl) durationEl.textContent = "0:00";
  }

  // Format time
  function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${min}:${s < 10 ? "0" + s : s}`;
  }

  // Load initial song if playlists exist
  if (playlistall.length > 0 && playlistall[0].length > 0) {
    loadSong(0, 0);
  }

  // Audio event listeners
  if (audio) {
    audio.addEventListener("loadedmetadata", () => {
      if (seek) seek.max = Math.floor(audio.duration);
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      if (seek) seek.value = Math.floor(audio.currentTime);
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      const currentPlaylistSongs = playlistall[currentPlaylist];
      currentSong = (currentSong + 1) % currentPlaylistSongs.length;
      loadSong(currentSong, currentPlaylist);
      audio.play();
      updatePlayPauseUI();
    });

    audio.addEventListener("play", updatePlayPauseUI);
    audio.addEventListener("pause", updatePlayPauseUI);
  }

  // Main player controls
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (audio) {
        audio.play();
        updatePlayPauseUI();
        updateVisualization(true);
      }
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      if (audio) {
        audio.pause();
        updatePlayPauseUI();
        updateVisualization(false);
      }
    });
  }

  if (seek) {
    seek.addEventListener("input", () => {
      if (audio) audio.currentTime = seek.value;
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      if (audio) audio.volume = volumeSlider.value;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const currentPlaylistSongs = playlistall[currentPlaylist];
      currentSong = (currentSong + 1) % currentPlaylistSongs.length;
      loadSong(currentSong, currentPlaylist);
      if (audio) {
        audio.play();
        updatePlayPauseUI();
        updateVisualization(true);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const currentPlaylistSongs = playlistall[currentPlaylist];
      currentSong = (currentSong - 1 + currentPlaylistSongs.length) % currentPlaylistSongs.length;
      loadSong(currentSong, currentPlaylist);
      if (audio) {
        audio.play();
        updatePlayPauseUI();
        updateVisualization(true);
      }
    });
  }

  // Card interactions
  function setupCardInteractions() {
    const playlistCards = document.querySelectorAll(".playlist-card");

    playlistCards.forEach(card => {
      // Hover effects
      card.addEventListener('mouseenter', () => {
        const playButton = card.querySelector('.play-button');
        const pauseButton = card.querySelector('.pause-button');
        const cardPlaylist = parseInt(card.dataset.playlistIndex);
        const cardSong = parseInt(card.dataset.songIndex);

        // Reset both buttons first
        if (playButton) playButton.style.display = "none";
        if (pauseButton) pauseButton.style.display = "none";

        // Show appropriate button based on current state
        if (currentPlaylist === cardPlaylist && currentSong === cardSong) {
          // This is the currently selected song
          if (audio && !audio.paused) {
            // Currently playing - show pause button
            if (pauseButton) pauseButton.style.display = "inline";
          } else {
            // Currently selected but paused - show play button
            if (playButton) playButton.style.display = "inline";
          }
        } else {
          // Different song - always show play button
          if (playButton) playButton.style.display = "inline";
        }
      });

      card.addEventListener('mouseleave', () => {
        const playButton = card.querySelector('.play-button');
        const pauseButton = card.querySelector('.pause-button');
        // Hide both buttons when mouse leaves
        if (playButton) playButton.style.display = "none";
        if (pauseButton) pauseButton.style.display = "none";
      });
    });

    // Play button clicks
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const playlistIdx = parseInt(button.dataset.playlist);
        const songIdx = parseInt(button.dataset.song);

        if (currentPlaylist === playlistIdx && currentSong === songIdx) {
          if (audio && audio.paused) {
            audio.play();
          }
        } else {
          loadSong(songIdx, playlistIdx);
          if (audio) audio.play();
        }

        updatePlayPauseUI();
        updateVisualization(true);
      });
    });

    // Pause button clicks
    const pauseButtons = document.querySelectorAll('.pause-button');
    pauseButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio) {
          audio.pause();
          updatePlayPauseUI();
          updateVisualization(false);
        }
      });
    });
  }

  // Update UI based on audio state
  function updatePlayPauseUI() {
    if (!audio) return;

    // Main player buttons
    if (audio.paused) {
      if (playBtn) playBtn.style.display = "inline";
      if (pauseBtn) pauseBtn.style.display = "none";
    } else {
      if (playBtn) playBtn.style.display = "none";
      if (pauseBtn) pauseBtn.style.display = "inline";
    }

    // Update card buttons for currently hovered cards
    updateCardButtonsOnHover();
  }

  // Update card buttons when audio state changes
  function updateCardButtonsOnHover() {
    const playlistCards = document.querySelectorAll(".playlist-card");

    playlistCards.forEach(card => {
      // Only update if the card is currently being hovered
      if (card.matches(':hover')) {
        const playButton = card.querySelector('.play-button');
        const pauseButton = card.querySelector('.pause-button');
        const cardPlaylist = parseInt(card.dataset.playlistIndex);
        const cardSong = parseInt(card.dataset.songIndex);

        // Reset both buttons first
        if (playButton) playButton.style.display = "none";
        if (pauseButton) pauseButton.style.display = "none";

        // Show appropriate button based on current state
        if (currentPlaylist === cardPlaylist && currentSong === cardSong) {
          if (audio && !audio.paused) {
            // Currently playing - show pause button
            if (pauseButton) pauseButton.style.display = "inline";
          } else {
            // Currently selected but paused - show play button
            if (playButton) playButton.style.display = "inline";
          }
        } else {
          // Different song - always show play button
          if (playButton) playButton.style.display = "inline";
        }
      }
    });
  }

  function updateVisualization(isPlaying) {
    if (visualizationBars.length > 0) {
      visualizationBars.forEach(bar => {
        bar.style.opacity = isPlaying ? 1 : 0.1;
      });
    }
  }

  // Search functionality
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      searchInput.focus();
      searchBtn.style.backgroundColor = 'white';
    });

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const playlistCards = document.querySelectorAll('.playlist-card');

      playlistCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const artist = card.querySelector('p').textContent.toLowerCase();
        const shouldShow = title.includes(query) || artist.includes(query) || query === '';
        card.style.display = shouldShow ? "block" : "none";
      });
    });
  }

  // Browse button
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      window.location.href = "browse.html";
    });
  }

  // Setup card interactions after DOM is ready
  setupCardInteractions();
}

// Call on load
window.addEventListener('DOMContentLoaded', loadPlaylists);



// This function loads playlists based on the provided playlist name from the URL

async function loadPlaylists() {
  const mainSection = document.querySelector('.main-section');
  let playlistall = [];
  let currentPlaylist = 0;
  let currentSong = 0;

  try {
    const indexResponse = await fetch('music/playlist-index.json');
    const playlistIndex = await indexResponse.json();
    console.log("Playlist Index:", playlistIndex);

    // Check if this is a request for combined Punjabi playlists
    if (playlistName && playlistName.toLowerCase() === `${playlistName}`) {
      // Find all playlists that have "punjabi" in their name (case insensitive)
      const CombinedPlaylists = playlistIndex.filter(playlist => 
        playlist.title.toLowerCase().includes(`${playlistName}`)
      );
      
      if (CombinedPlaylists.length > 0) {
        let combinedSongs = [];
        let playlistTitles = [];
        
        // Load songs from all Punjabi playlists
        for (const playlist of CombinedPlaylists) {
          const res = await fetch(playlist.file);
          const songs = await res.json();
          combinedSongs = combinedSongs.concat(songs);
          playlistTitles.push(playlist.title);
        }
        
        // Store combined songs for the player
        playlistall = combinedSongs;


        // Create playlist section for the combined playlists
        const playlistSection = document.createElement('div');
        playlistSection.className = 'playlist-wrapper';
        playlistSection.dataset.playlistIndex = 0;

        // Title
        const title = document.createElement('h3');
        title.className = 'section-title';
        title.textContent = `${playlistTitles.join(' + ')}`;
        playlistSection.appendChild(title);

        // Scrollable wrapper
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'playlist-scroll';

        

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';

        // Show all combined songs
        combinedSongs.forEach((song, songIdx) => {
          const card = document.createElement('div');
          card.className = 'playlist-card';
          card.dataset.playlistIndex = 0;
          card.dataset.songIndex = songIdx;

          card.innerHTML = `
              <div class="playbutton-svg">
                <button class="play-button" data-playlist="0" data-song="${songIdx}" style="display: none;">
                      <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="48" fill="#00C853" />
                          <polygon points="40,30 40,70 70,50" fill="#000000" />
                      </svg>
                  </button>
              </div>
              <div class="pausebutton-svg">
                <button class="pause-button" data-playlist="0" data-song="${songIdx}" style="display: none;">
                      <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="48" fill="#00C853" />
                          <rect x="35" y="30" width="10" height="40" fill="#000000" />
                          <rect x="55" y="30" width="10" height="40" fill="#000000" />
                      </svg>
                  </button>
              </div>
              <img src="${song.image}" alt="${song.title}">
              <h4>${song.title}</h4>
              <p>${song.artist}</p>
            `;

          scrollContainer.appendChild(card);
        });

        // Combine and append

        scrollWrapper.appendChild(scrollContainer);

        playlistSection.appendChild(scrollWrapper);
        mainSection.appendChild(playlistSection);

        // Add scroll functionality for this playlist

        // Setup player with the combined playlist
        setupPlayer([playlistall]);
        
      } else {
        console.log("No Punjabi playlists found");
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
          <h2>No Playlists Found</h2>
          <p>No playlists were found.</p>
          <a href="browse.html">← Back to Browse</a>
        `;
        mainSection.appendChild(errorMessage);
      }
    } else {
      // Handle single playlist loading (existing logic)
      const matchingPlaylist = playlistIndex.find(playlist => playlist.title === playlistName);
      
      if (matchingPlaylist) {
        const res = await fetch(matchingPlaylist.file);
        const songs = await res.json();
        
        // Store songs for the player
        playlistall = songs;
        console.log("Loaded playlist:", matchingPlaylist.title, songs);

        // Create playlist section for the matched playlist
        const playlistSection = document.createElement('div');
        playlistSection.className = 'playlist-wrapper';
        playlistSection.dataset.playlistIndex = 0;

        // Title
        const title = document.createElement('h3');
        title.className = 'section-title';
        title.textContent = matchingPlaylist.title;
        playlistSection.appendChild(title);

        // Scrollable wrapper
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'playlist-scroll';



        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';

        // Show all songs
        songs.forEach((song, songIdx) => {
          const card = document.createElement('div');
          card.className = 'playlist-card';
          card.dataset.playlistIndex = 0;
          card.dataset.songIndex = songIdx;

          card.innerHTML = `
              <div class="playbutton-svg">
                <button class="play-button" data-playlist="0" data-song="${songIdx}" style="display: none;">
                      <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="48" fill="#00C853" />
                          <polygon points="40,30 40,70 70,50" fill="#000000" />
                      </svg>
                  </button>
              </div>
              <div class="pausebutton-svg">
                <button class="pause-button" data-playlist="0" data-song="${songIdx}" style="display: none;">
                      <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="48" fill="#00C853" />
                          <rect x="35" y="30" width="10" height="40" fill="#000000" />
                          <rect x="55" y="30" width="10" height="40" fill="#000000" />
                      </svg>
                  </button>
              </div>
              <img src="${song.image}" alt="${song.title}">
              <h4>${song.title}</h4>
              <p>${song.artist}</p>
            `;

          scrollContainer.appendChild(card);
        });

        // Combine and append

        scrollWrapper.appendChild(scrollContainer);

        playlistSection.appendChild(scrollWrapper);
        mainSection.appendChild(playlistSection);

        // Add scroll functionality for this playlist


        // Setup player with the loaded playlist
        setupPlayer([playlistall]);
        
      } else {
        console.log("Playlist not found:", playlistName);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
          <h2>Playlist Not Found</h2>
          <p>The playlist "${playlistName}" could not be found.</p>
          <a href="browse.html">← Back to Browse</a>
        `;
        mainSection.appendChild(errorMessage);
      }
    }

  } catch (err) {
    console.error('Error loading playlist:', err);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
      <h2>Error Loading Playlist</h2>
      <p>There was an error loading the playlist. Please try again.</p>
      <a href="browse.html">← Back to Browse</a>
    `;
    mainSection.appendChild(errorMessage);
  }

  // Add footer to main section
  const footer = document.createElement('footer');
  footer.className = 'spotify-footer';
  footer.innerHTML = `
              <div class="footer-dividerup"></div>
                <div class="footer-columns">
                
                    <div class="footer-column">
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Jobs</a>
                        <a href="#">For the Record</a>
                    </div>

                    <div class="footer-column">
                        <h4>Communities</h4>
                        <a href="#">For Artists</a>
                        <a href="#">Developers</a>
                        <a href="#">Advertising</a>
                        <a href="#">Investors</a>
                        <a href="#">Vendors</a>
                    </div>

                    <div class="footer-column">
                        <h4>Useful links</h4>
                        <a href="#">Support</a>
                        <a href="#">Free Mobile App</a>
                        <a href="#">Popular by Country</a>
                    </div>

                    <div class="footer-column">
                        <h4>Spotify Plans</h4>
                        <a href="#">Premium Individual</a>
                        <a href="#">Premium Duo</a>
                        <a href="#">Premium Family</a>
                        <a href="#">Premium Student</a>
                        <a href="#">Spotify Free</a>
                    </div>

                    <div class="footer-socials">
                        <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/instagram-new.png"
                                alt="Instagram"></a>
                        <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/twitter--v1.png"
                                alt="Twitter"></a>
                        <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/facebook-new.png"
                                alt="Facebook"></a>
                    </div>
                </div>

                <div class="footer-dividerbottom"></div>
                </div>
            `;
  mainSection.appendChild(footer);
}