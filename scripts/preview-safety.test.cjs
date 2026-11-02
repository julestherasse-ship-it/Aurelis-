const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const handler = require('../api/leads.js');

const original = { fetch: global.fetch, env: { ...process.env } };
after(() => {
  global.fetch = original.fetch;
  for (const key of ['VERCEL_ENV', 'AURELIS_AI_URL', 'AURELIS_WEBSITE_INGEST_SECRET']) {
    if (original.env[key] === undefined) delete process.env[key];
    else process.env[key] = original.env[key];
  }
});

async function request(method, payload, headers = {}) {
  const req = Readable.from(payload === undefined ? [] : [Buffer.from(JSON.stringify(payload))]);
  req.method = method;
  req.headers = headers;
  req.socket = { remoteAddress: '127.0.0.1' };
  const res = {
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    end(body) { this.body = body ? JSON.parse(body) : null; },
  };
  await handler(req, res);
  return res;
}

test('preview, development and missing Vercel environment fail closed without contacting any backend', async () => {
  let calls = 0;
  global.fetch = async () => { calls++; throw new Error('must not call upstream'); };
  process.env.AURELIS_AI_URL = 'https://production.example.invalid';
  for (const env of ['preview', 'development', '']) {
    if (env) process.env.VERCEL_ENV = env;
    else delete process.env.VERCEL_ENV;
    const response = await request('POST', { email: 'test@example.invalid' });
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.integration, 'preview-disabled');
    assert.equal(response.body.ok, false);
  }
  assert.equal(calls, 0);
});

test('production proxy retains payload, idempotency and confirmed acceptance', async () => {
  process.env.VERCEL_ENV = 'production';
  process.env.AURELIS_AI_URL = 'https://unit-test.example.invalid/';
  process.env.AURELIS_WEBSITE_INGEST_SECRET = 'unit-test-only';
  const payload = { contactName: 'Test', offer: 'Aurelis Essential', consent: true };
  let sent;
  global.fetch = async (url, options) => {
    sent = { url, options };
    return { ok: true, text: async () => JSON.stringify({ accepted: true, id: 'lead-test', duplicate: false }) };
  };
  const response = await request('POST', payload, { 'x-idempotency-key': 'test-key' });
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.accepted, true);
  assert.equal(response.body.id, 'lead-test');
  assert.equal(sent.url, 'https://unit-test.example.invalid/api/inbound/website-offer');
  assert.deepEqual(JSON.parse(sent.options.body), payload);
  assert.equal(sent.options.headers['X-Idempotency-Key'], 'test-key');
  assert.equal(sent.options.headers['x-aurelis-ingest-secret'], 'unit-test-only');
});

test('production proxy returns an error rather than confirming failed delivery', async () => {
  process.env.VERCEL_ENV = 'production';
  global.fetch = async () => ({ ok: false, status: 503, text: async () => JSON.stringify({ error: 'unavailable' }) });
  const response = await request('POST', { test: true });
  assert.equal(response.statusCode, 503);
  assert.equal(response.body.ok, false);
  assert.equal(response.body.error, 'unavailable');
});

test('methods and preflight retain the original contract', async () => {
  const options = await request('OPTIONS');
  assert.equal(options.statusCode, 204);
  const get = await request('GET');
  assert.equal(get.statusCode, 405);
});
