import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `week-event`
 * Displays only the current week in calendar format
 *
 * @demo index.html
 * @element week-event
 */
export class WeekEvent extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "week-event";
  }

  constructor() {
    super();
    this.title = "Current Week";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Week View",
    };

    // Get current date and calculate week
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

  /**
   * Get the start of the week (Sunday)
   */
  _getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  /**
   * Get array of 7 days for current week
   */
  _getWeekDays() {
    const startOfWeek = this._getStartOfWeek(this.currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  }

  /**
   * Check if date is today
   */
  _isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Get day name (Sun, Mon, etc.)
   */
  _getDayName(date) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  /**
   * Get events for a specific date
   */
  _getEventsForDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return this.events.filter((event) => {
      // Parse YYYY-MM-DD format as local date
      const [eventYear, eventMonth, eventDay] = event.date.split('-').map(Number);
      return eventYear === year && eventMonth === month && eventDay === day;
    });
  }

  /**
   * Navigate to previous week
   */
  _prevWeek() {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    this.currentDate = newDate;
  }

  /**
   * Navigate to next week
   */
  _nextWeek() {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    this.currentDate = newDate;
  }

  /**
   * Go to current week
   */
  _goToToday() {
    this.currentDate = new Date();
  }

  /**
   * Format date range for header
   */
  _getWeekRange() {
    const days = this._getWeekDays();
    const start = days[0];
    const end = days[6];
    
    return `${start.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    })} - ${end.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    })}`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* Light Theme */
          :host {
            --bg-color: var(--ddd-theme-default-roarLight);
            --text-color: #1e3a8a;
            --accent-color: #1e3a8a;
            --hover-color: var(--ddd-theme-default-inventOrange);
            --hover-color-two: var(--ddd-theme-default-potentialMidnight);
          }

        /* Dark Theme */
          @media(prefers-color-scheme: dark) {
            :host {
              --bg-color: #f97316;
              --text-color: var(--ddd-theme-default-roarLight);
              --accent-color: #1e3a8a;
              --hover-color: var(--ddd-theme-default-potentialMidnight);
              --hover-color-two: var(--ddd-theme-default-inventOrange);
            }
          }
        :host {
          display: block;
          color: var(--text-color);
          font-family: var(--ddd-font-navigation);
        }

        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }

        h3 {
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-size: var(--ddd-font-size-l);
        }

        .week-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2);
          background-color: var(--bg-color);
          border-radius: 8px;
          border: 1px solid var(--accent-color);
        }

        .week-range {
          font-weight: bold;
          font-size: var(--ddd-font-size-m);
          color: var(--ddd-theme-primary);
        }

        .week-nav {
          display: flex;
          gap: var(--ddd-spacing-2);
        }

        button {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background-color: var(--accent-color);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s;
        }

        button:hover {
          background-color: var(--hover-color);
        }

        button:active {
          transform: scale(0.98);
        }

        .today-button {
          background-color: var(--accent-color);
        }

        .today-button:hover {
          background-color: var(--hover-color-two);
        }

        .week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: var(--ddd-spacing-2);
        }

        .day-column {
          border: 1px solid var(--accent-color);
          border-radius: 8px;
          padding: var(--ddd-spacing-2);
          min-height: 150px;
          background-color: var(--bg-color);
          transition: box-shadow 0.2s;
        }

        .day-column:hover {
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .day-column.today {
          border-color: var(--hover-color);
          border-width: 3px;
          background-color: var(--bg-color);
          box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
        }

        .day-header {
          text-align: center;
          padding-bottom: var(--ddd-spacing-2);
          border-bottom: 1px solid var(--accent-color);
          margin-bottom: var(--ddd-spacing-2);
        }

        .day-name {
          font-weight: bold;
          font-size: var(--ddd-font-size-m);
          color: var(--ddd-theme-primary);
          display: block;
        }

        .day-number {
          font-size: 24px;
          font-weight: bold;
          color: var(--ddd-theme-primary);
          display: block;
          margin-top: var(--ddd-spacing-1);
        }

        .day-column.today .day-number {
          color: var(--ddd-theme-accent);
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }

        .event-item {
          font-size: var(--ddd-font-size-xs);
          background-color: var(--bg-color);
          padding: var(--ddd-spacing-1);
          border-radius: 8px;
          border-left: 3px solid var(--accent-color);
          word-wrap: break-word;
        }

        .no-events {
          color: var(--ddd-theme-primary);
          font-style: italic;
          font-size: var(--ddd-font-size-xs);
          text-align: center;
          padding: var(--ddd-spacing-2);
        }

        @media (max-width: 1024px) {
          .week-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .week-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .week-header {
            flex-direction: column;
            gap: var(--ddd-spacing-2);
          }
        }

        @media (max-width: 480px) {
          .week-grid {
            grid-template-columns: 1fr;
          }
        }
      `,
    ];
  }

  render() {
    const weekDays = this._getWeekDays();

    return html`
      <div class="wrapper">
        <h3>${this.title}</h3>

        <div class="week-header">
          <div class="week-range">${this._getWeekRange()}</div>
          <div class="week-nav">
            <button @click=${this._prevWeek}>← Prev</button>
            <button class="today-button" @click=${this._goToToday}>
              Today
            </button>
            <button @click=${this._nextWeek}>Next →</button>
          </div>
        </div>

        <div class="week-grid">
          ${weekDays.map((day) => {
            const dayEvents = this._getEventsForDate(day);
            const isToday = this._isToday(day);

            return html`
              <div class="day-column ${isToday ? "today" : ""}">
                <div class="day-header">
                  <span class="day-name">${this._getDayName(day)}</span>
                  <span class="day-number">${day.getDate()}</span>
                </div>
                <div class="events-list">
                  ${dayEvents.length > 0
                    ? dayEvents.map(
                        (event) =>
                          html`<div class="event-item">${event.title}</div>`
                      )
                    : html`<div class="no-events">No events</div>`}
                </div>
              </div>
            `;
          })}
        </div>

        <slot></slot>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(WeekEvent.tag, WeekEvent);
