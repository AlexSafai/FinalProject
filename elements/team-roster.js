import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `team-roster`
 * 
 * @demo index.html
 * @element team-roster
 * 
 * Displays a roster of team members or coaches
 */
export class TeamRoster extends DDDSuper(LitElement) {

  static get tag() {
    return "team-roster";
  }

  constructor() {
    super();
    this.members = [];
  }

  static get properties() {
    return {
      ...super.properties,
      members: { type: Array },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
      }

    /* Light Theme */
        :host {
          --text-color: var(--ddd-theme-default-roarLight);
        }

    /* Dark Theme */
        @media(prefers-color-scheme: dark) {
          :host {
            --text-color: var(--ddd-theme-default-roarLight);
          }
        }

      .roster-container {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        justify-content: center;
        margin: 20px 0;
      }
      
      .team-member {
        text-align: center;
        width: 200px;
      }
      
      .team-member img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
      }

      .team-member img:hover {
        transform: scale(1.05);
      }
      
      .team-member .name {
        margin-top: 10px;
        font-weight: bold;
        font-size: 16px;
        color: var(--text-color);
      }
      
      .team-member .role {
        margin-top: 5px;
        font-size: 14px;
        color: var(--text-color);
      }
    `];
  }

  render() {
    return html`
      <div class="roster-container">
        ${this.members.map(member => html`
          <div class="team-member">
            <img src="${member.image}" alt="${member.name}">
            <div class="name">${member.name}</div>
            <div class="role">${member.role}</div>
          </div>
        `)}
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(TeamRoster.tag, TeamRoster);
