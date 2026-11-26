// NationScope charts: small canvas bar charts, drawn with no library.
// Every chart is drawn synchronously when its view renders, so a
// screenshot taken after page load always shows the finished chart.

const CHART = {
  ink: "#1d3557",
  teal: "#0e7c6b",
  amber: "#e8a33d",
  slate: "#5b6b7f",
  grid: "#dfe5ea",
  track: "#eef1f3"
};

// Scale a canvas for crisp text on high-density screens, then return its
// 2d context and the CSS-pixel width/height the caller asked for.
function prepareCanvas(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { ctx, w: cssWidth, h: cssHeight };
}

function niceMax(value) {
  // Round the axis ceiling up to a tidy 1/2/5 step so bars never touch it.
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const step = value / pow;
  const nice = step <= 1 ? 1 : step <= 2 ? 2 : step <= 2.5 ? 2.5 : step <= 5 ? 5 : 10;
  return nice * pow;
}

// Horizontal bars: [{ label, value, highlight }], drawn biggest first.
// `format` turns a value into the text shown at the end of each bar.
function drawBarChart(canvas, rows, format, opts) {
  const options = opts || {};
  const rowH = options.rowHeight || 34;
  const labelW = options.labelWidth || 108;
  const valueW = options.valueWidth || 92;
  const cssW = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const width = Math.max(320, Math.min(cssW, 860));
  const height = rows.length * rowH + 14;
  const { ctx, w, h } = prepareCanvas(canvas, width, height);
  const max = niceMax(Math.max.apply(null, rows.map((r) => r.value)) * 1.02);
  const barX = labelW;
  const barW = w - labelW - valueW;
  ctx.font = "13px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textBaseline = "middle";
  rows.forEach((row, i) => {
    const y = 8 + i * rowH;
    const barH = 20;
    // Label, right-aligned.
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = "right";
    ctx.fillText(row.label, labelW - 10, y + barH / 2);
    // Track and bar.
    ctx.fillStyle = CHART.track;
    ctx.fillRect(barX, y, barW, barH);
    const bw = Math.max(2, (row.value / max) * barW);
    ctx.fillStyle = row.highlight ? CHART.amber : CHART.teal;
    ctx.fillRect(barX, y, bw, barH);
    // Value at the bar's end.
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = "left";
    ctx.font = "600 13px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillText(format(row.value), barX + bw + 8, y + barH / 2);
    ctx.font = "13px system-ui, -apple-system, 'Segoe UI', sans-serif";
  });
  return { w, h };
}

// Grouped vertical bars for the compare view: one group per indicator,
// one bar per country. `series` is [{ label, values: [..], color }].
function drawGroupedChart(canvas, groups, series, format) {
  const cssW = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const width = Math.max(320, Math.min(cssW, 860));
  const height = 300;
  const { ctx, w, h } = prepareCanvas(canvas, width, height);
  const padL = 8, padB = 46, padT = 30;
  const plotW = w - padL * 2;
  const plotH = h - padT - padB;
  const all = [];
  series.forEach((s) => s.values.forEach((v) => all.push(v)));
  const max = niceMax(Math.max.apply(null, all) * 1.05);
  const groupW = plotW / groups.length;
  const barW = Math.min(44, (groupW - 16) / series.length - 6);
  const colors = [CHART.teal, CHART.amber, "#457b9d"];
  ctx.font = "12px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textBaseline = "alphabetic";
  // Gridlines.
  ctx.strokeStyle = CHART.grid;
  ctx.fillStyle = CHART.slate;
  ctx.textAlign = "right";
  [0, 0.5, 1].forEach((f) => {
    const y = padT + plotH * (1 - f);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padL, y);
    ctx.stroke();
    ctx.fillText(format(max * f), padL + 44, y - 4);
  });
  groups.forEach((g, gi) => {
    const gx = padL + gi * groupW;
    series.forEach((s, si) => {
      const v = s.values[gi];
      const bh = (v / max) * plotH;
      const bx = gx + (groupW - series.length * (barW + 6)) / 2 + si * (barW + 6);
      ctx.fillStyle = colors[si % colors.length];
      ctx.fillRect(bx, padT + plotH - bh, barW, bh);
      ctx.fillStyle = CHART.ink;
      ctx.textAlign = "center";
      ctx.fillText(format(v), bx + barW / 2, padT + plotH - bh - 6);
    });
    // Group label under the bars.
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = "center";
    ctx.font = "600 12px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillText(g, gx + groupW / 2, h - 26);
    ctx.font = "12px system-ui, -apple-system, 'Segoe UI', sans-serif";
  });
  // Legend.
  let lx = padL;
  ctx.textAlign = "left";
  series.forEach((s, si) => {
    ctx.fillStyle = colors[si % colors.length];
    ctx.fillRect(lx, h - 12, 12, 12);
    ctx.fillStyle = CHART.ink;
    ctx.fillText(s.label, lx + 17, h - 2);
    lx += 17 + ctx.measureText(s.label).width + 22;
  });
  return { w, h };
}
