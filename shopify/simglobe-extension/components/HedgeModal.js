/**
 * HedgeModal Component
 * Modal for executing Solana Pay hedge transactions
 */

function createHedgeModal(hedgeData) {
  // hedgeData = { amount, market, marketId, probability, qrCode }
  const overlay = document.createElement('div');
  overlay.className = 'simglobe-modal-overlay';
  overlay.dataset.simglobe = 'hedge-modal';

  const modal = document.createElement('div');
  modal.className = 'simglobe-modal';

  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'modal-header-left';
  
  const solanaLogo = document.createElement('div');
  solanaLogo.className = 'solana-logo';
  solanaLogo.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <defs>
        <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#00FFA3"/>
          <stop offset="100%" style="stop-color:#DC1FFF"/>
        </linearGradient>
      </defs>
      <path fill="url(#solana-gradient)" d="M17.7 6.2c-.1-.1-.3-.2-.5-.2H4.2c-.4 0-.6.5-.3.8l2.4 2.4c.1.1.3.2.5.2h13c.4 0 .6-.5.3-.8l-2.4-2.4zm0 11.4c-.1-.1-.3-.2-.5-.2H4.2c-.4 0-.6.5-.3.8l2.4 2.4c.1.1.3.2.5.2h13c.4 0 .6-.5.3-.8l-2.4-2.4zm-11-5.4c.1-.1.3-.2.5-.2h13c.4 0 .6-.5.3-.8l-2.4-2.4c-.1-.1-.3-.2-.5-.2H4.2c-.4 0-.6.5-.3.8l2.8 2.8z"/>
    </svg>
  `;

  const title = document.createElement('h2');
  title.textContent = 'Hedge on Solana';

  headerLeft.appendChild(solanaLogo);
  headerLeft.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => overlay.remove());

  header.appendChild(headerLeft);
  header.appendChild(closeBtn);

  // Body
  const body = document.createElement('div');
  body.className = 'modal-body';

  // Hedge details
  const details = document.createElement('div');
  details.className = 'hedge-details';

  details.innerHTML = `
    <div class="hedge-detail-row">
      <span class="hedge-label">Market</span>
      <span class="hedge-value">${hedgeData.market}</span>
    </div>
    <div class="hedge-detail-row">
      <span class="hedge-label">Amount</span>
      <span class="hedge-value hedge-amount">${hedgeData.amount} USDC</span>
    </div>
    <div class="hedge-detail-row">
      <span class="hedge-label">Current Odds</span>
      <span class="hedge-value">${Math.round(hedgeData.probability * 100)}%</span>
    </div>
  `;

  // QR Code section
  const qrSection = document.createElement('div');
  qrSection.className = 'hedge-qr-section';

  if (hedgeData.qrCode) {
    const qrImage = document.createElement('img');
    qrImage.src = hedgeData.qrCode;
    qrImage.alt = 'Solana Pay QR Code';
    qrImage.className = 'hedge-qr-code';
    qrSection.appendChild(qrImage);
  } else {
    const qrPlaceholder = document.createElement('div');
    qrPlaceholder.className = 'hedge-qr-placeholder';
    qrPlaceholder.innerHTML = `
      <svg viewBox="0 0 24 24" width="48" height="48">
        <path fill="currentColor" d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 19h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
      </svg>
      <p>QR code will appear here</p>
    `;
    qrSection.appendChild(qrPlaceholder);
  }

  const scanText = document.createElement('p');
  scanText.className = 'hedge-scan-text';
  scanText.textContent = 'Scan with Phantom or Solflare wallet';
  qrSection.appendChild(scanText);

  // Solana explainer
  const solanaExplainer = document.createElement('div');
  solanaExplainer.className = 'solana-explainer';
  solanaExplainer.innerHTML = `
    <h4>🔒 How Solana Protects Your Business</h4>
    <ul>
      <li><strong>Sub-second execution</strong> — Your hedge is placed instantly</li>
      <li><strong>Transparent on-chain</strong> — All transactions verifiable on blockchain</li>
      <li><strong>Automatic payout</strong> — If the risk materializes, you're protected</li>
      <li><strong>USDC payments</strong> — Stable value, no crypto volatility</li>
    </ul>
    <p class="solana-note">Powered by Solana Pay for fast, low-cost transactions</p>
  `;
  qrSection.appendChild(solanaExplainer);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'hedge-confirm-btn';
  confirmBtn.textContent = 'Generate QR Code';

  const statusText = document.createElement('p');
  statusText.className = 'hedge-status';
  statusText.style.display = 'none';

  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';
    statusText.style.display = 'block';
    statusText.textContent = 'Creating transaction...';

    try {
      const result = await executeHedge(hedgeData);

      if (result.qrCodeUrl) {
        const qrImg = qrSection.querySelector('.hedge-qr-code') || document.createElement('img');
        qrImg.src = result.qrCodeUrl;
        qrImg.className = 'hedge-qr-code';
        qrImg.alt = 'Solana Pay QR Code';

        const placeholder = qrSection.querySelector('.hedge-qr-placeholder');
        if (placeholder) {
          placeholder.replaceWith(qrImg);
        }
      }

      statusText.textContent = 'Scan QR code to complete transaction';
      statusText.className = 'hedge-status hedge-status--success';
      confirmBtn.textContent = 'Transaction Created';

      // Start polling for confirmation
      pollTransactionStatus(result.transactionId, statusText);

    } catch (error) {
      statusText.textContent = `Error: ${error.message}`;
      statusText.className = 'hedge-status hedge-status--error';
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Retry';
    }
  });

  actions.appendChild(confirmBtn);
  actions.appendChild(statusText);

  body.appendChild(details);
  body.appendChild(qrSection);
  body.appendChild(actions);

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  // Close on escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return overlay;
}

async function executeHedge(hedgeData) {
  return window.PredictifyApi.executeHedge({
    marketId: hedgeData.marketId,
    amount: hedgeData.amount,
    walletAddress: hedgeData.walletAddress || 'demo_wallet'
  });
}

async function pollTransactionStatus(transactionId, statusElement, attempts = 0) {
  if (attempts >= 30) {
    statusElement.textContent = 'Transaction timed out. Check your wallet.';
    return;
  }

  try {
    const status = await window.PredictifyApi.getHedgeStatus(transactionId);

    if (status.status === 'confirmed') {
      statusElement.textContent = 'Transaction confirmed!';
      statusElement.className = 'hedge-status hedge-status--success';
      return;
    }

    // Continue polling
    setTimeout(() => {
      pollTransactionStatus(transactionId, statusElement, attempts + 1);
    }, 2000);

  } catch (error) {
    console.error('Error polling status:', error);
  }
}

function showHedgeModal(hedgeData) {
  // Remove any existing modal
  const existing = document.querySelector('[data-simglobe="hedge-modal"]');
  if (existing) existing.remove();

  const modal = createHedgeModal(hedgeData);
  document.body.appendChild(modal);
}

// Make available globally
window.PredictifyComponents = window.PredictifyComponents || {};
window.PredictifyComponents.createHedgeModal = createHedgeModal;
window.PredictifyComponents.showHedgeModal = showHedgeModal;
