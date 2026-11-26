// NationScope hand-in program (Node 22, standard library only).
//
// The site itself is the static files under app/ — no build step. This
// program performs the hand-in: it copies app/ and screenshots/ from the
// repository into the output directory and writes dossier.json there with
// buildDossier from vendor/makefun-frontend.ts (the kit's library, kept
// unchanged, because the scorer rebuilds the dossier with its own copy
// and compares byte for byte).
//
// Run locally the way the README promises:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader, /output is used when MAKEFUN_OUTPUT_DIR is not set.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Preflight: fail here, with a plain reason, on the mistakes the scorer
// would refuse anyway — no entry page, or the wrong number of screenshots,
// or one screenshot over the size cap. Checking before the copy keeps a
// half-written output directory from ever looking like a finished hand-in.
function preflight() {
  if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
    throw new Error('app/index.html is missing: the site has no entry page');
  }
  const shotsDir = join(repoRoot, 'screenshots');
  const shots = existsSync(shotsDir)
    ? readdirSync(shotsDir).filter((name) => !name.startsWith('.')).sort()
    : [];
  if (shots.length < 3 || shots.length > 4) {
    throw new Error(`screenshots/ must hold 3 or 4 images, found ${shots.length}`);
  }
  for (const name of shots) {
    const size = statSync(join(shotsDir, name)).size;
    if (size > 262144) throw new Error(`screenshots/${name} is ${size} bytes, over the 262144 cap`);
  }
  return shots.length;
}

const shotCount = preflight();

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's gate, so an oversized entry fails here
// with the same words instead of being silently refused later.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`NationScope hand-in written to ${outputDir}: app/ copied, ${shotCount} screenshots, dossier.json ${dossier.length} bytes`);
