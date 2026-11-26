# national-statistics-site-26-nov-2026

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/dajinxiaodui/national-statistics-site-26-nov-2026/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/dajinxiaodui/national-statistics-site-26-nov-2026/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**NationScope** — national statistics, plainly presented. Twelve of the world's most populous countries, seven indicators each: population, GDP, GDP per capita, life expectancy, total area, population density and real GDP growth. A sortable, filterable table, a profile page per country with ranks and charts, a side-by-side comparison tool for up to three countries, and leaderboards by indicator — all drawn from real public figures, every one sourced and dated.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser or on a phone. The site is plain static files under `app/` — no build step, no network requests, no libraries — so it also works straight off disk or from any static server with `app/` at its root.

To hand the site in as an entry, run `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`, which copies `app/` and `screenshots/` to `out/` and writes the `out/dossier.json` summary.

## What is inside

- `app/index.html` — the single page shell: header navigation, footer sources
- `app/data.js` — the twelve countries, world totals, indicator metadata and formatting
- `app/charts.js` — canvas bar charts (horizontal bars, grouped bars), no chart library
- `app/views.js` — one render function per page: home, country profile, compare, rankings, sources
- `app/main.js` — the hash router (`#/`, `#/country/<code>`, `#/compare`, `#/rankings`, `#/about`)
- `app/style.css` — the whole look, system fonts only, with a phone layout
- `main.ts` — the entry program: copies `app/` and `screenshots/` and writes `dossier.json`
- `screenshots/` — four real renders of the site in a browser (desktop home, country profile, compare, phone)

## Data and sources

Every figure was checked in November 2026 against the World Bank's World Development Indicators and the UN Statistics Division, and is printed with its year on the page:

| Indicator | Source | Series | Year |
|---|---|---|---|
| Population | World Bank, World Development Indicators | SP.POP.TOTL | 2024 |
| GDP, current US$ | World Bank, World Development Indicators | NY.GDP.MKTP.CD | 2024 |
| GDP per capita | World Bank, World Development Indicators | NY.GDP.PCAP.CD | 2024 |
| Life expectancy at birth | World Bank, World Development Indicators | SP.DYN.LE00.IN | 2023 |
| Real GDP growth | World Bank, World Development Indicators | NY.GDP.MKTP.KD.ZG | 2024 |
| Total area | UN Statistics Division; CIA World Factbook country lists | — | — |
| Population density | Calculated here: 2024 population ÷ total area | — | 2024 |

World totals on the home page are the WDI world aggregates: population 8,141,808,945 (2024), GDP $111.3 trillion (2024), life expectancy 73.3 years (2023).

Where two vintages of the WDI disagree (the Bank revises its estimates), the site uses the Bank's published values as retrieved in November 2026. Three GDP-per-capita figures — Russia, Ethiopia and Mexico — are calculated here as GDP ÷ population, the same arithmetic the WDI uses for its own per-capita series, and are marked with an asterisk wherever they appear. Figures are rounded for display; the stored values are the published ones.

## Licence

MIT — see [LICENSE](LICENSE). Not affiliated with the World Bank or the United Nations.

---

<sub>Entered on [make.fun](https://make.fun/?ref=qtgxrqfw&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
