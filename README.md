# Portfolio — Giulio Taddei

Sito vetrina personale sviluppato in HTML, CSS e JavaScript vanilla. Nessun framework, nessuna dipendenza esterna.

---

## Struttura del progetto

```
src/
├── index.html
├── script.js
├── data/
│   ├── stack.js        # Tecnologie
│   ├── projects.js     # Progetti IT e EN
│   ├── certs.js        # Certificazioni
│   ├── experience.js   # Timeline esperienza
│   ├── contact.js      # Info di contatto
│   └── i18n.js         # Dizionari di traduzione
└── assets/
    └── *.svg           # Icone tecnologie
```

---

## Sistema di traduzione (i18n)

### Come funziona

Il dizionario delle traduzioni si trova in `data/i18n.js` ed è un oggetto con due chiavi, una per lingua:

```js
export const I18N = {
  it: {
    "nav.stack": "Stack",
    "hero.title": "Ciao, sono",
    "contact.send": "Invia messaggio",
    // ...
  },
  en: {
    "nav.stack": "Stack",
    "hero.title": "Hi, I'm",
    "contact.send": "Send message",
    // ...
  },
};
```

Ogni chiave segue la convenzione `sezione.elemento` per tenere le traduzioni organizzate per area del sito.

### Collegamento HTML → dizionario

Gli elementi traducibili nell'HTML hanno un attributo `data-i18n` con la chiave corrispondente:

```html
<a href="#stack" data-i18n="nav.stack">Stack</a>
<button data-i18n="contact.send">Invia messaggio</button>
```

Il testo nell'HTML è solo un valore di fallback — all'avvio viene subito sostituito dalla lingua corrente.

### Applicazione delle traduzioni

La funzione `applyI18n(lang)` in `script.js` scorre tutti gli elementi con `data-i18n` e ne aggiorna il contenuto:

```js
function applyI18n(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (I18N[lang][key] !== undefined) {
      el.textContent = I18N[lang][key];
    }
  });
}
```

### Contenuti dinamici

Alcuni contenuti non sono nell'HTML ma vengono generati da JavaScript (progetti, timeline). Per questi esistono array separati per ogni lingua in `data/projects.js` e `data/experience.js`:

```js
export const PROJECTS_IT = [ { name: "Simulazione strategie...", ... } ];
export const PROJECTS_EN = [ { name: "Simulation of betting...", ... } ];
```

Le funzioni di render ricevono `lang` come parametro e scelgono l'array corretto:

```js
function renderProjects(lang) {
  const data = lang === "it" ? PROJECTS_IT : PROJECTS_EN;
  // ...
}
```

### Cambio lingua

La variabile `currentLang` tiene traccia della lingua attiva. Al click sul bottone:

```js
document.getElementById("lang-btn").addEventListener("click", () => {
  currentLang = currentLang === "it" ? "en" : "it";
  applyI18n(currentLang);
  renderProjects(currentLang); // richiama il render dei contenuti dinamici
  renderTimeline(currentLang);
  renderContactInfo(currentLang);
});
```

---

## Dark mode

### Come funziona

Il tema è controllato tramite un attributo `data-theme` sull'elemento `<html>`:

```html
<html data-theme="dark"></html>
```

I colori non sono definiti con valori fissi ma con **CSS custom properties** (variabili CSS) che cambiano in base al valore dell'attributo:

```css
:root {
  --bg: #0a0a0f;
  --text: #f0f0f5;
  --bg-card: #16161f;
}

[data-theme="light"] {
  --bg: #f4f4fa;
  --text: #0a0a0f;
  --bg-card: #ffffff;
}
```

Tutti i componenti usano le variabili (`background: var(--bg)`, `color: var(--text)`) invece di colori hardcoded — cambiando l'attributo su `<html>`, l'intera UI si aggiorna automaticamente tramite il cascade CSS.

### Cambio tema

```js
function setTheme(theme) {
  document.documentElement.dataset.theme = theme; // imposta data-theme sull'html
  localStorage.setItem("theme", theme); // salva la preferenza
}

document.getElementById("theme-btn").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  setTheme(current === "dark" ? "light" : "dark");
});
```

### Persistenza

La preferenza viene salvata nel `localStorage` del browser. All'avvio, prima di renderizzare qualsiasi cosa, viene letta e applicata:

```js
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
  // ...
});
```

Se l'utente non ha mai visitato il sito, il tema di default è `dark`.

---

## Aggiungere contenuti

### Nuova tecnologia nello stack

Aggiungi un oggetto all'array in `data/stack.js`:

```js
{ img: "assets/nometecnologia.svg", name: "Nome", tag: "categoria", level: 0.80 }
```

Il campo `level` va da `0` a `1` e determina la lunghezza della barra di competenza.

### Nuovo progetto

Aggiungi un oggetto sia in `PROJECTS_IT` che in `PROJECTS_EN` in `data/projects.js`. Il campo `live` è opzionale — se omesso, il bottone Live non appare.

### Nuova certificazione

Aggiungi un oggetto all'array in `data/certs.js`.

### Nuova voce nella timeline

Aggiungi un oggetto sia in `TIMELINE_IT` che in `TIMELINE_EN` in `data/experience.js`.

---

## Deploy

Il sito è pubblicato tramite **GitHub Pages**. Ogni push sul branch `main` aggiorna automaticamente il sito all'indirizzo:

```
https://giuliotaddei.github.io/portfolio
```
