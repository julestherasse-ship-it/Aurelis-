const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { mkdtempSync, readFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");

const root = resolve(__dirname, "..");

test("the production candidate drops preview gates without touching the live home", () => {
  const before = readFileSync(join(root, "index.html"), "utf8");
  const output = mkdtempSync(join(tmpdir(), "aurelis-release-"));
  execFileSync(process.execPath, ["scripts/build-release-candidate.mjs", output], { cwd: root, stdio: "pipe" });
  const html = readFileSync(join(output, "index.html"), "utf8");
  const css = readFileSync(join(output, "landing.css"), "utf8");
  assert.equal(readFileSync(join(root, "index.html"), "utf8"), before);
  assert.doesNotMatch(html, /noindex/i);
  assert.doesNotMatch(html, /Prévisualisation|preview-notice/);
  assert.match(html, /rel="canonical" href="https:\/\/aurelis\.ink\/"/);
  assert.match(html, /hreflang="en" href="https:\/\/aurelis\.ink\/en\/"/);
  assert.match(html, /property="og:url" content="https:\/\/aurelis\.ink\/"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /990/);
  assert.match(html, /2[\s\u202f\u00a0]?490/);
  assert.match(html, /4[\s\u202f\u00a0]?490/);
  assert.match(html, /7[\s\u202f\u00a0]?490/);
  assert.match(html, /\/api\/leads|lead-funnel\.js/);
  assert.match(html, /12 mois de suivi régulier offerts après mise en ligne/);
  assert.match(html, /12 mois de suivi offerts/);
  assert.match(css, /#070706/);
  assert.doesNotMatch(css, /\.preview-notice/);
});
