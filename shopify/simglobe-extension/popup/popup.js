/**
 * SimGlobe Popup Script
 * Handles popup UI interactions and data display
 */

const API_BASE = 'http://localhost:4000/api';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize UI
  await loadSettings();
  await checkStatus();
  await loadStats();
  await loadRisksPreview();

  // Event listeners
  setupEventListeners();
});

async function loadSettings() {
  const settings = await chrome.storage.local.get(['simglobe_enabled']);
  const toggle = document.getElementById('enable-toggle');
  toggle.checked = settings.simglobe_enabled !== false;
}

async function checkStatus() {
  const indicator = document.getElementById('status-indicator');
  const dot = indicator.querySelector('.status-dot');
  const text = indicator.querySelector('.status-text');

  try {
    // Check if on Shopify Admin
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const isShopify = tab?.url?.includes('admin.shopify.com');

    // Check if backend is running
    const backendOk = await checkBackendHealth();

    if (isShopify && backendOk) {
      dot.className = 'status-dot status-dot--active';
      text.textContent = 'Active on Shopify Admin';
    } else if (isShopify && !backendOk) {
      dot.className = 'status-dot status-dot--warning';
      text.textContent = 'Backend not running';
    } else if (!isShopify && backendOk) {
      dot.className = 'status-dot status-dot--inactive';
      text.textContent = 'Navigate to Shopify Admin';
    } else {
      dot.className = 'status-dot status-dot--inactive';
      text.textContent = 'Inactive';
    }
  } catch (error) {
    dot.className = 'status-dot status-dot--error';
    text.textContent = 'Error checking status';
  }
}

async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE.replace('/api', '')}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function loadStats() {
  const riskCountEl = document.getElementById('risk-count');
  const avgProbEl = document.getElementById('avg-prob');

  try {
    // Try to get cached stats first
    const cached = await chrome.storage.local.get(['riskCount', 'avgProb']);

    if (cached.riskCount !== undefined) {
      riskCountEl.textContent = cached.riskCount;
      avgProbEl.textContent = `${cached.avgProb || 0}%`;
    }

    // Fetch fresh data
    const response = await fetch(`${API_BASE}/risks`, {
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();

      if (data.markets && data.markets.length > 0) {
        const riskCount = data.markets.length;
        const avgProb = Math.round(
          data.markets.reduce((sum, m) => sum + parseFloat(m.probability) * 100, 0) / riskCount
        );

        riskCountEl.textContent = riskCount;
        avgProbEl.textContent = `${avgProb}%`;

        // Cache the stats
        await chrome.storage.local.set({ riskCount, avgProb });
      }
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    if (riskCountEl.textContent === '--') {
      riskCountEl.textContent = '?';
      avgProbEl.textContent = '--%';
    }
  }
}

async function loadRisksPreview() {
  const risksList = document.getElementById('risks-list');

  try {
    const response = await fetch(`${API_BASE}/risks`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();

    if (data.markets && data.markets.length > 0) {
      risksList.innerHTML = '';

      // Show top 3 risks
      data.markets.slice(0, 3).forEach(market => {
        const riskItem = createRiskItem(market);
        risksList.appendChild(riskItem);
      });
    } else {
      risksList.innerHTML = '<div class="no-risks">No active risks detected</div>';
    }
  } catch (error) {
    risksList.innerHTML = `
      <div class="error-message">
        <p>Unable to load risks</p>
        <small>Make sure backend is running</small>
      </div>
    `;
  }
}

function createRiskItem(market) {
  const item = document.createElement('div');
  item.className = 'risk-item';

  const prob = parseFloat(market.probability);
  const probPercent = Math.round(prob * 100);
  const probClass = probPercent >= 70 ? 'high' : probPercent >= 40 ? 'medium' : 'low';

  item.innerHTML = `
    <div class="risk-badge risk-badge--${probClass}">${probPercent}%</div>
    <div class="risk-info">
      <span class="risk-title">${truncate(market.title, 40)}</span>
      <span class="risk-impact">${market.impact} impact</span>
    </div>
  `;

  return item;
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + '...';
}

function setupEventListeners() {
  // Solana info toggle
  document.getElementById('solana-toggle').addEventListener('click', () => {
    const toggle = document.getElementById('solana-toggle');
    const content = document.getElementById('solana-content');
    const isOpen = content.style.display !== 'none';
    
    content.style.display = isOpen ? 'none' : 'block';
    toggle.classList.toggle('open', !isOpen);
  });

  // Enable/disable toggle
  document.getElementById('enable-toggle').addEventListener('change', async (e) => {
    await chrome.storage.local.set({ simglobe_enabled: e.target.checked });

    // Reload active tab to apply changes
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url?.includes('admin.shopify.com')) {
      chrome.tabs.reload(tab.id);
    }
  });

  // Refresh button
  document.getElementById('refresh-btn').addEventListener('click', async () => {
    const btn = document.getElementById('refresh-btn');
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="spinning" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M23 4v6h-6M1 20v-6h6"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
      Refreshing...
    `;

    // Clear cache
    await chrome.storage.local.remove(['simglobe_risks', 'simglobe_voice_brief', 'riskCount', 'avgProb']);

    // Reload data
    await loadStats();
    await loadRisksPreview();

    // Reload active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url?.includes('admin.shopify.com')) {
      chrome.tabs.reload(tab.id);
    }

    btn.disabled = false;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M23 4v6h-6M1 20v-6h6"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
      Refresh Data
    `;
  });

  // Settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    // For now, open options in new tab
    // In future could have a dedicated options page
    chrome.tabs.create({
      url: 'https://simglobe.io/settings'
    });
  });
}
