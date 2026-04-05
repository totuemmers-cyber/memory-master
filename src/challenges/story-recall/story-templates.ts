import { shuffle } from '../../utils/random';

export interface StoryQuestion {
  text: string;
  correctAnswer: string;
  type: 'multipleChoice' | 'yesNo' | 'numberInput';
  options?: string[];
  min?: number;
  max?: number;
}

export interface FilledStory {
  sentences: string[];
  questions: StoryQuestion[];
}

const NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Ivan', 'Julia', 'Kevin', 'Laura', 'Marcus', 'Nina', 'Oscar', 'Priya'];
const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'white', 'black', 'pink', 'brown'];
const PLACES = ['park', 'beach', 'museum', 'library', 'cafe', 'market', 'station', 'bakery'];
const FOODS = ['pizza', 'pasta', 'salad', 'soup', 'sandwich', 'sushi', 'tacos', 'curry', 'steak', 'risotto'];
const DRINKS = ['coffee', 'tea', 'juice', 'lemonade', 'water', 'milk', 'cocoa', 'soda'];
const ANIMALS = ['dog', 'cat', 'parrot', 'rabbit', 'hamster', 'turtle', 'goldfish', 'lizard'];
const ITEMS = ['book', 'hat', 'scarf', 'umbrella', 'backpack', 'phone', 'camera', 'notebook'];
const SPORTS = ['soccer', 'tennis', 'swimming', 'cycling', 'basketball', 'running', 'volleyball', 'badminton'];
const CITIES = ['London', 'Paris', 'Tokyo', 'Berlin', 'Rome', 'Sydney', 'Toronto', 'Madrid'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SUBJECTS = ['math', 'history', 'science', 'English', 'art', 'music', 'geography', 'biology'];
const VEHICLES = ['car', 'bus', 'train', 'bicycle', 'boat', 'plane', 'scooter', 'taxi'];
const CAKE_FLAVORS = ['chocolate', 'vanilla', 'strawberry', 'lemon', 'carrot', 'red velvet', 'coconut', 'banana'];
const GAMES = ['charades', 'trivia', 'karaoke', 'board games', 'musical chairs', 'hide and seek'];
const GENRES = ['mystery', 'sci-fi', 'romance', 'thriller', 'fantasy', 'biography', 'comedy', 'horror'];
const TREES = ['oak', 'maple', 'pine', 'birch', 'cherry', 'willow', 'elm', 'cedar'];
const FLOWERS = ['rose', 'tulip', 'daisy', 'sunflower', 'lily', 'orchid', 'violet', 'iris'];
const INSECTS = ['beetle', 'ladybug', 'ant', 'butterfly', 'cricket', 'grasshopper', 'moth', 'dragonfly'];
const WEATHER = ['sunny', 'cloudy', 'windy', 'foggy', 'clear', 'overcast', 'mild', 'warm'];
const SNACKS = ['cookies', 'chips', 'popcorn', 'pretzels', 'crackers', 'brownies', 'muffins', 'granola bars'];
const MOVIES = ['The Last Journey', 'Starlight', 'Hidden Valley', 'The Blue Door', 'Night Riders', 'Echo Falls', 'Silver Path', 'Iron Sky'];
const BOOKS = ['The Lost Island', 'Midnight Train', 'Paper Wings', 'Glass River', 'Shadow Hill', 'Frozen Dawn', 'Silent Echo', 'The Red Key'];
const FURNITURE = ['sofa', 'desk', 'bookshelf', 'dresser', 'table', 'wardrobe', 'armchair', 'bed frame'];
const BANDS = ['The Echoes', 'Starfall', 'Neon Pulse', 'Silver Arrow', 'Midnight Sun', 'Crystal Wave', 'Iron Bloom', 'Velvet Storm'];
const SPICES = ['cinnamon', 'paprika', 'cumin', 'oregano', 'thyme', 'basil', 'turmeric', 'rosemary'];
const VEGETABLES = ['tomatoes', 'onions', 'peppers', 'mushrooms', 'carrots', 'zucchini', 'broccoli', 'spinach'];
const RESTAURANTS = ['Golden Fork', 'The Olive', 'Blue Moon', 'Pepper & Salt', 'Sunrise Kitchen', 'The Red Plate', 'Oak & Vine', 'Cloud Nine'];
const TEAM_NAMES = ['Eagles', 'Lions', 'Wolves', 'Bears', 'Hawks', 'Panthers', 'Tigers', 'Falcons'];
const PET_NAMES = ['Max', 'Bella', 'Rocky', 'Luna', 'Buddy', 'Coco', 'Daisy', 'Rex'];
const HOTEL_NAMES = ['Grand', 'Royal', 'Palace', 'Sunrise', 'Ocean', 'Mountain', 'Central', 'Harbor'];
const LANDMARKS = ['cathedral', 'tower', 'bridge', 'palace', 'garden', 'fountain', 'statue', 'castle'];
const ROOMS = ['living room', 'kitchen', 'bedroom', 'study', 'basement', 'attic', 'garage', 'patio'];
const MERCH = ['t-shirt', 'poster', 'mug', 'keychain', 'pin', 'sticker', 'cap', 'wristband'];
const DESSERTS = ['cheesecake', 'tiramisu', 'brownie', 'ice cream', 'creme brulee', 'panna cotta', 'mousse', 'apple pie'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pickExcept<T>(arr: T[], ...exclude: T[]): T {
  const filtered = arr.filter(x => !exclude.includes(x));
  return filtered[Math.floor(Math.random() * filtered.length)];
}
function num(min: number, max: number): number { return min + Math.floor(Math.random() * (max - min + 1)); }

function mcDistractors(correct: string, pool: string[], count = 3): string[] {
  return shuffle(pool.filter(p => p !== correct)).slice(0, count);
}

function numMcOptions(correct: number, min: number, max: number): string[] {
  const d = new Set<number>();
  for (let i = 1; d.size < 3 && i <= 10; i++) {
    if (correct + i <= max) d.add(correct + i);
    if (correct - i >= min && d.size < 3) d.add(correct - i);
  }
  return shuffle([String(correct), ...[...d].map(String).slice(0, 3)]);
}

function mc(text: string, correct: string, pool: string[]): StoryQuestion {
  return { text, correctAnswer: correct, type: 'multipleChoice', options: shuffle([correct, ...mcDistractors(correct, pool)]) };
}


function ni(text: string, correct: number, min = 0, max = 99): StoryQuestion {
  return { text, correctAnswer: String(correct), type: 'numberInput', min, max };
}

function numMc(text: string, correct: number, min: number, max: number): StoryQuestion {
  return { text, correctAnswer: String(correct), type: 'multipleChoice', options: numMcOptions(correct, min, max) };
}

type TemplateBuilder = () => FilledStory;

const TEMPLATES: TemplateBuilder[] = [
  // 1. Shopping trip
  () => {
    const name = pick(NAMES); const store = pick(PLACES); const item1 = pick(ITEMS); const item2 = pick(ITEMS.filter(i => i !== item1));
    const count1 = num(2, 8); const count2 = num(1, 5); const color = pick(COLORS); const day = pick(DAYS);
    const friend = pickExcept(NAMES, name); const drink = pick(DRINKS); const bill = num(15, 95);
    return {
      sentences: [
        `On ${day}, ${name} went to the ${store} to do some shopping.`,
        `They bought ${count1} ${item1}s and ${count2} packs of ${pick(FOODS)}.`,
        `${name} also found a ${color} ${item2} on sale.`,
        `The total bill came to $${bill}.`,
        `On the way home, ${name} stopped for a ${drink}.`,
        `${friend} called to ask if ${name} could pick up some ${pick(SNACKS)}.`,
        `${name} paid with a ${pick(['credit card', 'debit card', 'cash', 'phone app'])}.`,
        `The store was having a ${num(10, 50)}% off sale that week.`,
      ],
      questions: [
        mc(`Who went shopping?`, name, NAMES),
        numMc(`How many ${item1}s were bought?`, count1, 1, 10),
        mc(`What color was the ${item2}?`, color, COLORS),
        mc(`What day did they go shopping?`, day, DAYS),
        mc(`Where did ${name} go shopping?`, store, PLACES),
        ni(`How much was the total bill?`, bill, 5, 120),
        mc(`What drink did ${name} have on the way home?`, drink, DRINKS),
        mc(`Who called ${name}?`, friend, NAMES),
      ],
    };
  },

  // 2. Cooking recipe
  () => {
    const name = pick(NAMES); const dish = pick(FOODS); const guests = num(3, 12);
    const veg = pick(VEGETABLES); const count1 = num(2, 8);
    const spice = pick(SPICES); const friend = pickExcept(NAMES, name);
    const color = pick(COLORS); const minutes = num(20, 60); const temp = num(150, 220);
    return {
      sentences: [
        `${name} decided to cook ${dish} for ${guests} guests.`,
        `The recipe needed ${count1} ${veg} and some fresh ${spice}.`,
        `${name} preheated the oven to ${temp} degrees.`,
        `${name} chopped everything on a ${color} cutting board.`,
        `The dish took about ${minutes} minutes to prepare.`,
        `${friend} arrived early and helped set the table.`,
        `Everyone said it was the best ${dish} they had ever tasted.`,
        `${name} saved ${num(2, 4)} portions of leftovers in the fridge.`,
      ],
      questions: [
        numMc(`How many guests was ${name} cooking for?`, guests, 1, 15),
        mc(`What was ${name} cooking?`, dish, FOODS),
        numMc(`How many ${veg} were needed?`, count1, 1, 10),
        mc(`What spice did ${name} use?`, spice, SPICES),
        mc(`What color was the cutting board?`, color, COLORS),
        ni(`What temperature was the oven set to?`, temp, 100, 300),
        ni(`How many minutes did the dish take?`, minutes, 10, 90),
        mc(`Who helped set the table?`, friend, NAMES),
      ],
    };
  },

  // 3. Travel/vacation
  () => {
    const name = pick(NAMES); const city = pick(CITIES); const vehicle = pick(VEHICLES);
    const hotel = `Hotel ${pick(HOTEL_NAMES)}`; const days = num(3, 14); const month = pick(MONTHS);
    const landmark = pick(LANDMARKS); const color = pick(COLORS); const item = pick(ITEMS);
    return {
      sentences: [
        `${name} traveled to ${city} in ${month}.`,
        `They took the ${vehicle} to get there.`,
        `The trip lasted ${days} days at the ${hotel}.`,
        `${name} visited the famous ${landmark} and took many photos.`,
        `${name} bought a ${color} ${item} as a souvenir.`,
        `The weather was ${pick(WEATHER)} the entire trip.`,
        `One evening, ${name} tried the local ${pick(FOODS)} at a small cafe.`,
        `${name} met a traveler named ${pickExcept(NAMES, name)} at the hotel.`,
      ],
      questions: [
        mc(`Where did ${name} travel to?`, city, CITIES),
        mc(`How did ${name} travel?`, vehicle, VEHICLES),
        numMc(`How many days was the trip?`, days, 1, 16),
        mc(`In which month did ${name} travel?`, month, MONTHS),
        mc(`What was the hotel called?`, hotel, ['Hotel Grand', 'Hotel Royal', 'Hotel Palace', 'Hotel Sunrise', 'Hotel Ocean', 'Hotel Mountain', 'Hotel Central', 'Hotel Harbor']),
        mc(`What landmark did ${name} visit?`, landmark, LANDMARKS),
        mc(`What color was the souvenir?`, color, COLORS),
        mc(`What souvenir did ${name} buy?`, item, ITEMS),
      ],
    };
  },

  // 4. Birthday party
  () => {
    const name = pick(NAMES); const age = num(5, 40); const guests = num(4, 20);
    const gift = pick(ITEMS); const cake = pick(CAKE_FLAVORS); const friend = pickExcept(NAMES, name);
    const place = pick(['house', 'garden', 'restaurant', 'park', 'rooftop', 'backyard']);
    const game = pick(GAMES); const hatColor = pick(COLORS); const hours = num(2, 5);
    return {
      sentences: [
        `${name} celebrated their ${age}th birthday at the ${place}.`,
        `There were ${guests} guests at the party.`,
        `${friend} brought a ${pick(COLORS)} ${gift} as a present.`,
        `The birthday cake was ${cake} flavored with ${num(5, 25)} candles.`,
        `They played ${game} and everyone had a great time.`,
        `${name} wore a ${hatColor} party hat the whole evening.`,
        `The party lasted ${hours} hours.`,
        `Everyone drank ${pick(DRINKS)} and ate ${pick(SNACKS)}.`,
      ],
      questions: [
        ni(`How old did ${name} turn?`, age, 1, 50),
        numMc(`How many guests were there?`, guests, 1, 25),
        mc(`What flavor was the cake?`, cake, CAKE_FLAVORS),
        mc(`Who brought the gift?`, friend, NAMES),
        mc(`What gift did ${friend} bring?`, gift, ITEMS),
        mc(`What game did they play?`, game, GAMES),
        mc(`What color was ${name}'s party hat?`, hatColor, COLORS),
        mc(`Where was the party held?`, place, ['house', 'garden', 'restaurant', 'park', 'rooftop', 'backyard']),
      ],
    };
  },

  // 5. School day
  () => {
    const name = pick(NAMES); const subject = pick(SUBJECTS); const teacher = pickExcept(NAMES, name);
    const grade = pick(['A', 'B', 'C', 'B+', 'A-']); const students = num(15, 35);
    const friend = pickExcept(NAMES, name, teacher); const food = pick(FOODS);
    const subject2 = pickExcept(SUBJECTS, subject); const roomNum = num(101, 305);
    return {
      sentences: [
        `${name} had a busy day at school on ${pick(DAYS)}.`,
        `In ${subject} class, the teacher ${teacher} gave a surprise quiz.`,
        `${name} scored a grade of ${grade} with ${students} students in the class.`,
        `During lunch, ${name} sat with ${friend} and had ${food}.`,
        `After lunch, ${name} had ${subject2} in room ${roomNum}.`,
        `${name} borrowed a ${pick(COLORS)} ${pick(ITEMS)} from the library.`,
        `The school day ended at ${num(2, 4)} PM.`,
        `That evening, ${name} had ${num(1, 4)} hours of homework.`,
      ],
      questions: [
        mc(`What subject had the surprise quiz?`, subject, SUBJECTS),
        mc(`Who was the teacher?`, teacher, NAMES),
        mc(`What grade did ${name} get?`, grade, ['A', 'B', 'C', 'B+', 'A-', 'D']),
        numMc(`How many students were in the class?`, students, 10, 40),
        mc(`Who did ${name} sit with at lunch?`, friend, NAMES),
        mc(`What did ${name} eat for lunch?`, food, FOODS),
        mc(`What was the second class after lunch?`, subject2, SUBJECTS),
        ni(`What room number was ${subject2} in?`, roomNum, 100, 400),
      ],
    };
  },

  // 6. Sports event
  () => {
    const name = pick(NAMES); const sport = pick(SPORTS); const score1 = num(1, 5); const score2 = num(0, 5);
    const team = pick(TEAM_NAMES); const team2 = pickExcept(TEAM_NAMES, team);
    const friend = pickExcept(NAMES, name); const color = pick(COLORS);
    const venue = `${pick(CITIES)} Arena`; const hotdogs = num(1, 4);
    return {
      sentences: [
        `${name} went to watch a ${sport} game at the ${venue} on ${pick(DAYS)}.`,
        `The ${team} played against the ${team2}.`,
        `The final score was ${score1} to ${score2} in favor of the ${team}.`,
        `${name} sat with ${friend} in section ${num(1, 30)}.`,
        `They bought ${hotdogs} hot dogs and ${num(1, 3)} sodas.`,
        `${name} wore a ${color} jersey to support the team.`,
        `The crowd was about ${num(5, 50)} thousand people.`,
        `After the game, ${name} got a player's autograph.`,
      ],
      questions: [
        mc(`What sport did ${name} watch?`, sport, SPORTS),
        mc(`Which team won?`, team, TEAM_NAMES),
        ni(`What was the winning team's score?`, score1, 0, 10),
        ni(`What was the losing team's score?`, score2, 0, 10),
        mc(`Who did ${name} sit with?`, friend, NAMES),
        mc(`What color jersey did ${name} wear?`, color, COLORS),
        ni(`How many hot dogs did they buy?`, hotdogs, 1, 6),
        mc(`Where was the game played?`, venue, CITIES.map(c => `${c} Arena`)),
      ],
    };
  },

  // 7. Garden/nature
  () => {
    const name = pick(NAMES); const flower = pick(FLOWERS); const count1 = num(3, 12);
    const animal = pick(ANIMALS); const color = pick(COLORS); const friend = pickExcept(NAMES, name);
    const tree = pick(TREES); const insect = pick(INSECTS); const count2 = num(2, 8);
    const weather = pick(WEATHER); const day = pick(DAYS);
    return {
      sentences: [
        `${name} spent ${day} working in the garden.`,
        `${name} planted ${count1} ${flower} seeds in the ${color} flower bed.`,
        `A ${animal} appeared near the ${tree} tree and watched for a while.`,
        `The weather was ${weather} with a gentle breeze.`,
        `${friend} stopped by and helped prune the hedges.`,
        `They found ${count2} ${insect}s hiding under a rock.`,
        `${name} watered everything with a ${pick(COLORS)} watering can.`,
        `By the end, ${name} had filled ${num(2, 6)} bags with garden waste.`,
      ],
      questions: [
        mc(`What day did ${name} work in the garden?`, day, DAYS),
        numMc(`How many ${flower} seeds did ${name} plant?`, count1, 1, 15),
        mc(`What flower did ${name} plant?`, flower, FLOWERS),
        mc(`What animal appeared?`, animal, ANIMALS),
        mc(`What color was the flower bed?`, color, COLORS),
        mc(`What was the weather like?`, weather, WEATHER),
        mc(`Who helped ${name}?`, friend, NAMES),
        numMc(`How many ${insect}s did they find?`, count2, 1, 10),
      ],
    };
  },

  // 8. Office/work
  () => {
    const name = pick(NAMES); const colleague = pickExcept(NAMES, name);
    const boss = pickExcept(NAMES, name, colleague); const day = pick(DAYS);
    const project = pick(['Phoenix', 'Atlas', 'Nova', 'Orion', 'Echo', 'Summit', 'Pulse', 'Drift']);
    const emails = num(8, 35); const slides = num(5, 20); const food = pick(FOODS);
    const transport = pick(VEHICLES); const month = pick(MONTHS);
    return {
      sentences: [
        `${name} arrived at the office at ${num(7, 9)} AM on ${day}.`,
        `The first meeting was about Project ${project} in conference room ${num(1, 8)}.`,
        `${colleague} presented ${slides} slides about the new strategy.`,
        `${name} had ${emails} emails waiting and dealt with them before lunch.`,
        `For lunch, ${name} ordered ${food} from the cafe downstairs.`,
        `The boss, ${boss}, announced the deadline was moved to ${month}.`,
        `${name} left the office at ${num(5, 7)} PM.`,
        `${name} took the ${transport} home.`,
      ],
      questions: [
        mc(`What day was it?`, day, DAYS),
        mc(`What was the project called?`, project, ['Phoenix', 'Atlas', 'Nova', 'Orion', 'Echo', 'Summit', 'Pulse', 'Drift']),
        ni(`How many slides did ${colleague} present?`, slides, 1, 30),
        ni(`How many emails did ${name} have?`, emails, 1, 50),
        mc(`What did ${name} have for lunch?`, food, FOODS),
        mc(`Who is the boss?`, boss, NAMES),
        mc(`When was the new deadline?`, month, MONTHS),
        mc(`How did ${name} get home?`, transport, VEHICLES),
      ],
    };
  },

  // 9. Museum visit
  () => {
    const name = pick(NAMES); const museum = pick(['City', 'National', 'Modern', 'Natural History', 'Art', 'Science', 'Heritage', 'Royal']);
    const price = num(8, 25); const color = pick(COLORS); const artist = pickExcept(NAMES, name);
    const friend = pickExcept(NAMES, name, artist); const item = pick(ITEMS);
    const count2 = num(15, 60); const artifact = pick(['coins', 'vases', 'swords', 'masks', 'scrolls', 'statues', 'jewels', 'tools']);
    const rooms = num(5, 15);
    return {
      sentences: [
        `${name} visited the ${museum} Museum on ${pick(DAYS)}.`,
        `The ticket cost $${price} and included all exhibits.`,
        `The first exhibit was a ${color} painting by ${artist}.`,
        `In the ancient hall, there was a collection of ${count2} ${artifact}.`,
        `${name} spent ${num(10, 40)} minutes in the sculpture room.`,
        `${name} bought a ${item} from the gift shop.`,
        `${friend} worked there as a guide and showed ${name} around.`,
        `${name} visited ${rooms} rooms in total before closing time.`,
      ],
      questions: [
        mc(`Which museum did ${name} visit?`, `${museum} Museum`, ['City Museum', 'National Museum', 'Modern Museum', 'Natural History Museum', 'Art Museum', 'Science Museum', 'Heritage Museum', 'Royal Museum']),
        ni(`How much did the ticket cost?`, price, 1, 40),
        mc(`What color was the painting?`, color, COLORS),
        mc(`Who painted the featured artwork?`, artist, NAMES),
        numMc(`How many ${artifact} were in the collection?`, count2, 5, 70),
        mc(`What did ${name} buy from the gift shop?`, item, ITEMS),
        mc(`Who was the guide?`, friend, NAMES),
        ni(`How many rooms did ${name} visit?`, rooms, 1, 20),
      ],
    };
  },

  // 10. Pet story
  () => {
    const name = pick(NAMES); const pet = pick(ANIMALS); const petName = pick(PET_NAMES);
    const age = num(1, 12); const color = pick(COLORS); const friend = pickExcept(NAMES, name);
    const vet = pickExcept(NAMES, name, friend); const weight = num(5, 40);
    const trick = pick(['sit', 'shake', 'roll over', 'fetch', 'spin', 'lie down', 'high five', 'jump']);
    const treats = num(3, 10);
    return {
      sentences: [
        `${name} had a ${color} ${pet} named ${petName}.`,
        `${petName} was ${age} years old and weighed ${weight} pounds.`,
        `Every morning, ${name} took ${petName} to the ${pick(PLACES)}.`,
        `At the vet, Dr. ${vet} said ${petName} was very healthy.`,
        `${petName} learned to ${trick} after lots of practice.`,
        `${friend} came to visit and brought ${treats} treats.`,
        `${petName}'s favorite toy was a ${pick(COLORS)} ball.`,
        `${name} fed ${petName} ${pick(['chicken', 'fish', 'carrots', 'special kibble', 'rice'])} every day.`,
      ],
      questions: [
        mc(`What type of pet does ${name} have?`, pet, ANIMALS),
        mc(`What is the pet's name?`, petName, PET_NAMES),
        mc(`What color is ${petName}?`, color, COLORS),
        ni(`How old is ${petName}?`, age, 1, 15),
        ni(`How much does ${petName} weigh?`, weight, 1, 50),
        mc(`What is the vet's name?`, vet, NAMES),
        mc(`What trick did ${petName} learn?`, trick, ['sit', 'shake', 'roll over', 'fetch', 'spin', 'lie down', 'high five', 'jump']),
        mc(`Who brought treats for ${petName}?`, friend, NAMES),
      ],
    };
  },

  // 11. Library
  () => {
    const name = pick(NAMES); const librarian = pickExcept(NAMES, name);
    const friend = pickExcept(NAMES, name, librarian); const genre = pick(GENRES);
    const book = pick(BOOKS); const author = pickExcept(NAMES, name, librarian, friend);
    const pages = num(120, 450); const color = pick(COLORS);
    const dueDays = num(7, 21); const booksChecked = num(2, 6);
    return {
      sentences: [
        `${name} went to the library on ${pick(DAYS)} to find a new book.`,
        `The librarian, ${librarian}, recommended a ${genre} book called "${book}".`,
        `It was written by ${author} and had ${pages} pages.`,
        `${name} also picked up ${num(1, 4)} magazines from the ${color} shelf.`,
        `${friend} was there studying for a ${pick(SUBJECTS)} exam.`,
        `The book was due back in ${dueDays} days.`,
        `${name} checked out ${booksChecked} books total.`,
        `Before leaving, ${name} sat in the reading corner for ${num(15, 45)} minutes.`,
      ],
      questions: [
        mc(`What genre was the recommended book?`, genre, GENRES),
        mc(`Who was the librarian?`, librarian, NAMES),
        mc(`What was the book called?`, book, BOOKS),
        mc(`Who wrote the book?`, author, NAMES),
        ni(`How many pages did the book have?`, pages, 50, 500),
        mc(`What color was the magazine shelf?`, color, COLORS),
        ni(`In how many days was the book due?`, dueDays, 1, 30),
        mc(`Who was studying at the library?`, friend, NAMES),
      ],
    };
  },

  // 12. Concert
  () => {
    const name = pick(NAMES); const band = pick(BANDS); const venue = pick(['Grand Arena', 'Star Theater', 'City Hall', 'Rock Dome', 'Open Air Stage', 'The Warehouse']);
    const price = num(20, 120); const friend = pickExcept(NAMES, name);
    const color = pick(COLORS); const merch = pick(MERCH); const songs = num(8, 22);
    const encores = num(1, 3); const food = pick(SNACKS);
    return {
      sentences: [
        `${name} went to see ${band} perform at the ${venue} on ${pick(DAYS)}.`,
        `The ticket cost $${price} for a seat in row ${num(1, 30)}.`,
        `The band played ${songs} songs and did ${encores} encore(s).`,
        `${name} bought a ${color} ${merch} from the merchandise stand.`,
        `${friend} came along and they shared a bag of ${food}.`,
        `The opening act played for about ${num(20, 40)} minutes.`,
        `${name} took ${num(3, 15)} videos before the phone battery ran low.`,
        `After the show, they waited ${num(10, 30)} minutes to get out of the parking lot.`,
      ],
      questions: [
        mc(`Which band did ${name} see?`, band, BANDS),
        mc(`Where was the concert?`, venue, ['Grand Arena', 'Star Theater', 'City Hall', 'Rock Dome', 'Open Air Stage', 'The Warehouse']),
        ni(`How much did the ticket cost?`, price, 5, 200),
        numMc(`How many songs did the band play?`, songs, 5, 30),
        mc(`What color was the ${merch}?`, color, COLORS),
        mc(`What merchandise did ${name} buy?`, merch, MERCH),
        mc(`Who came to the concert with ${name}?`, friend, NAMES),
        numMc(`How many encores were there?`, encores, 1, 4),
      ],
    };
  },

  // 13. Moving day
  () => {
    const name = pick(NAMES); const oldCity = pick(CITIES); const newCity = pickExcept(CITIES, oldCity);
    const rooms = num(2, 6); const boxes = num(10, 40); const color = pick(COLORS);
    const friend = pickExcept(NAMES, name); const helper = pickExcept(NAMES, name, friend);
    const furniture = pick(FURNITURE); const pizzas = num(2, 6);
    const neighbor = pickExcept(NAMES, name, friend, helper);
    return {
      sentences: [
        `${name} moved from ${oldCity} to ${newCity} on ${pick(DAYS)}.`,
        `The new apartment had ${rooms} rooms on the ${num(1, 8)}th floor.`,
        `${name} packed ${boxes} boxes into a ${color} moving truck.`,
        `${friend} and ${helper} came to help carry the heavy ${furniture}.`,
        `The drive took ${num(2, 8)} hours.`,
        `${name} ordered ${pizzas} pizzas when they arrived.`,
        `The first thing unpacked was the ${pick(ITEMS)} for the ${pick(ROOMS)}.`,
        `The new neighbor, ${neighbor}, brought over a ${pick(['cake', 'pie', 'flowers', 'wine', 'fruit basket'])} as a welcome gift.`,
      ],
      questions: [
        mc(`Where did ${name} move from?`, oldCity, CITIES),
        mc(`Where did ${name} move to?`, newCity, CITIES),
        ni(`How many rooms does the new place have?`, rooms, 1, 8),
        ni(`How many boxes did ${name} pack?`, boxes, 5, 50),
        mc(`What color was the moving truck?`, color, COLORS),
        mc(`Who helped ${name} move?`, friend, NAMES),
        ni(`How many pizzas were ordered?`, pizzas, 1, 8),
        mc(`Who is the new neighbor?`, neighbor, NAMES),
      ],
    };
  },

  // 14. Restaurant
  () => {
    const name = pick(NAMES); const friend = pickExcept(NAMES, name);
    const restaurant = pick(RESTAURANTS); const dish = pick(FOODS); const drink = pick(DRINKS);
    const waiter = pickExcept(NAMES, name, friend); const dessert = pick(DESSERTS);
    const bill = num(20, 85); const tableNum = num(1, 20); const stars = num(3, 5);
    return {
      sentences: [
        `${name} had dinner at ${restaurant} on ${pick(DAYS)} evening.`,
        `The restaurant had ${stars} stars on the review site.`,
        `${name} ordered ${dish} as the main course and a ${drink} to drink.`,
        `The waiter, ${waiter}, recommended the ${dessert} for dessert.`,
        `${friend} joined for dinner and ordered the daily special.`,
        `The total bill came to $${bill}.`,
        `They sat at table number ${tableNum} near the window.`,
        `${name} left a $${num(3, 15)} tip for the excellent service.`,
      ],
      questions: [
        mc(`What restaurant did ${name} go to?`, restaurant, RESTAURANTS),
        mc(`What did ${name} order?`, dish, FOODS),
        mc(`What did ${name} drink?`, drink, DRINKS),
        mc(`What was the waiter's name?`, waiter, NAMES),
        mc(`What dessert was recommended?`, dessert, DESSERTS),
        ni(`How much was the total bill?`, bill, 10, 100),
        mc(`Who joined ${name} for dinner?`, friend, NAMES),
        ni(`What table number did they sit at?`, tableNum, 1, 25),
      ],
    };
  },

  // 15. Rainy day
  () => {
    const name = pick(NAMES); const day = pick(DAYS); const book = pick(BOOKS);
    const author = pickExcept(NAMES, name); const drink = pick(DRINKS);
    const snack = pick(SNACKS); const movie = pick(MOVIES); const friend = pickExcept(NAMES, name, author);
    const color = pick(COLORS); const pieces = num(100, 500);
    const minutes = num(15, 45);
    return {
      sentences: [
        `It rained all day on ${day}, so ${name} stayed home.`,
        `${name} started by reading "${book}" by ${author} on the couch.`,
        `At noon, ${name} made a cup of ${drink} and ate some ${snack}.`,
        `Then ${name} watched the movie "${movie}" for a couple of hours.`,
        `${friend} called and they talked for ${minutes} minutes.`,
        `${name} worked on a ${color} jigsaw puzzle with ${pieces} pieces.`,
        `For dinner, ${name} ordered ${pick(FOODS)} from a delivery app.`,
        `The rain finally stopped around ${num(6, 9)} PM.`,
      ],
      questions: [
        mc(`What day was it raining?`, day, DAYS),
        mc(`What book was ${name} reading?`, book, BOOKS),
        mc(`Who wrote the book?`, author, NAMES),
        mc(`What drink did ${name} make?`, drink, DRINKS),
        mc(`What movie did ${name} watch?`, movie, MOVIES),
        mc(`Who called ${name}?`, friend, NAMES),
        ni(`How many pieces did the puzzle have?`, pieces, 50, 600),
        mc(`What color was the puzzle?`, color, COLORS),
      ],
    };
  },

  // 16. Camping trip
  () => {
    const name = pick(NAMES); const friend = pickExcept(NAMES, name);
    const park = pick(['Pine Ridge', 'Blue Lake', 'Eagle Point', 'Bear Creek', 'Silver Falls', 'Sunset Valley']);
    const color = pick(COLORS); const fish = num(1, 8); const animal = pick(['raccoon', 'deer', 'fox', 'squirrel', 'bear', 'owl']);
    const snack = pick(SNACKS); const stars = num(3, 12); const miles = num(2, 10);
    const temp = num(35, 60); const day = pick(DAYS);
    return {
      sentences: [
        `${name} went camping at ${park} with ${friend} on ${day}.`,
        `They set up a ${color} tent near the lake.`,
        `${name} caught ${fish} fish that afternoon.`,
        `That night, they spotted ${stars} shooting stars in the sky.`,
        `A ${animal} wandered into the camp and stole a bag of ${snack}.`,
        `The temperature dropped to ${temp} degrees overnight.`,
        `They hiked ${miles} miles to a waterfall the next morning.`,
        `${name} found a ${pick(['feather', 'smooth stone', 'pinecone', 'fossil', 'arrowhead'])} on the trail.`,
      ],
      questions: [
        mc(`Where did ${name} go camping?`, park, ['Pine Ridge', 'Blue Lake', 'Eagle Point', 'Bear Creek', 'Silver Falls', 'Sunset Valley']),
        mc(`Who went camping with ${name}?`, friend, NAMES),
        mc(`What color was the tent?`, color, COLORS),
        ni(`How many fish did ${name} catch?`, fish, 0, 12),
        mc(`What animal stole the food?`, animal, ['raccoon', 'deer', 'fox', 'squirrel', 'bear', 'owl']),
        numMc(`How many shooting stars did they see?`, stars, 1, 15),
        ni(`What was the temperature overnight?`, temp, 20, 80),
        ni(`How many miles did they hike?`, miles, 1, 15),
      ],
    };
  },
];

export function buildStory(sentenceCount: number, questionCount: number): FilledStory {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  const story = template();

  // Ensure we don't ask for more than available
  const sc = Math.min(sentenceCount, story.sentences.length);
  const qc = Math.min(questionCount, story.questions.length);

  return {
    sentences: story.sentences.slice(0, sc),
    questions: shuffle(story.questions).slice(0, qc),
  };
}
