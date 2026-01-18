/**
 * Product Action Injector
 * Adds "Check Market Risk" button to product pages
 */

async function injectProductAction() {
  const { waitForElement, isAlreadyInjected, markAsInjected } = window.PredictifyDom;

  if (isAlreadyInjected('product-action')) {
    console.log('Predictify: Product action already injected');
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
      console.log('Predictify: Could not find product actions container');
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

    console.log('Predictify: Product action injected successfully');

  } catch (error) {
    console.error('Predictify: Error injecting product action:', error);
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
  const { waitForElement } = window.PredictifyDom;

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
    const risks = await window.PredictifyApi.getRisks();

    const { createRiskBadge, createImpactBadge } = window.PredictifyComponents;

    // Use the smart linker to find relevant risks for this product
    let relevantRisks = [];
    let analysis = { riskScore: 50, reasoning: 'Analyzing...', suggestedHedge: 500 };
    
    if (window.ProductRiskLinker) {
      const productData = {
        ...productInfo,
        category: inferProductCategory(productInfo.name),
        description: productInfo.name // Use name as description for matching
      };
      
      const matches = window.ProductRiskLinker.findRisksForProduct(productData, risks.markets || []);
      relevantRisks = matches.map(m => ({
        ...m.risk,
        matchReasons: m.matchReasons,
        matchScore: m.score
      }));
      
      // Calculate risk score based on matches
      if (relevantRisks.length > 0) {
        const avgProb = relevantRisks.reduce((sum, r) => sum + parseFloat(r.probability), 0) / relevantRisks.length;
        analysis.riskScore = Math.round(avgProb * 100);
        analysis.reasoning = `This product is exposed to ${relevantRisks.length} market risk${relevantRisks.length > 1 ? 's' : ''} based on its supply chain.`;
        analysis.suggestedHedge = window.ProductRiskLinker.calculateSuggestedHedge(productData, matches);
      } else {
        analysis.riskScore = 25;
        analysis.reasoning = 'No significant market risks detected for this product.';
        analysis.suggestedHedge = 0;
      }
    } else {
      relevantRisks = risks.markets || [];
    }

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
      
      const infoWrapper = document.createElement('div');
      infoWrapper.className = 'risk-factor-info';
      
      const title = document.createElement('span');
      title.className = 'risk-factor-title';
      title.textContent = risk.title;
      infoWrapper.appendChild(title);

      // Show match reasons if available
      if (risk.matchReasons && risk.matchReasons.length > 0) {
        const matchReason = document.createElement('span');
        matchReason.className = 'risk-factor-match';
        matchReason.textContent = risk.matchReasons[0]; // Show first reason
        infoWrapper.appendChild(matchReason);
      }

      const impact = document.createElement('span');
      impact.className = 'risk-factor-impact';
      impact.textContent = getImpactDescription(risk);

      // Add a link back to Predictify for this risk
      const viewLink = document.createElement('button');
      viewLink.className = 'risk-factor-view-btn';
      viewLink.innerHTML = `
        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
        </svg>
      `;
      viewLink.title = 'View in Predictify';
      viewLink.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelector('[data-simglobe="product-risk-modal"]')?.remove();
        // Navigate to Predictify and highlight this risk
        const { showPredictifyMainPage } = window.PredictifyInjectors || {};
        if (showPredictifyMainPage) {
          showPredictifyMainPage();
          // After a short delay, scroll to and highlight the risk
          setTimeout(() => {
            const riskRow = document.querySelector(`[data-market-id="${risk.id}"]`);
            if (riskRow) {
              riskRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
              riskRow.classList.add('simglobe-highlight');
              setTimeout(() => riskRow.classList.remove('simglobe-highlight'), 2000);
            }
          }, 500);
        }
      });

      factor.appendChild(badge);
      factor.appendChild(infoWrapper);
      factor.appendChild(impact);
      factor.appendChild(viewLink);
      factorsList.appendChild(factor);
    });

    // Event handlers
    container.querySelector('.hedge-product-btn').addEventListener('click', () => {
      const { showHedgeModal } = window.PredictifyComponents;
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
  if (window.ProductRiskLinker) {
    // Use smart descriptions based on category
    return window.ProductRiskLinker.getImpactDescription({}, risk);
  }
  
  const prob = parseFloat(risk.probability);
  if (prob >= 0.7) {
    return '+2-3 weeks shipping delay';
  } else if (prob >= 0.4) {
    return 'Potential 1-2 week delay';
  }
  return 'Minimal expected impact';
}

function inferProductCategory(productName) {
  const name = productName.toLowerCase();
  
  if (name.includes('shoe') || name.includes('sneaker') || name.includes('nike') || name.includes('adidas') || name.includes('air force')) {
    return 'Sneakers';
  }
  if (name.includes('t-shirt') || name.includes('tshirt') || name.includes('shirt')) {
    return 'T-Shirts';
  }
  if (name.includes('cotton')) {
    return 'T-Shirts';
  }
  if (name.includes('jean') || name.includes('pant') || name.includes('trouser')) {
    return 'Apparel';
  }
  if (name.includes('jacket') || name.includes('coat') || name.includes('hoodie')) {
    return 'Apparel';
  }
  if (name.includes('phone') || name.includes('laptop') || name.includes('computer')) {
    return 'Electronics';
  }
  
  return 'General';
}

// Make available globally
window.PredictifyInjectors = window.PredictifyInjectors || {};
window.PredictifyInjectors.injectProductAction = injectProductAction;
