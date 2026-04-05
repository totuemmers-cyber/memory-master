import { shuffle } from '../../utils/random';

export interface StoryQuestion {
  text: string;
  correctAnswer: string;
  type: 'multipleChoice' | 'yesNo' | 'numberInput';
  options?: string[];
  min?: number;
  max?: number;
}

interface FilledStory {
  sentences: string[];
  questions: StoryQuestion[];
}

const NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Ivan', 'Julia', 'Kevin', 'Laura', 'Marcus', 'Nina', 'Oscar', 'Priya'];
const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'white', 'black'];
const PLACES = ['park', 'beach', 'museum', 'library', 'cafe', 'market', 'station', 'bakery'];
const FOODS = ['pizza', 'pasta', 'salad', 'soup', 'sandwich', 'sushi', 'tacos', 'curry'];
const DRINKS = ['coffee', 'tea', 'juice', 'lemonade', 'water', 'milk', 'cocoa', 'soda'];
const ANIMALS = ['dog', 'cat', 'parrot', 'rabbit', 'hamster', 'turtle', 'goldfish', 'lizard'];
const ITEMS = ['book', 'hat', 'scarf', 'umbrella', 'backpack', 'phone', 'camera', 'notebook'];
const SPORTS = ['soccer', 'tennis', 'swimming', 'cycling', 'basketball', 'running', 'yoga', 'chess'];
const INSTRUMENTS = ['piano', 'guitar', 'violin', 'drums', 'flute', 'trumpet', 'cello', 'harp'];
const CITIES = ['London', 'Paris', 'Tokyo', 'Berlin', 'Rome', 'Sydney', 'Toronto', 'Madrid'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SUBJECTS = ['math', 'history', 'science', 'English', 'art', 'music', 'geography', 'biology'];
const VEHICLES = ['car', 'bus', 'train', 'bicycle', 'boat', 'plane', 'scooter', 'taxi'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function num(min: number, max: number): number { return min + Math.floor(Math.random() * (max - min + 1)); }
function distractors(correct: string, pool: string[], count: number): string[] {
  return shuffle(pool.filter(p => p !== correct)).slice(0, count);
}
function numDistractors(correct: number, count: number, min: number, max: number): string[] {
  const d = new Set<number>();
  for (let i = 1; i <= 3; i++) { if (correct + i <= max) d.add(correct + i); if (correct - i >= min) d.add(correct - i); }
  d.delete(correct);
  return shuffle([...d]).slice(0, count).map(String);
}

type TemplateBuilder = () => FilledStory;

const TEMPLATES: TemplateBuilder[] = [
  // Shopping
  () => {
    const name = pick(NAMES); const store = pick(PLACES); const item1 = pick(ITEMS); const item2 = pick(FOODS);
    const count1 = num(2, 8); const count2 = num(1, 5); const color = pick(COLORS); const day = pick(DAYS);
    return {
      sentences: [
        `On ${day}, ${name} went to the ${store} to do some shopping.`,
        `They bought ${count1} ${item1}s and ${count2} packs of ${item2}.`,
        `${name} also found a ${color} jacket on sale.`,
        `The total bill came to $${num(15, 95)}.`,
        `On the way home, ${name} stopped for a ${pick(DRINKS)}.`,
      ],
      questions: [
        { text: `Who went shopping?`, correctAnswer: name, type: 'multipleChoice', options: shuffle([name, ...distractors(name, NAMES, 3)]) },
        { text: `How many ${item1}s were bought?`, correctAnswer: String(count1), type: 'multipleChoice', options: shuffle([String(count1), ...numDistractors(count1, 3, 1, 10)]) },
        { text: `What color was the jacket?`, correctAnswer: color, type: 'multipleChoice', options: shuffle([color, ...distractors(color, COLORS, 3)]) },
        { text: `What day did they go shopping?`, correctAnswer: day, type: 'multipleChoice', options: shuffle([day, ...distractors(day, DAYS, 3)]) },
        { text: `Where did ${name} go shopping?`, correctAnswer: store, type: 'multipleChoice', options: shuffle([store, ...distractors(store, PLACES, 3)]) },
      ],
    };
  },
  // Cooking
  () => {
    const name = pick(NAMES); const dish = pick(FOODS); const guests = num(3, 12);
    const ingr1 = pick(['tomatoes', 'onions', 'peppers', 'mushrooms', 'carrots']); const count1 = num(2, 8);
    const ingr2 = pick(['garlic', 'cheese', 'butter', 'cream', 'herbs']); const time = `${num(1, 6)}:${pick(['00', '15', '30', '45'])} PM`;
    return {
      sentences: [
        `${name} decided to cook ${dish} for ${guests} guests.`,
        `The recipe needed ${count1} ${ingr1} and some ${ingr2}.`,
        `${name} started cooking at ${time}.`,
        `The dish took about ${num(20, 60)} minutes to prepare.`,
        `Everyone said it was the best ${dish} they had ever tasted.`,
      ],
      questions: [
        { text: `How many guests was ${name} cooking for?`, correctAnswer: String(guests), type: 'multipleChoice', options: shuffle([String(guests), ...numDistractors(guests, 3, 1, 15)]) },
        { text: `What was ${name} cooking?`, correctAnswer: dish, type: 'multipleChoice', options: shuffle([dish, ...distractors(dish, FOODS, 3)]) },
        { text: `How many ${ingr1} were needed?`, correctAnswer: String(count1), type: 'multipleChoice', options: shuffle([String(count1), ...numDistractors(count1, 3, 1, 10)]) },
        { text: `Did the recipe use ${ingr2}?`, correctAnswer: 'Yes', type: 'yesNo' },
        { text: `Who cooked the meal?`, correctAnswer: name, type: 'multipleChoice', options: shuffle([name, ...distractors(name, NAMES, 3)]) },
      ],
    };
  },
  // Travel
  () => {
    const name = pick(NAMES); const city = pick(CITIES); const vehicle = pick(VEHICLES); const hotel = `Hotel ${pick(['Grand', 'Royal', 'Palace', 'Sunrise', 'Ocean', 'Mountain'])}`;
    const days = num(3, 14); const month = pick(MONTHS);
    return {
      sentences: [
        `${name} traveled to ${city} in ${month}.`,
        `They took the ${vehicle} to get there.`,
        `The trip lasted ${days} days at the ${hotel}.`,
        `${name} visited ${num(2, 8)} different attractions.`,
        `The highlight was a visit to the famous ${pick(['cathedral', 'tower', 'bridge', 'palace', 'garden'])}.`,
      ],
      questions: [
        { text: `Where did ${name} travel to?`, correctAnswer: city, type: 'multipleChoice', options: shuffle([city, ...distractors(city, CITIES, 3)]) },
        { text: `How did ${name} travel?`, correctAnswer: vehicle, type: 'multipleChoice', options: shuffle([vehicle, ...distractors(vehicle, VEHICLES, 3)]) },
        { text: `How many days was the trip?`, correctAnswer: String(days), type: 'multipleChoice', options: shuffle([String(days), ...numDistractors(days, 3, 1, 16)]) },
        { text: `In which month did ${name} travel?`, correctAnswer: month, type: 'multipleChoice', options: shuffle([month, ...distractors(month, MONTHS, 3)]) },
        { text: `What was the hotel called?`, correctAnswer: hotel, type: 'multipleChoice', options: shuffle([hotel, `Hotel ${pick(['Star', 'Elite', 'Diamond'])}`, `Hotel ${pick(['Azure', 'Crown', 'Vista'])}`, `Hotel ${pick(['Classic', 'Premier', 'Central'])}`]) },
      ],
    };
  },
  // Birthday
  () => {
    const name = pick(NAMES); const age = num(5, 40); const guests = num(4, 20);
    const gift = pick(ITEMS); const cake = pick(['chocolate', 'vanilla', 'strawberry', 'lemon', 'carrot']);
    const place = pick(['house', 'garden', 'restaurant', 'park', 'rooftop']);
    return {
      sentences: [
        `${name} celebrated their ${age}th birthday.`,
        `The party was held at the ${place} with ${guests} guests.`,
        `The birthday cake was ${cake} flavored.`,
        `${name} received a ${gift} as a special present.`,
        `The celebration lasted until ${num(8, 11)} PM.`,
      ],
      questions: [
        { text: `How old did ${name} turn?`, correctAnswer: String(age), type: 'multipleChoice', options: shuffle([String(age), ...numDistractors(age, 3, 1, 50)]) },
        { text: `How many guests were there?`, correctAnswer: String(guests), type: 'multipleChoice', options: shuffle([String(guests), ...numDistractors(guests, 3, 1, 25)]) },
        { text: `What flavor was the cake?`, correctAnswer: cake, type: 'multipleChoice', options: shuffle([cake, ...distractors(cake, ['chocolate', 'vanilla', 'strawberry', 'lemon', 'carrot'], 3)]) },
        { text: `What gift did ${name} receive?`, correctAnswer: gift, type: 'multipleChoice', options: shuffle([gift, ...distractors(gift, ITEMS, 3)]) },
        { text: `Where was the party held?`, correctAnswer: place, type: 'multipleChoice', options: shuffle([place, ...distractors(place, ['house', 'garden', 'restaurant', 'park', 'rooftop'], 3)]) },
      ],
    };
  },
  // School
  () => {
    const name = pick(NAMES); const subject = pick(SUBJECTS); const teacher = pick(NAMES);
    const grade = pick(['A', 'B', 'C', 'B+', 'A-']); const students = num(15, 35);
    return {
      sentences: [
        `${name} had a big ${subject} exam on ${pick(DAYS)}.`,
        `The class was taught by ${teacher} and had ${students} students.`,
        `${name} studied for ${num(2, 8)} hours the night before.`,
        `The exam had ${num(20, 50)} questions in total.`,
        `${name} received a grade of ${grade}.`,
      ],
      questions: [
        { text: `What subject was the exam in?`, correctAnswer: subject, type: 'multipleChoice', options: shuffle([subject, ...distractors(subject, SUBJECTS, 3)]) },
        { text: `Who was the teacher?`, correctAnswer: teacher, type: 'multipleChoice', options: shuffle([teacher, ...distractors(teacher, NAMES, 3)]) },
        { text: `What grade did ${name} get?`, correctAnswer: grade, type: 'multipleChoice', options: shuffle([grade, ...distractors(grade, ['A', 'B', 'C', 'B+', 'A-', 'D'], 3)]) },
        { text: `How many students were in the class?`, correctAnswer: String(students), type: 'multipleChoice', options: shuffle([String(students), ...numDistractors(students, 3, 10, 40)]) },
        { text: `Did ${name} take the exam?`, correctAnswer: 'Yes', type: 'yesNo' },
      ],
    };
  },
  // Sports
  () => {
    const name = pick(NAMES); const sport = pick(SPORTS); const score1 = num(0, 5); const score2 = num(0, 5);
    const team = pick(['Eagles', 'Lions', 'Wolves', 'Bears', 'Hawks', 'Panthers']);
    const venue = pick(['Stadium', 'Arena', 'Field', 'Court', 'Center']);
    return {
      sentences: [
        `${name} played ${sport} for the ${team} on ${pick(DAYS)}.`,
        `The match was held at the ${pick(CITIES)} ${venue}.`,
        `The final score was ${score1} to ${score2}.`,
        `${name} scored ${num(0, 3)} times during the game.`,
        `About ${num(50, 500) * 10} spectators attended the event.`,
      ],
      questions: [
        { text: `What sport did ${name} play?`, correctAnswer: sport, type: 'multipleChoice', options: shuffle([sport, ...distractors(sport, SPORTS, 3)]) },
        { text: `What team did ${name} play for?`, correctAnswer: team, type: 'multipleChoice', options: shuffle([team, ...distractors(team, ['Eagles', 'Lions', 'Wolves', 'Bears', 'Hawks', 'Panthers'], 3)]) },
        { text: `Was the venue a ${venue}?`, correctAnswer: 'Yes', type: 'yesNo' },
        { text: `What was the first team's score?`, correctAnswer: String(score1), type: 'numberInput', min: 0, max: 10 },
        { text: `Who played in the match?`, correctAnswer: name, type: 'multipleChoice', options: shuffle([name, ...distractors(name, NAMES, 3)]) },
      ],
    };
  },
  // Pet
  () => {
    const name = pick(NAMES); const pet = pick(ANIMALS); const petName = pick(['Max', 'Bella', 'Rocky', 'Luna', 'Buddy', 'Coco', 'Daisy', 'Rex']);
    const age = num(1, 12); const color = pick(COLORS);
    return {
      sentences: [
        `${name} had a ${color} ${pet} named ${petName}.`,
        `${petName} was ${age} years old.`,
        `Every morning, ${name} would take ${petName} to the ${pick(PLACES)}.`,
        `${petName}'s favorite food was ${pick(['chicken', 'fish', 'carrots', 'treats', 'rice'])}.`,
        `Last week, ${name} took ${petName} to the vet for a checkup.`,
      ],
      questions: [
        { text: `What type of pet did ${name} have?`, correctAnswer: pet, type: 'multipleChoice', options: shuffle([pet, ...distractors(pet, ANIMALS, 3)]) },
        { text: `What was the pet's name?`, correctAnswer: petName, type: 'multipleChoice', options: shuffle([petName, ...distractors(petName, ['Max', 'Bella', 'Rocky', 'Luna', 'Buddy', 'Coco', 'Daisy', 'Rex'], 3)]) },
        { text: `What color was ${petName}?`, correctAnswer: color, type: 'multipleChoice', options: shuffle([color, ...distractors(color, COLORS, 3)]) },
        { text: `How old was ${petName}?`, correctAnswer: String(age), type: 'multipleChoice', options: shuffle([String(age), ...numDistractors(age, 3, 1, 15)]) },
        { text: `Did ${name} take ${petName} to the vet?`, correctAnswer: 'Yes', type: 'yesNo' },
      ],
    };
  },
  // Concert
  () => {
    const name = pick(NAMES); const band = pick(['The Echoes', 'Starfall', 'Neon Pulse', 'Silver Arrow', 'Midnight Sun', 'Crystal Wave']);
    const venue = pick(['Arena', 'Theater', 'Hall', 'Stadium', 'Club']);
    const city = pick(CITIES); const price = num(20, 120); const songs = num(8, 25);
    return {
      sentences: [
        `${name} went to see ${band} perform in ${city}.`,
        `The concert was at the ${city} ${venue}.`,
        `Tickets cost $${price} each.`,
        `The band played ${songs} songs that night.`,
        `${name} said the encore was the best part of the show.`,
      ],
      questions: [
        { text: `Which band performed?`, correctAnswer: band, type: 'multipleChoice', options: shuffle([band, ...distractors(band, ['The Echoes', 'Starfall', 'Neon Pulse', 'Silver Arrow', 'Midnight Sun', 'Crystal Wave'], 3)]) },
        { text: `In which city was the concert?`, correctAnswer: city, type: 'multipleChoice', options: shuffle([city, ...distractors(city, CITIES, 3)]) },
        { text: `How many songs did the band play?`, correctAnswer: String(songs), type: 'multipleChoice', options: shuffle([String(songs), ...numDistractors(songs, 3, 5, 30)]) },
        { text: `How much did a ticket cost?`, correctAnswer: String(price), type: 'numberInput', min: 5, max: 200 },
        { text: `Who went to the concert?`, correctAnswer: name, type: 'multipleChoice', options: shuffle([name, ...distractors(name, NAMES, 3)]) },
      ],
    };
  },
  // Restaurant
  () => {
    const name = pick(NAMES); const friend = pick(NAMES.filter(n => n !== name));
    const restaurant = pick(['Golden Fork', 'The Olive', 'Blue Moon', 'Pepper & Salt', 'Sunrise Kitchen']);
    const dish = pick(FOODS); const drink = pick(DRINKS); const bill = num(20, 80);
    return {
      sentences: [
        `${name} met ${friend} for dinner at ${restaurant}.`,
        `${name} ordered ${dish} and a glass of ${drink}.`,
        `${friend} had the daily special instead.`,
        `The total bill was $${bill} for both of them.`,
        `They agreed to come back next ${pick(MONTHS)}.`,
      ],
      questions: [
        { text: `Who did ${name} meet for dinner?`, correctAnswer: friend, type: 'multipleChoice', options: shuffle([friend, ...distractors(friend, NAMES, 3)]) },
        { text: `What restaurant did they go to?`, correctAnswer: restaurant, type: 'multipleChoice', options: shuffle([restaurant, ...distractors(restaurant, ['Golden Fork', 'The Olive', 'Blue Moon', 'Pepper & Salt', 'Sunrise Kitchen'], 3)]) },
        { text: `What did ${name} order?`, correctAnswer: dish, type: 'multipleChoice', options: shuffle([dish, ...distractors(dish, FOODS, 3)]) },
        { text: `What did ${name} drink?`, correctAnswer: drink, type: 'multipleChoice', options: shuffle([drink, ...distractors(drink, DRINKS, 3)]) },
        { text: `How much was the bill?`, correctAnswer: String(bill), type: 'numberInput', min: 10, max: 100 },
      ],
    };
  },
  // Music lesson
  () => {
    const name = pick(NAMES); const instrument = pick(INSTRUMENTS); const teacher = pick(NAMES);
    const years = num(1, 10); const day = pick(DAYS); const time = `${num(2, 7)} PM`;
    return {
      sentences: [
        `${name} has been learning ${instrument} for ${years} years.`,
        `The lessons are taught by ${teacher} every ${day} at ${time}.`,
        `${name} practices about ${num(20, 60)} minutes a day.`,
        `Next month, ${name} has a recital at the ${pick(['school', 'theater', 'concert hall', 'community center'])}.`,
        `${teacher} says ${name} is one of the best students.`,
      ],
      questions: [
        { text: `What instrument does ${name} play?`, correctAnswer: instrument, type: 'multipleChoice', options: shuffle([instrument, ...distractors(instrument, INSTRUMENTS, 3)]) },
        { text: `Who is the teacher?`, correctAnswer: teacher, type: 'multipleChoice', options: shuffle([teacher, ...distractors(teacher, NAMES, 3)]) },
        { text: `How many years has ${name} been learning?`, correctAnswer: String(years), type: 'multipleChoice', options: shuffle([String(years), ...numDistractors(years, 3, 1, 12)]) },
        { text: `On which day are the lessons?`, correctAnswer: day, type: 'multipleChoice', options: shuffle([day, ...distractors(day, DAYS, 3)]) },
        { text: `Does ${name} have a recital coming up?`, correctAnswer: 'Yes', type: 'yesNo' },
      ],
    };
  },
];

export function buildStory(sentenceCount: number, questionCount: number): FilledStory {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  const story = template();

  return {
    sentences: story.sentences.slice(0, sentenceCount),
    questions: shuffle(story.questions).slice(0, questionCount),
  };
}
