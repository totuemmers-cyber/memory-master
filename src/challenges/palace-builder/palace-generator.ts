import { shuffle, pickN } from '../../utils/random';

export interface Room {
  id: string;
  name: string;
  icon: string;
  items: string[];
}

export interface PalaceQuestion {
  id: string;
  text: string;
  correctAnswer: string;
  type: 'multipleChoice' | 'numberInput';
  options?: string[];
  min?: number;
  max?: number;
}

const ALL_ROOMS = [
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏' },
  { id: 'library', name: 'Library', icon: '📚' },
  { id: 'bathroom', name: 'Bathroom', icon: '🛁' },
  { id: 'garden', name: 'Garden', icon: '🌿' },
  { id: 'attic', name: 'Attic', icon: '🏚' },
  { id: 'basement', name: 'Basement', icon: '🪜' },
  { id: 'office', name: 'Office', icon: '💼' },
  { id: 'garage', name: 'Garage', icon: '🚗' },
  { id: 'living-room', name: 'Living Room', icon: '🛋' },
];

const ALL_ITEMS = [
  'sword', 'crown', 'compass', 'lantern', 'telescope', 'hourglass', 'crystal',
  'feather', 'shield', 'trophy', 'bell', 'candle', 'diamond', 'goblet', 'map',
  'scroll', 'key', 'mirror', 'hammer', 'violin', 'globe', 'anchor', 'basket',
  'clock', 'drum', 'flute', 'helmet', 'ladder', 'medal', 'pillow', 'ring',
  'torch', 'umbrella', 'wand', 'yarn', 'arrow', 'bone', 'chain', 'dice',
  'fan', 'gem', 'harp', 'ink', 'jar', 'kite', 'lens', 'mask',
];

export function generatePalace(roomCount: number, itemCount: number): Room[] {
  const selectedRooms = pickN(ALL_ROOMS, roomCount).map(r => ({ ...r, items: [] as string[] }));
  const selectedItems = pickN(ALL_ITEMS, itemCount);

  // Distribute items across rooms (at least 1 per room, rest random)
  for (let i = 0; i < selectedRooms.length && i < selectedItems.length; i++) {
    selectedRooms[i].items.push(selectedItems[i]);
  }
  for (let i = selectedRooms.length; i < selectedItems.length; i++) {
    const roomIdx = Math.floor(Math.random() * selectedRooms.length);
    selectedRooms[roomIdx].items.push(selectedItems[i]);
  }

  return selectedRooms;
}

let qId = 0;

export function generatePalaceQuestions(rooms: Room[], questionCount: number): PalaceQuestion[] {
  const candidates: PalaceQuestion[] = [];
  const allItems = rooms.flatMap(r => r.items);

  // "What was in the X?" questions
  for (const room of rooms) {
    if (room.items.length === 0) continue;
    const correctItem = room.items[Math.floor(Math.random() * room.items.length)];
    const otherItems = allItems.filter(i => !room.items.includes(i));
    const distractors = pickN(otherItems.length > 0 ? otherItems : ALL_ITEMS.filter(i => i !== correctItem), 3);
    const options = shuffle([correctItem, ...distractors]);

    candidates.push({
      id: `pq-${++qId}`,
      text: `What was in the ${room.name}?`,
      correctAnswer: correctItem,
      type: 'multipleChoice',
      options,
    });
  }

  // "Where was the X?" questions
  for (const room of rooms) {
    for (const item of room.items) {
      const otherRoomNames = rooms.filter(r => r.id !== room.id).map(r => r.name);
      const distractors = pickN(otherRoomNames, Math.min(3, otherRoomNames.length));
      const options = shuffle([room.name, ...distractors]);

      candidates.push({
        id: `pq-${++qId}`,
        text: `Where was the ${item}?`,
        correctAnswer: room.name,
        type: 'multipleChoice',
        options,
      });
    }
  }

  // "How many items in X?" questions
  for (const room of rooms) {
    candidates.push({
      id: `pq-${++qId}`,
      text: `How many items were in the ${room.name}?`,
      correctAnswer: String(room.items.length),
      type: 'numberInput',
      min: 0,
      max: 6,
    });
  }

  return shuffle(candidates).slice(0, questionCount);
}
