import styles from "./UserCard.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DEFAULT_NAME   = "Usuario";
const DEFAULT_ROLE   = "Invitado";
const DEFAULT_AVATAR = "👤";

class UserCard extends HTMLElement {
  #name   = DEFAULT_NAME;
  #role   = DEFAULT_ROLE;
  #avatar = DEFAULT_AVATAR;

  static get observedAttributes() {
    return ["name", "role", "avatar"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(sheet);
  }

  attributeChangedCallback(attr, _old, now) {
    if (attr === "name")   this.#name   = now ?? DEFAULT_NAME;
    if (attr === "role")   this.#role   = now ?? DEFAULT_ROLE;
    if (attr === "avatar") this.#avatar = now ?? DEFAULT_AVATAR;
    this.render();
  }

  connectedCallback() {
    this.#name   = this.getAttribute("name")   ?? DEFAULT_NAME;
    this.#role   = this.getAttribute("role")   ?? DEFAULT_ROLE;
    this.#avatar = this.getAttribute("avatar") ?? DEFAULT_AVATAR;
    this.render();
  }

  #greet() {
    this.dispatchEvent(new CustomEvent("usercard:greet", {
      bubbles: true,
      composed: true,
      detail: { name: this.#name, role: this.#role }
    }));
  }

  render() {
    const avatarContent = this.#avatar.startsWith("http")
      ? `<img src="${this.#avatar}" alt="${this.#name}">`
      : this.#avatar;

    this.shadowRoot.setHTMLUnsafe(/* html */`
      <div class="card" part="card">
        <div class="avatar" part="avatar">${avatarContent}</div>
        <p class="name"  part="name">${this.#name}</p>
        <p class="role"  part="role">${this.#role}</p>
        <button class="btn-greet" part="btn">Saludar</button>
      </div>
    `);

    this.shadowRoot
      .querySelector(".btn-greet")
      .addEventListener("click", () => this.#greet());
  }
}

customElements.define("user-card", UserCard);