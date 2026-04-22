import { on } from '@theme/helpers';

/**
 * Event keys.
 */

export const events = {
  cartUpdated: 'cart-updated',
  cartAdded: 'cart-added',
  sectionUpdate: 'section-update',
  escapeKey: 'escape-key',
  toggleElementOpening: 'toggle-element-opening',
  toggleElementOpen: 'toggle-element-open',
  toggleElementClose: 'toggle-element-close',
  toggleElementToggle: 'toggle-element-toggle',
};

/**
 * Subscribes a callback to an event.
 *
 * @param {string} eventName - The event name.
 * @param {function} callback - Runs when the event is published.
 * @returns {function}
 */
export function subscribe(eventName, callback) {
  return on(eventName, document, (event) => callback(event.detail ?? undefined));
}

/**
 * Publishes an event, which triggers any subscribed callbacks.
 *
 * @param {string} eventName - The event name.
 * @param {any} detail - The event payload.
 */
export function publish(eventName, detail) {
  document.dispatchEvent(new CustomEvent(eventName, { detail }));
}
