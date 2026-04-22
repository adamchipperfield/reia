import { subscribe } from '@theme/event-bus';
import { capitalize, getRefs, handleize, on } from '@theme/helpers';

/**
 * General custom element helpers, such as ref selectors and event management.
 */
export class HTMLCustomElement extends HTMLElement {
  events = [];

  /**
   * Throws an error if any of these attributes don't exist.
   * @type {string[]}
   */
  requiredAttributes = [];

  /**
   * Throws an error if any of these refs don't exist.
   * @type {string[]}
   */
  requiredRefs = [];

  constructor() {
    super();

    this.resetRefs();
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    if (this.requiredAttributes && this.requiredAttributes.length) {
      for (const attribute of this.requiredAttributes) {
        if (!this.hasAttribute(attribute)) {
          throw new MissingRequiredAttributeError(attribute, this);
        }
      }
    }

    if (this.requiredRefs && this.requiredRefs.length) {
      for (const name of this.requiredRefs) {
        if (!this.refs[name]) {
          throw new MissingRequiredRefError(name, this);
        }
      }
    }
  }

  /**
   * Returns elements related to the custom element.
   * @returns {ReturnType<typeof import('@theme/helpers').getRefs>}
   */
  get refs() {
    return this.cachedRefs ?? {};
  }

  /**
   * Returns if the given element is the named ref for the current custom element.
   * @param {HTMLElement} element - The element to test.
   * @param {string} name - The ref name.
   * @returns {boolean}
   */
  isRef(element, name) {
    return element.dataset.ref === `${this.tagName.toLowerCase()}.${handleize(name)}`;
  }

  /**
   * Applies a self-cleaning event listener.
   * @param {Parameters<typeof import('@theme/helpers').on>} args - The `on` helper arguments.
   */
  on(...args) {
    this.events.push(on(...args));
  }

  /**
   * Applies a self-cleaning Event Bus listener.
   * @param {Parameters<typeof import('@theme/event-bus').subscribe>} args - The `on` helper arguments.
   */
  subscribe(...args) {
    this.events.push(subscribe(...args));
  }

  /**
   * Removes all self-cleaning event listeners.
   */
  removeEventListeners() {
    for (const removeEvent of this.events) {
      removeEvent();
    }

    /**
     * Clear the event state.
     */
    this.events = [];
  }

  /**
   * Queries the refs again.
   */
  resetRefs() {
    this.cachedRefs = getRefs(this);
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }
}

class MissingRequiredAttributeError extends Error {
  /**
   * @param {string} attribute
   * @param {HTMLCustomElement} element
   */
  constructor(attribute, element) {
    super(`Required attribute "${attribute}" not found on element ${element.tagName.toLowerCase()}`);
  }
}

class MissingRequiredRefError extends Error {
  /**
   * @param {string} name
   * @param {HTMLCustomElement} element
   */
  constructor(name, element) {
    super(`Required ref "${name}" not found in element ${element.tagName.toLowerCase()}`);
  }
}

/**
 * Applies section specific helpers.
 * - Extend this custom element to hook into theme editor events.
 */
export class HTMLShopifySectionElement extends HTMLCustomElement {
  /**
   * Returns the Shopify section container.
   * @returns {HTMLElement}
   */
  get container() {
    return this.closest('.shopify-section');
  }

  /**
   * The Shopify theme editor event names.
   * @returns {string[]}
   */
  get eventNames() {
    return [
      'shopify:section:select',
      'shopify:section:deselect',
      'shopify:section:reorder',
      'shopify:block:select',
      'shopify:block:deselect',
    ];
  }

  /**
   * Maps the event names into an array of event objects, with their handlers.
   * @returns {{
   *   name: string
   *   handler: function
   * }[]}
   */
  get editorEvents() {
    return this.eventNames.reduce((handlers, name) => {
      const methodName = this.convertEventToMethodName(name);
      const handler = this[methodName];

      if (typeof handler === 'function') {
        handlers.push({
          name,
          handler: (event) => handler.call(this, event),
        });
      }

      return handlers;
    }, []);
  }

  /**
   * Converts a theme editor event name into it's corresponding method.
   * @param {string} eventName - The original event name.
   * @returns {string}
   */
  convertEventToMethodName(eventName) {
    return `on${eventName.split(':').slice(1).map(capitalize).join('')}`;
  }

  /**
   * Called each time the element is added to the document.
   */
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    if (!this.container) {
      return;
    }

    for (const { name, handler } of this.editorEvents) {
      this.on(name, this.container, handler);
    }
  }
}
