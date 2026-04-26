import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `animated-image`
 * Creates a button that switches between two images on hover.
 * Used as an animated indicator or animated home button.
 * 
 * @demo index.html
 * @element animated-image
 */
export class AnimatedImage extends DDDSuper(I18NMixin(LitElement)) {

    static get tag() {
        return "animated-image";
    }

    constructor() {
        super();
        this.src = "";
        this.hoveredSrc = "";
        this.link = "";
        this.isHovered = false;
        this.internalHovered = false;
    }

    // Lit reactive properties
    static get properties() {
        return {
            ...super.properties,
            src: { type: String },
            hoveredSrc: { type: String },
            link: { type: String },
            isHovered: { type: Boolean }, // From parent
            internalHovered: { type: Boolean, state: true } // Own hover state
        };
    }

    // Lit scoped styles
    static get styles() {
        return [super.styles,
        css`
            :host {
                display: inline-block;
            }
            .image-container {
                display: inline-block;
                cursor: pointer;
            }
            .image-container.no-link {
                cursor: default;
            }
            a.image-container img {
                display: block;
                width: 100px;
                height: 100px;
                object-fit: contain;
            }
            .image-container.no-link img {
                display: block;
                width: 64px;
                height: 64px;
                object-fit: contain;
            }
        `];
    }

    _handleMouseEnter() {
        this.internalHovered = true;
    }

    _handleMouseLeave() {
        this.internalHovered = false;
    }

    _getCurrentSrc() {
        const shouldShowHovered = (this.isHovered || this.internalHovered) && this.hoveredSrc;
        return shouldShowHovered ? this.hoveredSrc : this.src;
    }

    // Lit render the HTML
    render() {
        if (this.link) {
            return html`
                <a 
                    href="${this.link}"
                    class="image-container"
                    @mouseenter="${this._handleMouseEnter}"
                    @mouseleave="${this._handleMouseLeave}">
                    <img src="${this._getCurrentSrc()}" alt="" />
                </a>
            `;
        }
        
        return html`
            <div 
                class="image-container no-link"
                @mouseenter="${this._handleMouseEnter}"
                @mouseleave="${this._handleMouseLeave}">
                <img src="${this._getCurrentSrc()}" alt="" />
            </div>
        `;
    }
}

globalThis.customElements.define(AnimatedImage.tag, AnimatedImage);
