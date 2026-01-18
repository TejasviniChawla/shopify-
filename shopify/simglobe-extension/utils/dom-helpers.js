/**
 * DOM Helper utilities for Predictify extension
 */

const PredictifyDom = {
  /**
   * Wait for an element to appear in the DOM
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Element>}
   */
  waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver((mutations, obs) => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }, timeout);
    });
  },

  /**
   * Wait for multiple elements to appear
   * @param {string} selector - CSS selector
   * @param {number} minCount - Minimum number of elements
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<NodeList>}
   */
  waitForElements(selector, minCount = 1, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length >= minCount) {
        return resolve(elements);
      }

      const observer = new MutationObserver((mutations, obs) => {
        const els = document.querySelectorAll(selector);
        if (els.length >= minCount) {
          obs.disconnect();
          resolve(els);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        const els = document.querySelectorAll(selector);
        if (els.length > 0) {
          resolve(els);
        } else {
          reject(new Error(`Timeout waiting for elements: ${selector}`));
        }
      }, timeout);
    });
  },

  /**
   * Create an element with attributes and children
   * @param {string} tag - HTML tag name
   * @param {Object} attrs - Attributes to set
   * @param {Array|string} children - Child elements or text
   * @returns {HTMLElement}
   */
  createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, value);
      } else if (key === 'dataset' && typeof value === 'object') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });

    if (typeof children === 'string') {
      element.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          element.appendChild(child);
        }
      });
    }

    return element;
  },

  /**
   * Insert element after a reference element
   * @param {Element} newElement - Element to insert
   * @param {Element} referenceElement - Reference element
   */
  insertAfter(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
  },

  /**
   * Check if Predictify is already injected on the page
   * @param {string} identifier - Unique identifier for the injection
   * @returns {boolean}
   */
  isAlreadyInjected(identifier) {
    return document.querySelector(`[data-simglobe="${identifier}"]`) !== null;
  },

  /**
   * Mark an element as injected by Predictify
   * @param {Element} element - Element to mark
   * @param {string} identifier - Unique identifier
   */
  markAsInjected(element, identifier) {
    element.setAttribute('data-simglobe', identifier);
  },

  /**
   * Remove all Predictify injections
   */
  removeAllInjections() {
    document.querySelectorAll('[data-simglobe]').forEach(el => el.remove());
  },

  /**
   * Observe URL changes for SPA navigation
   * @param {Function} callback - Callback when URL changes
   * @returns {Function} - Cleanup function
   */
  observeUrlChanges(callback) {
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        callback(location.href);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also listen for popstate
    const popstateHandler = () => callback(location.href);
    window.addEventListener('popstate', popstateHandler);

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', popstateHandler);
    };
  }
};

// Make available globally
window.PredictifyDom = PredictifyDom;
