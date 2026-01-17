/**
 * Sidebar Injector
 * Injects SimGlobe tab into Shopify Admin sidebar navigation
 * Clones exact structure from existing nav items for perfect integration
 */

async function injectSidebar() {
  const { waitForElement, isAlreadyInjected, markAsInjected } = window.SimGlobeDom;

  if (isAlreadyInjected('sidebar')) {
    console.log('SimGlobe: Sidebar already injected');
    return;
  }

  try {
    // Wait for the Shopify sidebar navigation to load
    const navSelectors = [
      'nav[aria-label="Main"] ul',
      'nav ul[role="list"]',
      '[class*="Navigation"] ul',
      'aside nav ul'
    ];

    let navList = null;
    for (const selector of navSelectors) {
      try {
        navList = await waitForElement(selector, 3000);
        if (navList && navList.querySelector('li a')) break;
      } catch (e) {
        continue;
      }
    }

    if (!navList) {
      console.log('SimGlobe: Could not find sidebar navigation');
      return;
    }

    // Find a reference nav item (like Finance or Analytics) to clone structure
    const existingItems = navList.querySelectorAll('li');
    if (existingItems.length === 0) {
      console.log('SimGlobe: No existing nav items found');
      return;
    }

    // Find best template item (one with icon + text, not a section header)
    let templateItem = null;
    for (const item of existingItems) {
      const link = item.querySelector('a');
      const hasIcon = item.querySelector('svg, [class*="Icon"]');
      const text = item.textContent.trim();

      if (link && hasIcon && text.length > 0 && text.length < 30) {
        templateItem = item;
        break;
      }
    }

    if (!templateItem) {
      templateItem = existingItems[0];
    }

    // Clone the entire li structure
    const simglobeItem = templateItem.cloneNode(true);
    markAsInjected(simglobeItem, 'sidebar');

    // Find and update the link
    const link = simglobeItem.querySelector('a');
    if (link) {
      link.href = '#simglobe';
      link.removeAttribute('aria-current');
      link.classList.remove('active', 'selected');

      // Remove any active/selected classes from parent elements
      simglobeItem.classList.remove('active', 'selected');

      // Update the text content (find the text node/span)
      const textElements = link.querySelectorAll('span');
      let textUpdated = false;

      textElements.forEach(span => {
        // Skip icon containers
        if (span.querySelector('svg') || span.classList.toString().toLowerCase().includes('icon')) {
          return;
        }
        // Update text-containing spans
        if (span.textContent.trim() && !textUpdated) {
          span.textContent = 'SimGlobe';
          textUpdated = true;
        }
      });

      // If no span found, try direct text update
      if (!textUpdated) {
        const textNodes = Array.from(link.childNodes).filter(n => n.nodeType === 3);
        textNodes.forEach(node => {
          if (node.textContent.trim()) {
            node.textContent = 'SimGlobe';
            textUpdated = true;
          }
        });
      }

      // Update the icon to a globe
      const iconContainer = link.querySelector('svg, [class*="Icon"]')?.parentElement || link.querySelector('span:first-child');
      if (iconContainer) {
        // Check if it's an SVG directly
        const existingSvg = iconContainer.tagName === 'svg' ? iconContainer : iconContainer.querySelector('svg');
        if (existingSvg) {
          existingSvg.outerHTML = `
            <svg viewBox="0 0 20 20" fill="currentColor" style="width: 20px; height: 20px;">
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm7.92 9H14.1c-.12-2.66-.82-5.05-1.9-6.77A8.02 8.02 0 0117.92 9zm-9.42 0H8.1c.13-2.32.73-4.38 1.68-5.83a.5.5 0 01.44 0c.95 1.45 1.55 3.51 1.68 5.83h-3.4zm-2.4 0H2.08A8.02 8.02 0 017.8 2.23C6.72 3.95 6.02 6.34 5.9 9h.1zm-.1 2H2.08A8.02 8.02 0 007.8 17.77C6.72 16.05 6.02 13.66 5.9 11zm2.6 0h3.4c-.13 2.32-.73 4.38-1.68 5.83a.5.5 0 01-.44 0C9.23 15.38 8.63 13.32 8.5 11zm5.5 0h3.92a8.02 8.02 0 01-5.72 6.77c1.08-1.72 1.78-4.11 1.9-6.77h-.1z"/>
            </svg>
          `;
        }
      }

      // Add badge for risk count
      let badge = link.querySelector('.simglobe-nav-badge, [class*="badge"], [class*="Badge"]');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'simglobe-nav-badge';
        badge.style.cssText = `
          display: none;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          margin-left: auto;
          background: #36a69a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          border-radius: 9px;
          line-height: 1;
        `;
        link.appendChild(badge);
      } else {
        badge.className = 'simglobe-nav-badge';
        badge.style.display = 'none';
      }

      // Click handler
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSimGlobePanel();
      });
    }

    // Find position to insert (after Finance, before Analytics/Settings)
    let insertPosition = null;
    let insertBefore = true;

    existingItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes('finance')) {
        insertPosition = item;
        insertBefore = false; // Insert after Finance
      } else if (!insertPosition && (text.includes('analytics') || text.includes('settings'))) {
        insertPosition = item;
        insertBefore = true; // Insert before Analytics/Settings
      }
    });

    // Insert the nav item
    if (insertPosition) {
      if (insertBefore) {
        insertPosition.parentNode.insertBefore(simglobeItem, insertPosition);
      } else {
        insertPosition.parentNode.insertBefore(simglobeItem, insertPosition.nextSibling);
      }
    } else {
      navList.appendChild(simglobeItem);
    }

    // Update badge with risk count
    updateSidebarBadge();

    console.log('SimGlobe: Sidebar injected successfully');

  } catch (error) {
    console.error('SimGlobe: Error injecting sidebar:', error);
  }
}

async function updateSidebarBadge() {
  try {
    const data = await window.SimGlobeApi.getRisks();
    const badge = document.querySelector('.simglobe-nav-badge');

    if (badge && data.markets && data.markets.length > 0) {
      const highRiskCount = data.markets.filter(m =>
        parseFloat(m.probability) >= 0.6
      ).length;

      if (highRiskCount > 0) {
        badge.textContent = highRiskCount;
        badge.style.display = 'inline-flex';
      }
    }
  } catch (error) {
    console.error('SimGlobe: Error updating sidebar badge:', error);
  }
}

function toggleSimGlobePanel() {
  let panel = document.querySelector('[data-simglobe="panel"]');

  if (panel) {
    const isVisible = panel.classList.contains('simglobe-panel--visible');
    if (isVisible) {
      panel.classList.remove('simglobe-panel--visible');
    } else {
      panel.classList.add('simglobe-panel--visible');
    }
    return;
  }

  // Create the panel
  panel = document.createElement('div');
  panel.className = 'simglobe-panel simglobe-panel--visible';
  panel.dataset.simglobe = 'panel';

  panel.innerHTML = `
    <div class="simglobe-panel-content">
      <div class="simglobe-loading">
        <div class="simglobe-spinner"></div>
        <p>Loading market data...</p>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  // Load content
  loadPanelContent(panel.querySelector('.simglobe-panel-content'));

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !e.target.closest('[data-simglobe="sidebar"]')) {
      panel.classList.remove('simglobe-panel--visible');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      panel.classList.remove('simglobe-panel--visible');
    }
  });
}

async function loadPanelContent(contentContainer) {
  try {
    const [risks, voiceBrief] = await Promise.all([
      window.SimGlobeApi.getRisks(),
      window.SimGlobeApi.getVoiceBrief()
    ]);

    contentContainer.innerHTML = '';

    // Voice briefing / Transcript section
    if (voiceBrief && voiceBrief.transcript) {
      const voiceSection = document.createElement('div');
      voiceSection.className = 'simglobe-panel-section';

      voiceSection.innerHTML = `
        <details class="voice-transcript">
          <summary>View Transcript</summary>
          <p>${voiceBrief.transcript}</p>
        </details>
      `;

      contentContainer.appendChild(voiceSection);
    }

    // Risk list section
    if (risks && risks.markets && risks.markets.length > 0) {
      const riskSection = document.createElement('div');
      riskSection.className = 'simglobe-panel-section';

      const sectionTitle = document.createElement('h3');
      sectionTitle.textContent = 'ACTIVE MARKET RISKS';
      riskSection.appendChild(sectionTitle);

      const riskList = document.createElement('div');
      riskList.className = 'risk-list';

      risks.markets.forEach(market => {
        const card = createRiskCard(market);
        riskList.appendChild(card);
      });

      riskSection.appendChild(riskList);
      contentContainer.appendChild(riskSection);
    }

    // Hedge action button (sticky at bottom)
    const hedgeSection = document.createElement('div');
    hedgeSection.className = 'simglobe-panel-actions';

    const hedgeBtn = document.createElement('button');
    hedgeBtn.className = 'simglobe-btn simglobe-btn--primary';
    hedgeBtn.textContent = 'Hedge Portfolio Risk';
    hedgeBtn.addEventListener('click', () => {
      const { showHedgeModal } = window.SimGlobeComponents;
      showHedgeModal({
        market: 'Portfolio Hedge',
        marketId: 'portfolio',
        amount: 1000,
        probability: 0.65
      });
    });

    hedgeSection.appendChild(hedgeBtn);
    contentContainer.parentElement.appendChild(hedgeSection);

  } catch (error) {
    contentContainer.innerHTML = `
      <div class="simglobe-error">
        <p>Unable to load market data</p>
        <p class="simglobe-error-detail">${error.message}</p>
        <button class="simglobe-btn simglobe-btn--secondary" onclick="loadPanelContent(this.closest('.simglobe-panel-content'))">
          Retry
        </button>
      </div>
    `;
  }
}

function createRiskCard(market) {
  const prob = parseFloat(market.probability);
  const probPercent = Math.round(prob * 100);

  // Determine probability class
  let probClass = 'risk-badge--low';
  if (probPercent >= 70) probClass = 'risk-badge--high';
  else if (probPercent >= 40) probClass = 'risk-badge--medium';

  // Determine impact class
  let impactClass = 'impact--low';
  if (market.impact === 'high') impactClass = 'impact--high';
  else if (market.impact === 'medium') impactClass = 'impact--medium';

  const card = document.createElement('div');
  card.className = 'market-risk-card';
  card.dataset.marketId = market.id;

  card.innerHTML = `
    <div class="risk-card-header">
      <span class="risk-badge ${probClass}">${probPercent}%</span>
      <span class="risk-card-title">${market.title}</span>
    </div>
    <div class="risk-card-details">
      <span class="impact-badge ${impactClass}">${market.impact} Impact</span>
      <span class="risk-card-category">${market.category}</span>
      <span class="risk-card-volume">${formatVolume(market.volume)} volume</span>
    </div>
  `;

  card.addEventListener('click', () => {
    const { showHedgeModal } = window.SimGlobeComponents;
    showHedgeModal({
      market: market.title,
      marketId: market.id,
      amount: calculateHedgeAmount(market),
      probability: prob
    });
  });

  return card;
}

function formatVolume(volume) {
  const num = parseFloat(volume);
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return '$' + (num / 1000).toFixed(0) + 'K';
  return '$' + num;
}

function calculateHedgeAmount(risk) {
  const prob = parseFloat(risk.probability);
  const baseAmount = 1000;
  if (risk.impact === 'high') return Math.round(baseAmount * prob * 2);
  if (risk.impact === 'medium') return Math.round(baseAmount * prob * 1.5);
  return Math.round(baseAmount * prob);
}

// Make available globally
window.SimGlobeInjectors = window.SimGlobeInjectors || {};
window.SimGlobeInjectors.injectSidebar = injectSidebar;
