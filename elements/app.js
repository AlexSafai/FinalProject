import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./page-boilerplate/app-page.js";
import "./event-calendar.js";
import "./image-carousel.js";
import "./week-event.js";
import "./image-loader.js";
import "./team-roster.js";

const grimace = new URL("./page-boilerplate/images/grimace_mets.webp", import.meta.url).href;
const rizzler = new URL("./page-boilerplate/images/mets_rizzler.webp", import.meta.url).href;
const crowd = new URL("./page-boilerplate/images/mets_crowd.jpeg", import.meta.url).href;
const mascot = new URL("./page-boilerplate/images/mets_mascot.jpg", import.meta.url).href;
const mrMet = new URL("./page-boilerplate/images/mr-met.jpg", import.meta.url).href;
const coach1 = new URL("./page-boilerplate/images/metscoach.jpg", import.meta.url).href;
const coach2 = new URL("./page-boilerplate/images/metscoach2.jpeg", import.meta.url).href;

export class AppRoot extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "app-root";
  }

  constructor() {
    super();
    this.route = window.location.pathname || "/";
    this.initRouting();
  }

  static get properties() {
    return {
      ...super.properties,
      route: { type: String },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
      }
    `];
  }

  initRouting() {
    this.route = window.location.pathname || "/";
    this.requestUpdate();
    window.addEventListener('popstate', () => {
      this.route = window.location.pathname || "/";
      this.requestUpdate();
    });
    window.addEventListener('hashchange', () => this._scrollToHash());
  }

  firstUpdated() {
    this._scrollToHash();
  }

  _scrollToHash() {
    if (!window.location.hash) return;
    requestAnimationFrame(() => {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  handleNavigation(e) {
    if (e.detail && e.detail.path) {
      this.route = e.detail.path;
      window.history.pushState({}, "", e.detail.path);
    }
  }

  renderPage() {
    if (this.route.startsWith("/schedule")) {
      return html`
        <app-page page="schedule">
          <h2 id="full-schedule">Full Schedule</h2>
          <event-calendar></event-calendar>
          <p>Events coming up!</p>
          <h2 id="week">Current Week</h2>
          <week-event></week-event>
          <h2>Watch previous highlights</h2>
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/fbZISufeO2c"
              title="Mets vs Angels highlights"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen></iframe>
            <a href="https://www.mlb.com/standings/" target="_blank" rel="noopener noreferrer">View our standings</a>
          </div>
        </app-page>
      `;
    }
    if (this.route.startsWith("/team")) {
      return html`
        <app-page page="team">
          <h1>The Mets Team</h1>
          <p>Our looney toones team:</p>
          <h2 id="roster">Team Roster:</h2>
            <team-roster .members=${[
              { name: "Grimace", role: "Team Captain", image: grimace },
              { name: "Rizzler", role: "Vice Captain", image: rizzler },
              { name: "Mr Mett", role: "Pitcher", image: crowd },
              { name: "Mrs Mett", role: "First Base", image: mascot },
              { name: "Cartoon Mett", role: "Outfield", image: mrMet },
            ]}></team-roster>
          <h2 id="coaches">Coaches:</h2>
            <team-roster .members=${[
              { name: "Coach Mendoza", role: "Head Coach", image: coach1 },
              { name: "Coach Sad Fan", role: "Assistant Coach", image: coach2 },
            ]}></team-roster>
        </app-page>
      `;
    }

    if (this.route.startsWith("/about")) {
      return html`
        <app-page page="about">
          <h2>About The Mets</h2>
          <p> If we do not win it is rigged and anyone who beats us is cheating.</p>
          <image-carousel>
            <image-loader src="/api/images.json"></image-loader>
          </image-carousel>
          <h2 id="contact">Contact Us</h2>
          <p>
             Email: gomets@mets.com <br>
             Phone: 718-507-8499 <br>
             Address: Citi Field 41 Seaver Way Flushing NY 11368 <br>
          </p>
        </app-page>
      `;
    }
    return html`
      <app-page page="home">
        <h2>Its all about the Mets!</h2>

        <image-carousel>
          <image-loader src="/api/images.json"></image-loader>
        </image-carousel>

        <p>See Schedule:</p>
        <week-event></week-event>
      </app-page>
    `;
  }

  render() {
    console.log("AppRoot rendering, route:", this.route);
    return html`${this.renderPage()}`;
  }
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(AppRoot.tag, AppRoot);
