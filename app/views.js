// NationScope views: one render function per route. Each takes the page
// container (and route extras), fills it, then wires its own controls and
// charts. Nothing is fetched; every number comes from data.js.

import {
  COUNTRIES, INDICATORS, WORLD, countryByCode, fmtAxis, fmtInt, fmtMoney,
  fmtValue, indicatorByKey, rankOf, regions, shareOfWorld, valueOf,
} from './data.js';
import { drawBarChart, drawGroupedChart } from './charts.js';

const COMPARE_COLORS = ['#2e7d6b', '#d97706', '#38618c'];

function esc(text) {
  return String(text).replace(/[&<>"]/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]
  ));
}

function sourceLine(indicator) {
  return `${indicator.source}, ${indicator.series} (${indicator.year})`;
}

// --- home: world strip, controls, sortable table, population chart ------

export function renderHome(root) {
  const state = { sortKey: 'population', sortDir: -1, region: 'All regions', query: '' };

  root.innerHTML = `
    <section class="hero">
      <h1>Twelve countries, seven numbers each</h1>
      <p class="lede">NationScope tracks the world\u2019s most populous countries with the
      figures people actually look up \u2014 population, GDP, GDP per capita, life expectancy,
      area, density and growth \u2014 each one printed with its source and year.</p>
      <div class="world-strip">
        <div><strong>${fmtInt(WORLD.population)}</strong><span>people on Earth, 2024</span></div>
        <div><strong>${fmtMoney(WORLD.gdp)}</strong><span>world GDP, 2024</span></div>
        <div><strong>${WORLD.lifeExpectancy.toFixed(1)} years</strong><span>world life expectancy, 2023</span></div>
        <div><strong>${shareTotal()}%</strong><span>of humanity lives in these twelve</span></div>
      </div>
    </section>
    <section class="card">
      <div class="controls">
        <label>Region
          <select id="region-filter">
            <option>All regions</option>
            ${regions().map((r) => `<option>${esc(r)}</option>`).join('')}
          </select>
        </label>
        <label>Search
          <input id="country-search" type="search" placeholder="Country or capital\u2026">
        </label>
        <p class="hint">Select a column heading to sort. Select a country name for its full profile.</p>
      </div>
      <div class="table-scroll"><table id="country-table"></table></div>
    </section>
    <section class="card">
      <h2>Population, 2024</h2>
      <canvas id="pop-chart" class="chart"></canvas>
      <p class="note">India passed China as the most populous country in 2023 and the gap
      is widening. Source: World Bank, SP.POP.TOTL (2024).</p>
    </section>`;

  function shareTotal() {
    const sum = COUNTRIES.reduce((acc, c) => acc + c.population, 0);
    return (sum / WORLD.population * 100).toFixed(1);
  }

  function drawTable() {
    let rows = COUNTRIES.filter((c) =>
      (state.region === 'All regions' || c.region === state.region) &&
      (c.name + ' ' + c.capital).toLowerCase().includes(state.query.toLowerCase()));
    rows = [...rows].sort((a, b) =>
      state.sortDir * (valueOf(a, state.sortKey) - valueOf(b, state.sortKey)) ||
      a.name.localeCompare(b.name));
    const head = INDICATORS.map((ind) => {
      const arrow = state.sortKey === ind.key ? (state.sortDir < 0 ? ' \u25BC' : ' \u25B2') : '';
      return `<th><button class="th-sort" data-key="${ind.key}">${ind.label}${arrow}</button></th>`;
    }).join('');
    const body = rows.map((c) => `
      <tr>
        <td class="cname"><a href="#/country/${c.code}">${esc(c.name)}</a>
          <span class="sub">${esc(c.capital)} \u00B7 ${esc(c.region)}</span></td>
        ${INDICATORS.map((ind) => `<td>${fmtValue(c, ind.key)}</td>`).join('')}
      </tr>`).join('');
    root.querySelector('#country-table').innerHTML =
      `<thead><tr><th class="cname">Country</th>${head}</tr></thead>
       <tbody>${body || '<tr><td colspan="8">No country matches that search.</td></tr>'}</tbody>`;
    root.querySelectorAll('.th-sort').forEach((btn) => btn.addEventListener('click', () => {
      if (state.sortKey === btn.dataset.key) state.sortDir *= -1;
      else { state.sortKey = btn.dataset.key; state.sortDir = -1; }
      drawTable();
    }));
  }

  root.querySelector('#region-filter').addEventListener('change', (e) => {
    state.region = e.target.value; drawTable();
  });
  root.querySelector('#country-search').addEventListener('input', (e) => {
    state.query = e.target.value; drawTable();
  });

  drawTable();
  const byPop = [...COUNTRIES].sort((a, b) => b.population - a.population);
  drawBarChart(root.querySelector('#pop-chart'),
    byPop.map((c) => ({ label: c.name, value: c.population, text: fmtAxis('population', c.population) })));
}

// --- country profile ------------------------------------------------------

export function renderCountry(root, code) {
  const country = countryByCode(code);
  if (!country) {
    root.innerHTML = `<section class="card"><h1>Country not found</h1>
      <p>No profile exists for \u201C${esc(code)}\u201D. <a href="#/">Back to the overview</a>.</p></section>`;
    return;
  }
  const facts = INDICATORS.map((ind) => `
    <div class="fact">
      <span class="fact-label">${ind.label} \u00B7 rank ${rankOf(country, ind.key)} of ${COUNTRIES.length}</span>
      <strong>${fmtValue(country, ind.key)}</strong>
      <span class="fact-src">${sourceLine(ind)}</span>
    </div>`).join('');

  root.innerHTML = `
    <p class="crumbs"><a href="#/">All countries</a> \u203A ${esc(country.name)}</p>
    <section class="profile-head">
      <h1>${esc(country.name)}</h1>
      <p class="lede">${esc(country.capital)} \u00B7 ${esc(country.region)} \u00B7 home to
      ${shareOfWorld(country).toFixed(1)}% of the world\u2019s population.</p>
    </section>
    <section class="fact-grid">${facts}</section>
    <section class="card">
      <h2>Where ${esc(country.name)} stands</h2>
      <label class="inline-label">Chart indicator
        <select id="profile-chart-key">
          ${INDICATORS.map((i) => `<option value="${i.key}">${i.label}</option>`).join('')}
        </select>
      </label>
      <canvas id="profile-chart" class="chart"></canvas>
      <p class="note" id="profile-chart-note"></p>
    </section>
    <section class="card">
      <h2>Neighbours on the population ladder</h2>
      <div id="neighbours"></div>
      <p class="actions">
        <a class="btn" href="#/compare?c=${country.code}">Compare ${esc(country.name)} with others</a>
        <a class="btn ghost" href="#/rankings">See all rankings</a>
      </p>
    </section>`;

  const ladder = [...COUNTRIES].sort((a, b) => b.population - a.population);
  const pos = ladder.findIndex((c) => c.code === country.code);
  const near = ladder.slice(Math.max(0, pos - 1), pos + 2);
  root.querySelector('#neighbours').innerHTML = near.map((c) => `
    <p class="neighbour ${c.code === country.code ? 'self' : ''}">
      <span>${rankOf(c, 'population')}. <a href="#/country/${c.code}">${esc(c.name)}</a></span>
      <span>${fmtInt(c.population)} people</span>
    </p>`).join('');

  const chartSelect = root.querySelector('#profile-chart-key');
  function drawProfileChart() {
    const ind = indicatorByKey(chartSelect.value);
    const sorted = [...COUNTRIES].sort((a, b) => valueOf(b, ind.key) - valueOf(a, ind.key));
    drawBarChart(root.querySelector('#profile-chart'),
      sorted.map((c) => ({
        label: c.name, value: valueOf(c, ind.key),
        text: fmtAxis(ind.key, valueOf(c, ind.key)), hot: c.code === country.code,
      })), { dim: true });
    root.querySelector('#profile-chart-note').textContent =
      `${ind.label} (${ind.unit}), ${ind.year}. ${ind.blurb} Source: ${sourceLine(ind)}.`;
  }
  chartSelect.addEventListener('change', drawProfileChart);
  drawProfileChart();
}

// --- compare ---------------------------------------------------------------

export function renderCompare(root, preset) {
  const chosen = new Set(
    (preset ? preset.split(',') : ['USA', 'CHN', 'IND'])
      .map((s) => s.trim().toUpperCase())
      .filter((code) => countryByCode(code)),
  );
  if (chosen.size === 0) ['USA', 'CHN', 'IND'].forEach((c) => chosen.add(c));

  root.innerHTML = `
    <h1>Compare countries</h1>
    <p class="lede">Pick up to three countries. The chart indexes each indicator to the
    strongest of the three (best = 100) so unlike units can share one picture;
    the table underneath carries the real figures.</p>
    <section class="card">
      <div class="picker">
        ${COUNTRIES.map((c) => `
          <label class="pick">
            <input type="checkbox" value="${c.code}" ${chosen.has(c.code) ? 'checked' : ''}>
            ${esc(c.name)}
          </label>`).join('')}
      </div>
      <p class="hint" id="compare-hint"></p>
      <canvas id="compare-chart" class="chart"></canvas>
      <div class="table-scroll"><table id="compare-table"></table></div>
    </section>`;

  function drawCompare() {
    const list = COUNTRIES.filter((c) => chosen.has(c.code));
    root.querySelector('#compare-hint').textContent = chosen.size >= 3
      ? 'Three selected \u2014 untick one to swap in another country.'
      : `${chosen.size} of 3 selected.`;
    const series = list.map((c, i) => ({ name: c.name, color: COMPARE_COLORS[i] }));
    const groups = INDICATORS.map((ind) => {
      const vals = list.map((c) => valueOf(c, ind.key));
      const max = Math.max(...vals);
      return { label: ind.label, values: vals.map((v) => (max > 0 ? (v / max) * 100 : 0)) };
    });
    drawGroupedChart(root.querySelector('#compare-chart'), groups, series);
    root.querySelector('#compare-table').innerHTML = `
      <thead><tr><th>Indicator</th>${list.map((c) => `<th>${esc(c.name)}</th>`).join('')}</tr></thead>
      <tbody>
        ${INDICATORS.map((ind) => `<tr>
          <td class="cname">${ind.label}<span class="sub">${ind.year}</span></td>
          ${list.map((c) => `<td>${fmtValue(c, ind.key)}</td>`).join('')}
        </tr>`).join('')}
        <tr><td class="cname">Capital</td>${list.map((c) => `<td>${esc(c.capital)}</td>`).join('')}</tr>
        <tr><td class="cname">Region</td>${list.map((c) => `<td>${esc(c.region)}</td>`).join('')}</tr>
      </tbody>`;
  }

  root.querySelectorAll('.pick input').forEach((box) => box.addEventListener('change', () => {
    if (box.checked && chosen.size >= 3) { box.checked = false; return; }
    if (box.checked) chosen.add(box.value); else chosen.delete(box.value);
    if (chosen.size === 0) { chosen.add(box.value); box.checked = true; }
    drawCompare();
  }));
  drawCompare();
}

// --- rankings ---------------------------------------------------------------

export function renderRankings(root) {
  root.innerHTML = `
    <h1>Rankings</h1>
    <p class="lede">All twelve countries ordered by one indicator at a time, highest first.</p>
    <section class="card">
      <div class="tabs" id="rank-tabs">
        ${INDICATORS.map((ind, i) => `
          <button data-key="${ind.key}" class="${i === 0 ? 'active' : ''}">${ind.label}</button>`).join('')}
      </div>
      <canvas id="rank-chart" class="chart"></canvas>
      <ol class="rank-list" id="rank-list"></ol>
      <p class="note" id="rank-note"></p>
    </section>`;

  function drawRankings(key) {
    const ind = indicatorByKey(key);
    const sorted = [...COUNTRIES].sort((a, b) => valueOf(b, key) - valueOf(a, key));
    drawBarChart(root.querySelector('#rank-chart'),
      sorted.map((c) => ({ label: c.name, value: valueOf(c, key), text: fmtAxis(key, valueOf(c, key)) })));
    root.querySelector('#rank-list').innerHTML = sorted.map((c) => `
      <li><a href="#/country/${c.code}">${esc(c.name)}</a>
        <span>${fmtValue(c, key)}</span></li>`).join('');
    root.querySelector('#rank-note').textContent =
      `${ind.blurb} Source: ${sourceLine(ind)}.`;
  }
  root.querySelectorAll('#rank-tabs button').forEach((btn) => btn.addEventListener('click', () => {
    root.querySelectorAll('#rank-tabs button').forEach((b) => b.classList.toggle('active', b === btn));
    drawRankings(btn.dataset.key);
  }));
  drawRankings('population');
}

// --- about / sources ----------------------------------------------------------

export function renderAbout(root) {
  root.innerHTML = `
    <h1>About NationScope &amp; sources</h1>
    <section class="card prose">
      <p>NationScope is a small, self-contained reference: the twelve most populous
      countries, seven indicators each, no accounts, no tracking, nothing loaded
      from anywhere else. It exists so a student, journalist or curious reader can
      answer \u201Chow big, how rich, how long-lived?\u201D in under a minute and see
      exactly where every answer came from.</p>
      <h2>Where the figures come from</h2>
      ${INDICATORS.map((ind) => `
        <p><strong>${ind.label} (${ind.year}).</strong> ${ind.blurb}<br>
        <span class="fact-src">${sourceLine(ind)}</span></p>`).join('')}
      <h2>Reading the numbers</h2>
      <p>GDP is in current US dollars, so it moves with exchange rates as well as
      with real output; the growth column is the inflation-adjusted figure.
      GDP per capita is an average across every resident, not a typical income.
      Density divides population by total area, so a country with a large empty
      interior (Russia, Brazil) reads as emptier than its cities feel.</p>
      <p>An asterisk on a GDP-per-capita figure means it was calculated on this
      site as GDP \u00F7 population \u2014 the same arithmetic the World Bank uses for
      its own per-capita series \u2014 because no separate published value was used.
      That applies to Russia, Ethiopia and Mexico. Population density is
      calculated the same way for every country. World totals on the home page
      are the World Bank\u2019s world aggregates: population 8,141,808,945 (2024),
      GDP $111.33 trillion (2024), life expectancy 73.3 years (2023).</p>
      <h2>Corrections</h2>
      <p>National statistics get revised. Figures here are the values published
      by the sources above as retrieved in November 2026; where two vintages
      disagree, the newer published value wins.</p>
    </section>`;
}
