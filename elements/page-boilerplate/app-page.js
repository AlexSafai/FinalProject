/*
Component to use for each page - includes header, footer, and slot for content
*/
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "../social-footer.js";
import "./app-banner.js";
import "./animated-image.js";
import "./nav-button.js";

const home1 = new URL("./images/metslogo.png", import.meta.url).href;
const home2 = new URL("./images/metslogo.png", import.meta.url).href;

/**
 * `app-page`
 * Boilerplate component for each page with header, footer, and content slot
 * 
 * @demo index.html
 * @element app-page
 */
export class AppPage extends DDDSuper(I18NMixin(LitElement)) {

    static get tag() {
        return "app-page";
    }

    constructor() {
        super();
        this.page = "home";
    }

    // Lit reactive properties
    static get properties() {
        return {
            ...super.properties,
            page: { type: String },
        };
    }

    // Lit scoped styles
    static get styles() {
        return [super.styles,
        css`
        /* Light Theme */
        :host {
            --bg-color: #f97316;
            --text-color: #1e3a8a;
        }

        /* Dark Theme */
        @media(prefers-color-scheme: dark) {
            :host {
                --bg-color: #1e3a8a;
                --text-color: var(--ddd-theme-default-roarLight);
            }
        }

        :host {
            display: block;
            color: var(--text-color);
            background-color: var(--bg-color);
            font-family: var(--ddd-font-navigation);
            border-radius: var(--ddd-radius-lg);
        }

        .body {
            padding: var(--ddd-spacing-4);
            margin: 0;
        }

        .wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .content {
            flex: 1;
        }
        `];
    }

    // Lit render the HTML
    render() {
        return html`
            <div class="wrapper">
                <div class="header">
                    <app-banner>
                        <animated-image 
                            link="/home"
                            slot="logo" 
                            src="${home1}"
                            hoveredSrc="${home2}">
                        </animated-image>
                        <nav-button slot="buttons" label="Schedule" link="/schedule">
                            <a href="/schedule#full-schedule">Full Schedule</a>
                            <a href="/schedule#week">Current Week</a>
                        </nav-button>
                        <nav-button slot="buttons" label="Team" link="/team">
                            <a href="/team">Team Page</a>
                            <a href="/team#roster">Roster</a>
                            <a href="/team#coaches">Coaches</a>
                        </nav-button>
                        <nav-button slot="buttons" label="About" link="/about">
                            <a href="/about">About Page</a>
                            <a href="/about#contact">Contact</a>
                        </nav-button>
                    </app-banner>
                </div>

                <div class="body content">
                    <slot></slot>
                </div>

                <div class="footer">
                    <social-footer></social-footer>
                </div>
            </div>
        `;
    }
}

globalThis.customElements.define(AppPage.tag, AppPage);
