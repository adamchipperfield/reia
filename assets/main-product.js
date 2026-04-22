import { events, publish } from '@theme/event-bus';
import { sectionStatusHandler, text } from '@theme/fetch';
import { parseHtml, updateQueryParam } from '@theme/helpers';
import { HTMLCustomElement } from '@theme/html-custom-element';

customElements.define(
  'main-product',
  class MainProduct extends HTMLCustomElement {
    requiredAttributes = ['section-id'];

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();

      this.on('option-change', this.refs.form, this.handleOptionChange.bind(this));
    }

    /**
     * Handles the product form option change event.
     *
     * @param {object} event - The event payload.
     */
    async handleOptionChange(event) {
      const response = await this.getSectionByOptionValues(event.detail);
      const section = parseHtml(response, this.tagName.toLowerCase());

      publish(events.sectionUpdate, {
        sections: {
          [this.getAttribute('section-id')]: response,
        },
      });

      updateQueryParam('variant', section.getAttribute('selected-variant'));
    }

    /**
     * Fetches and returns the updated section.
     *
     * @param {string[]} values - The selected option values.
     * @returns {Promise<string>}
     */
    getSectionByOptionValues(values) {
      return text(
        fetch(
          `${window.location.pathname}?section_id=${this.getAttribute('section-id')}&option_values=${values.join(',')}`,
        ),
        sectionStatusHandler,
      );
    }
  },
);
