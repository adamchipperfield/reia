import { text } from '@theme/fetch';
import { morph, parseHtml } from '@theme/helpers';
import { HTMLCustomElement } from '@theme/html-custom-element';

class ProductRecommendations extends HTMLCustomElement {
  requiredAttributes = ['url'];

  connectedCallback() {
    text(fetch(`${this.getAttribute('url')}`), async (response) => {
      /**
       * @see https://shopify.dev/docs/api/ajax/reference/product-recommendations#error-responses
       */

      if (response.status === 404) {
        throw new Error('Product or section not found');
      }

      if (response.status === 422) {
        throw new Error('A parameter was invalid');
      }

      return response;
    }).then((response) => {
      morph(this, parseHtml(response, 'product-recommendations'));
    });
  }
}

if (!customElements.get('product-recommendations'))
  customElements.define('product-recommendations', ProductRecommendations);
