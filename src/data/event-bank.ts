// Event bank for Memory Master Date Keeper challenge
// 150+ date-event pairs spanning the 1400s to 2020s

export interface DateEvent {
  event: string;
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export const EVENT_BANK: DateEvent[] = [
  // 1400s
  { event: 'Fall of Constantinople', year: 1453, month: 5, day: 29 },
  { event: 'Gutenberg Bible printed', year: 1455, month: 2, day: 23 },
  { event: 'Columbus reaches America', year: 1492, month: 10, day: 12 },

  // 1500s
  { event: 'Mona Lisa completed', year: 1503, month: 10, day: 1 },
  { event: 'Luther posts 95 Theses', year: 1517, month: 10, day: 31 },
  { event: 'Magellan voyage begins', year: 1519, month: 9, day: 20 },
  { event: 'Copernicus publishes model', year: 1543, month: 5, day: 24 },
  { event: 'Spanish Armada defeated', year: 1588, month: 8, day: 8 },

  // 1600s
  { event: 'Shakespeare writes Hamlet', year: 1601, month: 1, day: 1 },
  { event: 'Jamestown founded', year: 1607, month: 5, day: 14 },
  { event: 'Galileo sees Jupiter moons', year: 1610, month: 1, day: 7 },
  { event: 'Mayflower lands', year: 1620, month: 12, day: 21 },
  { event: 'Great Fire of London', year: 1666, month: 9, day: 2 },
  { event: 'Newton publishes Principia', year: 1687, month: 7, day: 5 },

  // 1700s
  { event: 'Bach born', year: 1685, month: 3, day: 21 },
  { event: 'Benjamin Franklin born', year: 1706, month: 1, day: 17 },
  { event: 'Mozart born', year: 1756, month: 1, day: 27 },
  { event: 'Boston Tea Party', year: 1773, month: 12, day: 16 },
  { event: 'Declaration of Independence', year: 1776, month: 7, day: 4 },
  { event: 'Storming of the Bastille', year: 1789, month: 7, day: 14 },
  { event: 'George Washington inaugurated', year: 1789, month: 4, day: 30 },
  { event: 'Bill of Rights ratified', year: 1791, month: 12, day: 15 },
  { event: 'Beethoven first concert', year: 1795, month: 3, day: 29 },

  // 1800s
  { event: 'Louisiana Purchase signed', year: 1803, month: 4, day: 30 },
  { event: 'Battle of Trafalgar', year: 1805, month: 10, day: 21 },
  { event: 'Battle of Waterloo', year: 1815, month: 6, day: 18 },
  { event: 'First photograph taken', year: 1826, month: 6, day: 1 },
  { event: 'Telegraph invented', year: 1837, month: 1, day: 6 },
  { event: 'California Gold Rush begins', year: 1848, month: 1, day: 24 },
  { event: 'Origin of Species published', year: 1859, month: 11, day: 24 },
  { event: 'American Civil War begins', year: 1861, month: 4, day: 12 },
  { event: 'Emancipation Proclamation', year: 1863, month: 1, day: 1 },
  { event: 'Lincoln assassinated', year: 1865, month: 4, day: 14 },
  { event: 'Suez Canal opens', year: 1869, month: 11, day: 17 },
  { event: 'Telephone invented', year: 1876, month: 3, day: 10 },
  { event: 'Light bulb demonstrated', year: 1879, month: 10, day: 21 },
  { event: 'Statue of Liberty dedicated', year: 1886, month: 10, day: 28 },
  { event: 'Eiffel Tower completed', year: 1889, month: 3, day: 31 },
  { event: 'First modern Olympics', year: 1896, month: 4, day: 6 },

  // 1900s
  { event: 'Marconi sends radio signal', year: 1901, month: 12, day: 12 },
  { event: 'Wright brothers first flight', year: 1903, month: 12, day: 17 },
  { event: 'Einstein publishes relativity', year: 1905, month: 6, day: 30 },
  { event: 'Ford Model T released', year: 1908, month: 10, day: 1 },
  { event: 'Titanic sinks', year: 1912, month: 4, day: 15 },
  { event: 'World War I begins', year: 1914, month: 7, day: 28 },
  { event: 'Russian Revolution begins', year: 1917, month: 10, day: 25 },
  { event: 'World War I armistice', year: 1918, month: 11, day: 11 },
  { event: 'Treaty of Versailles signed', year: 1919, month: 6, day: 28 },
  { event: 'Women gain US vote', year: 1920, month: 8, day: 18 },
  { event: 'Insulin first used', year: 1922, month: 1, day: 11 },
  { event: 'Penicillin discovered', year: 1928, month: 9, day: 28 },
  { event: 'Stock market crash', year: 1929, month: 10, day: 29 },
  { event: 'Empire State Building opens', year: 1931, month: 5, day: 1 },
  { event: 'Hindenburg disaster', year: 1937, month: 5, day: 6 },
  { event: 'World War II begins', year: 1939, month: 9, day: 1 },
  { event: 'Pearl Harbor attacked', year: 1941, month: 12, day: 7 },
  { event: 'D-Day invasion', year: 1944, month: 6, day: 6 },
  { event: 'Hiroshima bombing', year: 1945, month: 8, day: 6 },
  { event: 'World War II ends', year: 1945, month: 9, day: 2 },
  { event: 'United Nations founded', year: 1945, month: 10, day: 24 },
  { event: 'India gains independence', year: 1947, month: 8, day: 15 },
  { event: 'Israel established', year: 1948, month: 5, day: 14 },
  { event: 'NATO established', year: 1949, month: 4, day: 4 },
  { event: 'Everest first summited', year: 1953, month: 5, day: 29 },
  { event: 'DNA structure discovered', year: 1953, month: 4, day: 25 },
  { event: 'Sputnik launched', year: 1957, month: 10, day: 4 },
  { event: 'Cuban Revolution succeeds', year: 1959, month: 1, day: 1 },
  { event: 'Gagarin orbits Earth', year: 1961, month: 4, day: 12 },
  { event: 'Berlin Wall built', year: 1961, month: 8, day: 13 },
  { event: 'Cuban Missile Crisis', year: 1962, month: 10, day: 16 },
  { event: 'JFK assassinated', year: 1963, month: 11, day: 22 },
  { event: 'I Have a Dream speech', year: 1963, month: 8, day: 28 },
  { event: 'Civil Rights Act signed', year: 1964, month: 7, day: 2 },
  { event: 'First spacewalk', year: 1965, month: 3, day: 18 },
  { event: 'Moon landing', year: 1969, month: 7, day: 20 },
  { event: 'Woodstock festival', year: 1969, month: 8, day: 15 },
  { event: 'First Earth Day', year: 1970, month: 4, day: 22 },
  { event: 'Watergate break-in', year: 1972, month: 6, day: 17 },
  { event: 'Nixon resigns', year: 1974, month: 8, day: 9 },
  { event: 'Viking 1 lands on Mars', year: 1976, month: 7, day: 20 },
  { event: 'Star Wars film released', year: 1977, month: 5, day: 25 },
  { event: 'First test tube baby born', year: 1978, month: 7, day: 25 },
  { event: 'John Lennon killed', year: 1980, month: 12, day: 8 },
  { event: 'First IBM PC released', year: 1981, month: 8, day: 12 },
  { event: 'Chernobyl disaster', year: 1986, month: 4, day: 26 },
  { event: 'Challenger explodes', year: 1986, month: 1, day: 28 },
  { event: 'Fall of the Berlin Wall', year: 1989, month: 11, day: 9 },
  { event: 'Tiananmen Square protests', year: 1989, month: 6, day: 4 },
  { event: 'World Wide Web invented', year: 1989, month: 3, day: 12 },
  { event: 'Nelson Mandela freed', year: 1990, month: 2, day: 11 },
  { event: 'German reunification', year: 1990, month: 10, day: 3 },
  { event: 'Soviet Union dissolves', year: 1991, month: 12, day: 26 },
  { event: 'Hubble Telescope launched', year: 1990, month: 4, day: 24 },
  { event: 'Apartheid ends', year: 1994, month: 4, day: 27 },
  { event: 'Channel Tunnel opens', year: 1994, month: 5, day: 6 },
  { event: 'Dolly the sheep cloned', year: 1996, month: 7, day: 5 },
  { event: 'Hong Kong returned', year: 1997, month: 7, day: 1 },
  { event: 'Google founded', year: 1998, month: 9, day: 4 },

  // 2000s
  { event: 'Y2K midnight passes', year: 2000, month: 1, day: 1 },
  { event: 'September 11 attacks', year: 2001, month: 9, day: 11 },
  { event: 'Euro currency launched', year: 2002, month: 1, day: 1 },
  { event: 'Human genome sequenced', year: 2003, month: 4, day: 14 },
  { event: 'Facebook launched', year: 2004, month: 2, day: 4 },
  { event: 'YouTube goes live', year: 2005, month: 2, day: 14 },
  { event: 'Twitter launched', year: 2006, month: 7, day: 15 },
  { event: 'First iPhone released', year: 2007, month: 6, day: 29 },
  { event: 'Obama inaugurated', year: 2009, month: 1, day: 20 },
  { event: 'Bitcoin whitepaper published', year: 2008, month: 10, day: 31 },
  { event: 'Haiti earthquake', year: 2010, month: 1, day: 12 },
  { event: 'Arab Spring begins', year: 2010, month: 12, day: 17 },
  { event: 'Bin Laden killed', year: 2011, month: 5, day: 2 },
  { event: 'Fukushima disaster', year: 2011, month: 3, day: 11 },
  { event: 'Higgs boson discovered', year: 2012, month: 7, day: 4 },
  { event: 'Curiosity lands on Mars', year: 2012, month: 8, day: 6 },
  { event: 'Paris climate agreement', year: 2015, month: 12, day: 12 },
  { event: 'Gravitational waves detected', year: 2016, month: 2, day: 11 },
  { event: 'Brexit referendum', year: 2016, month: 6, day: 23 },
  { event: 'COVID-19 pandemic declared', year: 2020, month: 3, day: 11 },
  { event: 'Perseverance lands on Mars', year: 2021, month: 2, day: 18 },
  { event: 'James Webb Telescope launch', year: 2021, month: 12, day: 25 },

  // Famous births and deaths
  { event: 'Leonardo da Vinci born', year: 1452, month: 4, day: 15 },
  { event: 'Shakespeare born', year: 1564, month: 4, day: 23 },
  { event: 'Napoleon born', year: 1769, month: 8, day: 15 },
  { event: 'Abraham Lincoln born', year: 1809, month: 2, day: 12 },
  { event: 'Charles Darwin born', year: 1809, month: 2, day: 12 },
  { event: 'Marie Curie born', year: 1867, month: 11, day: 7 },
  { event: 'Einstein born', year: 1879, month: 3, day: 14 },
  { event: 'Gandhi born', year: 1869, month: 10, day: 2 },
  { event: 'Martin Luther King born', year: 1929, month: 1, day: 15 },

  // Cultural milestones
  { event: 'Sistine Chapel completed', year: 1512, month: 10, day: 31 },
  { event: 'First newspaper published', year: 1605, month: 1, day: 1 },
  { event: 'First dictionary published', year: 1755, month: 4, day: 15 },
  { event: 'First public cinema show', year: 1895, month: 12, day: 28 },
  { event: 'First radio broadcast', year: 1920, month: 11, day: 2 },
  { event: 'First television broadcast', year: 1928, month: 9, day: 11 },
  { event: 'Color TV introduced', year: 1951, month: 6, day: 25 },
  { event: 'First video game created', year: 1958, month: 10, day: 18 },

  // Sports milestones
  { event: 'First FIFA World Cup', year: 1930, month: 7, day: 13 },
  { event: 'Jesse Owens wins gold', year: 1936, month: 8, day: 3 },
  { event: 'Roger Bannister four-minute mile', year: 1954, month: 5, day: 6 },
  { event: 'First Super Bowl', year: 1967, month: 1, day: 15 },
  { event: 'Miracle on Ice hockey', year: 1980, month: 2, day: 22 },

  // Science and technology
  { event: 'First steam engine patent', year: 1769, month: 1, day: 5 },
  { event: 'First battery created', year: 1800, month: 3, day: 20 },
  { event: 'Dynamite patented', year: 1867, month: 5, day: 7 },
  { event: 'X-rays discovered', year: 1895, month: 11, day: 8 },
  { event: 'Radioactivity discovered', year: 1896, month: 3, day: 1 },
  { event: 'First plastic invented', year: 1907, month: 7, day: 14 },
  { event: 'First nuclear reactor', year: 1942, month: 12, day: 2 },
  { event: 'First transistor invented', year: 1947, month: 12, day: 23 },
  { event: 'First satellite phone call', year: 1962, month: 7, day: 10 },
  { event: 'First email sent', year: 1971, month: 10, day: 29 },
  { event: 'First mobile phone call', year: 1973, month: 4, day: 3 },
  { event: 'First GPS satellite launched', year: 1978, month: 2, day: 22 },
  { event: 'CD format released', year: 1982, month: 10, day: 1 },

  // Exploration
  { event: 'Machu Picchu discovered', year: 1911, month: 7, day: 24 },
  { event: 'South Pole reached', year: 1911, month: 12, day: 14 },
  { event: 'North Pole reached', year: 1909, month: 4, day: 6 },
  { event: 'Tutankhamun tomb opened', year: 1922, month: 11, day: 26 },
  { event: 'Mariana Trench explored', year: 1960, month: 1, day: 23 },
  { event: 'Voyager 1 launched', year: 1977, month: 9, day: 5 },
  { event: 'Voyager 2 launched', year: 1977, month: 8, day: 20 },

  // Treaties and agreements
  { event: 'Magna Carta signed', year: 1215, month: 6, day: 15 },
  { event: 'Treaty of Westphalia', year: 1648, month: 10, day: 24 },
  { event: 'Geneva Convention signed', year: 1949, month: 8, day: 12 },
  { event: 'Antarctic Treaty signed', year: 1959, month: 12, day: 1 },
  { event: 'Nuclear Test Ban Treaty', year: 1963, month: 8, day: 5 },

  // Disasters and notable events
  { event: 'Great Lisbon earthquake', year: 1755, month: 11, day: 1 },
  { event: 'Krakatoa erupts', year: 1883, month: 8, day: 27 },
  { event: 'San Francisco earthquake', year: 1906, month: 4, day: 18 },
  { event: 'Triangle Shirtwaist fire', year: 1911, month: 3, day: 25 },
  { event: 'Tunguska explosion', year: 1908, month: 6, day: 30 },
];

export function getRandomEvents(count: number): DateEvent[] {
  // Return `count` random unique events using Fisher-Yates partial shuffle
  const copy = [...EVENT_BANK];
  const result: DateEvent[] = [];
  for (let i = 0; i < count && i < copy.length; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
    result.push(copy[i]);
  }
  return result;
}

export function formatDate(event: DateEvent, format: 'year' | 'monthYear' | 'full'): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (format === 'year') return String(event.year);
  if (format === 'monthYear') return `${months[event.month - 1]} ${event.year}`;
  return `${months[event.month - 1]} ${event.day}, ${event.year}`;
}
