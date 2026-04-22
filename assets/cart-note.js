import { fetchConfig, json } from '@theme/fetch';
import { debounce } from '@theme/helpers';
import { HTMLCustomElement } from '@theme/html-custom-element';

class CartNote extends HTMLCustomElement {
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this.on(
      'keyup',
      this.refs.input,
      debounce(async () => {
        await json(
          fetch(
            `${theme.routes.cart_update_url}.js`,
            fetchConfig('json', {
              body: JSON.stringify({
                note: this.refs.input.value,
              }),
            }),
          ),
        );
      }),
    );
  }
}

if (!customElements.get('cart-note')) customElements.define('cart-note', CartNote);
