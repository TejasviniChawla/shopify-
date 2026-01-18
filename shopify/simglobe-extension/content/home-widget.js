/**
 * Home Widget Injector
 * Injects voice briefing widget on Shopify Admin Home dashboard
 */

async function injectHomeWidget() {
  const { waitForElement, isAlreadyInjected, markAsInjected, createElement } = window.PredictifyDom;

  if (isAlreadyInjected('home-widget')) {
    console.log('Predictify: Home widget already injected');
    return;
  }

  try {
    // Wait for the dashboard content to load
    // Shopify Home page has various card sections
    const containerSelectors = [
      '[data-testid="home-page"]',
      '.Polaris-Page__Content',
      'main [role="main"]',
      '.home-index',
      'main'
    ];

    let container = null;
    for (const selector of containerSelectors) {
      try {
        container = await waitForElement(selector, 3000);
        if (container) break;
      } catch (e) {
        continue;
      }
    }

    if (!container) {
      console.log('Predictify: Could not find home page container');
      return;
    }

    // Find the first card/section to insert after
    const firstCard = container.querySelector('.Polaris-Card, .Polaris-LegacyCard, [class*="Card"], section');

    // Create the widget
    const widget = createHomeWidget();
    markAsInjected(widget, 'home-widget');

    // Insert after first card or at the beginning
    if (firstCard && firstCard.parentNode) {
      firstCard.parentNode.insertBefore(widget, firstCard.nextSibling);
    } else {
      container.insertBefore(widget, container.firstChild);
    }

    // Load data into widget
    loadHomeWidgetData(widget);

    console.log('Predictify: Home widget injected successfully');

  } catch (error) {
    console.error('Predictify: Error injecting home widget:', error);
  }
}

function createHomeWidget() {
  const widget = document.createElement('div');
  widget.className = 'simglobe-home-widget';

  widget.innerHTML = `
    <div class="simglobe-card">
      <div class="simglobe-card-header">
        <div class="simglobe-card-title">
          <span class="simglobe-card-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          <h2>Predictify Market Brief</h2>
        </div>
        <button class="simglobe-refresh-btn" title="Refresh data">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
      </div>
      <div class="simglobe-card-content">
        <div class="simglobe-loading">
          <div class="simglobe-spinner"></div>
          <p>Loading market intelligence...</p>
        </div>
      </div>
    </div>
  `;

  // Refresh button handler
  widget.querySelector('.simglobe-refresh-btn').addEventListener('click', async () => {
    await window.PredictifyApi.clearCache();
    const content = widget.querySelector('.simglobe-card-content');
    content.innerHTML = `
      <div class="simglobe-loading">
        <div class="simglobe-spinner"></div>
        <p>Refreshing market data...</p>
      </div>
    `;
    loadHomeWidgetData(widget);
  });

  return widget;
}

async function loadHomeWidgetData(widget) {
  const content = widget.querySelector('.simglobe-card-content');

  try {
    const [voiceBrief, risks] = await Promise.all([
      window.PredictifyApi.getVoiceBrief(),
      window.PredictifyApi.getRisks()
    ]);

    content.innerHTML = '';

    // Voice briefing player
    if (voiceBrief && voiceBrief.audioUrl) {
      const { createVoiceBriefing } = window.PredictifyComponents;
      const voicePlayer = createVoiceBriefing(voiceBrief.audioUrl, voiceBrief.transcript);
      content.appendChild(voicePlayer);
    }

    // Top 3 risks
    if (risks && risks.markets && risks.markets.length > 0) {
      const riskSection = document.createElement('div');
      riskSection.className = 'simglobe-risk-summary';

      const riskHeader = document.createElement('h3');
      riskHeader.textContent = 'Top Market Risks';
      riskSection.appendChild(riskHeader);

      const topRisks = risks.markets.slice(0, 3);
      topRisks.forEach(risk => {
        const riskItem = createRiskItem(risk);
        riskSection.appendChild(riskItem);
      });

      content.appendChild(riskSection);
    }

    // View dashboard link
    const footer = document.createElement('div');
    footer.className = 'simglobe-card-footer';
    footer.innerHTML = `
      <a href="#simglobe" class="simglobe-view-dashboard">
        View Full Dashboard
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    `;

    footer.querySelector('.simglobe-view-dashboard').addEventListener('click', (e) => {
      e.preventDefault();
      // Trigger sidebar panel
      const sidebarLink = document.querySelector('.simglobe-nav-link');
      if (sidebarLink) sidebarLink.click();
    });

    content.appendChild(footer);

  } catch (error) {
    content.innerHTML = `
      <div class="simglobe-error">
        <p>Unable to load market data</p>
        <p class="simglobe-error-detail">${error.message}</p>
        <p class="simglobe-error-hint">Make sure the Predictify backend is running on localhost:3000</p>
      </div>
    `;
  }
}

function createRiskItem(risk) {
  const { createRiskBadge, createImpactBadge } = window.PredictifyComponents;

  const item = document.createElement('div');
  item.className = 'simglobe-risk-item';

  const mainRow = document.createElement('div');
  mainRow.className = 'simglobe-risk-main';

  const badge = createRiskBadge(risk.probability);
  const title = document.createElement('span');
  title.className = 'simglobe-risk-title';
  title.textContent = risk.title;

  mainRow.appendChild(badge);
  mainRow.appendChild(title);

  const impactBadge = createImpactBadge(risk.impact);

  item.appendChild(mainRow);
  item.appendChild(impactBadge);

  // Click to show details
  item.addEventListener('click', () => {
    const { showHedgeModal } = window.PredictifyComponents;
    showHedgeModal({
      market: risk.title,
      marketId: risk.id,
      amount: calculateHedgeAmount(risk),
      probability: parseFloat(risk.probability)
    });
  });

  return item;
}

function calculateHedgeAmount(risk) {
  // Simple calculation based on probability and impact
  const prob = parseFloat(risk.probability);
  const baseAmount = 1000;

  if (risk.impact === 'high') {
    return Math.round(baseAmount * prob * 2);
  } else if (risk.impact === 'medium') {
    return Math.round(baseAmount * prob * 1.5);
  }
  return Math.round(baseAmount * prob);
}

// Make available globally
window.PredictifyInjectors = window.PredictifyInjectors || {};
window.PredictifyInjectors.injectHomeWidget = injectHomeWidget;
