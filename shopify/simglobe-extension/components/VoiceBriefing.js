/**
 * VoiceBriefing Component
 * Audio player with transcript for market briefings
 */

function createVoiceBriefing(audioUrl, transcript) {
  const container = document.createElement('div');
  container.className = 'voice-briefing';

  // Audio player section
  const playerSection = document.createElement('div');
  playerSection.className = 'voice-briefing-player';

  const playButton = document.createElement('button');
  playButton.className = 'voice-play-btn';
  playButton.innerHTML = `
    <svg class="play-icon" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M8 5v14l11-7z"/>
    </svg>
    <svg class="pause-icon" viewBox="0 0 24 24" width="24" height="24" style="display: none;">
      <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  `;

  const audio = document.createElement('audio');
  audio.src = audioUrl;
  audio.preload = 'metadata';

  const progressContainer = document.createElement('div');
  progressContainer.className = 'voice-progress-container';

  const progressBar = document.createElement('div');
  progressBar.className = 'voice-progress-bar';

  const progressFill = document.createElement('div');
  progressFill.className = 'voice-progress-fill';

  const timeDisplay = document.createElement('span');
  timeDisplay.className = 'voice-time';
  timeDisplay.textContent = '0:00 / 0:00';

  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressBar);
  progressContainer.appendChild(timeDisplay);

  playerSection.appendChild(playButton);
  playerSection.appendChild(progressContainer);

  // Transcript section
  const transcriptSection = document.createElement('details');
  transcriptSection.className = 'voice-transcript';

  const summary = document.createElement('summary');
  summary.textContent = 'View Transcript';

  const transcriptText = document.createElement('p');
  transcriptText.textContent = transcript;

  transcriptSection.appendChild(summary);
  transcriptSection.appendChild(transcriptText);

  container.appendChild(playerSection);
  container.appendChild(audio);
  container.appendChild(transcriptSection);

  // Event handlers
  let isPlaying = false;

  playButton.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playButton.querySelector('.play-icon').style.display = 'block';
      playButton.querySelector('.pause-icon').style.display = 'none';
    } else {
      audio.play();
      playButton.querySelector('.play-icon').style.display = 'none';
      playButton.querySelector('.pause-icon').style.display = 'block';
    }
    isPlaying = !isPlaying;
  });

  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    playButton.querySelector('.play-icon').style.display = 'block';
    playButton.querySelector('.pause-icon').style.display = 'none';
    progressFill.style.width = '0%';
  });

  audio.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });

  // Click on progress bar to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * audio.duration;
  });

  return container;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Make available globally
window.PredictifyComponents = window.PredictifyComponents || {};
window.PredictifyComponents.createVoiceBriefing = createVoiceBriefing;
