/**
 * RiskBadge Component
 * Displays a probability badge with color coding
 */

function createRiskBadge(probability, size = 'medium') {
  const prob = parseFloat(probability);
  const probClass = getProbabilityClass(prob);
  const sizeClass = `risk-badge--${size}`;

  const badge = document.createElement('span');
  badge.className = `risk-badge ${probClass} ${sizeClass}`;
  badge.textContent = `${Math.round(prob * 100)}%`;

  return badge;
}

function getProbabilityClass(prob) {
  const percentage = prob <= 1 ? prob * 100 : prob;
  if (percentage >= 70) return 'risk-badge--high';
  if (percentage >= 40) return 'risk-badge--medium';
  return 'risk-badge--low';
}

function getImpactClass(impact) {
  switch (impact?.toLowerCase()) {
    case 'high':
      return 'impact--high';
    case 'medium':
      return 'impact--medium';
    case 'low':
    default:
      return 'impact--low';
  }
}

function createImpactBadge(impact) {
  const badge = document.createElement('span');
  badge.className = `impact-badge ${getImpactClass(impact)}`;
  badge.textContent = `${impact} Impact`;
  return badge;
}

// Make available globally
window.PredictifyComponents = window.PredictifyComponents || {};
window.PredictifyComponents.createRiskBadge = createRiskBadge;
window.PredictifyComponents.createImpactBadge = createImpactBadge;
window.PredictifyComponents.getProbabilityClass = getProbabilityClass;
