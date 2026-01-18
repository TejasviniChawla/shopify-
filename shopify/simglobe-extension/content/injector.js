/**
 * Predictify Main Injector
 * Orchestrates page detection and delegates to specific injectors
 */

(function() {
  'use strict';

  // Check if extension is disabled
  const checkEnabled = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['simglobe_enabled'], (result) => {
        resolve(result.simglobe_enabled !== false); // Default to enabled
      });
    });
  };

  // Detect current Shopify Admin page type
  const detectPage = () => {
    const path = window.location.pathname;

    // Home dashboard
    if (path.match(/\/store\/[^\/]+\/home/) || path.match(/\/store\/[^\/]+\/?$/)) {
      return 'home';
    }

    // Marketing campaigns
    if (path.includes('/marketing/campaigns') || path.includes('/marketing')) {
      return 'campaigns';
    }

    // Individual product page
    if (path.match(/\/products\/\d+/)) {
      return 'product';
    }

    // Products list
    if (path.includes('/products')) {
      return 'products-list';
    }

    // Orders
    if (path.includes('/orders')) {
      return 'orders';
    }

    // Analytics
    if (path.includes('/analytics')) {
      return 'analytics';
    }

    return 'other';
  };

  // Main initialization
  const init = async () => {
    // Check if enabled
    const enabled = await checkEnabled();
    if (!enabled) {
      console.log('Predictify: Extension is disabled');
      return;
    }

    // Detect page type
    const pageType = detectPage();
    console.log(`Predictify: Activated on ${pageType} page`);

    // Get injectors
    const { injectSidebar, injectCampaignsWidget, injectProductAction, injectProductsListRisks } = window.PredictifyInjectors || {};

    try {
      // Always inject sidebar navigation (unless already done)
      if (injectSidebar) {
        await injectSidebar();
      }

      // Page-specific injections
      switch (pageType) {
        case 'home':
          // Home widget disabled - users can access Predictify from sidebar
          break;

        case 'campaigns':
          if (injectCampaignsWidget) {
            await injectCampaignsWidget();
          }
          break;

        case 'product':
          if (injectProductAction) {
            await injectProductAction();
          }
          break;

        case 'products-list':
          if (injectProductsListRisks) {
            await injectProductsListRisks();
          }
          break;

        case 'orders':
          // Could add order risk indicators here
          break;

        case 'analytics':
          // Could add market correlation charts here
          break;

        default:
          // No specific injection for other pages
          break;
      }

      // Log successful initialization
      console.log('Predictify: Initialization complete');

    } catch (error) {
      console.error('Predictify: Initialization error:', error);
    }
  };

  // Handle SPA navigation
  const handleNavigation = () => {
    let lastPath = window.location.pathname;

    // Use MutationObserver to detect navigation in SPA
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        console.log('Predictify: Navigation detected, re-initializing...');

        // Small delay to let the new page render
        setTimeout(() => {
          // Close Predictify main page if open and restore original content
          const { closePredictifyMainPage } = window.PredictifyInjectors || {};
          if (closePredictifyMainPage) {
            closePredictifyMainPage();
          }

          // Remove old injections before re-injecting
          const oldInjections = document.querySelectorAll('[data-simglobe]');
          oldInjections.forEach(el => {
            // Don't remove sidebar on navigation, but do remove main-page
            const type = el.getAttribute('data-simglobe');
            if (type !== 'sidebar') {
              el.remove();
            }
          });

          init();
        }, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also listen for popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      setTimeout(init, 500);
    });
  };

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      handleNavigation();
    });
  } else {
    init();
    handleNavigation();
  }

  // Expose for debugging
  window.Predictify = {
    reinit: init,
    detectPage,
    version: '1.0.0'
  };

})();
