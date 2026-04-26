import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./animated-image.js";

/**
 * `nav-button`
 * The code for all of our buttons, directing to different pages!
 * 
 * @demo index.html
 * @element nav-button
 */
export class NavButton extends DDDSuper(I18NMixin(LitElement)) {

    static get tag() {
        return "nav-button";
    }

    constructor() {
        super();
        this.label = "";
        this.link = "/";
        this.isOpen = false;
        this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        
        this._handleResize = this._handleResize.bind(this);
        this._handleClickOutside = this._handleClickOutside.bind(this);
    }

    // Lit reactive properties
    static get properties() {
        return {
            ...super.properties,
            label: { type: String },
            link: { type: String },
            isOpen: { type: Boolean, reflect: true },
            isMobile: { type: Boolean }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._mediaQuery = window.matchMedia("(max-width: 768px)");
        this._mediaQuery.addEventListener('change', this._handleResize);
        document.addEventListener('click', this._handleClickOutside);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._mediaQuery?.removeEventListener('change', this._handleResize);
        document.removeEventListener('click', this._handleClickOutside);
    }

    _handleResize(e) {
        this.isMobile = e.matches;
        if (this.isOpen) {
            this.isOpen = false;
        }
    }

    _handleClickOutside(e) {
        // Only handle click-outside on mobile
        if (!this.isMobile || !this.isOpen) return;
        
        // Check if click is outside this component
        if (!e.composedPath().includes(this)) {
            this.isOpen = false;
        }
    }

    _handleMouseEnter() {
        // Only open on hover for desktop
        if (!this.isMobile) {
            this.isOpen = true;
        }
    }

    _handleMouseLeave() {
        // Only close on mouse leave for desktop
        if (!this.isMobile) {
            this.isOpen = false;
        }
    }

    _handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // On mobile, toggle the dropdown and dispatch event to close others
        if (this.isMobile) {
            const wasOpen = this.isOpen;
            
            // Dispatch event to close all other dropdowns
            this.dispatchEvent(new CustomEvent('nav-button-click', {
                bubbles: true,
                composed: true,
                detail: { button: this }
            }));
            
            this.isOpen = !wasOpen;
        }
    }

    // Lit scoped styles
    static get styles() {
        return [super.styles,
        css`

            /* Light Theme */
            :host {
                --bg-color: var(--ddd-theme-default-roarLight);
                --text-color: #f97316;
                --hover-color: #1e3a8a;
            }

            /* Dark Theme */
            @media(prefers-color-scheme: dark) {
                :host {
                --bg-color: #f97316;
                --text-color: var(--ddd-theme-default-roarLight);
                --hover-color: #1e3a8a;
                }
            }

            :host {
                display: inline-block;
                position: relative;
            }
            .nav-wrapper {
                position: relative;
            }
            .button-container {
                display: flex;
                align-items: center;
                gap: var(--ddd-spacing-2);
                padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
                background-color: var(--bg-color);
                border: none;
                border-radius: var(--ddd-radius-sm);
                cursor: pointer;
                font-family: var(--ddd-font-navigation);
                font-size: var(--ddd-font-size-m);
                color: var(--text-color);
                text-decoration: none;
                transition: background-color 0.3s ease;
                min-height: 44px;
                box-sizing: border-box;
            }
            .button-container:hover {
                background-color: var(--hover-color);
            }
            .dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 200px;
                background-color: var(--ddd-theme-default-white);
                border: 1px solid var(--ddd-theme-default-coalyGray);
                border-radius: var(--ddd-radius-sm);
                box-shadow: var(--ddd-boxShadow-md);
                display: none;
                flex-direction: column;
                z-index: 1000;
            }
            .dropdown.open {
                display: flex;
            }
            ::slotted(a) {
                display: block;
                padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
                color: var(--ddd-theme-default-potentialMidnight);
                text-decoration: none;
                font-family: var(--ddd-font-navigation);
                font-size: var(--ddd-font-size-s);
                transition: background-color 0.2s ease;
                border-bottom: 1px solid var(--ddd-theme-default-limestoneGray);
                min-height: 44px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
            }
            ::slotted(a:last-child) {
                border-bottom: none;
            }
            ::slotted(a:hover) {
                background-color: var(--ddd-theme-default-limestoneLight);
            }

            /* Mobile styles */
            @media (max-width: 768px) {
                :host {
                    display: block;
                    width: 100%;
                }
                .button-container {
                    width: 100%;
                    justify-content: space-between;
                }
                .dropdown {
                    width: 100%;
                    left: 0;
                    position: static;
                    border: none;
                    border-radius: 0;
                    box-shadow: none;
                    padding: 0;
                    margin-top: var(--ddd-spacing-2);
                    background-color: transparent;
                }
                .dropdown.open {
                    display: flex;
                }
                ::slotted(a) {
                    border-bottom: 1px solid var(--ddd-theme-default-coalyGray);
                    background-color: var(--ddd-theme-default-limestoneGray);
                    padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
                }
                ::slotted(a:last-child) {
                    border-bottom: none;
                }
            }
        `];
    }

    closeDropdown() {
        this.isOpen = false;
    }

    // Lit render the HTML
    render() {
        return html`
            <div class="nav-wrapper"
                 @mouseenter=${this._handleMouseEnter.bind(this)}
                 @mouseleave=${this._handleMouseLeave.bind(this)}>
                <div class="button-container"
                     @click=${this._handleButtonClick.bind(this)}>
                    <span>${this.label}</span>
                </div>
                <div class="dropdown ${this.isOpen ? 'open' : ''}">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

globalThis.customElements.define(NavButton.tag, NavButton);
