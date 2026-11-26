// NationScope data: twelve of the world's most populous countries.
// Every figure was checked against the World Bank's World Development
// Indicators (WDI) and the UN Statistics Division in November 2026.
// Figures are shown rounded on the site; the stored values below are the
// published values (population and GDP in the units the WDI publishes).
// GDP per capita marked "derived" is GDP divided by population, the same
// arithmetic the WDI uses for its own per-capita series.
// Population density is likewise population divided by total area.
//
// Sources, per indicator:
//   Population 2024 — WDI SP.POP.TOTL (World Bank values, retrieved Nov 2026)
//   GDP 2024, current US$ — WDI NY.GDP.MKTP.CD
//   GDP per capita 2024 — WDI NY.GDP.PCAP.CD, or derived where noted
//   Life expectancy 2023 — WDI SP.DYN.LE00.IN
//   Real GDP growth 2024 — WDI NY.GDP.MKTP.KD.ZG
//   Total area — UN Statistics Division / CIA World Factbook country lists
//   World totals — WDI world aggregates for 2024 (population, GDP)

const COUNTRIES = [
  {
    code: "ind", name: "India", region: "Asia", capital: "New Delhi",
    population: 1450935791, gdpBillionsUsd: 3912.7, gdpPerCapitaUsd: 2697,
    gdpPerCapitaDerived: false, lifeExpectancy: 72.0, areaKm2: 3287263,
    gdpGrowthPct: 6.5,
    blurb: "The world's most populous country since 2023, and its fastest-growing large economy in 2024. More than half of Indians are under 30, and services — above all software and business services — now drive growth alongside manufacturing."
  },
  {
    code: "chn", name: "China", region: "Asia", capital: "Beijing",
    population: 1408975000, gdpBillionsUsd: 18743.8, gdpPerCapitaUsd: 13303,
    gdpPerCapitaDerived: false, lifeExpectancy: 78.0, areaKm2: 9596960,
    gdpGrowthPct: 5.0,
    blurb: "The world's second-largest economy and its largest manufacturer. China's population has edged down for three straight years, while life expectancy — 78.0 years — now sits close to the level of much richer countries."
  },
  {
    code: "usa", name: "United States", region: "North America", capital: "Washington, D.C.",
    population: 340110988, gdpBillionsUsd: 29184.9, gdpPerCapitaUsd: 85810,
    gdpPerCapitaDerived: false, lifeExpectancy: 78.4, areaKm2: 9525067,
    gdpGrowthPct: 2.8,
    blurb: "The world's largest economy by a wide margin: about $29.2 trillion in 2024, more than a quarter of world output. GDP per person is the highest of the twelve countries here, yet life expectancy trails Japan by more than five years."
  },
  {
    code: "idn", name: "Indonesia", region: "Asia", capital: "Jakarta",
    population: 283487931, gdpBillionsUsd: 1396.3, gdpPerCapitaUsd: 4925,
    gdpPerCapitaDerived: false, lifeExpectancy: 71.2, areaKm2: 1904569,
    gdpGrowthPct: 5.0,
    blurb: "The fourth most populous country and the largest economy in South-East Asia, spread across more than 17,000 islands. Steady 5% growth has held for a decade, powered by domestic consumption and nickel, coal and palm-oil exports."
  },
  {
    code: "pak", name: "Pakistan", region: "Asia", capital: "Islamabad",
    population: 251269164, gdpBillionsUsd: 373.1, gdpPerCapitaUsd: 1485,
    gdpPerCapitaDerived: false, lifeExpectancy: 67.7, areaKm2: 882363,
    gdpGrowthPct: 3.2,
    blurb: "The fifth most populous country, with one of the youngest populations on earth — a median age near 20. Growth rebounded to 3.2% in 2024 after floods and a balance-of-payments crisis shrank the economy the year before."
  },
  {
    code: "nga", name: "Nigeria", region: "Africa", capital: "Abuja",
    population: 232679478, gdpBillionsUsd: 187.8, gdpPerCapitaUsd: 807,
    gdpPerCapitaDerived: false, lifeExpectancy: 54.5, areaKm2: 923768,
    gdpGrowthPct: 3.4,
    blurb: "Africa's most populous country and its largest oil producer. Dollar GDP fell sharply in 2024 as the naira was devalued — the economy kept growing in real terms (3.4%), but each dollar bought far fewer naira. Life expectancy, 54.5 years, is the lowest of the twelve."
  },
  {
    code: "bra", name: "Brazil", region: "South America", capital: "Brasília",
    population: 211998573, gdpBillionsUsd: 2179.4, gdpPerCapitaUsd: 10280,
    gdpPerCapitaDerived: false, lifeExpectancy: 75.9, areaKm2: 8510346,
    gdpGrowthPct: 3.4,
    blurb: "South America's giant: the fifth-largest country by area and the tenth-largest economy. Agriculture, iron ore and oil fund a diversified economy, and life expectancy has climbed back to 75.9 years after the pandemic dip."
  },
  {
    code: "bgd", name: "Bangladesh", region: "Asia", capital: "Dhaka",
    population: 173562364, gdpBillionsUsd: 450.1, gdpPerCapitaUsd: 2593,
    gdpPerCapitaDerived: false, lifeExpectancy: 74.7, areaKm2: 148460,
    gdpGrowthPct: 4.2,
    blurb: "The most densely settled large country on earth — about 1,170 people per square kilometre. Garment exports built one of Asia's steadiest growth records, and life expectancy (74.7 years) now beats far richer neighbours."
  },
  {
    code: "rus", name: "Russia", region: "Europe", capital: "Moscow",
    population: 143669648, gdpBillionsUsd: 2173.8, gdpPerCapitaUsd: 15131,
    gdpPerCapitaDerived: true, lifeExpectancy: 73.3, areaKm2: 17098246,
    gdpGrowthPct: 4.3,
    blurb: "The largest country on earth by area — more than twice the size of the next — spanning eleven time zones. Wartime spending pushed real growth to 4.3% in 2024, while the population keeps shrinking slowly."
  },
  {
    code: "eth", name: "Ethiopia", region: "Africa", capital: "Addis Ababa",
    population: 132059767, gdpBillionsUsd: 149.7, gdpPerCapitaUsd: 1134,
    gdpPerCapitaDerived: true, lifeExpectancy: 67.3, areaKm2: 1104300,
    gdpGrowthPct: 7.6,
    blurb: "Africa's second most populous country and its fastest-growing large economy in 2024 at 7.6%. The birr was floated in mid-2024, which cut dollar GDP even as real output surged; four in five Ethiopians still work the land."
  },
  {
    code: "mex", name: "Mexico", region: "North America", capital: "Mexico City",
    population: 130861007, gdpBillionsUsd: 1856.4, gdpPerCapitaUsd: 14186,
    gdpPerCapitaDerived: true, lifeExpectancy: 75.1, areaKm2: 1964375,
    gdpGrowthPct: 1.4,
    blurb: "The United States' largest trading partner since 2023, with factories along the northern border feeding American supply chains. Growth cooled to 1.4% in 2024, and life expectancy (75.1 years) is still recovering from the pandemic."
  },
  {
    code: "jpn", name: "Japan", region: "Asia", capital: "Tokyo",
    population: 123975371, gdpBillionsUsd: 4027.6, gdpPerCapitaUsd: 32487,
    gdpPerCapitaDerived: false, lifeExpectancy: 84.0, areaKm2: 377975,
    gdpGrowthPct: 0.1,
    blurb: "The longest-lived large nation on earth: 84.0 years at birth. Japan's population has fallen every year since 2009 and nearly three in ten residents are over 65 — the oldest society in this set, and the fourth-largest economy."
  }
];

// World aggregates for the same reference years (WDI world totals).
const WORLD = {
  population2024: 8141808945,
  gdpTrillionsUsd2024: 111.3,
  lifeExpectancy2023: 73.3
};

// Indicator metadata: key, label, unit, and how to format a value.
const INDICATORS = [
  { key: "population", label: "Population", unit: "people, 2024", format: fmtPeople, higherBetter: null },
  { key: "gdp", label: "GDP", unit: "current US$, 2024", format: fmtMoney, higherBetter: null },
  { key: "gdpPerCapita", label: "GDP per capita", unit: "current US$, 2024", format: fmtDollars, higherBetter: null },
  { key: "lifeExpectancy", label: "Life expectancy", unit: "years at birth, 2023", format: fmtYears, higherBetter: true },
  { key: "area", label: "Total area", unit: "km²", format: fmtArea, higherBetter: null },
  { key: "density", label: "Population density", unit: "people per km², 2024", format: fmtDensity, higherBetter: null },
  { key: "gdpGrowth", label: "Real GDP growth", unit: "% per year, 2024", format: fmtGrowth, higherBetter: true }
];

// --- Derived values (computed from the published figures above) ---------
function gdpUsd(c) { return c.gdpBillionsUsd * 1e9; }
function gdpPerCapita(c) { return c.gdpPerCapitaUsd; }
function density(c) { return c.population / c.areaKm2; }
function indicatorValue(c, key) {
  switch (key) {
    case "population": return c.population;
    case "gdp": return gdpUsd(c);
    case "gdpPerCapita": return gdpPerCapita(c);
    case "lifeExpectancy": return c.lifeExpectancy;
    case "area": return c.areaKm2;
    case "density": return density(c);
    case "gdpGrowth": return c.gdpGrowthPct;
    default: return null;
  }
}
function rankOf(c, key) {
  const sorted = [...COUNTRIES].sort((a, b) => indicatorValue(b, key) - indicatorValue(a, key));
  return sorted.findIndex((x) => x.code === c.code) + 1;
}
function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === code) || null;
}

// --- Number formatting --------------------------------------------------
function fmtInt(n) { return Math.round(n).toLocaleString("en-US"); }
function fmtPeople(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + " bn";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " m";
  return fmtInt(n);
}
function fmtMoney(n) {
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + " tn";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + " bn";
  return "$" + fmtInt(n);
}
function fmtDollars(n) { return "$" + fmtInt(n); }
function fmtYears(n) { return n.toFixed(1) + " yrs"; }
function fmtArea(n) { return fmtInt(n) + " km²"; }
function fmtDensity(n) { return fmtInt(n) + " /km²"; }
function fmtGrowth(n) { return (n > 0 ? "+" : "") + n.toFixed(1) + "%"; }
function fmtPopFull(n) { return fmtInt(n); }
