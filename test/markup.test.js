import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('home screen does not render inactive chrome or decorative Moon image', () => {
  assert.equal(html.includes('class="top-bar"'), false);
  assert.equal(html.includes('class="moon-visual"'), false);
  assert.equal(html.includes('class="tab-bar"'), false);
});

test('home screen renders compact Moon aspect fields', () => {
  assert.equal(html.includes('data-voc-aspect'), true);
  assert.equal(html.includes('data-last-moon-aspect'), true);
  assert.equal(html.includes('data-next-moon-aspect'), true);
  assert.equal(html.includes('data-moon-aspect-interpretation'), true);
  assert.equal(html.includes('data-moon-aspects-toggle'), true);
  assert.equal(html.includes('Последний аспект'), true);
  assert.equal(html.includes('Следующий аспект'), true);
});

test('home screen uses event heading for VOC card', () => {
  assert.equal(html.includes('<h2>Луна без курса</h2>'), true);
  assert.equal(html.includes('<h2>Статус Луны</h2>'), false);
});

test('home screen renders field quality fields', () => {
  assert.equal(html.includes('data-field-summary'), true);
  assert.equal(html.includes('data-field-advice'), true);
  assert.equal(html.includes('Главный совет момента'), true);
  assert.equal(html.includes('data-field-metrics'), true);
  assert.equal(html.includes('data-field-reasons'), true);
  assert.equal(html.includes('data-field-supports'), true);
  assert.equal(html.includes('data-field-avoid'), true);
});

test('home screen renders Moon precision field', () => {
  assert.equal(html.includes('data-moon-precision'), true);
  assert.equal(html.includes('class="moon-precision"'), true);
});

test('home screen renders planetary hour hint field', () => {
  assert.equal(html.includes('data-hour-hint'), true);
  assert.equal(html.includes('class="planet-hint"'), true);
});

test('home screen renders hidden warnings card shell', () => {
  assert.equal(html.includes('Осторожно сегодня'), true);
  assert.equal(html.includes('data-warnings-card hidden'), true);
  assert.equal(html.includes('data-warnings'), true);
});

test('home screen places warnings between VOC and Moon aspects', () => {
  const vocIndex = html.indexOf('class="glass-card voc-card"');
  const warningsIndex = html.indexOf('data-warnings-card hidden');
  const aspectsIndex = html.indexOf('class="glass-card moon-aspects-card"');

  assert.equal(vocIndex >= 0, true);
  assert.equal(warningsIndex >= 0, true);
  assert.equal(aspectsIndex >= 0, true);
  assert.equal(vocIndex < warningsIndex, true);
  assert.equal(warningsIndex < aspectsIndex, true);
});
