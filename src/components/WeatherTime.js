import styles from "./WeatherTime.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const L   = "liberia+guanacaste";
const URL = `https://wttr.in/${L}?format=j1`;

class WeatherTime extends HTMLElement {
  data = {};

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets.push(sheet);
    this.init();
  }

  async init() {
    const response = await fetch(URL);
    const json     = await response.json();
    const current  = json.current_condition[0];
    this.data = {
      temperature: `${current.temp_C} °C`,
      description: current.weatherDesc[0].value
    };
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  get temperature() {
    return this.data?.temperature;
  }

  get description() {
    return this.data?.description;
  }

  render() {
    const loading = /* html */`
      <div class="weather" part="weather">
        <span class="city" part="city">Liberia</span>
        <div class="loading">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`;

    const loaded = /* html */`
      <div class="weather" part="weather">
        <span class="city"      part="city">Liberia</span>
        <span class="icon"      part="icon">🌤️</span>
        <span class="temp"      part="temp">${this.temperature}</span>
        <span class="condition" part="condition">${this.description}</span>
      </div>`;

    this.shadowRoot.setHTMLUnsafe(!this.temperature ? loading : loaded);
  }
}

customElements.define("weather-time", WeatherTime);