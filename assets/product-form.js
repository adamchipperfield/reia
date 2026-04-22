import { events, publish } from '@theme/event-bus';
import { fetchConfig, json } from '@theme/fetch';
import { classes, getCartSectionNames } from '@theme/helpers';
import { HTMLCustomElement } from '@theme/html-custom-element';

class ProductForm extends HTMLCustomElement {
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this.on('submit', this.refs.form, this.handleFormSubmit.bind(this));
    this.on('change', this.refs.option && this.refs.option.all, this.handleOptionChange.bind(this));
    this.on('change', this.refs.giftCardFormCheckbox, this.handleGiftCardFormCheckbox.bind(this));
  }

  /**
   * Handles the option change event.
   */
  handleOptionChange() {
    const values = this.refs.option.all.filter(({ checked }) => checked).map(({ dataset }) => dataset.optionValueId);

    this.dispatchEvent(
      new CustomEvent('option-change', {
        detail: values,
      }),
    );
  }

  /**
   * Handles the form submit event.
   */
  handleFormSubmit(event) {
    const body = new FormData(event.target);

    event.preventDefault();

    this.setAddingState();
    this.setFormMessage();

    body.append('attributes[Test]', 'Test value');

    /**
     * Include the cart sections in the response.
     */
    body.append('sections', getCartSectionNames());

    try {
      json(fetch(theme.routes.cart_add_url, fetchConfig('javascript', { body }))).then((response) => {
        this.handleSubmitResponse(response);
        this.setAddingState(true);
      });
    } catch {
      event.target.submit();
    }
  }

  /**
   * Handles the form submit response.
   *
   * @param {object} response - The form response.
   */
  handleSubmitResponse(response) {
    if (response.message) {
      this.setFormMessage(response.message);
      return;
    }

    publish(events.cartUpdated);
    publish(events.cartAdded);
    publish(events.sectionUpdate, { sections: response.sections });

    this.refs.quantity.value = 1;
  }

  /**
   * Handles the gift card recipient form checkbox change.
   *
   * @param {InputEvent} event - The checkbox event.
   */
  handleGiftCardFormCheckbox(event) {
    if (this.refs.giftCardField) {
      for (const element of this.refs.giftCardField.all) {
        element.classList.toggle(classes.hidden, !event.target.checked);
      }
    }

    if (this.refs.giftCardInput) {
      for (const element of this.refs.giftCardInput.all) {
        element.disabled = !event.target.checked;
      }
    }
  }

  /**
   * Sets the form message state.
   *
   * @param {string} text - The message to set.
   */
  setFormMessage(text = '') {
    if (!this.refs.message) return;

    this.refs.message.innerHTML = text;
  }

  /**
   * Sets the form's "adding" state, when adding to cart.
   *
   * @param {boolean} remove - Removes the adding state.
   */
  setAddingState(remove = false) {
    if (!this.refs.submit) return;

    this.refs.submit.innerHTML = theme.strings.product[remove ? 'add_to_cart' : 'adding_to_cart'];
    this.refs.submit.disabled = !remove;
  }
}

if (!customElements.get('product-form')) customElements.define('product-form', ProductForm);
