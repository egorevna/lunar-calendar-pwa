import {
  getLunarInfo,
  getMoonSignInfo,
  getPlanetaryHour,
  getVoidOfCourse,
} from '../src/astro.js';
import { getDayIndicators } from '../src/dayIndicators.js';
import { getFieldQuality } from '../src/fieldQuality.js';
import { formatTimeWithSeconds } from '../src/format.js';
import {
  getPreciseLunarDayInfo,
  getPreciseMajorMoonPhase,
  getPreciseMoonAspectInfo,
  getPreciseMoonSignInfo,
  getPreciseSolarMonthBranch,
  getPreciseVoidOfCourse,
} from '../src/preciseEphemeris.js';

const SAMPLES = [
  { label: 'Сегодня / текущая точка', at: new Date() },
  { label: 'Контроль Tong Shu: стабильность', at: new Date('2026-05-11T12:00:00+03:00') },
  { label: 'Активная Луна без курса', at: new Date('2026-05-10T19:10:00+03:00') },
  { label: 'Новолуние', at: new Date('2026-05-16T23:10:00+03:00') },
  { label: 'Полнолуние', at: new Date('2026-05-01T20:30:00+03:00') },
  { label: 'Потенциально мягкое окно', at: new Date('2026-05-10T23:30:00+03:00') },
  { label: 'Потенциально напряженное окно', at: new Date('2026-05-10T14:00:00+03:00') },
];

for (const sample of SAMPLES) {
  printSample(sample);
}

function printSample(sample) {
  const context = buildContext(sample.at);
  const quality = getFieldQuality(context);

  console.log(`\n## ${sample.label}`);
  console.log(`Время: ${sample.at.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} MSK`);
  console.log(`Фраза: ${quality.summary}`);
  console.log('Оценки:');
  for (const metric of quality.metrics) {
    console.log(`- ${metric.label}: ${metric.level} (${metric.score}/10)`);
  }
  console.log(`Подходит: ${quality.supports.join(', ')}`);
  console.log(`Не подходит: ${quality.avoid.join(', ')}`);
  console.log('Контекст:');
  console.log(`- Лунный день: ${context.lunarDay}`);
  console.log(`- Фаза: ${context.majorPhase ? `${context.majorPhase.name} в ${formatTimeWithSeconds(context.majorPhase.at)}` : context.lunar.phaseName}`);
  console.log(`- Луна: ${context.moonSign.current.name}`);
  console.log(`- VOC: ${context.voc.isActive ? 'активна' : context.voc.status}`);
  console.log(`- Последний аспект: ${formatAspectLine(context.moonAspects?.previous)}`);
  console.log(`- Следующий аспект: ${formatAspectLine(context.moonAspects?.next)}`);
  console.log(`- Индикатор дня: ${context.indicators.dayOfficer.name}`);
  console.log(`- Ба-цзы: ${context.indicators.sexagenaryDay.name}`);
  console.log(`- Планетарный час: ${context.planetaryHour.name}`);
  console.log('Причины:');
  for (const reason of quality.reasons) {
    console.log(`- ${reason}`);
  }
}

function buildContext(date) {
  const lunar = getLunarInfo(date);
  const voc = getPreciseVoidOfCourse(date) ?? getVoidOfCourse(date);
  const moonSign = getPreciseMoonSignInfo(date) ?? getMoonSignInfo(date);
  const moonAspects = getPreciseMoonAspectInfo(date);
  const majorPhase = getPreciseMajorMoonPhase(date);
  const lunarDay = getPreciseLunarDayInfo(date)?.lunarDay ?? lunar.lunarDay;
  const solarMonthBranch = getPreciseSolarMonthBranch(date)?.key;
  const indicators = getDayIndicators(date, { lunarDay, solarMonthBranch });
  const planetaryHour = getPlanetaryHour(date);

  return {
    now: date,
    lunar,
    lunarDay,
    majorPhase,
    voc,
    moonSign,
    moonAspects,
    indicators,
    planetaryHour,
  };
}

function formatAspectLine(aspect) {
  if (!aspect) return 'нет данных';
  return `${aspect.aspect}° ${aspect.planet} в ${formatTimeWithSeconds(aspect.at)}`;
}
