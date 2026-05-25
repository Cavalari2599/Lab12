import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock CSSStyleSheet
global.CSSStyleSheet = class {
  replaceSync() {}
};

// Mock attachShadow — guarda el shadow en propiedad propia
const originalAttachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (options) {
  const shadow = document.createElement("div");
  shadow.adoptedStyleSheets = [];
  shadow.setHTMLUnsafe = (html) => { shadow.innerHTML = html; };
  Object.defineProperty(this, "shadowRoot", {
    get: () => shadow,
    configurable: true
  });
  return shadow;
};

import "./WarningBadge.js";

describe("WarningBadge", () => {
  let el;

  beforeEach(() => {
    el = document.createElement("warning-badge");
    el.setAttribute("text", "Sesión por expirar");
    document.body.append(el);
  });

  afterEach(() => el.remove());

  describe("registro y renderizado inicial", () => {
    it("se registra como custom element", () => {
      expect(customElements.get("warning-badge")).toBeDefined();
    });

    it("renderiza un span.badge al conectarse", () => {
      expect(el.shadowRoot.querySelector(".badge")).not.toBeNull();
    });

    it("muestra el texto del atributo text", () => {
      expect(el.shadowRoot.querySelector(".badge").textContent)
        .toBe("Sesión por expirar");
    });

    it("no tiene pulsing por defecto", () => {
      expect(el.hasAttribute("pulsing")).toBe(false);
    });
  });

  describe("atributo pulsing reactivo", () => {
    it("activate() agrega el atributo pulsing", () => {
      el.activate();
      expect(el.hasAttribute("pulsing")).toBe(true);
    });

    it("deactivate() remueve el atributo pulsing", () => {
      el.activate();
      el.deactivate();
      expect(el.hasAttribute("pulsing")).toBe(false);
    });

    it("setAttribute pulsing dispara attributeChangedCallback", () => {
      el.setAttribute("pulsing", "");
      expect(el.hasAttribute("pulsing")).toBe(true);
    });

    it("removeAttribute pulsing dispara attributeChangedCallback", () => {
      el.setAttribute("pulsing", "");
      el.removeAttribute("pulsing");
      expect(el.hasAttribute("pulsing")).toBe(false);
    });
  });

  describe("atributo text reactivo", () => {
    it("cambia el texto al cambiar el atributo text", () => {
      el.setAttribute("text", "Nuevo aviso");
      expect(el.shadowRoot.querySelector(".badge").textContent)
        .toBe("Nuevo aviso");
    });

    it("usa texto por defecto si no tiene atributo text", () => {
      const badge = document.createElement("warning-badge");
      document.body.append(badge);
      expect(badge.shadowRoot.querySelector(".badge").textContent)
        .toBe("Advertencia");
      badge.remove();
    });
  });

  describe("shadow dom", () => {
    it("tiene shadowRoot abierto", () => {
      expect(el.shadowRoot).not.toBeNull();
    });

    it("el span tiene el part badge expuesto", () => {
      const span = el.shadowRoot.querySelector("[part='badge']");
      expect(span).not.toBeNull();
    });
  });

});