export interface HistoricalEvent {
  name: string;
  year: number;
  month: number; // 1-12
  day: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const EVENT_BANK: HistoricalEvent[] = [
  { name: 'Moon Landing', year: 1969, month: 7, day: 20 },
  { name: 'Fall of the Berlin Wall', year: 1989, month: 11, day: 9 },
  { name: 'Declaration of Independence', year: 1776, month: 7, day: 4 },
  { name: 'Titanic Sank', year: 1912, month: 4, day: 15 },
  { name: 'First iPhone Released', year: 2007, month: 6, day: 29 },
  { name: 'WWI Started', year: 1914, month: 7, day: 28 },
  { name: 'WWII Ended', year: 1945, month: 9, day: 2 },
  { name: 'French Revolution Began', year: 1789, month: 7, day: 14 },
  { name: 'Columbus Reached the Americas', year: 1492, month: 10, day: 12 },
  { name: 'Wright Brothers First Flight', year: 1903, month: 12, day: 17 },
  { name: 'Pearl Harbor Attack', year: 1941, month: 12, day: 7 },
  { name: 'D-Day (Normandy Landing)', year: 1944, month: 6, day: 6 },
  { name: 'Assassination of JFK', year: 1963, month: 11, day: 22 },
  { name: 'Martin Luther King Jr. "I Have a Dream"', year: 1963, month: 8, day: 28 },
  { name: 'Hiroshima Atomic Bomb', year: 1945, month: 8, day: 6 },
  { name: 'Chernobyl Disaster', year: 1986, month: 4, day: 26 },
  { name: 'Berlin Airlift Began', year: 1948, month: 6, day: 24 },
  { name: 'Sputnik Launched', year: 1957, month: 10, day: 4 },
  { name: 'Cuban Missile Crisis Began', year: 1962, month: 10, day: 16 },
  { name: 'Assassination of Lincoln', year: 1865, month: 4, day: 14 },
  { name: 'Magna Carta Signed', year: 1215, month: 6, day: 15 },
  { name: 'Battle of Waterloo', year: 1815, month: 6, day: 18 },
  { name: 'Battle of Hastings', year: 1066, month: 10, day: 14 },
  { name: 'Fall of Constantinople', year: 1453, month: 5, day: 29 },
  { name: 'Gutenberg Printing Press', year: 1440, month: 2, day: 23 },
  { name: 'Boston Tea Party', year: 1773, month: 12, day: 16 },
  { name: 'Emancipation Proclamation', year: 1863, month: 1, day: 1 },
  { name: 'Women\'s Suffrage (19th Amendment)', year: 1920, month: 8, day: 18 },
  { name: 'Stock Market Crash (Black Tuesday)', year: 1929, month: 10, day: 29 },
  { name: 'End of WWI (Armistice)', year: 1918, month: 11, day: 11 },
  { name: 'Treaty of Versailles Signed', year: 1919, month: 6, day: 28 },
  { name: 'Russian Revolution Began', year: 1917, month: 10, day: 25 },
  { name: 'First Computer (ENIAC) Unveiled', year: 1946, month: 2, day: 14 },
  { name: 'DNA Structure Discovered', year: 1953, month: 4, day: 25 },
  { name: 'Yuri Gagarin First in Space', year: 1961, month: 4, day: 12 },
  { name: 'Nelson Mandela Released', year: 1990, month: 2, day: 11 },
  { name: 'Fall of the Soviet Union', year: 1991, month: 12, day: 26 },
  { name: 'September 11 Attacks', year: 2001, month: 9, day: 11 },
  { name: 'Barack Obama Inaugurated', year: 2009, month: 1, day: 20 },
  { name: 'COVID-19 Pandemic Declared', year: 2020, month: 3, day: 11 },
  { name: 'First Email Sent', year: 1971, month: 10, day: 29 },
  { name: 'World Wide Web Invented', year: 1989, month: 3, day: 12 },
  { name: 'Panama Canal Opened', year: 1914, month: 8, day: 15 },
  { name: 'Suez Canal Opened', year: 1869, month: 11, day: 17 },
  { name: 'Great Fire of London', year: 1666, month: 9, day: 2 },
  { name: 'Krakatoa Eruption', year: 1883, month: 8, day: 27 },
  { name: 'San Francisco Earthquake', year: 1906, month: 4, day: 18 },
  { name: 'Hindenburg Disaster', year: 1937, month: 5, day: 6 },
  { name: 'First Transatlantic Flight (Lindbergh)', year: 1927, month: 5, day: 21 },
  { name: 'First Heart Transplant', year: 1967, month: 12, day: 3 },
  { name: 'Watergate Break-in', year: 1972, month: 6, day: 17 },
  { name: 'Nixon Resigned', year: 1974, month: 8, day: 9 },
  { name: 'Challenger Disaster', year: 1986, month: 1, day: 28 },
  { name: 'Hubble Telescope Launched', year: 1990, month: 4, day: 24 },
  { name: 'Dolly the Sheep Cloned', year: 1996, month: 7, day: 5 },
  { name: 'Euro Currency Introduced', year: 1999, month: 1, day: 1 },
  { name: 'Human Genome Project Completed', year: 2003, month: 4, day: 14 },
  { name: 'Indian Independence', year: 1947, month: 8, day: 15 },
  { name: 'State of Israel Founded', year: 1948, month: 5, day: 14 },
  { name: 'Korean War Started', year: 1950, month: 6, day: 25 },
  { name: 'Vietnam War Ended', year: 1975, month: 4, day: 30 },
  { name: 'Magellan Expedition Began', year: 1519, month: 9, day: 20 },
  { name: 'American Civil War Began', year: 1861, month: 4, day: 12 },
  { name: 'Abolition of Slavery (13th Amendment)', year: 1865, month: 12, day: 6 },
  { name: 'First Olympic Games (Modern)', year: 1896, month: 4, day: 6 },
  { name: 'Einstein Published Relativity', year: 1905, month: 6, day: 30 },
  { name: 'Penicillin Discovered', year: 1928, month: 9, day: 28 },
  { name: 'United Nations Founded', year: 1945, month: 10, day: 24 },
  { name: 'NATO Established', year: 1949, month: 4, day: 4 },
  { name: 'Rosa Parks Bus Protest', year: 1955, month: 12, day: 1 },
  { name: 'Berlin Wall Built', year: 1961, month: 8, day: 13 },
  { name: 'Apollo 13 Incident', year: 1970, month: 4, day: 13 },
  { name: 'Voyager 1 Launched', year: 1977, month: 9, day: 5 },
  { name: 'First Space Shuttle Launch', year: 1981, month: 4, day: 12 },
  { name: 'Tiananmen Square Protests', year: 1989, month: 6, day: 4 },
  { name: 'German Reunification', year: 1990, month: 10, day: 3 },
  { name: 'Apartheid Ended', year: 1994, month: 4, day: 27 },
  { name: 'Hong Kong Returned to China', year: 1997, month: 7, day: 1 },
  { name: 'Mars Rover Curiosity Landed', year: 2012, month: 8, day: 6 },
  { name: 'Paris Climate Agreement', year: 2015, month: 12, day: 12 },
  { name: 'SpaceX First Crewed Launch', year: 2020, month: 5, day: 30 },
  { name: 'James Webb Telescope Launched', year: 2021, month: 12, day: 25 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getRandomEvents(count: number): HistoricalEvent[] {
  return shuffleArray(EVENT_BANK).slice(0, count);
}

type DateFormat = 'year' | 'monthYear' | 'full';

export function formatEventDate(event: HistoricalEvent, format: DateFormat): string {
  switch (format) {
    case 'year':
      return String(event.year);
    case 'monthYear':
      return `${MONTH_NAMES[event.month - 1]} ${event.year}`;
    case 'full':
      return `${MONTH_NAMES[event.month - 1]} ${event.day}, ${event.year}`;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDistractorDates(
  correctEvent: HistoricalEvent,
  format: DateFormat,
  count: number
): string[] {
  const correctStr = formatEventDate(correctEvent, format);
  const distractors = new Set<string>();

  const maxAttempts = count * 20;
  let attempts = 0;

  while (distractors.size < count && attempts < maxAttempts) {
    attempts++;
    let candidate: string;

    if (format === 'year') {
      const offset = randomInt(1, 10) * (Math.random() < 0.5 ? -1 : 1);
      const year = correctEvent.year + offset;
      candidate = String(year);
    } else if (format === 'monthYear') {
      if (Math.random() < 0.5) {
        // Same year, different month
        let m = correctEvent.month;
        while (m === correctEvent.month) {
          m = randomInt(1, 12);
        }
        candidate = `${MONTH_NAMES[m - 1]} ${correctEvent.year}`;
      } else {
        // Same month, different year
        const offset = randomInt(1, 8) * (Math.random() < 0.5 ? -1 : 1);
        candidate = `${MONTH_NAMES[correctEvent.month - 1]} ${correctEvent.year + offset}`;
      }
    } else {
      // full format: vary day, month, or year
      const roll = Math.random();
      if (roll < 0.33) {
        // Vary day
        const offset = randomInt(1, 10) * (Math.random() < 0.5 ? -1 : 1);
        const d = clamp(correctEvent.day + offset, 1, 28);
        candidate = `${MONTH_NAMES[correctEvent.month - 1]} ${d}, ${correctEvent.year}`;
      } else if (roll < 0.66) {
        // Vary month
        let m = correctEvent.month;
        while (m === correctEvent.month) {
          m = randomInt(1, 12);
        }
        const d = clamp(correctEvent.day, 1, 28);
        candidate = `${MONTH_NAMES[m - 1]} ${d}, ${correctEvent.year}`;
      } else {
        // Vary year
        const offset = randomInt(1, 5) * (Math.random() < 0.5 ? -1 : 1);
        candidate = `${MONTH_NAMES[correctEvent.month - 1]} ${correctEvent.day}, ${correctEvent.year + offset}`;
      }
    }

    if (candidate !== correctStr) {
      distractors.add(candidate);
    }
  }

  return Array.from(distractors);
}

/** Parse a formatted date string back into {month, day, year} for comparison */
export function parseDateString(str: string, format: DateFormat): { month?: number; day?: number; year: number } {
  if (format === 'year') {
    return { year: parseInt(str, 10) };
  }
  if (format === 'monthYear') {
    const parts = str.split(' ');
    const month = MONTH_NAMES.indexOf(parts[0]) + 1;
    const year = parseInt(parts[1], 10);
    return { month, year };
  }
  // full: "Month day, year"
  const parts = str.split(' ');
  const month = MONTH_NAMES.indexOf(parts[0]) + 1;
  const day = parseInt(parts[1].replace(',', ''), 10);
  const year = parseInt(parts[2], 10);
  return { month, day, year };
}

export { MONTH_NAMES };
