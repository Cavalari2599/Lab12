import styles from "./WarningBadge.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DEFAULT_TEXT = "Advertencia";

class WarningBadge extends HTMLElement {
  #text = DEFAULT_TEXT;

  static get observedAttributes() {
    return ["pulsing", "text"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(sheet);
  }

  attributeChangedCallback(attr, _old, now) {
    if (attr === "text") this.#text = now ?? DEFAULT_TEXT;
    this.render();
  }

 connectedCallback() {
  const attr = this.getAttribute("text");
  this.#text = attr ?? DEFAULT_TEXT;
  this.render();
}

  activate()   { this.setAttribute("pulsing", ""); }
  deactivate() { this.removeAttribute("pulsing"); }

  render() {
    this.shadowRoot.setHTMLUnsafe(/* html */`
      <span class="badge" part="badge">${this.#text}</span>
    `);
  }
}

customElements.define("warning-badge", WarningBadge);