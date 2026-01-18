/**
 * Campaigns Widget Injector
 * Injects AI recommendations banner on Shopify Admin Campaigns page
 */

async function injectCampaignsWidget() {
  const { waitForElement, isAlreadyInjected, markAsInjected } = window.SimGlobeDom;

  if (isAlreadyInjected('campaigns-widget')) {
    console.log('SimGlobe: Campaigns widget already injected');
    return;
  }

  try {
    // Wait for the campaigns page content
    const containerSelectors = [
      '[data-testid="marketing-campaigns"]',
      '.Polaris-Page__Content',
      'main [role="main"]',
      '.marketing-campaigns',
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
      console.log('SimGlobe: Could not find campaigns page container');
      return;
    }

    // Get store ID from URL
    const storeId = extractStoreId();

    // Create the banner widget
    const banner = await createCampaignsBanner(storeId);
    markAsInjected(banner, 'campaigns-widget');

    // Insert at the top of the content area
    const breadcrumbs = container.querySelector('.Polaris-Page-Header, [class*="Header"], nav[aria-label="Breadcrumb"]');
    if (breadcrumbs && breadcrumbs.nextSibling) {
      breadcrumbs.parentNode.insertBefore(banner, breadcrumbs.nextSibling);
    } else {
      container.insertBefore(banner, container.firstChild);
    }

    console.log('SimGlobe: Campaigns widget injected successfully');

    // Set up polling for real-time updates
    startCampaignsPolling(banner, storeId);

  } catch (error) {
    console.error('SimGlobe: Error injecting campaigns widget:', error);
  }
}

async function createCampaignsBanner(storeId) {
  const banner = document.createElement('div');
  banner.className = 'simglobe-campaigns-banner';

  // Initially show loading state
  banner.innerHTML = `
    <div class="simglobe-banner simglobe-banner--loading">
      <div class="simglobe-banner-content">
        <div class="simglobe-spinner"></div>
        <span>Analyzing market conditions...</span>
      </div>
    </div>
  `;

  // Load analysis data
  try {
    const analysis = await window.SimGlobeApi.analyzeStore({
      storeId,
      page: 'campaigns'
    });

    updateCampaignsBanner(banner, analysis);
  } catch (error) {
    banner.innerHTML = `
      <div class="simglobe-banner simglobe-banner--info">
        <div class="simglobe-banner-content">
          <div class="simglobe-banner-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div class="simglobe-banner-text">
            <h3>SimGlobe Market Intelligence</h3>
            <p>Unable to load analysis. <a href="#" class="simglobe-retry-link">Retry</a></p>
          </div>
        </div>
      </div>
    `;

    banner.querySelector('.simglobe-retry-link')?.addEventListener('click', async (e) => {
      e.preventDefault();
      const analysis = await window.SimGlobeApi.analyzeStore({ storeId, page: 'campaigns' });
      updateCampaignsBanner(banner, analysis);
    });
  }

  return banner;
}

function updateCampaignsBanner(banner, analysis) {
  const { riskScore, recommendations, hedgeAmount, reasoning } = analysis;

  // Determine banner type based on risk score
  let bannerType = 'info';
  let iconSvg = '';

  if (riskScore >= 70) {
    bannerType = 'critical';
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>`;
  } else if (riskScore >= 40) {
    bannerType = 'warning';
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>`;
  } else {
    bannerType = 'success';
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>`;
  }

  // Build recommendations list
  const recommendationsList = recommendations.map(rec => `
    <li class="simglobe-recommendation">
      <span class="simglobe-rec-action">${rec.action}</span>
      <span class="simglobe-rec-impact">${rec.impact}</span>
    </li>
  `).join('');

  banner.innerHTML = `
    <div class="simglobe-banner simglobe-banner--${bannerType}">
      <div class="simglobe-banner-content">
        <div class="simglobe-banner-icon">${iconSvg}</div>
        <div class="simglobe-banner-text">
          <h3>Market Alert: ${reasoning}</h3>
          <p>Risk Score: <strong>${riskScore}%</strong></p>
          <ul class="simglobe-recommendations-list">
            ${recommendationsList}
          </ul>
        </div>
        <div class="simglobe-banner-actions">
          <button class="simglobe-btn simglobe-btn--outline simglobe-apply-all">
            Apply All
          </button>
          <button class="simglobe-btn simglobe-btn--primary simglobe-hedge-btn">
            Hedge $${hedgeAmount?.toLocaleString() || '0'}
          </button>
        </div>
      </div>
      <button class="simglobe-banner-dismiss" title="Dismiss">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `;

  // Event handlers
  banner.querySelector('.simglobe-apply-all')?.addEventListener('click', () => {
    applyAllRecommendations(recommendations);
  });

  banner.querySelector('.simglobe-hedge-btn')?.addEventListener('click', () => {
    const { showHedgeModal } = window.SimGlobeComponents;
    showHedgeModal({
      market: 'Campaign Risk Hedge',
      marketId: 'campaign-hedge',
      amount: hedgeAmount || 1000,
      probability: riskScore / 100
    });
  });

  banner.querySelector('.simglobe-banner-dismiss')?.addEventListener('click', () => {
    banner.style.display = 'none';
    // Remember dismissal for this session
    sessionStorage.setItem('simglobe_campaigns_dismissed', 'true');
  });

  // Check if previously dismissed
  if (sessionStorage.getItem('simglobe_campaigns_dismissed') === 'true') {
    banner.style.display = 'none';
  }
}

function applyAllRecommendations(recommendations) {
  // In a real implementation, this would interact with Shopify's API
  // For the hackathon demo, show a confirmation
  const applied = recommendations.map(r => r.action).join('\n- ');

  const toast = document.createElement('div');
  toast.className = 'simglobe-toast simglobe-toast--success';
  toast.innerHTML = `
    <div class="simglobe-toast-content">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Recommendations queued for review</span>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('simglobe-toast--hiding');
    setTimeout(() => toast.remove(), 300);
  }, 3000);

  console.log('SimGlobe: Applying recommendations:', recommendations);
}

function extractStoreId() {
  // Extract store ID from URL: admin.shopify.com/store/[store-id]/...
  const match = window.location.pathname.match(/\/store\/([^\/]+)/);
  return match ? match[1] : 'unknown';
}

let pollingInterval = null;

function startCampaignsPolling(banner, storeId) {
  // Poll every 30 seconds for updates
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  pollingInterval = setInterval(async () => {
    try {
      // Clear cache to get fresh data
      await window.SimGlobeApi.setCache(`simglobe_analysis_${storeId}_campaigns`, null, 0);
      const analysis = await window.SimGlobeApi.analyzeStore({
        storeId,
        page: 'campaigns'
      });
      updateCampaignsBanner(banner, analysis);
    } catch (error) {
      console.error('SimGlobe: Polling error:', error);
    }
  }, 30000);

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  });
}

// Make available globally
window.SimGlobeInjectors = window.SimGlobeInjectors || {};
window.SimGlobeInjectors.injectCampaignsWidget = injectCampaignsWidget;
