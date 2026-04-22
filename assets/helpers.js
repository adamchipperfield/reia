/**
 * Strings.
 */

/**
 * Capitalizes the string.
 *
 * @param {string} string - The source string to format.
 * @returns {string}
 */
export function capitalize(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

/**
 * Formats a string into camel case.
 *
 * @param {string} input - The string to format.
 * @returns {string}
 */
export function camelCase(input) {
  return input
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

/**
 * Formats a string into a handle (snake case).
 *
 * @param {string} input - The string to format.
 * @returns {string}
 */
export function handleize(input) {
  return input
    .toLowerCase()
    .replace(/[./\\]/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Cart.
 */

/**
 * Selectors of cart sections.
 */
const CART_SECTION_SELECTORS = [
  '.shopify-section-header',
  '.shopify-section-cart-drawer',
  '.shopify-section-main-cart',
];

/**
 * Returns the names of cart-related sections.
 *
 * @returns {string[]}
 */
export function getCartSectionNames() {
  return CART_SECTION_SELECTORS.map((selector) =>
    document.querySelector(selector)?.id.replace('shopify-section-', ''),
  ).filter(Boolean);
}

/**
 * Performance.
 */

/**
 * Defaults.
 */
export const THROTTLE_DEFAULT_WAIT = 100;
export const DEBOUNCE_DEFAULT_WAIT = 250;

/**
 * Ensures a function runs at most once per `wait` ms.
 * - Uses: scrolling, resizing, mouse movement, drag updates.
 *
 * @param {function} callback - The function to execute when timer is passed.
 * @param {number} wait - The amount of time before debounce call is triggered.
 * @param {boolean} immediate - Trigger the immediately.
 */
export function throttle(callback, wait = THROTTLE_DEFAULT_WAIT, immediate = false) {
  let timeout = null;
  let firstCall = true;

  return function (...args) {
    const callNow = immediate && firstCall;

    const next = () => {
      callback.apply(this, args);

      /**
       * Clear up the scheduler.
       */
      timeout = null;
    };

    if (callNow) {
      firstCall = false;

      /**
       * Run the callback immediately.
       */
      next();
    }

    if (!timeout) {
      timeout = setTimeout(next, wait);
    }
  };
}

/**
 * Delays execution until `wait` ms have passed since last call.
 * - Uses: after user stops interacting, like typing in a search field or autosaving forms.
 *
 * @param {function} callback The function to debounce.
 * @param {number} wait - The amount of time before debounce call is triggered.
 * @param {boolean} immediate - Trigger the immediately.
 */
export function debounce(callback, wait = DEBOUNCE_DEFAULT_WAIT, immediate = false) {
  let timeout = null;

  return function (...args) {
    const callNow = immediate && !timeout;

    const later = () => {
      timeout = null;

      if (!immediate) {
        callback.apply(this, args);
      }
    };

    clearTimeout(timeout);

    /**
     * Schedule the next run.
     */
    timeout = setTimeout(later, wait);

    if (callNow) {
      callback.apply(this, args);
    }
  };
}

/**
 * Media queries.
 */

/**
 * Breakpoints.
 */
export const breakpoints = {
  small: 576,
  medium: 768,
  large: 1024,
  xlarge: 1328,
};

/**
 * Returns if the viewport is at least the named breakpoint.
 *
 * @param {keyof typeof breakpoints} breakpoint - The name of the breakpoint.
 * @returns {boolean}
 */
export function isFromBreakpoint(breakpoint) {
  return window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`).matches;
}

/**
 * Returns if the viewport is less than the named breakpoint.
 *
 * @param {keyof typeof breakpoints} breakpoint - The name of the breakpoint.
 * @returns {boolean}
 */
export function isUntilBreakpoint(breakpoint) {
  return window.matchMedia(`(max-width: ${breakpoints[breakpoint] - 1}px)`).matches;
}

/**
 * Elements.
 */

/**
 * State classes.
 */
export const classes = {
  active: 'is-active',
  disabled: 'is-disabled',
  hidden: 'hidden',
  loading: 'is-loading',
  open: 'is-open',
  ready: 'is-ready',
  tabbable: 'is-tabbable',
  transitioning: 'is-transitioning',
  noTransition: 'no-transition',
};

/**
 * Returns parsed HTML from a string.
 *
 * @param {string} text - The text to parse.
 * @param {string} selector - Optional child selector.
 * @returns {Document|HTMLElement}
 */
export function parseHtml(text, selector) {
  const parsed = new DOMParser().parseFromString(text, 'text/html');

  /**
   * Return a selected element if a selector is provided.
   */
  if (selector) return parsed.querySelector(selector);

  return parsed;
}

/**
 * Input events related to updates.
 */
const INPUT_UPDATE_EVENTS = ['input', 'change'];

/**
 * Set a number input's value and dispatch standard events.
 *
 * @param {HTMLInputElement} input
 * @param {number} value
 */
export function setInputValue(input, value) {
  input.value = value;

  /**
   * Dispatch both input and change events like native user input.
   */
  INPUT_UPDATE_EVENTS.forEach((type) => input.dispatchEvent(new Event(type, { bubbles: true })));
}

/**
 * Returns a parsed attribute values.
 *
 * @param {HTMLElement} element - The element to get attributes from.
 * @param {string} attribute - The attribute name.
 * @param {any} fallback - The fallback value, if the attribute isn't found.
 * @returns {boolean|number|string}
 */
export function getAttributeValue(element, attribute, fallback = null) {
  const value = element.getAttribute(attribute);
  const lowercase = value && value.toLowerCase();

  if (value === null) return fallback;

  /**
   * Booleans.
   */
  if (lowercase === '' || lowercase === 'true') return true;
  if (lowercase === 'false') return false;

  /**
   * Numbers.
   */
  if (!isNaN(Number(value))) return Number(value);

  return value;
}

/**
 * Returns elements related to the parent element.
 *
 * @param {HTMLElement} element - The parent custom element.
 * @param {string} [tagName] - Custom tag name selector, defaults to the element.
 * @returns {Record<string, HTMLElement & { all: HTMLElement[] }>}
 * @example <div data-ref="example-element.item"></div>
 */
export function getRefs(element, tagName) {
  if (!element) return null;

  if (!tagName) {
    tagName = element.tagName.toLowerCase();
  }

  return [...element.querySelectorAll(`[data-ref^="${tagName}"]`)].reduce((refs, ref) => {
    const key = camelCase(ref.dataset.ref.replace(`${tagName}.`, ''));

    if (tagName === element.tagName.toLowerCase() && !(ref.closest(tagName) === element)) return refs;

    if (!Object.hasOwn(refs, key)) {
      refs[key] = ref;
    }

    /**
     * Define the `all` property, for multiple refs of the same name.
     */
    if (Object.hasOwn(refs[key], 'all')) {
      if (!refs[key].all.includes(ref)) {
        refs[key].all.push(ref);
      }
    } else {
      Object.defineProperty(refs[key], 'all', {
        value: [ref],
      });
    }

    return refs;
  }, {});
}

/**
 * Replaces an element with it's updated version.
 *
 * @param {HTMLElement} fromElement - The current element.
 * @param {HTMLElement} toElement - The updated element.
 * @param {boolean} childrenOnly - Only updates the elements' children.
 * @param {function(HTMLElement): boolean} onBeforeElUpdated - Decides if an element should be morphed.
 * @returns {Promise<HTMLElement>}
 */
export async function morph(fromElement, toElement, childrenOnly, onBeforeElUpdated) {
  const { default: morphdom } = await import('@theme/morphdom');

  return morphdom(fromElement, toElement, {
    childrenOnly,
    onBeforeElUpdated,
  });
}

/**
 * Shopify's dynamic elements.
 */
const DYNAMIC_SHOPIFY_ELEMENTS = ['dynamic-checkout-cart', 'payment-button'];

/**
 * Updates a section's elements with refreshed content.
 *
 * @param {string} sectionId - The section name.
 * @param {string} sectionHtml - The section content.
 * @returns {Promise<HTMLElement[]>}
 */
export async function updateSectionElements(sectionId, sectionHtml) {
  const elements = Array.from(document.querySelectorAll(`[data-section-element][data-section="${sectionId}"]`));
  const section = elements.length && parseHtml(sectionHtml);

  if (elements.length === 0) return [];

  return Promise.all(
    elements.map((element) => {
      const matchedElement = section.querySelector(`[data-section-element="${element.dataset.sectionElement}"]`);

      if (matchedElement) {
        return morph(
          element,
          matchedElement,
          false,
          /**
           * Exclude dynamic Shopify elements.
           */
          (from) => !DYNAMIC_SHOPIFY_ELEMENTS.includes(from.dataset.shopify),
        );
      }

      return null;
    }),
  );
}

/**
 * Events.
 */

/**
 * Adds an event listener to an element or elements.
 *
 * @param {string} event - The event name.
 * @param {HTMLElement | HTMLElement[]} element - The element(s) to apply the listener to.
 * @param {function} handler - The listener callback.
 * @param {AddEventListenerOptions} options - Options for the event listener.
 * @param {boolean} immediate - Runs the handler immedaitely, without an event payload.
 * @returns {function} Removes the event listeners.
 */
export function on(event, element, handler, options, immediate) {
  const add = (element) => element.addEventListener(event, handler, options);
  const remove = (element) => element.removeEventListener(event, handler, options);

  if (!element) return () => null;

  /**
   * Handle multiple elements.
   */
  if (Array.isArray(element)) {
    [...element].forEach(add);

    return () => {
      [...element].forEach(remove);

      return null;
    };
  }

  add(element);

  if (immediate) handler();

  return () => {
    remove(element);

    /**
     * Return nothing once the listener has been removed.
     */
    return null;
  };
}

/**
 * URL.
 */

/**
 * Pushes a query parameter to the current location state.
 *
 * @param {string} key - The parameter key.
 * @param {string} value - The value to push (optional).
 */
export function updateQueryParam(key, value, push = false) {
  const url = new URL(window.location.href);

  if (value === null) {
    /**
     * Delete the search parameter if `null` is passed.
     */
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }

  window.history[push ? 'pushState' : 'replaceState']({}, '', url);
}
