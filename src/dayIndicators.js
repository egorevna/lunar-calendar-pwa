const MS_PER_DAY = 86400000;
const BASE_JIA_SHEN_DATE = Date.UTC(2026, 4, 10);
const BASE_JIA_SHEN_INDEX = 20;
const MOSCOW_OFFSET_HOURS = 3;
const DAY_CHANGE_HOUR = 23;

const LUNAR_SYMBOLS = [
  'Светильник',
  'Рог изобилия',
  'Барс',
  'Древо познания',
  'Единорог',
  'Журавль',
  'Жезл',
  'Феникс',
  'Летучая мышь',
  'Фонтан',
  'Корона',
  'Сердце',
  'Колесо',
  'Труба',
  'Змей',
  'Голубь',
  'Колокол',
  'Зеркало',
  'Паук',
  'Орел',
  'Конь',
  'Слон',
  'Крокодил Маккара',
  'Медведь',
  'Черепаха',
  'Жаба',
  'Трезубец',
  'Лотос',
  'Спрут',
  'Лебедь',
];

const STEMS = [
  { glyph: '甲', element: { masculine: 'Деревянный', feminine: 'Деревянная' } },
  { glyph: '乙', element: { masculine: 'Деревянный', feminine: 'Деревянная' } },
  { glyph: '丙', element: { masculine: 'Огненный', feminine: 'Огненная' } },
  { glyph: '丁', element: { masculine: 'Огненный', feminine: 'Огненная' } },
  { glyph: '戊', element: { masculine: 'Земляной', feminine: 'Земляная' } },
  { glyph: '己', element: { masculine: 'Земляной', feminine: 'Земляная' } },
  { glyph: '庚', element: { masculine: 'Металлический', feminine: 'Металлическая' } },
  { glyph: '辛', element: { masculine: 'Металлический', feminine: 'Металлическая' } },
  { glyph: '壬', element: { masculine: 'Водный', feminine: 'Водная' } },
  { glyph: '癸', element: { masculine: 'Водный', feminine: 'Водная' } },
];

const BRANCHES = [
  { key: 'zi', glyph: '子', animal: 'Крыса', gender: 'feminine' },
  { key: 'chou', glyph: '丑', animal: 'Бык', gender: 'masculine' },
  { key: 'yin', glyph: '寅', animal: 'Тигр', gender: 'masculine' },
  { key: 'mao', glyph: '卯', animal: 'Кролик', gender: 'masculine' },
  { key: 'chen', glyph: '辰', animal: 'Дракон', gender: 'masculine' },
  { key: 'si', glyph: '巳', animal: 'Змея', gender: 'feminine' },
  { key: 'wu', glyph: '午', animal: 'Лошадь', gender: 'feminine' },
  { key: 'wei', glyph: '未', animal: 'Коза', gender: 'feminine' },
  { key: 'shen', glyph: '申', animal: 'Обезьяна', gender: 'feminine' },
  { key: 'you', glyph: '酉', animal: 'Петух', gender: 'masculine' },
  { key: 'xu', glyph: '戌', animal: 'Собака', gender: 'feminine' },
  { key: 'hai', glyph: '亥', animal: 'Свинья', gender: 'feminine' },
];

const DAY_OFFICERS = [
  { key: 'establish', name: 'Установление', glyph: '建' },
  { key: 'remove', name: 'Устранение', glyph: '除' },
  { key: 'full', name: 'Наполнение', glyph: '满' },
  { key: 'balance', name: 'Равновесие', glyph: '平' },
  { key: 'stable', name: 'Стабильность', glyph: '定' },
  { key: 'hold', name: 'Удержание', glyph: '执' },
  { key: 'destruction', name: 'Разрушение', glyph: '破' },
  { key: 'danger', name: 'Опасность', glyph: '危' },
  { key: 'success', name: 'Успех', glyph: '成' },
  { key: 'receive', name: 'Получение', glyph: '收' },
  { key: 'open', name: 'Открытие', glyph: '开' },
  { key: 'close', name: 'Закрытие', glyph: '闭' },
];

export function getDayIndicators(date = new Date(), context) {
  const lunarDay = context?.lunarDay ?? 1;
  const sexagenaryDay = getSexagenaryDay(date);
  const monthBranchIndex = BRANCHES.findIndex((branch) => branch.key === context?.solarMonthBranch);
  const officerIndex = positiveModulo(sexagenaryDay.branchIndex - monthBranchIndex, 12);

  return {
    lunarSymbol: {
      name: LUNAR_SYMBOLS[lunarDay - 1] ?? 'Лунные сутки',
    },
    sexagenaryDay,
    dayOfficer: DAY_OFFICERS[officerIndex],
  };
}

function getSexagenaryDay(date) {
  const dayStart = getTongShuDayStart(date);
  const diff = Math.round((dayStart - BASE_JIA_SHEN_DATE) / MS_PER_DAY);
  const index = positiveModulo(BASE_JIA_SHEN_INDEX + diff, 60);
  const stem = STEMS[index % 10];
  const branchIndex = index % 12;
  const branch = BRANCHES[branchIndex];

  return {
    index,
    stemBranch: `${stem.glyph}${branch.glyph}`,
    name: `${stem.element[branch.gender]} ${branch.animal}`,
    branch: branch.key,
    branchIndex,
  };
}

function getTongShuDayStart(date) {
  const moscow = new Date(date.getTime() + MOSCOW_OFFSET_HOURS * 3600000);
  if (moscow.getUTCHours() >= DAY_CHANGE_HOUR) {
    moscow.setUTCDate(moscow.getUTCDate() + 1);
  }

  return Date.UTC(moscow.getUTCFullYear(), moscow.getUTCMonth(), moscow.getUTCDate());
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}
