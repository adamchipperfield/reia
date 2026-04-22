import { events, publish, subscribe } from '@theme/event-bus';
import { classes, on, updateSectionElements } from '@theme/helpers';
import { SelectProvider } from '@theme/select-provider';
import { ToggleButton, ToggleElement } from '@theme/toggle-element';

/**
 * Keyboard events.
 */
on('keyup', document, (event) => {
  if (event.key === 'Escape') publish(events.escapeKey);
  if (event.key === 'Tab') document.body.classList.add(classes.tabbable);
});

/**
 * Custom elements.
 */
customElements.define('select-provider', SelectProvider);
customElements.define('toggle-element', ToggleElement);
customElements.define('toggle-button', ToggleButton);

/**
 * Handles Section Rendering API events.
 */
subscribe(events.sectionUpdate, async ({ sections, onAfterElementsUpdated }) => {
  await Promise.all(
    Object.entries(sections).map(([sectionId, sectionHtml]) => updateSectionElements(sectionId, sectionHtml)),
  );

  if (typeof onAfterElementsUpdated === 'function') {
    onAfterElementsUpdated();
  }
});
