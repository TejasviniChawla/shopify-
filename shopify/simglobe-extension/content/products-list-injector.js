/**
 * Products List Injector
 * Adds risk indicators to the products list table
 */

async function injectProductsListRisks() {
  const { waitForElement, isAlreadyInjected, markAsInjected } = window.PredictifyDom;

  if (isAlreadyInjected('products-list')) {
    return;
  }

  try {
    // Wait for the products table to load
    const tableSelectors = [
      '.Polaris-Table-TableBody',
      '[role="rowgroup"] .Polaris-Table-TableRow',
      '.Polaris-Table'
    ];

    let tableBody = null;
    for (const selector of tableSelectors) {
      try {
        tableBody = await waitForElement(selector, 5000);
        if (tableBody) break;
      } catch (e) {
        continue;
      }
    }

    if (!tableBody) {
      console.log('Predictify: Could not find products table');
      return;
    }

    // Get risks data
    let risks = [];
    try {
      const risksData = await window.PredictifyApi.getRisks();
      risks = risksData.markets || [];
    } catch (e) {
      console.log('Predictify: Could not fetch risks for products list');
      return;
    }

    // Find all product rows
    const productRows = document.querySelectorAll('.Polaris-Table-TableRow');
    
    productRows.forEach(row => {
      // Skip header rows
      if (row.closest('.Polaris-Table-TableHead')) return;
      
      // Check if already injected
      if (row.querySelector('.predictify-risk-indicator')) return;

      // Extract product info from the row
      const productLink = row.querySelector('a[href*="/products/"]');
      if (!productLink) return;

      const href = productLink.getAttribute('href');
      const productIdMatch = href.match(/\/products\/(\d+)/);
      if (!productIdMatch) return;

      const productId = productIdMatch[1];
      const productName = productLink.textContent.trim();
      
      // Get category from the row
      const cells = row.querySelectorAll('.Polaris-Table-TableCell');
      let category = '';
      cells.forEach(cell => {
        const text = cell.textContent.trim();
        if (text === 'Sneakers' || text === 'T-Shirts' || text === 'Apparel' || text === 'Electronics') {
          category = text;
        }
      });

      // Find matching risks for this product
      const productData = {
        id: productId,
        name: productName,
        category: category,
        description: productName
      };

      let matchedRisks = [];
      if (window.ProductRiskLinker) {
        matchedRisks = window.ProductRiskLinker.findRisksForProduct(productData, risks);
      }

      // If there are matched risks, add an indicator
      if (matchedRisks.length > 0) {
        addRiskIndicatorToRow(row, productData, matchedRisks);
      }
    });

    // Mark as injected on a parent element
    const container = document.querySelector('.Polaris-Table');
    if (container) {
      markAsInjected(container, 'products-list');
    }

    console.log('Predictify: Products list risks injected');

  } catch (error) {
    console.error('Predictify: Error injecting products list risks:', error);
  }
}

function addRiskIndicatorToRow(row, product, matchedRisks) {
  // Find the product name cell (column 3)
  const productCell = row.querySelector('[aria-colindex="3"] .Polaris-Table-TableCell__TableCellContent');
  if (!productCell) return;

  // Determine overall risk level
  const highRisks = matchedRisks.filter(m => parseFloat(m.risk.probability) >= 0.6).length;
  const mediumRisks = matchedRisks.filter(m => parseFloat(m.risk.probability) >= 0.4 && parseFloat(m.risk.probability) < 0.6).length;
  
  let riskLevel = 'low';
  let riskColor = '#2a7e6e';
  if (highRisks > 0) {
    riskLevel = 'high';
    riskColor = '#d72c0d';
  } else if (mediumRisks > 0) {
    riskLevel = 'medium';
    riskColor = '#b98900';
  }

  // Create the risk indicator button
  const indicator = document.createElement('button');
  indicator.className = `predictify-risk-indicator predictify-risk-indicator--${riskLevel}`;
  indicator.title = `${matchedRisks.length} market risk${matchedRisks.length > 1 ? 's' : ''} affecting this product`;
  indicator.innerHTML = `
    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
    </svg>
    <span class="predictify-risk-count">${matchedRisks.length}</span>
  `;

  // Style the indicator
  indicator.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    margin-left: 8px;
    background: ${riskLevel === 'high' ? '#fbeae5' : riskLevel === 'medium' ? '#fdf8e8' : '#e6f3f0'};
    border: 1px solid ${riskColor};
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    color: ${riskColor};
    cursor: pointer;
    transition: all 150ms ease;
    vertical-align: middle;
  `;

  // Hover effect
  indicator.addEventListener('mouseenter', () => {
    indicator.style.transform = 'scale(1.05)';
    indicator.style.boxShadow = `0 2px 8px ${riskColor}33`;
  });
  indicator.addEventListener('mouseleave', () => {
    indicator.style.transform = 'scale(1)';
    indicator.style.boxShadow = 'none';
  });

  // Click handler - show risks popup or navigate to Predictify
  indicator.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showProductRisksPopup(product, matchedRisks, indicator);
  });

  // Append to product cell
  productCell.appendChild(indicator);
}

function showProductRisksPopup(product, matchedRisks, anchor) {
  // Remove any existing popup
  document.querySelectorAll('.predictify-risks-popup').forEach(p => p.remove());

  const popup = document.createElement('div');
  popup.className = 'predictify-risks-popup';
  
  popup.innerHTML = `
    <div class="predictify-popup-header">
      <span class="predictify-popup-title">Market Risks for ${product.name}</span>
      <button class="predictify-popup-close">&times;</button>
    </div>
    <div class="predictify-popup-content">
      ${matchedRisks.slice(0, 3).map(match => {
        const prob = Math.round(parseFloat(match.risk.probability) * 100);
        const probClass = prob >= 60 ? 'high' : prob >= 40 ? 'medium' : 'low';
        return `
          <div class="predictify-popup-risk" data-risk-id="${match.risk.id}">
            <span class="predictify-popup-prob predictify-popup-prob--${probClass}">${prob}%</span>
            <div class="predictify-popup-risk-info">
              <span class="predictify-popup-risk-title">${match.risk.title}</span>
              <span class="predictify-popup-risk-reason">${match.matchReasons[0] || ''}</span>
            </div>
            <svg class="predictify-popup-arrow" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        `;
      }).join('')}
    </div>
    <div class="predictify-popup-footer">
      <button class="predictify-popup-view-all">
        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
        </svg>
        View All in Predictify
      </button>
    </div>
  `;

  // Position the popup
  const rect = anchor.getBoundingClientRect();
  popup.style.cssText = `
    position: fixed;
    top: ${rect.bottom + 8}px;
    left: ${rect.left}px;
    z-index: 999999;
    background: #ffffff;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    width: 320px;
    animation: fadeIn 150ms ease;
  `;

  // Add to DOM
  document.body.appendChild(popup);

  // Close button
  popup.querySelector('.predictify-popup-close').addEventListener('click', () => {
    popup.remove();
  });

  // Click outside to close
  const closeOnClickOutside = (e) => {
    if (!popup.contains(e.target) && e.target !== anchor) {
      popup.remove();
      document.removeEventListener('click', closeOnClickOutside);
    }
  };
  setTimeout(() => document.addEventListener('click', closeOnClickOutside), 100);

  // Risk row click - go to Predictify and highlight
  popup.querySelectorAll('.predictify-popup-risk').forEach(riskEl => {
    riskEl.style.cursor = 'pointer';
    riskEl.addEventListener('click', () => {
      const riskId = riskEl.dataset.riskId;
      popup.remove();
      navigateToPredictifyRisk(riskId);
    });
  });

  // View All button
  popup.querySelector('.predictify-popup-view-all').addEventListener('click', () => {
    popup.remove();
    const { showPredictifyMainPage } = window.PredictifyInjectors || {};
    if (showPredictifyMainPage) {
      showPredictifyMainPage();
    }
  });
}

function navigateToPredictifyRisk(riskId) {
  const { showPredictifyMainPage } = window.PredictifyInjectors || {};
  if (showPredictifyMainPage) {
    showPredictifyMainPage();
    // After a short delay, scroll to and highlight the risk
    setTimeout(() => {
      const riskRow = document.querySelector(`[data-market-id="${riskId}"]`);
      if (riskRow) {
        riskRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        riskRow.classList.add('simglobe-highlight');
        // Open the info panel
        const infoBtn = riskRow.querySelector('.simglobe-info-btn');
        if (infoBtn) infoBtn.click();
        setTimeout(() => riskRow.classList.remove('simglobe-highlight'), 2000);
      }
    }, 500);
  }
}

// Add popup styles
function addPopupStyles() {
  if (document.getElementById('predictify-popup-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'predictify-popup-styles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .predictify-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #e1e1e1;
    }
    
    .predictify-popup-title {
      font-size: 13px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .predictify-popup-close {
      background: none;
      border: none;
      font-size: 18px;
      color: #6d7175;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    
    .predictify-popup-close:hover {
      color: #1a1a1a;
    }
    
    .predictify-popup-content {
      padding: 8px;
    }
    
    .predictify-popup-risk {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 6px;
      transition: background 150ms ease;
    }
    
    .predictify-popup-risk:hover {
      background: #f6f6f7;
    }
    
    .predictify-popup-prob {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 10px;
      min-width: 40px;
      text-align: center;
    }
    
    .predictify-popup-prob--high {
      background: #fbeae5;
      color: #d72c0d;
    }
    
    .predictify-popup-prob--medium {
      background: #fdf8e8;
      color: #b98900;
    }
    
    .predictify-popup-prob--low {
      background: #e6f3f0;
      color: #1a6b4a;
    }
    
    .predictify-popup-risk-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .predictify-popup-risk-title {
      font-size: 12px;
      font-weight: 500;
      color: #1a1a1a;
    }
    
    .predictify-popup-risk-reason {
      font-size: 10px;
      color: #2a7e6e;
      font-style: italic;
    }
    
    .predictify-popup-arrow {
      color: #6d7175;
      flex-shrink: 0;
    }
    
    .predictify-popup-risk:hover .predictify-popup-arrow {
      color: #2a7e6e;
      transform: translateX(2px);
    }
    
    .predictify-popup-footer {
      padding: 12px 16px;
      border-top: 1px solid #e1e1e1;
    }
    
    .predictify-popup-view-all {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      background: #2a7e6e;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 150ms ease;
    }
    
    .predictify-popup-view-all:hover {
      background: #227062;
    }
  `;
  document.head.appendChild(style);
}

// Initialize
addPopupStyles();

// Make available globally
window.PredictifyInjectors = window.PredictifyInjectors || {};
window.PredictifyInjectors.injectProductsListRisks = injectProductsListRisks;

