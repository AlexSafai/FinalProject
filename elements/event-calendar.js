import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `event-calendar`
 *
 * @demo index.html
 * @element event-calendar
 */
export class EventCalendar extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "event-calendar";
  }

  constructor() {
    super();
    // i18n setup
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
      monthLabel: "Calendar", // fallback, can be localized
    };

    // calendar state
    this.currentDate = new Date();
    this.events = [];
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      currentDate: { type: Object },
      events: { type: Array },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchEvents();
  }

  async _fetchEvents() {
    try {
      // Fetch from program.json
      const response = await fetch("/api/program.json");
      const data = await response.json();
      
      // Map the data to match expected format
      const eventsArray = data['program'] || data;
      this.events = Array.isArray(eventsArray) 
        ? eventsArray.map(e => ({
            ...e,
            title: e.title || e.name,
            date: e.date
          }))
        : [];
    } catch (e) {
      console.warn("Failed to fetch events from program.json", e);
      this.events = [];
    }
  }

  _renderCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // empty cells before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(html`<div class="empty-day"></div>`);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayYear = date.getFullYear();
      const dayMonth = date.getMonth() + 1;
      const dayDate = date.getDate();
      
      const dayEvents = this.events.filter((event) => {
        // Parse YYYY-MM-DD format as local date
        const [eventYear, eventMonth, eventDay] = event.date.split('-').map(Number);
        return eventYear === dayYear && eventMonth === dayMonth && eventDay === dayDate;
      });

      days.push(html`
        <div class="calendar-day">
          <span class="day-number">${day}</span>
          ${dayEvents.length > 0
            ? html`
                <div class="events">
                  ${dayEvents.map(
                    (event) =>
                      html`<div class="event-item">${event.title}</div>`
                  )}
                </div>
              `
            : ""}
        </div>
      `);
    }
    return days;
  }

  _prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
  }

  _nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }

        /* Light Theme */
        :host {
          --button-color: #1e3a8a;
          --text-color: var(--ddd-theme-default-roarLight);
        }

        /* Dark Theme */
        @media(prefers-color-scheme: dark) {
          :host {
            --button-color: #f97316;
            --text-color: #1e3a8a;
          }
        }

        .nav-button{
          background-color: var(--button-color);
          color: var(--text-color);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          opacity: 0.9;
        }

        .nav-button:active {
          transform: scale(0.98);
        }

        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }

        h3 span {
          font-size: var(--calendar-label-font-size, var(--ddd-font-size-s));
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--ddd-spacing-2);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }

        .calendar-day {
          border: 1px solid #ccc;
          padding: 8px;
          min-height: 80px;
          background-color: white;
          position: relative;
        }

        .empty-day {
          background-color: #f0f0f0;
          min-height: 80px;
        }

        .day-number {
          color: #333;
          font-weight: bold;
          display: block;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .event-item {
          font-size: 0.8em;
          background-color: #f97316;
          margin-top: 2px;
          padding: 2px;
          border-radius: 3px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="wrapper">
        <h3>
          <span>${this.t.title}:</span> ${this.title}
        </h3>

        <div class="calendar-header">
          <button class="nav-button" @click=${this._prevMonth}>Prev</button>
          <span>
            ${this.currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button class="nav-button" @click=${this._nextMonth}>Next</button>
        </div>

        <div class="calendar-grid">
          ${this._renderCalendarDays()}
        </div>

        <!-- slot if you want extra content under the calendar -->
        <slot></slot>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(EventCalendar.tag, EventCalendar);
