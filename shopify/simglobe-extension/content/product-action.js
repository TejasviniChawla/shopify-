/**
 * Product Action Injector
 * Adds "Check Market Risk" button to product pages
 */

async function injectProductAction() {
  const { waitForElement, isAlreadyInjected, markAsInjected } = window.SimGlobeDom;

  if (isAlreadyInjected('product-action')) {
    console.log('SimGlobe: Product action already injected');
    return;
  }

  try {
    // Wait for the product page header actions
    const actionSelectors = [
      '.Polaris-Page-Header__PrimaryAction',
      '.Polaris-Page-Header__Actions',
      '[class*="PageHeader"] [class*="Actions"]',
      '.Polaris-ButtonGroup',
      '.product-header-actions'
    ];

    let actionsContainer = null;
    for (const selector of actionSelectors) {
      try {
        actionsContainer = await waitForElement(selector, 3000);
        if (actionsContainer) break;
      } catch (e) {
        continue;
      }
    }

    if (!actionsContainer) {
      console.log('SimGlobe: Could not find product actions container');
      return;
    }

    // Extract product info from the page
    const productInfo = extractProductInfo();

    // Create the action button
    const actionButton = createProductActionButton(productInfo);
    markAsInjected(actionButton, 'product-action');

    // Insert before the first button or at the beginning
    const firstButton = actionsContainer.querySelector('button, .Polaris-Button');
    if (firstButton) {
      actionsContainer.insertBefore(actionButton, firstButton);
    } else {
      actionsContainer.appendChild(actionButton);
    }

    console.log('SimGlobe: Product action injected successfully');

  } catch (error) {
    console.error('SimGlobe: Error injecting product action:', error);
  }
}

function createProductActionButton(productInfo) {
  const button = document.createElement('button');
  button.className = 'simglobe-product-action Polaris-Button Polaris-Button--outline';
  button.type = 'button';

  button.innerHTML = `
    <span class="Polaris-Button__Content">
      <span class="Polaris-Button__Icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </span>
      <span class="Polaris-Button__Text">Check Market Risk</span>
    </span>
  `;

  button.addEventListener('click', () => {
    showProductRiskModal(productInfo);
  });

  return button;
}

function extractProductInfo() {
  // Extract product info from URL and page content
  const urlMatch = window.location.pathname.match(/\/products\/(\d+)/);
  const productId = urlMatch ? urlMatch[1] : 'unknown';

  // Try to get product name from page header
  const titleEl = document.querySelector('.Polaris-Header-Title, h1, [class*="Title"]');
  const productName = titleEl ? titleEl.textContent.trim() : 'This Product';

  // Try to get price
  const priceEl = document.querySelector('[class*="price"], [data-testid="price"]');
  const price = priceEl ? priceEl.textContent.trim() : null;

  return {
    id: productId,
    name: productName,
    price
  };
}

async function showProductRiskModal(productInfo) {
  const { waitForElement } = window.SimGlobeDom;

  // Remove any existing modal
  const existing = document.querySelector('[data-simglobe="product-risk-modal"]');
  if (existing) existing.remove();

  // Create modal
  const overlay = document.createElement('div');
  overlay.className = 'simglobe-modal-overlay';
  overlay.dataset.simglobe = 'product-risk-modal';

  const modal = document.createElement('div');
  modal.className = 'simglobe-modal simglobe-product-risk-modal';

  modal.innerHTML = `
    <div class="modal-header">
      <h2>Market Risks for ${productInfo.name}</h2>
      <button class="modal-close-btn">&times;</button>
    </div>
    <div class="modal-body">
      <div class="simglobe-loading">
        <div class="simglobe-spinner"></div>
        <p>Analyzing market conditions...</p>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close handlers
  modal.querySelector('.modal-close-btn').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Load risk data
  await loadProductRiskData(modal.querySelector('.modal-body'), productInfo);
}

async function loadProductRiskData(container, productInfo) {
  try {
    const [risks, analysis] = await Promise.all([
      window.SimGlobeApi.getRisks(),
      window.SimGlobeApi.analyzeStore({
        storeId: extractStoreId(),
        productIds: [productInfo.id],
        page: 'product'
      })
    ]);

    const { createRiskBadge, createImpactBadge } = window.SimGlobeComponents;

    // Filter risks relevant to products (supply chain, shipping, etc.)
    const relevantRisks = risks.markets || [];

    container.innerHTML = `
      <div class="product-risk-content">
        <div class="product-risk-summary">
          <div class="risk-score-circle risk-score--${getRiskLevel(analysis.riskScore)}">
            <span class="risk-score-value">${analysis.riskScore}</span>
            <span class="risk-score-label">Risk Score</span>
          </div>
          <div class="risk-summary-text">
            <p>${analysis.reasoning}</p>
          </div>
        </div>

        <div class="product-risk-breakdown">
          <h3>Risk Factors</h3>
          <div class="risk-factors-list"></div>
        </div>

        <div class="product-risk-recommendation">
          <h3>Recommended Hedge</h3>
          <div class="hedge-recommendation-box">
            <span class="hedge-amount">$${analysis.suggestedHedge?.toLocaleString() || '0'} USDC</span>
            <p>Protects against supply chain disruptions</p>
          </div>
        </div>

        <div class="product-risk-actions">
          <button class="simglobe-btn simglobe-btn--primary hedge-product-btn">
            Execute Hedge
          </button>
          <button class="simglobe-btn simglobe-btn--outline view-details-btn">
            View Market Details
          </button>
        </div>
      </div>
    `;

    // Populate risk factors
    const factorsList = container.querySelector('.risk-factors-list');
    relevantRisks.slice(0, 4).forEach(risk => {
      const factor = document.createElement('div');
      factor.className = 'risk-factor-item';

      const badge = createRiskBadge(risk.probability);
      const title = document.createElement('span');
      title.className = 'risk-factor-title';
      title.textContent = risk.title;

      const impact = document.createElement('span');
      impact.className = 'risk-factor-impact';
      impact.textContent = getImpactDescription(risk);

      factor.appendChild(badge);
      factor.appendChild(title);
      factor.appendChild(impact);
      factorsList.appendChild(factor);
    });

    // Event handlers
    container.querySelector('.hedge-product-btn').addEventListener('click', () => {
      const { showHedgeModal } = window.SimGlobeComponents;
      showHedgeModal({
        market: `${productInfo.name} Supply Risk`,
        marketId: `product-${productInfo.id}`,
        amount: analysis.suggestedHedge || 500,
        probability: analysis.riskScore / 100
      });
    });

    container.querySelector('.view-details-btn').addEventListener('click', () => {
      // Open sidebar panel
      const sidebarLink = document.querySelector('.simglobe-nav-link');
      if (sidebarLink) {
        document.querySelector('[data-simglobe="product-risk-modal"]')?.remove();
        sidebarLink.click();
      }
    });

  } catch (error) {
    container.innerHTML = `
      <div class="simglobe-error">
        <p>Unable to load risk analysis</p>
        <p class="simglobe-error-detail">${error.message}</p>
        <button class="simglobe-btn" onclick="loadProductRiskData(this.parentElement.parentElement, ${JSON.stringify(productInfo)})">
          Retry
        </button>
      </div>
    `;
  }
}

function extractStoreId() {
  const match = window.location.pathname.match(/\/store\/([^\/]+)/);
  return match ? match[1] : 'unknown';
}

function getRiskLevel(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getImpactDescription(risk) {
  const prob = parseFloat(risk.probability);
  if (prob >= 0.7) {
    return '+2-3 weeks shipping delay';
  } else if (prob >= 0.4) {
    return 'Potential 1-2 week delay';
  }
  return 'Minimal expected impact';
}

// Make available globally
window.SimGlobeInjectors = window.SimGlobeInjectors || {};
window.SimGlobeInjectors.injectProductAction = injectProductAction;
