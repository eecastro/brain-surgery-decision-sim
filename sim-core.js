/*
  Where Should the Surgeon Go?
  Copyright (c) 2026 Eric E Castro, Psychology Department, St Ignatius College Prep.
  Licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/

  sim-core.js — shared helpers used by index.html and results.html. No editing needed.
*/
(function () {
  const C = window.SIM_CONTENT;

  const abilityByCode = {};
  C.abilities.forEach((a) => (abilityByCode[a.code] = a));
  const corridorByCode = {};
  C.corridors.forEach((c) => (corridorByCode[c.code] = c));

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  // Result code: V1-TOP1-TOP2-TOP3-BOT1-BOT2-BOT3-CORR-OUTCOMES
  // bottom three are ranks 10, 11, 12 (the last one is the student's lowest priority).
  // OUTCOMES has one letter per risk in the chosen corridor: P permanent, T temporary, S spared.
  function buildCode(ranking, corridorCode, outcomes) {
    const top = ranking.slice(0, 3);
    const bottom = ranking.slice(-3);
    return [C.version, ...top, ...bottom, corridorCode, outcomes.join("")].join("-");
  }

  // Normalizes text pasted from phones, forms and spreadsheets (smart dashes, spaces, lowercase).
  function normalize(text) {
    return String(text)
      .toUpperCase()
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-")
      .replace(/[ \t]*-[ \t]*/g, "-");
  }

  const CODE_RE = /\bV\d+(?:-[A-Z]{3}){6}-[A-Z]{4}-[PTS]{1,12}\b/g;

  function parseOne(raw) {
    const parts = raw.split("-");
    const version = parts[0];
    const top = parts.slice(1, 4);
    const bottom = parts.slice(4, 7);
    const corridor = parts[7];
    const outcomes = parts[8].split("");
    if (version !== C.version) return { ok: false, reason: "version", raw };
    const six = top.concat(bottom);
    if (!six.every((c) => abilityByCode[c])) return { ok: false, reason: "invalid", raw };
    if (new Set(six).size !== 6) return { ok: false, reason: "invalid", raw };
    const corr = corridorByCode[corridor];
    if (!corr || corr.risks.length !== outcomes.length) return { ok: false, reason: "invalid", raw };
    return { ok: true, raw, version, top, bottom, corridor, outcomes };
  }

  // Finds every code in a block of pasted text (one per line, or mixed with other text).
  function extractCodes(text) {
    const norm = normalize(text);
    const found = norm.match(CODE_RE) || [];
    return found.map(parseOne);
  }

  // Parses a single code a student typed. Returns {ok, ...} or {ok:false, message}.
  function parseCode(text) {
    const found = normalize(text).match(CODE_RE);
    if (!found) return { ok: false, message: "That doesn\u2019t look like a result code. Check that every part is there, separated by dashes." };
    const r = parseOne(found[0]);
    if (!r.ok && r.reason === "version") return { ok: false, message: "That code comes from a different version of this activity, so it can\u2019t be shown here." };
    if (!r.ok) return { ok: false, message: "Part of that code doesn\u2019t match this activity. Check it for typos." };
    return r;
  }

  function secureRandom() {
    try {
      const a = new Uint32Array(1);
      window.crypto.getRandomValues(a);
      return a[0] / 4294967296;
    } catch (e) {
      return Math.random();
    }
  }

  // Credit and license line at the bottom of each page.
  function renderCredits() {
    const el = document.getElementById("credits");
    const k = C.credits;
    if (!el || !k) return;
    el.innerHTML =
      `<p>${esc(k.original)}${k.adaptation ? " " + esc(k.adaptation) : ""}</p>` +
      `<p>Licensed under <a href="${esc(k.licenseUrl)}" rel="license noopener" target="_blank">${esc(k.license)}</a>.</p>`;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderCredits);
  else renderCredits();

  window.SIM = { C, abilityByCode, corridorByCode, esc, buildCode, parseCode, extractCodes, secureRandom };
})();
