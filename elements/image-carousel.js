import { LitElement, html, css } from "lit";

const pic1 = new URL("./page-boilerplate/images/grimace_mets.jpeg", import.meta.url).href;
const pic2 = new URL("./page-boilerplate/images/mets_rizzler.webp", import.meta.url).href;
const pic3 = new URL("./page-boilerplate/images/mets_crowd.jpeg", import.meta.url).href;
const pic4 = new URL("./page-boilerplate/images/mets_mascot.jpg", import.meta.url).href;

export class ImageCarousel extends LitElement {
  static properties = {
    images: { type: Array },
    selectedIndex: { type: Number },
  };

  constructor() {
    super();
    this.selectedIndex = 0;
    this.images = [
      { src: pic1, caption: "Grimace throws out the first pitch!" },
      { src: pic2, caption: "Mets Rizzler in the building!" },
      { src: pic3, caption: "Packed crowd at Citi Field!" },
      { src: pic4, caption: "Mr. Met cheering on the team!" },
    ];
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      margin: 15px 0;
    }

    :host {
      --bg-color: #f97316;
      --text-color: #ffffff;
      --border-color: #1e3a8a;
      --accent-color: #1e3a8a;
    }

    @media(prefers-color-scheme: dark) {
      :host {
        --bg-color: #1e3a8a;
        --text-color: #ffffff;
        --border-color: #f97316;
        --accent-color: #f97316;
      }
    }

    .caption {
      position: absolute;
      padding: 8px;
      font-size: 16px;
      color: var(--text-color);
    }

    .slide {
      position: relative;
      display: none;
      width: 100%;
      max-width: 400px;
      aspect-ratio: 4 / 3;
      margin: 0 auto;
      overflow: hidden;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background-color: var(--bg-color);
      color: var(--text-color);
      text-align: center;
    }

    .slide.active {
      display: block;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--accent-color);
      border: none;
      font-size: 22px;
      padding: 6px 10px;
      cursor: pointer;
      color: var(--bg-color);
      border-radius: 50%;
      opacity: 0.85;
    }

    button.prev {
      left: 8px;
    }

    button.next {
      right: 8px;
    }

  `;

render() {
  return html`
    ${this.images.map(
      (item, index) => html`
        <div class="slide ${index === this.selectedIndex ? 'active' : ''}">
          <img src="${item.src}" alt="Image ${index + 1}" />
          <div class="caption">${item.caption}</div>
        </div>
      `
    )}

    <button class="prev" @click=${this.prev}>&lt;</button>
    <button class="next" @click=${this.next}>&gt;</button>
  `;
}

  connectedCallback() {
    super.connectedCallback();
    this.startAutoSlide();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  startAutoSlide() {
    this._timer = setInterval(() => {
      this.next();
    }, 10000);
  }

  resetTimer() {
    clearInterval(this._timer);
    this.startAutoSlide();
  }

  prev() {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.images.length) % this.images.length;
    this.resetTimer();
  }

  next() {
    this.selectedIndex =
      (this.selectedIndex + 1) % this.images.length;
    this.resetTimer();
  }
}

customElements.define("image-carousel", ImageCarousel);
