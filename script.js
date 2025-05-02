const audio = new Audio();
const playPauseBtn = document.querySelector('.play-pause');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeElem = document.querySelector('.current-time');
const totalTimeElem = document.querySelector('.total-time');
const volumeBtn = document.querySelector('.volume-btn');
const volumeSlider = document.querySelector('.volume-slider');
const volumeTrack = document.querySelector('.volume-track');
const volumeFill = document.querySelector('.volume-fill');
const volumeHandle = document.querySelector('.volume-handle');
const favoriteBtn = document.querySelector('.favorite');
const skipBackBtn = document.querySelector('.skip-back');
const skipForwardBtn = document.querySelector('.skip-forward');

let isPlaying = false;
let isVolumeOpen = false;
let volumeBeforeMute = 1;
let isDragging = false;

// Song list (replace with actual song data)
const songs = [
  { title: "Smash SUBSCRIBE", artist: "BintScripts", src: "assets/song.mp3" },
  { title: "Like the Video", artist: "BintScripts", src: "assets/Phonk.mp3" },
  // Add more songs here
];

let currentSongIndex = 0;

function loadSong(song) {
  audio.src = song.src;
  document.querySelector('.title').textContent = song.title;
  document.querySelector('.artist').textContent = song.artist;
  audio.load();
}

loadSong(songs[currentSongIndex]);

function togglePlayback() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.innerHTML = `<svg class="play-icon" viewBox="0 0 24 24" width="32" height="32"><path d="M8 5v14l11-7z"/></svg>`;
  } else {
    audio.play();
    playPauseBtn.innerHTML = `<svg class="play-icon" viewBox="0 0 24 24" width="32" height="32"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>`;
  }
  isPlaying = !isPlaying;
}

function updateProgress() {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeElem.textContent = formatTime(audio.currentTime);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
}

function updateVolume(e) {
  const rect = volumeTrack.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let volume = Math.max(Math.min(x / rect.width, 1), 0);
  audio.volume = volume;
  volumeFill.style.width = `${volume * 100}%`;
  volumeHandle.style.left = `${volume * 100}%`;

  const svg = volumeBtn.querySelector('svg');
  if (volume === 0) {
    svg.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
  } else {
    svg.innerHTML = `<path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-4 0l-4.26 4.26.05.05c-1.13.92-1.84 2.27-1.84 3.79 0 1.52.71 2.87 1.84 3.79l-.05.05 4.26 4.26v-16.2z"/>`;
  }
}

function toggleVolumeSlider() {
  isVolumeOpen = !isVolumeOpen;
  volumeSlider.classList.toggle('active');
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function skipSong(direction) {
  currentSongIndex += direction;
  if (currentSongIndex < 0) currentSongIndex = songs.length - 1;
  if (currentSongIndex >= songs.length) currentSongIndex = 0;
  loadSong(songs[currentSongIndex]);
  audio.play();
  isPlaying = true;
  playPauseBtn.innerHTML = `<svg class="play-icon" viewBox="0 0 24 24" width="32" height="32"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>`;
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlayback);
progressBar.addEventListener('click', setProgress);
volumeBtn.addEventListener('click', toggleVolumeSlider);
volumeTrack.addEventListener('click', updateVolume);
favoriteBtn.addEventListener('click', () => favoriteBtn.classList.toggle('active'));
skipBackBtn.addEventListener('click', () => skipSong(-1));
skipForwardBtn.addEventListener('click', () => skipSong(1));

// Drag Support for Volume
volumeTrack.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('mousemove', (e) => {
  if (isDragging) updateVolume(e);
});

// Initialize
audio.volume = 0.7;
volumeFill.style.width = '70%';
volumeHandle.style.left = '70%';

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', () => {
  totalTimeElem.textContent = formatTime(audio.duration);
});
window.addEventListener('resize', checkTitleOverflow);