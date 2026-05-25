import styles from "./UserDashboard.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class UserDashboard extends HTMLElement {
  #timer = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(sheet);
  }

  connectedCallback() {
    this.render();
    this.#listenGreet();
  }

  #listenGreet() {
    this.addEventListener("usercard:greet", (e) => {
      const { name, role } = e.detail;

      const badge = this.shadowRoot.querySelector("warning-badge");
      badge?.activate();

      clearTimeout(this.#timer);
      this.#timer = setTimeout(() => badge?.deactivate(), 5000);

      this.#log(`► usercard:greet → ${name} (${role}) — badge activado`);
    });
  }

  #log(msg) {
    const el = this.shadowRoot.querySelector(".event-log");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 4500);
  }

  render() {
    this.shadowRoot.setHTMLUnsafe(/* html */`
      <div class="dashboard" part="dashboard">
        <slot name="card"></slot>
        <slot name="weather"></slot>

        <div class="badge-row">
          <warning-badge text="Sesión por expirar"></warning-badge>
        </div>

        <div class="event-log" part="log"></div>
      </div>
    `);
  }
}

customElements.define("user-dashboard", UserDashboard);