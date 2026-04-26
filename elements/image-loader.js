import { LitElement } from "lit";

class ImageLoader extends LitElement {
  static get properties() {
    return {
      src: { type: String } // API endpoint
    };
  }

  constructor() {
    super();
    this.src = "/api/images.json";
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadImages();
  }

  async loadImages() {
    try {
      const res = await fetch(this.src);
      const images = await res.json();

      const carousel = this.closest("image-carousel") ||
        document.querySelector("image-carousel");

      if (!carousel) {
        console.warn("image-loader: No <image-carousel> found.");
        return;
      }

      images.forEach((img, index) => {
        const fig = document.createElement("figure");
        fig.id = img.id;
        if (index === 0) fig.setAttribute("active", "");

        fig.innerHTML = `
          <img src="${img.src}" alt="${img.alt}">
          <figcaption>${img.caption}</figcaption>
        `;

        carousel.appendChild(fig);
      });

    } catch (err) {
      console.error("image-loader: Failed to load images", err);
    }
  }
}

customElements.define("image-loader", ImageLoader);
