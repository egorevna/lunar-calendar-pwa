import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { describeArabicPartsBlock } from '../src/profileUi.js';

const appSource = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const swSource = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

const SELECTED_VRONSKY_LABELS = Object.freeze([
  'Точка любви',
  'Точка искусства',
  'Точка друзей',
  'Братья и сестры',
  'Точка наследства',
  'Точка веры',
  'Точка свободы',
  'Точка матери',
  'Точка отца',
  'Дети мужского пола',
  'Астрология',
  'Торговля',
]);

const FORBIDDEN_UI_FRAGMENTS = Object.freeze([
  'Lot of Eros',
  'lot-of-eros',
  'lot-of-necessity',
  'lot-of-basis',
  'lot-of-exaltation',
  'Necessity',
  'Basis',
  'Exaltation',
  'точка смерти',
  'точка болезни',
  'Катастрофа',
  'Карма',
  'birthDate',
  'birthTime',
  'utcDateTime',
  'timezone',
  'coordinates',
  'latitude',
  'longitude',
  'provider',
  'fullProfile',
  'operand',
  'опасность',
  'фатально',
  'карм',
  'ритуал',
  'interpretation',
]);

function readyArabicPartsFixture() {
  return {
    status: 'ready',
    ready: true,
    title: 'Жребии и арабские части',
    summary: '2 жребия рассчитаны',
    chartSectLabel: 'Дневная карта',
    items: [
      { text: 'Парс Фортуны — Телец 19°07′24″ · 4 дом' },
      { text: 'Жребий Духа — Скорпион 08°11′20″ · 10 дом' },
    ],
    limitations: [
      'Жребии рассчитываются только при готовых ASC, Солнце, Луне и дневной/ночной карте.',
      'Этот блок не содержит интерпретаций.',
    ],
  };
}

function readyVronskyFixture() {
  return {
    status: 'ready',
    ready: true,
    title: 'Точки Вронского',
    summary: '12 точек Вронского рассчитаны',
    items: SELECTED_VRONSKY_LABELS.map((label, index) => ({
      text: `${label} — Лев ${String(index).padStart(2, '0')}°00′00″ · ${index + 1} дом`,
    })),
    limitations: [
      'Формулы Вронского подтверждены для дневного рождения.',
      'Ночные формулы по Вронскому пока не verified.',
      'Этот блок не содержит интерпретаций.',
    ],
  };
}

test('Arabic Parts UI view keeps existing lots and adds Vronsky subsection inside same block', () => {
  const view = describeArabicPartsBlock({ id: 'profile-day', name: 'Егор' }, {
    arabicParts: readyArabicPartsFixture(),
    vronskyArabicParts: readyVronskyFixture(),
  });
  const text = JSON.stringify(view);

  assert.equal(view.title, 'Жребии и арабские части');
  assert.equal(view.status, '');
  assert.equal(view.summary, '2 жребия рассчитаны');
  assert.deepEqual(view.items, [
    'Парс Фортуны — Телец 19°07′24″ · 4 дом',
    'Жребий Духа — Скорпион 08°11′20″ · 10 дом',
  ]);
  assert.equal(view.vronskySection.title, 'Точки Вронского');
  assert.equal(view.vronskySection.message, '');
  assert.equal(view.vronskySection.items.length, 12);
  assert.equal(view.vronskySection.items.every((item) => /″ · \d{1,2} дом$/.test(item)), true);
  SELECTED_VRONSKY_LABELS.forEach((label) => {
    assert.equal(text.includes(label), true);
  });
  assert.equal(view.limitations.filter((item) => item === 'Формулы Вронского подтверждены для дневного рождения.').length, 1);
  assert.equal(view.limitations.filter((item) => item === 'Ночные формулы по Вронскому пока не verified.').length, 1);
  assert.equal(view.limitations.filter((item) => item === 'Источник: Вронский, Том 1, Приложение 2, Таблица 17.').length, 1);
  FORBIDDEN_UI_FRAGMENTS.forEach((fragment) => {
    assert.equal(text.includes(fragment), false, fragment);
  });
});

test('Arabic Parts UI view renders safe Vronsky fallback for night boundary and unknown states', () => {
  const nightView = describeArabicPartsBlock({ id: 'profile-night', name: 'Егор' }, {
    arabicParts: readyArabicPartsFixture(),
    vronskyArabicParts: {
      status: 'notReady',
      ready: false,
      title: 'Точки Вронского',
      summary: 'Пока недоступно.',
      message: 'Точки Вронского пока недоступны для ночной карты. Ночные формулы по Вронскому пока не verified.',
      items: [],
      limitations: ['Ночные формулы по Вронскому пока не verified.'],
    },
  });
  const boundaryView = describeArabicPartsBlock({ id: 'profile-boundary', name: 'Егор' }, {
    arabicParts: readyArabicPartsFixture(),
    vronskyArabicParts: {
      status: 'notReady',
      ready: false,
      title: 'Точки Вронского',
      summary: 'Пока недоступно.',
      message: 'Точки Вронского пока недоступны на границе дня и ночи.',
      items: [],
      limitations: [],
    },
  });
  const unknownView = describeArabicPartsBlock({ id: 'profile-unknown', name: 'Егор' }, {
    arabicParts: readyArabicPartsFixture(),
    vronskyArabicParts: {
      status: 'notReady',
      ready: false,
      title: 'Точки Вронского',
      summary: 'Пока недоступно.',
      message: 'Для расчета точек Вронского нужна готовая дневная/ночная карта.',
      items: [],
      limitations: [],
    },
  });

  assert.equal(nightView.vronskySection.items.length, 0);
  assert.equal(nightView.vronskySection.message, 'Точки Вронского пока недоступны для ночной карты. Ночные формулы по Вронскому пока не verified.');
  assert.equal(boundaryView.vronskySection.message, 'Точки Вронского пока недоступны на границе дня и ночи.');
  assert.equal(unknownView.vronskySection.message, 'Для расчета точек Вронского нужна готовая дневная/ночная карта.');
  assert.equal(JSON.stringify(nightView).includes('Точка любви —'), false);
});

test('Arabic Parts markup has Vronsky subsection slots without creating a competing block', () => {
  const panelStart = html.indexOf('data-profiles-panel');
  const panelEnd = html.indexOf('class="glass-card mode-selector"');
  const panelHtml = html.slice(panelStart, panelEnd);
  const arabicPartsStart = panelHtml.indexOf('data-arabic-parts-readiness');
  const specialPointsStart = panelHtml.indexOf('data-special-points-readiness');
  const arabicPartsHtml = panelHtml.slice(arabicPartsStart, specialPointsStart);

  assert.equal(arabicPartsStart >= 0, true);
  assert.equal(specialPointsStart > arabicPartsStart, true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-vronsky-section'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-vronsky-title'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-vronsky-message'), true);
  assert.equal(arabicPartsHtml.includes('data-arabic-parts-vronsky-list'), true);
  assert.equal((panelHtml.match(/Точки Вронского/g) ?? []).length, 1);
  assert.equal(panelHtml.includes('data-vronsky-arabic-parts-readiness'), false);
  assert.equal(arabicPartsHtml.includes('Точка любви — Лев'), false);
  FORBIDDEN_UI_FRAGMENTS.forEach((fragment) => {
    assert.equal(arabicPartsHtml.includes(fragment), false, fragment);
  });
});

test('Arabic Parts renderer handles Vronsky section and notes inside existing collapse flow', () => {
  assert.equal(appSource.includes('arabicPartsVronskySection'), true);
  assert.equal(appSource.includes('renderArabicPartsVronskySection(elements.arabicPartsVronskySection, view.vronskySection);'), true);
  assert.equal(appSource.includes('elements.arabicPartsVronskySection.hidden = !isExpanded || !view.vronskySection.title;'), true);
  assert.equal(appSource.includes('renderSimpleList(elements.arabicPartsLimitations, view.limitations);'), true);
  assert.equal(appSource.includes('expandedArabicPartsProfileId = isExpanded ? null : profileId;'), true);
  assert.equal(appSource.includes('getArabicPartsDebugState'), true);
  assert.equal(appSource.includes('buildVronskyArabicPartsDebugSnapshotForProfile'), true);
  assert.equal(html.includes('Vronsky Arabic Points Debug'), false);
  assert.equal(html.includes('Точки Вронского Debug'), false);
});

test('service worker caches app-visible Vronsky profile helper and bumps cache version', () => {
  assert.equal(swSource.includes("const CACHE_NAME = 'lunar-calendar-v97';"), true);
  assert.equal(swSource.includes("'src/vronskyArabicPartsForProfile.js'"), true);
  assert.equal(swSource.includes("'src/vronskyArabicPartsDebug.js'"), true);
});
