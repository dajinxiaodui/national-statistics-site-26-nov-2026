// NationScope data layer.
// One record per country, seven headline indicators, plus the metadata that
// says where each figure comes from and which year it describes. All values
// are stored at full precision; rounding happens only in the formatters.

export const WORLD = {
  population: 8141808945,
  gdp: 111326000000000,
  lifeExpectancy: 73.3,
};

// calculated: true means the figure is derived on this site (GDP / population,
// or population / area) rather than read straight off a published series.
export const INDICATORS = [
  {
    key: 'population', label: 'Population', unit: 'people', year: 2024,
    source: 'World Bank, World Development Indicators', series: 'SP.POP.TOTL',
    blurb: 'Everyone usually resident in the country, counted at mid-year.',
  },
  {
    key: 'gdp', label: 'GDP', unit: 'current US$', year: 2024,
    source: 'World Bank, World Development Indicators', series: 'NY.GDP.MKTP.CD',
    blurb: 'The total value of goods and services produced, in current US dollars.',
  },
  {
    key: 'gdpPerCapita', label: 'GDP per capita', unit: 'current US$', year: 2024,
    source: 'World Bank, World Development Indicators', series: 'NY.GDP.PCAP.CD',
    blurb: 'GDP divided by population. An average, not what a typical person earns.',
  },
  {
    key: 'lifeExpectancy', label: 'Life expectancy', unit: 'years at birth', year: 2023,
    source: 'World Bank, World Development Indicators', series: 'SP.DYN.LE00.IN',
    blurb: 'How long a newborn would live if today\u2019s mortality rates stayed the same.',
  },
  {
    key: 'area', label: 'Total area', unit: 'km\u00B2', year: 2024,
    source: 'UN Statistics Division; CIA World Factbook country lists', series: '\u2014',
    blurb: 'Land and inland water area, in square kilometres.',
  },
  {
    key: 'density', label: 'Population density', unit: 'people per km\u00B2', year: 2024,
    source: 'Calculated on this site: 2024 population \u00F7 total area', series: '\u2014',
    blurb: 'How crowded the map looks on average. Deserts and cities average out.',
  },
  {
    key: 'growth', label: 'Real GDP growth', unit: '% per year', year: 2024,
    source: 'World Bank, World Development Indicators', series: 'NY.GDP.MKTP.KD.ZG',
    blurb: 'Annual growth of GDP after inflation is taken out.',
  },
];

// The twelve most populous countries. gdpPerCapitaCalc marks the three
// countries whose per-capita figure is GDP \u00F7 population computed here.
export const COUNTRIES = [
  { code: 'IND', name: 'India', capital: 'New Delhi', region: 'South Asia',
    population: 1450935791, gdp: 3912700000000, gdpPerCapita: 2694,
    lifeExpectancy: 72.0, area: 3287263, growth: 6.5, gdpPerCapitaCalc: false },
  { code: 'CHN', name: 'China', capital: 'Beijing', region: 'East Asia & Pacific',
    population: 1408289000, gdp: 18743000000000, gdpPerCapita: 13303,
    lifeExpectancy: 78.0, area: 9596961, growth: 5.0, gdpPerCapitaCalc: false },
  { code: 'USA', name: 'United States', capital: 'Washington, D.C.', region: 'North America',
    population: 340110988, gdp: 29720000000000, gdpPerCapita: 87386,
    lifeExpectancy: 78.5, area: 9833517, growth: 2.8, gdpPerCapitaCalc: false },
  { code: 'IDN', name: 'Indonesia', capital: 'Jakarta', region: 'East Asia & Pacific',
    population: 283487931, gdp: 1396171000000, gdpPerCapita: 4925,
    lifeExpectancy: 71.1, area: 1904569, growth: 5.0, gdpPerCapitaCalc: false },
  { code: 'PAK', name: 'Pakistan', capital: 'Islamabad', region: 'South Asia',
    population: 251269164, gdp: 374843000000, gdpPerCapita: 1492,
    lifeExpectancy: 67.6, area: 881913, growth: 2.5, gdpPerCapitaCalc: false },
  { code: 'NGA', name: 'Nigeria', capital: 'Abuja', region: 'Sub-Saharan Africa',
    population: 232679478, gdp: 187764000000, gdpPerCapita: 807,
    lifeExpectancy: 54.6, area: 923768, growth: 3.4, gdpPerCapitaCalc: false },
  { code: 'BRA', name: 'Brazil', capital: 'Bras\u00EDlia', region: 'Latin America & Caribbean',
    population: 216422446, gdp: 2171000000000, gdpPerCapita: 10031,
    lifeExpectancy: 75.8, area: 8514877, growth: 3.4, gdpPerCapitaCalc: false },
  { code: 'BGD', name: 'Bangladesh', capital: 'Dhaka', region: 'South Asia',
    population: 173562364, gdp: 450316000000, gdpPerCapita: 2595,
    lifeExpectancy: 74.7, area: 147570, growth: 4.2, gdpPerCapitaCalc: false },
  { code: 'RUS', name: 'Russia', capital: 'Moscow', region: 'Europe & Central Asia',
    population: 143526702, gdp: 2173830000000, gdpPerCapita: 15145,
    lifeExpectancy: 73.1, area: 17098242, growth: 4.1, gdpPerCapitaCalc: true },
  { code: 'ETH', name: 'Ethiopia', capital: 'Addis Ababa', region: 'Sub-Saharan Africa',
    population: 129719719, gdp: 163700000000, gdpPerCapita: 1262,
    lifeExpectancy: 67.3, area: 1104300, growth: 8.1, gdpPerCapitaCalc: true },
  { code: 'MEX', name: 'Mexico', capital: 'Mexico City', region: 'Latin America & Caribbean',
    population: 129739759, gdp: 1848000000000, gdpPerCapita: 14244,
    lifeExpectancy: 75.0, area: 1964375, growth: 1.5, gdpPerCapitaCalc: true },
  { code: 'JPN', name: 'Japan', capital: 'Tokyo', region: 'East Asia & Pacific',
    population: 123753041, gdp: 4026400000000, gdpPerCapita: 32537,
    lifeExpectancy: 84.0, area: 377975, growth: 0.1, gdpPerCapitaCalc: false },
];

export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === String(code).toUpperCase()) || null;
}

export function indicatorByKey(key) {
  return INDICATORS.find((i) => i.key === key) || INDICATORS[0];
}

// The raw numeric value of one indicator for one country. Density is the
// only figure worked out on the spot; everything else is stored.
export function valueOf(country, key) {
  if (key === 'density') return country.population / country.area;
  return country[key];
}

// Rank of a country on one indicator, 1 = highest value, among the twelve.
export function rankOf(country, key) {
  const sorted = [...COUNTRIES].sort((a, b) => valueOf(b, key) - valueOf(a, key));
  return sorted.findIndex((c) => c.code === country.code) + 1;
}

export function regions() {
  return [...new Set(COUNTRIES.map((c) => c.region))].sort();
}

// --- display formatting -------------------------------------------------

const grouped = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function fmtInt(n) {
  return grouped.format(Math.round(n));
}

export function fmtMoney(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + ' trillion';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + ' billion';
  return '$' + fmtInt(n);
}

export function fmtValue(country, key) {
  const v = valueOf(country, key);
  switch (key) {
    case 'population': return fmtInt(v);
    case 'gdp': return fmtMoney(v);
    case 'gdpPerCapita': return '$' + fmtInt(v) + (country.gdpPerCapitaCalc ? '*' : '');
    case 'lifeExpectancy': return v.toFixed(1) + ' years';
    case 'area': return fmtInt(v) + ' km\u00B2';
    case 'density': return v.toFixed(1) + ' per km\u00B2';
    case 'growth': return (v > 0 ? '+' : '') + v.toFixed(1) + '%';
    default: return String(v);
  }
}

// Short axis label for charts: compact, no units prose.
export function fmtAxis(key, v) {
  switch (key) {
    case 'population': return v >= 1e9 ? (v / 1e9).toFixed(2) + 'B' : Math.round(v / 1e6) + 'M';
    case 'gdp': return '$' + (v / 1e12).toFixed(1) + 'T';
    case 'gdpPerCapita': return '$' + fmtInt(v);
    case 'lifeExpectancy': return v.toFixed(1);
    case 'area': return (v / 1e6).toFixed(1) + 'M km\u00B2';
    case 'density': return v.toFixed(0);
    case 'growth': return v.toFixed(1) + '%';
    default: return String(v);
  }
}

export function shareOfWorld(country) {
  return (country.population / WORLD.population) * 100;
}
