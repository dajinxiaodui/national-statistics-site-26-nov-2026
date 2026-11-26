// NationScope charts: two canvas drawings, no library.
// Both functions paint into a canvas the caller has already placed in the
// page, scale for the device pixel ratio, and use only values handed to
// them, so a chart can never disagree with the table next to it.

const INK = '#17323f';
const FAINT = '#6b7f89';
const BAR = '#2e7d6b';
const BAR_DIM = '#b9cfc9';
const HIGHLIGHT = '#d97706';
const GRID = '#dde5e2';

// Prepare a canvas for crisp drawing and return its 2d context plus the
// CSS-pixel size to draw in.
function prep(canvas, cssHeight) {
  const cssWidth = canvas.clientWidth || canvas.parentElement.clientWidth;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.height = cssHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.font = '12px system-ui, sans-serif';
  return { ctx, width: cssWidth, height: cssHeight };
}

// Horizontal bars, one row per entry: { label, value, text, hot }.
// The longest bar fills the plot width; values print at the bar ends.
export function drawBarChart(canvas, rows, options = {}) {
  const rowH = 26;
  const labelW = options.labelWidth || 104;
  const { ctx, width } = prep(canvas, rows.length * rowH + 8);
  const plotW = width - labelW - 86;
  const max = Math.max(...rows.map((r) => r.value));
  ctx.clearRect(0, 0, width, rows.length * rowH + 8);

  rows.forEach((row, i) => {
    const y = 4 + i * rowH;
    const barW = max > 0 ? Math.max(2, (row.value / max) * plotW) : 2;
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(row.label, labelW - 8, y + rowH / 2);
    ctx.fillStyle = row.hot ? HIGHLIGHT : options.dim ? BAR_DIM : BAR;
    if (row.hot && options.dim) ctx.fillStyle = HIGHLIGHT;
    ctx.beginPath();
    ctx.roundRect(labelW, y + 4, barW, rowH - 9, 3);
    ctx.fill();
    ctx.fillStyle = FAINT;
    ctx.textAlign = 'left';
    ctx.fillText(row.text, labelW + barW + 7, y + rowH / 2);
  });
}

// Grouped bars for the comparison page. Each group is one indicator,
// drawn on an indexed scale (the best of the compared countries = 100)
// because the indicators have incompatible units; the real figures sit
// in the table under the chart. series: [{ name, color }], groups:
// [{ label, values: [one per series] }].
export function drawGroupedChart(canvas, groups, series) {
  const groupH = 64;
  const labelW = 118;
  const barH = 13;
  const { ctx, width, height } = prep(canvas, groups.length * groupH + series.length * 20 + 14);
  const plotW = width - labelW - 16;
  ctx.clearRect(0, 0, width, height);

  // Legend along the top.
  let lx = labelW;
  series.forEach((s) => {
    ctx.fillStyle = s.color;
    ctx.fillRect(lx, 2, 10, 10);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.name, lx + 14, 7);
    lx += 14 + ctx.measureText(s.name).width + 22;
  });

  groups.forEach((group, gi) => {
    const top = 24 + gi * groupH;
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(labelW, top - 5);
    ctx.lineTo(labelW + plotW, top - 5);
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.fillText(group.label, labelW - 8, top + (series.length * (barH + 3)) / 2);
    series.forEach((s, si) => {
      const y = top + si * (barH + 3);
      const w = Math.max(2, (group.values[si] / 100) * plotW);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.roundRect(labelW, y, w, barH, 3);
      ctx.fill();
    });
  });
}
