import assert from 'node:assert/strict';
import test from 'node:test';

import { getFieldQuality } from '../src/fieldQuality.js';

test('describes a stable moment for practical work', () => {
  const quality = getFieldQuality({
    lunar: { illumination: 0.62, waxing: true },
    voc: { isActive: false },
    moonSign: { current: { key: 'taurus' } },
    moonAspects: {
      previous: { aspect: 120, planet: 'venus' },
      next: { aspect: 60, planet: 'jupiter' },
    },
    indicators: { dayOfficer: { key: 'stable' } },
    planetaryHour: { key: 'venus' },
  });

  assert.equal(quality.summary, 'Поле денежное: хорошо для практик на ресурс, клиентов и устойчивый доход.');
  assert.equal(quality.advice, 'Работать с ресурсом и клиентами спокойно, без резких обещаний.');
  assert.equal(quality.scores.material.level, 'высоко');
  assert.equal(quality.scores.rituals.level, 'высоко');
  assert.equal(quality.metrics.length, 3);
  assert.ok(quality.reasons.includes('Стабильный индикатор дня поддерживает закрепление результата.'));
  assert.ok(quality.supports.includes('закрепление решений'));
  assert.ok(quality.avoid.includes('хаотичные развороты'));
});

test('warns when void-of-course and hard next aspect make the field unstable', () => {
  const quality = getFieldQuality({
    lunar: { illumination: 0.18, waxing: false },
    voc: { isActive: true, end: new Date('2026-05-12T05:31:00+03:00') },
    moonSign: { current: { key: 'gemini' } },
    moonAspects: {
      previous: { aspect: 90, planet: 'mars' },
      next: { aspect: 90, planet: 'saturn' },
    },
    indicators: { dayOfficer: { key: 'danger' } },
    planetaryHour: { key: 'mars' },
  });

  assert.equal(quality.summary, 'Поле нервное: возможны резкие реакции и сбои планов.');
  assert.equal(quality.advice, 'Не действовать на раздражении; важные решения лучше отложить до более спокойного фона.');
  assert.equal(quality.scores.material.level, 'низко');
  assert.equal(quality.scores.rituals.level, 'средне');
  assert.ok(quality.reasons.includes('Луна без курса снижает надежность стартов и материальных решений.'));
  assert.ok(quality.supports.includes('завершение начатого'));
  assert.ok(quality.avoid.includes('запуск новых дел'));
  assert.ok(quality.warnings.includes('Луна без курса до 05:31 — лучше не начинать важное.'));
  assert.ok(quality.warnings.includes('Напряженный аспект Луны к Сатурну — лучше действовать осторожнее.'));
});

test('raises intuition for water Moon signs and Neptune influence', () => {
  const quality = getFieldQuality({
    lunar: { illumination: 0.42, waxing: false },
    voc: { isActive: false },
    moonSign: { current: { key: 'pisces' } },
    moonAspects: {
      previous: { aspect: 120, planet: 'neptune' },
      next: { aspect: 60, planet: 'venus' },
    },
    indicators: { dayOfficer: { key: 'open' } },
    planetaryHour: { key: 'moon' },
  });

  assert.equal(quality.summary, 'Поле тонкое: хорошо для интуиции, Таро и снов.');
  assert.equal(quality.advice, 'Хороший момент для диагностики, Таро, снов и тонкой настройки.');
  assert.equal(quality.scores.intuition.level, 'высоко');
  assert.ok(quality.reasons.includes('Водный знак Луны усиливает интуицию и сновидческое поле.'));
  assert.ok(quality.supports.includes('Таро и диагностика'));
  assert.ok(quality.avoid.includes('жесткие разговоры'));
});

test('limits the echo of an old hard Moon aspect', () => {
  const quality = getFieldQuality({
    now: new Date('2026-05-11T12:00:00+03:00'),
    lunar: { illumination: 0.32, waxing: false },
    voc: { isActive: false, status: 'upcoming' },
    moonSign: { current: { key: 'pisces' } },
    moonAspects: {
      previous: { at: new Date('2026-05-10T22:13:02+03:00'), aspect: 90, planet: 'uranus' },
      next: { at: new Date('2026-05-11T06:42:44+03:00'), aspect: 60, planet: 'mercury' },
    },
    indicators: { dayOfficer: { key: 'stable' } },
    planetaryHour: { key: 'venus' },
  });

  assert.notEqual(quality.summary, 'Поле нестабильно: лучше завершать и чистить, а не начинать.');
  assert.equal(quality.scores.material.level, 'высоко');
  assert.equal(quality.reasons.includes('Напряженный аспект к жесткой планете повышает фон осторожности.'), false);
});

test('gives dense advice for Saturnian field', () => {
  const quality = getFieldQuality({
    now: new Date('2026-05-11T10:00:00+03:00'),
    lunar: { illumination: 0.62, waxing: true },
    voc: { isActive: false },
    moonSign: { current: { key: 'capricorn' } },
    moonAspects: {
      previous: { at: new Date('2026-05-11T09:00:00+03:00'), aspect: 60, planet: 'saturn' },
      next: { aspect: 120, planet: 'saturn' },
    },
    indicators: { dayOfficer: { key: 'stable' } },
    planetaryHour: { key: 'saturn' },
  });

  assert.equal(quality.summary, 'Поле плотное: хорошо для телесных практик, защиты и стабилизации.');
  assert.equal(quality.advice, 'Сначала стабилизация, границы и дисциплина, потом действие.');
  assert.equal(quality.metrics.length, 3);
});

test('gives cleansing advice for cleansing field', () => {
  const quality = getFieldQuality({
    lunar: { illumination: 0.18, waxing: false },
    voc: { isActive: true },
    moonSign: { current: { key: 'virgo' } },
    moonAspects: {
      previous: { aspect: 60, planet: 'venus' },
      next: { aspect: 60, planet: 'mercury' },
    },
    indicators: { dayOfficer: { key: 'remove' } },
    planetaryHour: { key: 'moon' },
  });

  assert.equal(quality.summary, 'Поле очищающее: хорошо завершать, убирать и отсекать лишнее.');
  assert.equal(quality.advice, 'Сначала чистка, завершение и отсечение лишнего; новые запуски лучше отложить.');
  assert.ok(quality.supports.includes('чистки и отсечение'));
  assert.ok(quality.avoid.includes('запуск новых дел'));
});

test('gives blurred advice for Neptunian field', () => {
  const quality = getFieldQuality({
    now: new Date('2026-05-11T10:00:00+03:00'),
    lunar: { illumination: 0.48, waxing: true },
    voc: { isActive: false },
    moonSign: { current: { key: 'libra' } },
    moonAspects: {
      previous: { at: new Date('2026-05-11T09:00:00+03:00'), aspect: 90, planet: 'neptune' },
      next: { aspect: 120, planet: 'venus' },
    },
    indicators: { dayOfficer: { key: 'open' } },
    planetaryHour: { key: 'venus' },
  });

  assert.equal(quality.summary, 'Поле размытое: осторожно с обещаниями, договорами и ожиданиями.');
  assert.equal(quality.advice, 'Проверять обещания и ожидания; лучше не строить решения на туманных вводных.');
  assert.equal(quality.metrics.length, 3);
});

test('returns no warnings when there are no red flags', () => {
  const quality = getFieldQuality({
    now: new Date('2026-05-11T10:00:00+03:00'),
    lunar: { lunarDay: 12, illumination: 0.62, waxing: true },
    voc: {
      isActive: false,
      status: 'upcoming',
      start: new Date('2026-05-12T13:04:00+03:00'),
      end: new Date('2026-05-13T03:03:00+03:00'),
    },
    moonSign: { current: { key: 'taurus' } },
    moonAspects: {
      previous: { at: new Date('2026-05-11T08:00:00+03:00'), aspect: 120, planet: 'venus' },
      next: { at: new Date('2026-05-11T18:00:00+03:00'), aspect: 60, planet: 'jupiter' },
    },
    indicators: { dayOfficer: { key: 'stable' } },
    planetaryHour: { key: 'venus' },
  });

  assert.deepEqual(quality.warnings, []);
});

test('warns about upcoming void-of-course today', () => {
  const quality = getFieldQuality({
    now: new Date('2026-05-11T10:00:00+03:00'),
    lunar: { lunarDay: 12, illumination: 0.62, waxing: true },
    voc: {
      isActive: false,
      status: 'upcoming',
      start: new Date('2026-05-11T13:04:00+03:00'),
      end: new Date('2026-05-12T03:03:00+03:00'),
    },
    moonSign: { current: { key: 'taurus' } },
    moonAspects: { next: { aspect: 60, planet: 'jupiter' } },
    indicators: { dayOfficer: { key: 'stable' } },
    planetaryHour: { key: 'venus' },
  });

  assert.ok(quality.warnings.includes('VOC с 13:04 — важные запуски лучше сделать до этого времени.'));
});

test('warns about hard Moon aspect, 23 and 29 lunar days, and Pisces Moon', () => {
  const quality23 = getFieldQuality({
    now: new Date('2026-05-11T10:00:00+03:00'),
    lunar: { lunarDay: 23, illumination: 0.38, waxing: false },
    voc: { isActive: false },
    moonSign: { current: { key: 'pisces' } },
    moonAspects: { next: { aspect: 90, planet: 'uranus' } },
    indicators: { dayOfficer: { key: 'open' } },
    planetaryHour: { key: 'moon' },
  });

  assert.ok(quality23.warnings.includes('Напряженный аспект Луны к Урану — возможны резкие реакции.'));
  assert.ok(quality23.warnings.includes('23 лунные сутки — не делать магию из злости.'));
  assert.ok(quality23.warnings.includes('Луна в Рыбах — риск иллюзий и эмоциональной размытости.'));
  assert.equal(quality23.warnings.length, 3);

  const quality29 = getFieldQuality({
    lunar: { lunarDay: 29, illumination: 0.04, waxing: false },
    voc: { isActive: false },
    moonSign: { current: { key: 'virgo' } },
    moonAspects: { next: { aspect: 60, planet: 'venus' } },
    indicators: { dayOfficer: { key: 'remove' } },
    planetaryHour: { key: 'moon' },
  });

  assert.ok(quality29.warnings.includes('29 лунные сутки — лучше чистки, не запуск нового.'));
});
