/**
 * MarketRiskCard Component
 * Displays market risk information in a card format
 */

function createMarketRiskCard(risk) {
  // risk = { id, title, probability, impact, category, volume, endDate }
  const { createRiskBadge, createImpactBadge } = window.PredictifyComponents;

  const card = document.createElement('div');
  card.className = 'market-risk-card';
  card.dataset.marketId = risk.id;

  const header = document.createElement('div');
  header.className = 'risk-card-header';

  const badge = createRiskBadge(risk.probability);
  const title = document.createElement('span');
  title.className = 'risk-card-title';
  title.textContent = risk.title;

  header.appendChild(badge);
  header.appendChild(title);

  const details = document.createElement('div');
  details.className = 'risk-card-details';

  const impactBadge = createImpactBadge(risk.impact);
  const category = document.createElement('span');
  category.className = 'risk-card-category';
  category.textContent = risk.category;

  details.appendChild(impactBadge);
  details.appendChild(category);

  if (risk.volume) {
    const volume = document.createElement('span');
    volume.className = 'risk-card-volume';
    volume.textContent = `$${formatNumber(risk.volume)} volume`;
    details.appendChild(volume);
  }

  card.appendChild(header);
  card.appendChild(details);

  // Add click handler to show more details
  card.addEventListener('click', () => {
    showMarketDetails(risk);
  });

  return card;
}

function createRiskList(risks) {
  const list = document.createElement('div');
  list.className = 'risk-list';

  risks.forEach(risk => {
    const card = createMarketRiskCard(risk);
    list.appendChild(card);
  });

  return list;
}

function formatNumber(num) {
  const n = parseFloat(num);
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(0) + 'K';
  }
  return n.toString();
}

async function showMarketDetails(risk) {
  // Could open a modal with more details
  console.log('Market details:', risk);
}

// Make available globally
window.PredictifyComponents = window.PredictifyComponents || {};
window.PredictifyComponents.createMarketRiskCard = createMarketRiskCard;
window.PredictifyComponents.createRiskList = createRiskList;
