import { debounce, handleize, isFromBreakpoint } from '@theme/helpers';
import { HTMLCustomElement } from '@theme/html-custom-element';

/**
 * A deferred and responsive video wrapper.
 *
 * - Use the `large-{mime_type}` attribute for each MIME type for the desktop video.
 * - Use `data-src` on the video element to lazy load.
 */
export class VideoElement extends HTMLCustomElement {
  requiredRefs = ['video'];

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this.on('resize', window, debounce(this.setDefaultState.bind(this)), null, true);
  }

  /**
   * Sets the default video source state.
   */
  setDefaultState() {
    if (!this.refs.video.checkVisibility()) return;

    this.setPosterDefaultState();

    for (const element of this.refs.video.children) {
      if (element.tagName === 'SOURCE') {
        this.setSourceDefaultState(element);
      } else if (element.hasAttribute('data-src')) {
        element.src = element.dataset.src;

        /**
         * Tidy up the lazy attribute.
         */
        element.removeAttribute('data-src');
      }
    }

    /**
     * Load the updated sources.
     */
    this.refs.video.load();

    if (this.refs.video.autoplay) {
      this.refs.video.play();
    }
  }

  /**
   * Sets the default video state based on viewport.
   *
   * @param {HTMLSourceElement} element - The video source element.
   */
  setSourceDefaultState(element) {
    if (isFromBreakpoint('large') && this.hasAttribute(`large-${handleize(element.type)}`)) {
      if (!element.hasAttribute('data-src')) {
        element.dataset.src = element.src;
      }

      element.src = this.getAttribute(`large-${handleize(element.type)}`);
      return;
    }

    if (element.hasAttribute('data-src')) {
      element.src = element.dataset.src;
    }
  }

  /**
   * Sets the responsive poster attribute.
   */
  setPosterDefaultState() {
    if (this.hasAttribute('large-poster') && isFromBreakpoint('large')) {
      if (this.refs.video.poster && !this.refs.video.hasAttribute('data-poster')) {
        this.refs.video.dataset.poster = this.refs.video.poster;
      }

      this.setPoster(this.getAttribute('large-poster'));
      return;
    }

    if (this.refs.video.hasAttribute('data-poster')) {
      this.setPoster(this.refs.video.dataset.poster);
    }
  }

  /**
   * Sets the video element's poster.
   *
   * @param {string} posterUrl - The poster url to set.
   */
  setPoster(posterUrl) {
    this.refs.video.poster = null;
    this.refs.video.poster = posterUrl;
  }
}

if (!customElements.get('video-element')) customElements.define('video-element', VideoElement);
