import { events, publish } from '@theme/event-bus';
import { fetchConfig, json } from '@theme/fetch';
import { classes, getCartSectionNames } from '@theme/helpers';
import { HTMLCustomElement } from '@theme/html-custom-element';

class CartDiscount extends HTMLCustomElement {
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this.on('submit', this.refs.form, this.handleFormSubmit.bind(this));

    this.on('click', this, (event) => {
      if (this.isRef(event.target, 'remove')) this.handleRemoveClick(event);
    });
  }

  /**
   * Handles the discount form submit.
   *
   * @param {SubmitEvent} event - The form submit event.
   */
  async handleFormSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const discount = form.get('discount');

    if (this.refs.submit) this.refs.submit.disabled = true;

    this.updateCartDiscount(
      Array.from(
        new Set([
          discount,
          ...(this.getAttribute('applied-codes') === '' ? [] : this.getAttribute('applied-codes').split(', ')),
        ]),
      ).join(','),
    ).then(({ discount_codes } = {}) => {
      const code = discount_codes && discount_codes.find(({ code }) => code === discount);

      if (this.refs.submit) this.refs.submit.disabled = false;

      if (!code || (code && !code.applicable)) {
        this.showError();
        return;
      }

      this.hideError();
    });
  }

  /**
   * Handles the remove click event.
   *
   * @param {MouseEvent} event - The click event.
   */
  handleRemoveClick(event) {
    event.target.disabled = true;

    this.updateCartDiscount(
      this.getAttribute('applied-codes')
        .split(', ')
        .filter((appliedCode) => !(appliedCode === event.target.dataset.discount))
        .join(','),
    );
  }

  /**
   * Updates the cart's discount property.
   *
   * @param {string} discount - The discount code to apply.
   * @returns {Promise<{ discount_codes: { code: string; applicable: boolean; }[] }>}
   */
  updateCartDiscount(discount) {
    try {
      this.hideError();

      return json(
        fetch(
          `${theme.routes.cart_update_url}.js`,
          fetchConfig('json', {
            body: JSON.stringify({
              discount,
              sections: getCartSectionNames(),
            }),
          }),
        ),
      ).then(({ discount_codes, sections }) => {
        return new Promise((resolve) => {
          /**
           * Don't update the sections if there is an error.
           */
          if (discount_codes.length && !discount_codes.find(({ applicable }) => applicable)) {
            resolve();
            return;
          }

          publish(events.sectionUpdate, {
            sections,
            onAfterElementsUpdated() {
              resolve({
                discount_codes,
              });
            },
          });
        });
      });
    } catch {
      this.showError();
    }
  }

  /**
   * Shows the error message.
   */
  showError() {
    if (this.refs.error) this.refs.error.classList.remove(classes.hidden);
  }

  /**
   * Hides the error message.
   */
  hideError() {
    if (this.refs.error) this.refs.error.classList.add(classes.hidden);
  }
}

if (!customElements.get('cart-discount')) customElements.define('cart-discount', CartDiscount);
