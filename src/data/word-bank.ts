// Word bank for Memory Master challenges
// 500+ common English nouns organized by category

const WORDS_BY_CATEGORY: Record<string, string[]> = {
  animals: [
    'dog', 'cat', 'horse', 'eagle', 'shark', 'whale', 'tiger', 'bear',
    'wolf', 'fox', 'deer', 'rabbit', 'snake', 'frog', 'hawk', 'owl',
    'crow', 'swan', 'duck', 'goat', 'sheep', 'pig', 'cow', 'lion',
    'ape', 'bat', 'bee', 'ant', 'crab', 'seal', 'dove', 'moth',
    'eel', 'ram', 'yak', 'hen',
  ],
  food: [
    'bread', 'cheese', 'apple', 'grape', 'melon', 'peach', 'lemon',
    'olive', 'onion', 'corn', 'rice', 'bean', 'steak', 'bacon',
    'cream', 'butter', 'sugar', 'honey', 'salt', 'pepper', 'mint',
    'plum', 'pear', 'lime', 'fig', 'mango', 'cherry', 'cake',
    'soup', 'toast', 'pasta', 'curry', 'pie', 'jam', 'egg',
  ],
  objects: [
    'key', 'coin', 'ring', 'bell', 'clock', 'phone', 'book',
    'lamp', 'mirror', 'candle', 'rope', 'chain', 'bottle', 'cup',
    'plate', 'bowl', 'knife', 'spoon', 'fork', 'pen', 'pencil',
    'brush', 'comb', 'needle', 'button', 'badge', 'stamp', 'card',
    'dice', 'globe', 'flag', 'box', 'bag', 'jar', 'vase',
  ],
  places: [
    'beach', 'forest', 'desert', 'island', 'valley', 'canyon', 'cave',
    'lake', 'river', 'ocean', 'marsh', 'cliff', 'ridge', 'harbor',
    'village', 'castle', 'temple', 'market', 'garden', 'park', 'farm',
    'tower', 'bridge', 'tunnel', 'arena', 'plaza', 'port', 'trail',
    'shore', 'creek', 'pond', 'reef', 'bay', 'cove', 'peak',
  ],
  nature: [
    'tree', 'flower', 'leaf', 'root', 'seed', 'stone', 'rock',
    'mountain', 'river', 'cloud', 'star', 'moon', 'sun', 'flame',
    'wave', 'frost', 'ice', 'snow', 'sand', 'dust', 'mud',
    'moss', 'vine', 'thorn', 'petal', 'shell', 'coral', 'pearl',
    'crystal', 'gem', 'amber', 'fern', 'reed', 'oak', 'elm',
  ],
  body: [
    'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'tooth',
    'tongue', 'lip', 'chin', 'neck', 'throat', 'chest', 'back',
    'arm', 'leg', 'knee', 'elbow', 'wrist', 'ankle', 'thumb',
    'finger', 'palm', 'skull', 'spine', 'rib', 'hip', 'jaw',
    'brow', 'cheek', 'nail', 'bone', 'skin', 'hair', 'lung',
  ],
  clothing: [
    'hat', 'cap', 'hood', 'scarf', 'glove', 'belt', 'boot',
    'shoe', 'sock', 'shirt', 'vest', 'coat', 'jacket', 'cloak',
    'robe', 'gown', 'dress', 'skirt', 'pants', 'jeans', 'shorts',
    'suit', 'tie', 'bow', 'mask', 'crown', 'helmet', 'apron',
    'shawl', 'sash', 'patch', 'collar', 'sleeve', 'pocket', 'zipper',
  ],
  vehicles: [
    'car', 'bus', 'van', 'truck', 'train', 'plane', 'boat',
    'ship', 'bike', 'cart', 'sled', 'raft', 'canoe', 'kayak',
    'ferry', 'yacht', 'barge', 'jet', 'rocket', 'shuttle', 'tank',
    'cab', 'tram', 'wagon', 'sleigh', 'scooter', 'moped', 'jeep',
    'crane', 'blimp', 'drone', 'glider', 'sub', 'taxi', 'limo',
  ],
  tools: [
    'hammer', 'drill', 'saw', 'wrench', 'pliers', 'scraper', 'chisel',
    'clamp', 'file', 'vice', 'anvil', 'axe', 'shovel', 'rake',
    'hoe', 'pick', 'lever', 'pulley', 'wedge', 'bolt', 'screw',
    'nail', 'wire', 'tape', 'glue', 'ruler', 'scale', 'gauge',
    'pump', 'hose', 'winch', 'jack', 'hook', 'blade', 'lathe',
  ],
  furniture: [
    'chair', 'table', 'desk', 'bench', 'stool', 'couch', 'sofa',
    'bed', 'crib', 'shelf', 'rack', 'cabinet', 'dresser', 'drawer',
    'trunk', 'chest', 'locker', 'closet', 'stand', 'ledge', 'counter',
    'throne', 'cradle', 'hammock', 'cot', 'bunk', 'mat', 'rug',
    'carpet', 'curtain', 'blind', 'screen', 'frame', 'pillow', 'cushion',
  ],
  instruments: [
    'drum', 'flute', 'harp', 'horn', 'bell', 'gong', 'lute',
    'pipe', 'fife', 'viola', 'cello', 'bass', 'banjo', 'sitar',
    'organ', 'piano', 'guitar', 'violin', 'trumpet', 'tuba', 'oboe',
    'cymbal', 'chime', 'lyre', 'bugle', 'fiddle', 'bongo', 'tabla',
    'kazoo', 'reed', 'mallet', 'bow', 'pick', 'string', 'key',
  ],
  sports: [
    'ball', 'goal', 'net', 'bat', 'club', 'puck', 'dart',
    'disc', 'ring', 'hoop', 'paddle', 'oar', 'sail', 'ski',
    'pole', 'whip', 'lance', 'sword', 'shield', 'bow', 'arrow',
    'rod', 'reel', 'lure', 'glove', 'helmet', 'jersey', 'cleat',
    'track', 'field', 'court', 'rink', 'pool', 'mat', 'cage',
  ],
  weather: [
    'rain', 'snow', 'hail', 'sleet', 'fog', 'mist', 'dew',
    'frost', 'ice', 'wind', 'gust', 'breeze', 'storm', 'gale',
    'flood', 'drought', 'thunder', 'bolt', 'flash', 'cloud', 'smog',
    'heat', 'cold', 'chill', 'thaw', 'blizzard', 'cyclone', 'tornado',
    'squall', 'shower', 'drizzle', 'downpour', 'rainbow', 'haze', 'surge',
  ],
  buildings: [
    'house', 'barn', 'shed', 'cabin', 'hut', 'fort', 'castle',
    'tower', 'church', 'mosque', 'temple', 'palace', 'prison', 'jail',
    'mill', 'inn', 'pub', 'lodge', 'motel', 'hotel', 'clinic',
    'school', 'chapel', 'dome', 'vault', 'cellar', 'attic', 'porch',
    'deck', 'balcony', 'garage', 'bunker', 'silo', 'hangar', 'depot',
  ],
  colors: [
    'red', 'blue', 'green', 'gold', 'silver', 'bronze', 'white',
    'black', 'gray', 'brown', 'pink', 'orange', 'yellow', 'purple',
    'violet', 'indigo', 'teal', 'cyan', 'magenta', 'scarlet', 'crimson',
    'ivory', 'pearl', 'ruby', 'jade', 'coral', 'salmon', 'slate',
    'ash', 'rust', 'tan', 'cream', 'navy', 'maroon', 'olive',
  ],
};

// Flatten all categories into one array, removing duplicates
const allWordsSet = new Set<string>();
for (const words of Object.values(WORDS_BY_CATEGORY)) {
  for (const word of words) {
    allWordsSet.add(word);
  }
}

export const WORD_BANK: string[] = Array.from(allWordsSet);

export function getRandomWords(count: number): string[] {
  // Return `count` random unique words from WORD_BANK
  // Use Fisher-Yates partial shuffle for efficiency
  const copy = [...WORD_BANK];
  const result: string[] = [];
  for (let i = 0; i < count && i < copy.length; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
    result.push(copy[i]);
  }
  return result;
}

export function getWordsByCategory(category: string): string[] {
  return WORDS_BY_CATEGORY[category] || [];
}

export function getCategories(): string[] {
  return Object.keys(WORDS_BY_CATEGORY);
}
