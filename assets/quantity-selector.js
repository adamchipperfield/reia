import { setInputValue } from '@theme/helpers';
import { HTMLCustomElement } from '@theme/html-custom-element';

class QuantitySelector extends HTMLCustomElement {
  /**
   * @returns {HTMLInputElement}
   */
  get input() {
    return this.querySelector('input[type=number]');
  }

  /**
   * Returns the input minimum value.
   */
  get min() {
    return this.input.min === '' ? -Infinity : Number(this.input.min);
  }

  /**
   * Returns the input maximum value.
   */
  get max() {
    return this.input.max === '' ? Infinity : Number(this.input.max);
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    if (!this.input) {
      throw new Error('A number input is required.');
    }

    this.on('click', this.refs.decrease, () => this.adjustValue(-1));
    this.on('click', this.refs.increase, () => this.adjustValue(+1));
    this.on('change', this.input, this.handleChange.bind(this), null, true);
  }

  /**
   * Adjusts the input value by the provided number.
   *
   * @param {number} adjustment - The value adjustment.
   */
  adjustValue(adjustment) {
    const current = Number(this.input.value) || 0;
    const value = current + adjustment;

    /**
     * Return if the input has reached its bounds.
     */
    if (value < this.min || value > this.max) return;

    setInputValue(this.input, value);
  }

  /**
   * Handles the input change event.
   */
  handleChange() {
    const value = Number(this.input.value) || 0;

    this.refs.decrease.disabled = value <= this.min;
    this.refs.increase.disabled = value >= this.max;
  }
}

if (!customElements.get('quantity-selector')) customElements.define('quantity-selector', QuantitySelector);
