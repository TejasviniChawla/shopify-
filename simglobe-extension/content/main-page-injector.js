/**
 * Main Page Injector
 * Injects SimGlobe content into the main content area (like Markets page)
 * Replaces the right sidebar with a centered full-page view
 */

async function showSimGlobeMainPage() {
  const { waitForElement, markAsInjected } = window.SimGlobeDom;

  try {
    // Find the main content area (where Shopify pages render their content)
    const mainContentSelectors = [
      'main[id="AppFrameMain"]',
      'main[role="main"]',
      '.Polaris-Frame__Main',
      'main',
      '#AppFrameMain'
    ];

    let mainContent = null;
    for (const selector of mainContentSelectors) {
      mainContent = document.querySelector(selector);
      if (mainContent) break;
    }

    if (!mainContent) {
      console.error('SimGlobe: Could not find main content area');
      return;
    }

    // Check if SimGlobe page is already showing
    let simglobePage = document.querySelector('[data-simglobe="main-page"]');
    
    if (simglobePage) {
      // Already exists, just make sure it's visible
      simglobePage.style.display = 'block';
      hideOriginalContent(mainContent);
      return;
    }

    // Store reference to original content
    hideOriginalContent(mainContent);

    // Create the SimGlobe main page
    simglobePage = createSimGlobeMainPage();
    markAsInjected(simglobePage, 'main-page');

    // Insert at the beginning of main content
    mainContent.insertBefore(simglobePage, mainContent.firstChild);

    // Load data
    await loadMainPageContent(simglobePage);

    console.log('SimGlobe: Main page injected successfully');

  } catch (error) {
    console.error('SimGlobe: Error showing main page:', error);
  }
}

function hideOriginalContent(mainContent) {
  // Hide other direct children except our SimGlobe page
  Array.from(mainContent.children).forEach(child => {
    if (!child.hasAttribute('data-simglobe')) {
      child.dataset.simglobeHidden = 'true';
      child.style.display = 'none';
    }
  });
}

function showOriginalContent(mainContent) {
  // Restore hidden content
  Array.from(mainContent.children).forEach(child => {
    if (child.dataset.simglobeHidden === 'true') {
      child.style.display = '';
      delete child.dataset.simglobeHidden;
    }
  });

  // Hide SimGlobe page
  const simglobePage = document.querySelector('[data-simglobe="main-page"]');
  if (simglobePage) {
    simglobePage.style.display = 'none';
  }
}

function createSimGlobeMainPage() {
  const page = document.createElement('div');
  page.className = 'simglobe-main-page';

  page.innerHTML = `
    <div class="simglobe-page-container">
      <!-- Page Header (matches Shopify's Markets page header) -->
      <div class="simglobe-page-header">
        <div class="simglobe-page-header-row">
          <div class="simglobe-page-title-section">
            <span class="simglobe-page-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm7.92 9H14.1c-.12-2.66-.82-5.05-1.9-6.77A8.02 8.02 0 0117.92 9zm-9.42 0H8.1c.13-2.32.73-4.38 1.68-5.83a.5.5 0 01.44 0c.95 1.45 1.55 3.51 1.68 5.83h-3.4zm-2.4 0H2.08A8.02 8.02 0 017.8 2.23C6.72 3.95 6.02 6.34 5.9 9h.1zm-.1 2H2.08A8.02 8.02 0 007.8 17.77C6.72 16.05 6.02 13.66 5.9 11zm2.6 0h3.4c-.13 2.32-.73 4.38-1.68 5.83a.5.5 0 01-.44 0C9.23 15.38 8.63 13.32 8.5 11zm5.5 0h3.92a8.02 8.02 0 01-5.72 6.77c1.08-1.72 1.78-4.11 1.9-6.77h-.1z"/>
              </svg>
            </span>
            <h1 class="simglobe-page-title">SimGlobe</h1>
          </div>
          <div class="simglobe-page-actions">
            <button class="simglobe-btn simglobe-btn--primary simglobe-hedge-all-btn">
              Hedge Portfolio Risk
            </button>
          </div>
        </div>
      </div>

      <!-- Search/Filter Bar (matches Markets page) -->
      <div class="simglobe-search-bar">
        <div class="simglobe-search-input-wrapper">
          <svg class="simglobe-search-icon" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input type="text" class="simglobe-search-input" placeholder="Search market risks">
        </div>
        <div class="simglobe-filter-actions">
          <button class="simglobe-btn simglobe-btn--secondary simglobe-refresh-btn" title="Refresh data">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Voice Briefing Section -->
      <div class="simglobe-voice-section">
        <div class="simglobe-voice-card">
          <!-- Audio Player Row -->
          <div class="simglobe-audio-row">
            <button class="simglobe-audio-play-btn" title="Play morning briefing">
              <svg class="simglobe-play-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg class="simglobe-pause-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="display: none;">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </button>
            <div class="simglobe-audio-info">
              <span class="simglobe-audio-title">Morning Market Briefing</span>
              <span class="simglobe-audio-duration">Today's risk analysis</span>
            </div>
            <div class="simglobe-audio-progress">
              <div class="simglobe-audio-progress-bar">
                <div class="simglobe-audio-progress-fill"></div>
              </div>
              <span class="simglobe-audio-time">0:00</span>
            </div>
          </div>
          
          <!-- Actions Row -->
          <div class="simglobe-briefing-actions">
            <button class="simglobe-transcript-btn">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h3v2H7v-2z" clip-rule="evenodd"/>
              </svg>
              View Transcript
            </button>
            <button class="simglobe-email-subscribe-btn">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              Get Daily Briefings
            </button>
          </div>
          
          <!-- Transcript (hidden by default) -->
          <div class="simglobe-transcript-panel" style="display: none;">
            <div class="simglobe-transcript-header">
              <span>Transcript</span>
              <button class="simglobe-transcript-close">×</button>
            </div>
            <div class="simglobe-transcript-text"></div>
          </div>
          
          <!-- Email Subscribe Modal (hidden by default) -->
          <div class="simglobe-email-panel" style="display: none;">
            <div class="simglobe-email-header">
              <span>📬 Daily Market Briefings</span>
              <button class="simglobe-email-close">×</button>
            </div>
            <p class="simglobe-email-desc">Get AI-powered market risk analysis delivered to your inbox every morning at 8 AM.</p>
            <div class="simglobe-email-form">
              <input type="email" class="simglobe-email-input" placeholder="Enter your email">
              <button class="simglobe-btn simglobe-btn--primary simglobe-email-submit">Subscribe</button>
            </div>
            <p class="simglobe-email-note">Unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
        
        <!-- Hidden audio element -->
        <audio class="simglobe-audio-element" preload="metadata"></audio>
      </div>

      <!-- Market Risks Table (matches Markets page layout) -->
      <div class="simglobe-risks-container">
        <div class="simglobe-table-wrapper">
          <!-- Table Header -->
          <div class="simglobe-table-header">
            <div class="simglobe-table-col simglobe-col-probability">Probability</div>
            <div class="simglobe-table-col simglobe-col-market">Market Risk</div>
            <div class="simglobe-table-col simglobe-col-impact">Impact</div>
            <div class="simglobe-table-col simglobe-col-category">Category</div>
            <div class="simglobe-table-col simglobe-col-volume">Volume</div>
          </div>
          
          <!-- Table Body -->
          <div class="simglobe-table-body">
            <div class="simglobe-loading">
              <div class="simglobe-spinner"></div>
              <p>Loading market risks...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Link -->
      <div class="simglobe-page-footer">
        <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" class="simglobe-learn-more">
          Learn more about prediction markets
        </a>
      </div>
    </div>
  `;

  // Event handlers
  setupMainPageEvents(page);

  return page;
}

function setupMainPageEvents(page) {
  // Hedge All button
  const hedgeAllBtn = page.querySelector('.simglobe-hedge-all-btn');
  hedgeAllBtn.addEventListener('click', () => {
    const { showHedgeModal } = window.SimGlobeComponents;
    showHedgeModal({
      market: 'Portfolio Hedge',
      marketId: 'portfolio',
      amount: 1000,
      probability: 0.65
    });
  });

  // Refresh button
  const refreshBtn = page.querySelector('.simglobe-refresh-btn');
  refreshBtn.addEventListener('click', async () => {
    await window.SimGlobeApi.clearCache();
    const tableBody = page.querySelector('.simglobe-table-body');
    tableBody.innerHTML = `
      <div class="simglobe-loading">
        <div class="simglobe-spinner"></div>
        <p>Refreshing market data...</p>
      </div>
    `;
    await loadMainPageContent(page);
  });

  // Search functionality
  const searchInput = page.querySelector('.simglobe-search-input');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = page.querySelectorAll('.simglobe-table-row');
    
    rows.forEach(row => {
      const title = row.querySelector('.simglobe-market-title')?.textContent.toLowerCase() || '';
      const category = row.querySelector('.simglobe-category-badge')?.textContent.toLowerCase() || '';
      
      if (title.includes(searchTerm) || category.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // Audio Player Setup
  setupAudioPlayer(page);

  // Transcript toggle
  const transcriptBtn = page.querySelector('.simglobe-transcript-btn');
  const transcriptPanel = page.querySelector('.simglobe-transcript-panel');
  const transcriptClose = page.querySelector('.simglobe-transcript-close');
  
  transcriptBtn.addEventListener('click', () => {
    const isVisible = transcriptPanel.style.display !== 'none';
    transcriptPanel.style.display = isVisible ? 'none' : 'block';
    // Hide email panel if open
    page.querySelector('.simglobe-email-panel').style.display = 'none';
  });
  
  transcriptClose.addEventListener('click', () => {
    transcriptPanel.style.display = 'none';
  });

  // Email subscription toggle
  const emailBtn = page.querySelector('.simglobe-email-subscribe-btn');
  const emailPanel = page.querySelector('.simglobe-email-panel');
  const emailClose = page.querySelector('.simglobe-email-close');
  const emailSubmit = page.querySelector('.simglobe-email-submit');
  const emailInput = page.querySelector('.simglobe-email-input');
  
  emailBtn.addEventListener('click', () => {
    const isVisible = emailPanel.style.display !== 'none';
    emailPanel.style.display = isVisible ? 'none' : 'block';
    // Hide transcript panel if open
    transcriptPanel.style.display = 'none';
    if (!isVisible) {
      emailInput.focus();
    }
  });
  
  emailClose.addEventListener('click', () => {
    emailPanel.style.display = 'none';
  });

  emailSubmit.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (email && email.includes('@')) {
      // Show success state
      emailPanel.innerHTML = `
        <div class="simglobe-email-success">
          <svg viewBox="0 0 20 20" width="32" height="32" fill="#1a6b4a">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <h4>You're subscribed!</h4>
          <p>Daily briefings will be sent to <strong>${email}</strong> every morning at 8 AM.</p>
        </div>
      `;
    } else {
      emailInput.style.borderColor = '#c4321a';
      emailInput.placeholder = 'Please enter a valid email';
    }
  });

  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      emailSubmit.click();
    }
  });
}

function setupAudioPlayer(page) {
  const audioElement = page.querySelector('.simglobe-audio-element');
  const playBtn = page.querySelector('.simglobe-audio-play-btn');
  const playIcon = page.querySelector('.simglobe-play-icon');
  const pauseIcon = page.querySelector('.simglobe-pause-icon');
  const progressFill = page.querySelector('.simglobe-audio-progress-fill');
  const timeDisplay = page.querySelector('.simglobe-audio-time');
  const progressBar = page.querySelector('.simglobe-audio-progress-bar');

  // Set audio source to the bundled MP3
  const audioUrl = chrome.runtime.getURL('assets/morning-briefing.mp3');
  audioElement.src = audioUrl;

  // Play/Pause toggle
  playBtn.addEventListener('click', () => {
    if (audioElement.paused) {
      audioElement.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      playBtn.classList.add('playing');
    } else {
      audioElement.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      playBtn.classList.remove('playing');
    }
  });

  // Update progress bar
  audioElement.addEventListener('timeupdate', () => {
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    progressFill.style.width = `${progress}%`;
    timeDisplay.textContent = formatTime(audioElement.currentTime);
  });

  // Click on progress bar to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioElement.currentTime = percentage * audioElement.duration;
  });

  // When audio ends
  audioElement.addEventListener('ended', () => {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playBtn.classList.remove('playing');
    progressFill.style.width = '0%';
    timeDisplay.textContent = '0:00';
  });

  // Update duration when loaded
  audioElement.addEventListener('loadedmetadata', () => {
    const durationSpan = page.querySelector('.simglobe-audio-duration');
    durationSpan.textContent = `${formatTime(audioElement.duration)} • Today's risk analysis`;
  });
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function loadMainPageContent(page) {
  const tableBody = page.querySelector('.simglobe-table-body');
  const transcriptText = page.querySelector('.simglobe-transcript-text');

  try {
    const [risks, voiceBrief] = await Promise.all([
      window.SimGlobeApi.getRisks(),
      window.SimGlobeApi.getVoiceBrief()
    ]);

    // Populate transcript panel with briefing text
    if (voiceBrief && voiceBrief.transcript) {
      transcriptText.textContent = voiceBrief.transcript;
    } else {
      // Default transcript if API doesn't return one
      transcriptText.textContent = "Good morning! Here's your daily market risk briefing. We're tracking several key prediction markets that could impact your e-commerce operations. The most significant risk is a potential port strike at LA/Long Beach with a 78% probability, which could cause major shipping delays. US inflation indicators show a 45% chance of exceeding 4% this month. We recommend considering hedge positions on high-impact risks to protect your supply chain.";
    }

    // Market risks table
    if (risks && risks.markets && risks.markets.length > 0) {
      tableBody.innerHTML = '';

      risks.markets.forEach(market => {
        const row = createMarketRiskRow(market);
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = `
        <div class="simglobe-empty-state">
          <svg viewBox="0 0 20 20" fill="currentColor" width="40" height="40" class="simglobe-empty-icon">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <h3>No active market risks</h3>
          <p>When prediction markets indicate potential supply chain or economic risks, they'll appear here.</p>
        </div>
      `;
    }

  } catch (error) {
    tableBody.innerHTML = `
      <div class="simglobe-error-state">
        <svg viewBox="0 0 20 20" fill="currentColor" width="40" height="40" class="simglobe-error-icon">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <h3>Unable to load market data</h3>
        <p>${error.message}</p>
        <p class="simglobe-error-hint">Make sure the SimGlobe backend is running on localhost:3000</p>
        <button class="simglobe-btn simglobe-btn--secondary simglobe-retry-btn">
          Retry
        </button>
      </div>
    `;

    const retryBtn = tableBody.querySelector('.simglobe-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => loadMainPageContent(page));
    }
  }
}

function createMarketRiskRow(market) {
  const prob = parseFloat(market.probability);
  const probPercent = Math.round(prob * 100);

  // Determine probability class
  let probClass = 'simglobe-prob--low';
  if (probPercent >= 70) probClass = 'simglobe-prob--high';
  else if (probPercent >= 40) probClass = 'simglobe-prob--medium';

  // Determine impact class
  let impactClass = 'simglobe-impact--low';
  let impactLabel = 'Low Impact';
  if (market.impact === 'high') {
    impactClass = 'simglobe-impact--high';
    impactLabel = 'High Impact';
  } else if (market.impact === 'medium') {
    impactClass = 'simglobe-impact--medium';
    impactLabel = 'Medium Impact';
  }

  const row = document.createElement('div');
  row.className = 'simglobe-table-row';
  row.dataset.marketId = market.id;

  row.innerHTML = `
    <div class="simglobe-table-col simglobe-col-probability">
      <span class="simglobe-prob-badge ${probClass}">${probPercent}%</span>
    </div>
    <div class="simglobe-table-col simglobe-col-market">
      <span class="simglobe-market-title">${market.title}</span>
    </div>
    <div class="simglobe-table-col simglobe-col-impact">
      <span class="simglobe-impact-badge ${impactClass}">${impactLabel}</span>
    </div>
    <div class="simglobe-table-col simglobe-col-category">
      <span class="simglobe-category-badge">${market.category}</span>
    </div>
    <div class="simglobe-table-col simglobe-col-volume">
      <span class="simglobe-volume">${formatVolume(market.volume)}</span>
    </div>
  `;

  // Click handler to show hedge modal
  row.addEventListener('click', () => {
    const { showHedgeModal } = window.SimGlobeComponents;
    showHedgeModal({
      market: market.title,
      marketId: market.id,
      amount: calculateHedgeAmount(market),
      probability: prob
    });
  });

  return row;
}

function formatVolume(volume) {
  const num = parseFloat(volume);
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M volume';
  if (num >= 1000) return '$' + (num / 1000).toFixed(0) + 'K volume';
  return '$' + num + ' volume';
}

function calculateHedgeAmount(risk) {
  const prob = parseFloat(risk.probability);
  const baseAmount = 1000;
  if (risk.impact === 'high') return Math.round(baseAmount * prob * 2);
  if (risk.impact === 'medium') return Math.round(baseAmount * prob * 1.5);
  return Math.round(baseAmount * prob);
}

function closeSimGlobeMainPage() {
  const mainContent = document.querySelector('main[id="AppFrameMain"], main[role="main"], .Polaris-Frame__Main, main');
  if (mainContent) {
    showOriginalContent(mainContent);
  }
}

// Make available globally
window.SimGlobeInjectors = window.SimGlobeInjectors || {};
window.SimGlobeInjectors.showSimGlobeMainPage = showSimGlobeMainPage;
window.SimGlobeInjectors.closeSimGlobeMainPage = closeSimGlobeMainPage;

