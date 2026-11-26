// NationScope views: one render function per page, all fed by data.js.
// The router lives in main.js; it calls renderRoute() with the hash parts.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function countryLink(c) {
  return '<a href="#/country/' + c.code + '">' + esc(c.name) + "</a>";
}

function statCard(label, value, note) {
  return '<div class="stat"><div class="stat-label">' + esc(label) + '</div>' +
    '<div class="stat-value">' + value + '</div>' +
    '<div class="stat-note">' + note + "</div></div>";
}

function rankChip(c, key, label) {
  const r = rankOf(c, key);
  return '<span class="chip">#' + r + " of 12 · " + esc(label) + "</span>";
}

// --- Shared data table (home page): sortable, filterable, searchable ---
let tableState = { sortKey: "population", sortDir: -1, region: "all", query: "" };

function tableRows() {
  let list = COUNTRIES.slice();
  if (tableState.region !== "all") {
    list = list.filter((c) => c.region === tableState.region);
  }
  if (tableState.query) {
    const q = tableState.query.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q));
  }
  const key = tableState.sortKey;
  list.sort((a, b) => {
    const d = indicatorValue(a, key) - indicatorValue(b, key);
    return tableState.sortDir * d;
  });
  return list;
}

function renderTable() {
  const rows = tableRows();
  const heads = [
    ["name", "Country"], ["population", "Population"], ["gdp", "GDP"],
    ["gdpPerCapita", "GDP per capita"], ["lifeExpectancy", "Life expectancy"],
    ["area", "Area"], ["density", "Density"]
  ];
  let html = '<table class="data-table"><thead><tr>';
  heads.forEach(([key, label]) => {
    const arrow = tableState.sortKey === key ? (tableState.sortDir === -1 ? " ▼" : " ▲") : "";
    if (key === "name") {
      html += '<th><button class="th-btn" data-sort="name">Country' + (tableState.sortKey === "name" ? arrow : "") + "</button></th>";
    } else {
      html += '<th><button class="th-btn" data-sort="' + key + '">' + label + arrow + "</button></th>";
    }
  });
  html += "</tr></thead><tbody>";
  if (rows.length === 0) {
    html += '<tr><td colspan="7" class="empty">No country matches that filter. Clear the search or pick another region.</td></tr>';
  }
  rows.forEach((c) => {
    html += "<tr><td>" + countryLink(c) + "</td>" +
      "<td>" + fmtPopFull(c.population) + "</td>" +
      "<td>" + fmtMoney(gdpUsd(c)) + "</td>" +
      "<td>" + fmtDollars(c.gdpPerCapitaUsd) + (c.gdpPerCapitaDerived ? " *" : "") + "</td>" +
      "<td>" + fmtYears(c.lifeExpectancy) + "</td>" +
      "<td>" + fmtArea(c.areaKm2) + "</td>" +
      "<td>" + fmtDensity(density(c)) + "</td></tr>";
  });
  html += "</tbody></table>";
  html += '<p class="fineprint">* GDP per capita calculated from the published GDP and population figures. ' +
    "Population and GDP are 2024; life expectancy is 2023. " +
    'Sources: World Bank World Development Indicators; area: UN Statistics Division. <a href="#/about">Full sources</a>.</p>';
  return html;
}

function bindTable(container) {
  container.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-sort");
      if (key === "name") {
        tableState.sortKey = "name";
        tableState.sortDir = tableState.sortDir === 1 ? -1 : 1;
        // Name sorts alphabetically, not numerically.
        const body = container.querySelector("tbody");
        const rows = tableRows();
        rows.sort((a, b) => tableState.sortDir * a.name.localeCompare(b.name));
        body.innerHTML = rows.map((c) =>
          "<tr><td>" + countryLink(c) + "</td><td>" + fmtPopFull(c.population) + "</td><td>" +
          fmtMoney(gdpUsd(c)) + "</td><td>" + fmtDollars(c.gdpPerCapitaUsd) +
          (c.gdpPerCapitaDerived ? " *" : "") + "</td><td>" + fmtYears(c.lifeExpectancy) +
          "</td><td>" + fmtArea(c.areaKm2) + "</td><td>" + fmtDensity(density(c)) + "</td></tr>"
        ).join("");
        container.querySelectorAll("[data-sort]").forEach((b2) => {
          b2.textContent = b2.textContent.replace(/ [▲▼]$/, "");
        });
        btn.textContent = "Country" + (tableState.sortDir === 1 ? " ▲" : " ▼");
        return;
      }
      if (tableState.sortKey === key) {
        tableState.sortDir = -tableState.sortDir;
      } else {
        tableState.sortKey = key;
        tableState.sortDir = -1;
      }
      container.querySelector(".table-wrap").innerHTML = renderTable();
      bindTable(container);
    });
  });
}

// --- Home ----------------------------------------------------------------
function renderHome() {
  const topPop = [...COUNTRIES].sort((a, b) => b.population - a.population).slice(0, 5);
  const topGdp = [...COUNTRIES].sort((a, b) => gdpUsd(b) - gdpUsd(a)).slice(0, 5);
  const regions = ["all", ...new Set(COUNTRIES.map((c) => c.region))];
  const html =
    '<section class="hero">' +
      "<p class=\"kicker\">Twelve countries · Real figures · Sources on every page</p>" +
      "<h1>How big is a country, really?</h1>" +
      "<p class=\"lede\">NationScope puts the numbers that define a nation side by side — how many people live there, what the economy produces, how long people live, and how much room they have. Every figure comes from the World Bank's World Development Indicators or the UN, with its year printed next to it.</p>" +
      '<div class="world-strip">' +
        statCard("World population", "8.14 bn", "2024 · World Bank WDI") +
        statCard("World GDP", "$111.3 tn", "2024 · World Bank WDI") +
        statCard("World life expectancy", "73.3 yrs", "2023 · World Bank WDI") +
        statCard("Countries covered", "12", "the 12 most populous") +
      "</div>" +
    "</section>" +
    '<section class="charts-row">' +
      '<div class="card"><h2>Most people, 2024</h2><p class="card-sub">Population, World Bank WDI (SP.POP.TOTL)</p><canvas id="chart-pop" role="img" aria-label="Bar chart of the five largest populations in 2024"></canvas></div>' +
      '<div class="card"><h2>Biggest economies, 2024</h2><p class="card-sub">GDP in current US$, World Bank WDI (NY.GDP.MKTP.CD)</p><canvas id="chart-gdp" role="img" aria-label="Bar chart of the five largest economies in 2024"></canvas></div>' +
    "</section>" +
    '<section class="card table-card"><h2>All twelve countries</h2>' +
      '<p class="card-sub">Click any column heading to sort. Filter by region or search by name or capital.</p>' +
      '<div class="table-controls">' +
        '<label>Region <select id="region-filter">' +
          regions.map((r) => '<option value="' + esc(r) + '"' + (tableState.region === r ? " selected" : "") + ">" + (r === "all" ? "All regions" : esc(r)) + "</option>").join("") +
        "</select></label>" +
        '<label>Search <input id="table-search" type="search" placeholder="e.g. Japan or Lima…" value="' + esc(tableState.query) + '"></label>' +
        '<a class="btn" href="#/compare">Compare countries →</a>' +
      "</div>" +
      '<div class="table-wrap">' + renderTable() + "</div>" +
    "</section>" +
    '<section class="card"><h2>Start with a country</h2><p class="card-sub">Pick any of the twelve for its full profile — ranks, charts and a short read.</p>' +
      '<div class="country-grid">' +
      COUNTRIES.map((c) =>
        '<a class="country-tile" href="#/country/' + c.code + '"><span class="tile-name">' + esc(c.name) + '</span>' +
        '<span class="tile-fact">' + fmtPeople(c.population) + " people · " + fmtMoney(gdpUsd(c)) + "</span></a>"
      ).join("") +
      "</div></section>";
  const view = document.getElementById("view");
  view.innerHTML = html;
  drawBarChart(document.getElementById("chart-pop"),
    topPop.map((c) => ({ label: c.name, value: c.population, highlight: c.code === "ind" })), fmtPeople);
  drawBarChart(document.getElementById("chart-gdp"),
    topGdp.map((c) => ({ label: c.name, value: gdpUsd(c), highlight: c.code === "usa" })), fmtMoney);
  const tableCard = view.querySelector(".table-card");
  bindTable(tableCard);
  view.querySelector("#region-filter").addEventListener("change", (e) => {
    tableState.region = e.target.value;
    tableCard.querySelector(".table-wrap").innerHTML = renderTable();
    bindTable(tableCard);
  });
  view.querySelector("#table-search").addEventListener("input", (e) => {
    tableState.query = e.target.value;
    tableCard.querySelector(".table-wrap").innerHTML = renderTable();
    bindTable(tableCard);
  });
}

// --- Country detail -------------------------------------------------------
function renderCountry(code) {
  const c = countryByCode(code);
  const view = document.getElementById("view");
  if (!c) {
    view.innerHTML = '<section class="card"><h1>Country not found</h1><p>We cover twelve countries. <a href="#/">Back to the full table</a>.</p></section>';
    return;
  }
  const others = [...COUNTRIES].filter((x) => x.code !== c.code)
    .sort((a, b) => b.population - a.population);
  const html =
    '<section class="hero country-hero">' +
      '<p class="kicker"><a href="#/">All countries</a> · ' + esc(c.region) + "</p>" +
      "<h1>" + esc(c.name) + "</h1>" +
      '<p class="lede">' + esc(c.blurb) + "</p>" +
      '<div class="chips">' +
        rankChip(c, "population", "population") + rankChip(c, "gdp", "GDP") +
        rankChip(c, "gdpPerCapita", "GDP per capita") + rankChip(c, "lifeExpectancy", "life expectancy") +
      "</div>" +
    "</section>" +
    '<section class="stat-grid">' +
      statCard("Population", fmtPopFull(c.population), "2024 · WDI SP.POP.TOTL") +
      statCard("GDP", fmtMoney(gdpUsd(c)), "2024, current US$ · WDI NY.GDP.MKTP.CD") +
      statCard("GDP per capita", fmtDollars(c.gdpPerCapitaUsd) + (c.gdpPerCapitaDerived ? " *" : ""), "2024 · WDI NY.GDP.PCAP.CD" + (c.gdpPerCapitaDerived ? " (calculated)" : "")) +
      statCard("Life expectancy", fmtYears(c.lifeExpectancy), "2023 at birth · WDI SP.DYN.LE00.IN") +
      statCard("Total area", fmtArea(c.areaKm2), "UN Statistics Division") +
      statCard("Population density", fmtDensity(density(c)), "2024, calculated") +
      statCard("Real GDP growth", fmtGrowth(c.gdpGrowthPct), "2024 · WDI NY.GDP.MKTP.KD.ZG") +
      statCard("Capital", esc(c.capital), "Region: " + esc(c.region)) +
    "</section>" +
    '<section class="card"><h2>Population against the other eleven</h2>' +
      '<p class="card-sub">Millions of people, 2024. ' + esc(c.name) + " is highlighted.</p>" +
      '<canvas id="chart-country" role="img" aria-label="Bar chart comparing populations of all twelve countries"></canvas></section>' +
    '<section class="card"><h2>How to read these numbers</h2>' +
      "<p>GDP is in current US dollars, so exchange-rate swings move it even when nothing changes at home — Nigeria's dollar GDP fell in 2024 mostly because the naira was devalued, not because Nigerians produced less. Life expectancy is a period measure: it imagines a newborn living through today's death rates at every age, so it describes conditions in 2023, not the lifespan of any one child. Density divides the 2024 population by total area, including inland water.</p>" +
      '<p><a href="#/compare">Compare ' + esc(c.name) + ' with other countries →</a> &nbsp;·&nbsp; <a href="#/about">Sources and method →</a></p>' +
    "</section>";
  view.innerHTML = html;
  const rows = [c, ...others].map((x) => ({
    label: x.name, value: x.population, highlight: x.code === c.code
  }));
  drawBarChart(document.getElementById("chart-country"), rows, (n) => (n / 1e6).toFixed(0) + " m", { rowHeight: 30 });
}

// --- Compare ---------------------------------------------------------------
let compareState = { codes: ["usa", "chn", "ind"], indicator: "gdpPerCapita" };

function renderCompare() {
  const view = document.getElementById("view");
  const ind = INDICATORS.find((i) => i.key === compareState.indicator);
  const selected = compareState.codes.map(countryByCode).filter(Boolean);
  let html =
    '<section class="hero"><p class="kicker">Side by side</p><h1>Compare countries</h1>' +
    '<p class="lede">Tick up to three countries, pick an indicator, and see them next to each other — as a chart and as a table with the source and year of every figure.</p></section>' +
    '<section class="card"><h2>1 · Pick countries (up to 3)</h2><div class="picker">' +
    COUNTRIES.map((c) =>
      '<label class="pick"><input type="checkbox" data-code="' + c.code + '"' +
      (compareState.codes.includes(c.code) ? " checked" : "") + "> " + esc(c.name) + "</label>"
    ).join("") + "</div>" +
    '<h2>2 · Pick an indicator</h2><div class="picker">' +
    INDICATORS.map((i) =>
      '<label class="pick"><input type="radio" name="indicator" value="' + i.key + '"' +
      (compareState.indicator === i.key ? " checked" : "") + "> " + esc(i.label) + "</label>"
    ).join("") + "</div></section>";
  if (selected.length === 0) {
    html += '<section class="card"><p>Select at least one country above to see the comparison.</p></section>';
  } else {
    html += '<section class="card"><h2>' + esc(ind.label) + " — " + esc(ind.unit) + "</h2>" +
      '<canvas id="chart-compare" role="img" aria-label="Grouped bar chart comparing the selected countries"></canvas>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Country</th>' +
      INDICATORS.map((i) => "<th>" + esc(i.label) + "</th>").join("") + "</tr></thead><tbody>" +
      selected.map((c) =>
        "<tr><td>" + countryLink(c) + "</td>" +
        INDICATORS.map((i) => "<td>" + i.format(indicatorValue(c, i.key)) + "</td>").join("") + "</tr>"
      ).join("") + "</tbody></table></div>" +
      '<p class="fineprint">Population and GDP are 2024; life expectancy is 2023. Sources: World Bank World Development Indicators; area: UN Statistics Division. <a href="#/about">Full sources</a>.</p></section>';
  }
  view.innerHTML = html;
  view.querySelectorAll("input[data-code]").forEach((box) => {
    box.addEventListener("change", () => {
      const code = box.getAttribute("data-code");
      if (box.checked) {
        if (compareState.codes.length >= 3) {
          box.checked = false;
          return;
        }
        compareState.codes.push(code);
      } else {
        compareState.codes = compareState.codes.filter((x) => x !== code);
      }
      renderCompare();
    });
  });
  view.querySelectorAll('input[name="indicator"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      compareState.indicator = radio.value;
      renderCompare();
    });
  });
  if (selected.length > 0) {
    const canvas = document.getElementById("chart-compare");
    const groups = [ind.label];
    const series = selected.map((c) => ({ label: c.name, values: [indicatorValue(c, ind.key)] }));
    drawGroupedChart(canvas, groups, series, ind.format);
  }
}

// --- Rankings ---------------------------------------------------------------
let rankingsState = { indicator: "lifeExpectancy" };

function renderRankings() {
  const view = document.getElementById("view");
  const ind = INDICATORS.find((i) => i.key === rankingsState.indicator);
  const sorted = [...COUNTRIES].sort((a, b) => indicatorValue(b, ind.key) - indicatorValue(a, ind.key));
  const max = indicatorValue(sorted[0], ind.key);
  const html =
    '<section class="hero"><p class="kicker">Leaderboards</p><h1>Rankings</h1>' +
    '<p class="lede">All twelve countries, ranked on one indicator at a time. Bars are drawn to scale so the gaps are honest.</p></section>' +
    '<section class="card"><div class="picker">' +
    INDICATORS.map((i) =>
      '<label class="pick"><input type="radio" name="rank-indicator" value="' + i.key + '"' +
      (rankingsState.indicator === i.key ? " checked" : "") + "> " + esc(i.label) + "</label>"
    ).join("") + "</div>" +
    "<h2>" + esc(ind.label) + " — " + esc(ind.unit) + "</h2>" +
    '<ol class="rank-list">' +
    sorted.map((c, i) => {
      const pct = Math.max(2, (indicatorValue(c, ind.key) / max) * 100);
      return '<li><span class="rank-pos">' + (i + 1) + '</span><span class="rank-name">' + countryLink(c) + '</span>' +
        '<span class="rank-bar"><span style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="rank-val">' + ind.format(indicatorValue(c, ind.key)) + "</span></li>";
    }).join("") + "</ol>" +
    '<p class="fineprint">Population and GDP are 2024; life expectancy is 2023. Sources: World Bank World Development Indicators; area: UN Statistics Division. <a href="#/about">Full sources</a>.</p></section>';
  view.innerHTML = html;
  view.querySelectorAll('input[name="rank-indicator"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      rankingsState.indicator = radio.value;
      renderRankings();
    });
  });
}

// --- About / sources ---------------------------------------------------------
function renderAbout() {
  const view = document.getElementById("view");
  view.innerHTML =
    '<section class="hero"><p class="kicker">Method &amp; sources</p><h1>About NationScope</h1>' +
    '<p class="lede">NationScope is a small, original reference site: twelve of the world\'s most populous countries, seven indicators each, every figure traced to the public source it came from. The site is a set of static files — it fetches nothing from the network, so it works offline and the numbers you see are exactly the numbers in its files.</p></section>' +
    '<section class="card"><h2>Where every figure comes from</h2>' +
    "<table class=\"data-table\"><thead><tr><th>Indicator</th><th>Source</th><th>Series</th><th>Year</th></tr></thead><tbody>" +
    "<tr><td>Population</td><td>World Bank, World Development Indicators</td><td>SP.POP.TOTL</td><td>2024</td></tr>" +
    "<tr><td>GDP, current US$</td><td>World Bank, World Development Indicators</td><td>NY.GDP.MKTP.CD</td><td>2024</td></tr>" +
    "<tr><td>GDP per capita</td><td>World Bank, World Development Indicators</td><td>NY.GDP.PCAP.CD</td><td>2024</td></tr>" +
    "<tr><td>Life expectancy at birth</td><td>World Bank, World Development Indicators</td><td>SP.DYN.LE00.IN</td><td>2023</td></tr>" +
    "<tr><td>Real GDP growth</td><td>World Bank, World Development Indicators</td><td>NY.GDP.MKTP.KD.ZG</td><td>2024</td></tr>" +
    "<tr><td>Total area</td><td>UN Statistics Division; CIA World Factbook country lists</td><td>—</td><td>—</td></tr>" +
    "<tr><td>Population density</td><td>Calculated here: 2024 population ÷ total area</td><td>—</td><td>2024</td></tr>" +
    "</tbody></table>" +
    '<p class="fineprint">World totals on the home page are the WDI world aggregates: population 8,141,808,945 (2024), GDP $111.3 trillion (2024), life expectancy 73.3 years (2023).</p></section>' +
    '<section class="card"><h2>How the figures were checked</h2>' +
    "<p>Each value was read from the World Bank's own data pages or from rankings that republish the WDI series verbatim, and cross-checked against a second source before it was written into this site. Where two vintages of the WDI disagree — the Bank revises its estimates — the site uses the Bank's published values as retrieved in November 2026, and says so here so a reader can reproduce the check. Figures are rounded for display (population to the nearest person in the table, GDP to one decimal of a billion dollars); the stored values are the published ones.</p>" +
    "<p>Three GDP-per-capita figures — Russia, Ethiopia and Mexico — are not published as a separate WDI lookup in the sources checked, so they are calculated here as GDP divided by population, the same arithmetic the WDI uses for its own per-capita series. They are marked with an asterisk wherever they appear.</p></section>" +
    '<section class="card"><h2>What this site is not</h2>' +
    "<p>It is not affiliated with the World Bank, the United Nations or any national statistics office, and it is not a live feed: the numbers are a snapshot of the latest complete reference years (2024 for population and GDP, 2023 for life expectancy), checked in November 2026. For the newest releases, go to the World Bank's data portal or the country's own statistics office.</p>" +
    '<p><a href="#/">Back to the numbers →</a></p></section>';
}

// --- Route dispatcher ---------------------------------------------------------
function renderRoute(parts) {
  const page = parts[0] || "";
  if (page === "") { renderHome(); return; }
  if (page === "country") { renderCountry(parts[1] || ""); return; }
  if (page === "compare") { renderCompare(); return; }
  if (page === "rankings") { renderRankings(); return; }
  if (page === "about") { renderAbout(); return; }
  document.getElementById("view").innerHTML =
    '<section class="card"><h1>Page not found</h1><p>That address does not exist here. <a href="#/">Back to the home page</a>.</p></section>';
}
