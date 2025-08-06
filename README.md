# Full Spotify Clone Using HTML, CSS, and JavaScript

A sleek, responsive Spotify-inspired music player web app built with HTML, CSS, and vanilla JavaScript. Users can browse playlists, play/pause tracks, and control playback with an interactive player bar. The design closely mimics Spotify's modern UI, and the codebase is clean, modular, and easy to extend.

---

## Features

- **Modern Spotify-like UI:** 
  - Custom navigation bar, sidebar, and footer.
  - Responsive grid and card layout for playlists and browsing.
  - Stylish player bar with real-time controls and audio visualizer.

- **Playlist Browsing:**
  - Browse through multiple playlists and genres.
  - Individual playlist pages with song lists.
  - Playlist covers and smooth scrolling for easy navigation.

- **Playback Controls:**
  - Fixed player bar at the bottom with play, pause, next, previous, and seek controls.
  - Volume control and animated audio visualizer.
  - Responsive controls for mobile and desktop.

- **Responsive Design:**
  - Fully responsive using CSS media queries.
  - Touch-friendly controls for mobile devices.

- **Vanilla JavaScript:**
  - No frameworks or build tools required.
  - Easy to understand and customize.

---

## Folder Structure

```
/
├── Assets/                 # Playlist cover images and other assets
├── css/                    # CSS files (layout, navbar, playlist, browse, footer, etc.)
├── html/                   # HTML files for pages and components
├── javascript/             # JavaScript logic for player, playlist, and UI
├── music/                  # Audio files (songs)
├── svg/                    # SVG icons and graphics
└── README.md               # Project documentation
```

---

## How It Works

- **HTML:** Provides page structure, playlist and song markup, navigation, and containers for dynamic content.
- **CSS:** 
  - `playlist.css`, `PlaylistIndi.css` - Styles playlists and the main content area, including responsive grid layouts and interactive cards.
  - `navbar.css` - Styles the navigation bar and search input.
  - `browse.css` - Styles for the genre/playlist browse page.
  - `footer.css` - Footer layout and social links.
- **JavaScript:** Handles playlist loading, song playback, player bar controls, and UI interactions (not attached in this context but expected in `/javascript`).
- **Assets:** Images for playlist covers, SVGs for icons, and music files for playback.

---

## Responsive Design

- Uses CSS media queries to adapt layout and font sizes for tablets and mobile devices.
- Navigation, player bar, and playlists all adapt for smaller screens.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lokesh-102214/Full-Spotify-Clone-Using-HTML-CSS-And-JAVASCRIPT.git
   ```
2. **Open the main HTML file:**  
   Open `html/index.html` (or the main entry point) in your web browser.

3. **Add your own music and covers:**  
   Place `.mp3` files in the `music/` folder and playlist images in `Assets/`. Update the HTML/JS to reference your files.

4. **Enjoy!**

---

## Customization

- **Add more playlists:**  
  Duplicate playlist cards in HTML and update their images and song lists.

- **Change theme colors:**  
  Edit the CSS color variables and gradients in `/css` files.

- **Expand with new features:**  
  Add shuffle, repeat, queue, user authentication, or connect to a backend for real data.

---

## Credits

- UI inspired by [Spotify](https://spotify.com/)
- Built by [Lokesh-102214](https://github.com/Lokesh-102214)
- Icons from [SVGRepo](https://www.svgrepo.com/) and similar sources

---

## License

This project is for educational and personal use.  
Not affiliated with or endorsed by Spotify.

---
