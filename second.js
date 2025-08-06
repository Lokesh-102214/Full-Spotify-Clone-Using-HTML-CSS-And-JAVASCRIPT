async function loadPlaylists() {
  const mainSection = document.querySelector('.main-section');
  let playlistall = []; 

  try {
    const indexResponse = await fetch('music/playlist-index.json');
    const playlistIndex = await indexResponse.json();
    for (const playlist of playlistIndex) {
      const res = await fetch(playlist.file);
      const songs = await res.json();

      playlistall.push(songs);
      // Log the playlist title and songs 
      console.log(`Loading playlist: ${playlist.title}`, playlistall);

      // Uncomment the next line for debugging playlists in development
      const playlistSection = document.createElement('div');
      playlistSection.className = 'playlist-wrapper';

      // Title
      const title = document.createElement('h3');
      title.className = 'section-title';
      title.textContent = playlist.title;
      playlistSection.appendChild(title);

      // Scrollable wrapper
      const scrollWrapper = document.createElement('div');
      scrollWrapper.className = 'playlist-scroll';

      // Scroll Buttons
      const leftBtn = document.createElement('button');
      leftBtn.className = 'scroll-btn left';
      leftBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000"
                        fill="none">
                        <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor"
                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>`;
      const rightBtn = document.createElement('button');
      rightBtn.className = 'scroll-btn right';
      rightBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000"
                        fill="none">
                        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#000000"
                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>`;

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'scroll-container';

      // Limit to first 10 songs
      songs.slice(0, 10).forEach(song => {
        const card = document.createElement('div');
        card.className = 'playlist-card';

        card.innerHTML = `
            <div class="playbutton-svg" >
              <button class="play-button" data-src="${song.file}" style="display: none;">
                    <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" fill="#00C853" />
                        <polygon points="40,30 40,70 70,50" fill="#000000" />
                    </svg>
                </button>
            </div>
            <div class="pausebutton-svg" >
              <button class="pause-button" data-src="${song.file}" style="display: none;">
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
      scrollWrapper.appendChild(leftBtn);
      scrollWrapper.appendChild(scrollContainer);
      scrollWrapper.appendChild(rightBtn);
      playlistSection.appendChild(scrollWrapper);
      mainSection.appendChild(playlistSection);
    }
      // DOM elements
    const playlistcard = document.querySelectorAll(".playlist-card");
    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");
    const seek = document.getElementById("seek");
    const currentTimeEl = document.getElementById("current-time");
    const durationEl = document.getElementById("duration");
    const volumeSlider = document.getElementById("volume");
    const cover = document.getElementById("cover");
    const artist = document.getElementById("artist");
    const titleEl = document.getElementById("title"); // Main player title element
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const playCardButtons = document.querySelectorAll('.play-button');
    const pauseCardButtons = document.querySelectorAll('.pause-button');
    visualizationbars = document.querySelectorAll('.visualizer-bars');
    const searchbtn = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-bar input');
    const browsebtn = document.querySelector('.browse-button');
    const scrollContainer = document.querySelector('.scroll-container');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');






    const scrollAmount = 350; // pixels to scroll on each click

    //check if the scroll container is not null

    // Initialize scroll buttons
    scrollContainer.addEventListener('mouseenter', () => {
      leftBtn.style.opacity = "1";
      rightBtn.style.opacity = "1";
    });
    scrollContainer.addEventListener('mouseleave', () => {
      leftBtn.style.opacity = "0";
      rightBtn.style.opacity = "0";
    });
    leftBtn.addEventListener('mouseenter', () => {
      leftBtn.style.opacity = "1";
    });
    rightBtn.addEventListener('mouseenter', () => {
      rightBtn.style.opacity = "1";
    });
    // hovering over the playlist cards show play buttons
    playlistcard.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const playButton = card.querySelector('.play-button');
        const pauseButton = card.querySelector('.pause-button');
        playButton.style.display = "inline";
        pauseButton.style.display = "none";
      });
      card.addEventListener('mouseleave', () => {
        const playButton = card.querySelector('.play-button');
        const pauseButton = card.querySelector('.pause-button');
        playButton.style.display = "none";
        pauseButton.style.display = "none";
      });
    });

    // Scroll left and right functionality
    leftBtn.addEventListener('click', () => {

      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

    });

    rightBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    // State
    let playlistidx = 0;
    let currentSong = 0;

    // Load and display current song
    function loadSong(index=0, playlistIndex = 0) {
      const song = playlistall[playlistIndex][index];
      if (titleEl) titleEl.textContent = song.title; // Update main player title
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

    // Metadata loaded
    audio.addEventListener("loadedmetadata", () => {
      seek.max = Math.floor(audio.duration);
      durationEl.textContent = formatTime(audio.duration);
    });

    // Play
    playBtn.addEventListener("click", () => {
      audio.play();
      playBtn.style.display = "none";
      pauseBtn.style.display = "inline";
      visualizationbars.forEach(bar => {
        bar.style.opacity = 1;
      });
    });

    // Pause
    pauseBtn.addEventListener("click", () => {
      audio.pause();
      pauseBtn.style.display = "none";
      playBtn.style.display = "inline";
      visualizationbars.forEach(bar => {
        bar.style.opacity = 0.1;
      });
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
      playBtn.style.display = "none";
      pauseBtn.style.display = "inline";
    });

    // Prev
    prevBtn.addEventListener("click", () => {
      currentSong = (currentSong - 1 + songs.length) % songs.length;
      loadSong(currentSong);
      audio.play();
      playBtn.style.display = "none";
      pauseBtn.style.display = "inline";
      visualizationbars.forEach(bar => {
        bar.style.opacity = 1;
      });
    });

    // Autoplay next when ended
    audio.addEventListener("ended", () => {
      currentSong = (currentSong + 1) % songs.length;
      loadSong(currentSong);
      audio.play();
      playBtn.style.display = "none";
      pauseBtn.style.display = "inline";
    });

    // Sync card play button with main player
    function updatePlayPauseUI() {
      // Main player buttons
      if (audio.paused) {
        playBtn.style.display = "inline";
        pauseBtn.style.display = "none";
      } else {
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline";
      }
      // Card buttons
      playCardButtons.forEach((btn, idx) => {
        btn.style.display = (idx === currentSong && audio.paused) ? "inline" : "none";
      });
      pauseCardButtons.forEach((btn, idx) => {
        btn.style.display = (idx === currentSong && !audio.paused) ? "inline" : "none";
      });
    }

    playCardButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (currentSong === index) {
          if (audio.paused) {
            audio.play();
            visualizationbars.forEach(bar => {
              bar.style.opacity = 1;
            });
          } else {
            audio.pause();
            visualizationbars.forEach(bar => {
              bar.style.opacity = 0.1;
            });
          }
        } else {
          currentSong = index;
          loadSong(currentSong);
          audio.play();
          visualizationbars.forEach(bar => {
            bar.style.opacity = 1;
          });
        }
        updatePlayPauseUI();
      });
    });

    // Also update UI on main play/pause button clicks and audio events
    playBtn.addEventListener("click", () => {
      audio.play();
      updatePlayPauseUI();
    });

    pauseBtn.addEventListener("click", () => {
      audio.pause();
      updatePlayPauseUI();
    });

    audio.addEventListener("play", updatePlayPauseUI);
    audio.addEventListener("pause", updatePlayPauseUI);
    audio.addEventListener("ended", () => {
      currentSong = (currentSong + 1) % songs.length;
      loadSong(currentSong);
      audio.play();
      updatePlayPauseUI();
    });
    playCardButtons.forEach((btn, btnIdx) => {
      btn.style.display = (btnIdx === currentSong && audio.paused) ? "inline" : "none";
    });
    pauseCardButtons.forEach((btn, btnIdx) => {
      btn.style.display = (btnIdx === currentSong && !audio.paused) ? "inline" : "none";
    });


    // Add an event listener for the search button
    searchbtn.addEventListener('click', () => {
      // focus the search bar when the search button is clicked
      searchInput.focus();
      searchbtn.style.backgroundColor = white; // Change background color on click
    });



    // Add an event listener for the search input

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();

      // Filter the songs that match the query
      const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
      );

      // Loop through all playlist cards and show/hide based on filtered songs
      playlistcard.forEach((card, idx) => {
        const song = songs[idx];
        const shouldShow = filteredSongs.some(filteredSong => filteredSong.title === song.title && filteredSong.artist === song.artist);
        card.style.display = shouldShow ? "block" : "none";
      });
    });

  } catch (err) {
    console.error('Error loading playlists:', err);
  }
}

// Call on load
window.addEventListener('DOMContentLoaded', loadPlaylists);
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
    artist: "Shankar Ahsan Loy",
    file: "Assets/Zinda.mp3",
    image: "Assets/Zinda.png"
  }
];



// Add an event listener for the browse button
browsebtn.addEventListener('click', () => {
  // load the browse html page
  window.location.href = "browse.html"; // Navigate to browse.html

  // Optionally, you can also clear the search input
});

