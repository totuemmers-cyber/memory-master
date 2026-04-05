// Name bank for Memory Master challenges
// 200+ first names and 100+ last names for generating character names

const FIRST_NAMES: string[] = [
  // Male names - diverse origins
  'James', 'Oliver', 'William', 'Henry', 'Thomas', 'Samuel', 'Daniel',
  'Joseph', 'Edward', 'Arthur', 'George', 'Charles', 'Frank', 'Walter',
  'Albert', 'Harold', 'Ernest', 'Leonard', 'Victor', 'Oscar', 'Felix',
  'Hugo', 'Leo', 'Max', 'Axel', 'Erik', 'Lars', 'Sven', 'Hans',
  'Klaus', 'Ivan', 'Boris', 'Dmitri', 'Yuri', 'Anton', 'Nikolai',
  'Chen', 'Wei', 'Jun', 'Hiro', 'Kenji', 'Takeshi', 'Ryu',
  'Raj', 'Arjun', 'Vikram', 'Sanjay', 'Amit', 'Deepak', 'Rahul',
  'Omar', 'Hassan', 'Karim', 'Tariq', 'Malik', 'Idris', 'Jamal',
  'Diego', 'Carlos', 'Pablo', 'Luis', 'Marco', 'Rafael', 'Miguel',
  'Andre', 'Jean', 'Pierre', 'Marcel', 'Luca', 'Mateo', 'Dante',
  'Kofi', 'Kwame', 'Emeka', 'Chidi', 'Zane', 'Kai', 'Finn',
  'Noah', 'Ethan', 'Liam', 'Mason', 'Logan', 'Aiden', 'Caleb',
  'Ryan', 'Seth', 'Troy', 'Blake', 'Grant', 'Miles', 'Reed',
  'Nolan', 'Quinn', 'Jasper', 'Silas', 'Rowan', 'Beckett', 'Cruz',

  // Female names - diverse origins
  'Maria', 'Sofia', 'Emma', 'Anna', 'Clara', 'Helena', 'Iris',
  'Julia', 'Diana', 'Eva', 'Rosa', 'Vera', 'Alice', 'Grace',
  'Helen', 'Ruth', 'Pearl', 'Hazel', 'Ivy', 'Violet', 'Ruby',
  'Stella', 'Luna', 'Aurora', 'Celeste', 'Estelle', 'Flora', 'Coral',
  'Aisha', 'Fatima', 'Leila', 'Nadia', 'Yasmin', 'Zara', 'Amira',
  'Priya', 'Anita', 'Devi', 'Lakshmi', 'Meera', 'Sita', 'Indira',
  'Yuki', 'Mei', 'Hana', 'Lin', 'Sakura', 'Naomi', 'Mika',
  'Carmen', 'Elena', 'Isabel', 'Lucia', 'Marta', 'Pilar', 'Paloma',
  'Ingrid', 'Astrid', 'Freya', 'Sigrid', 'Elsa', 'Greta', 'Helga',
  'Olga', 'Katya', 'Tanya', 'Natasha', 'Irina', 'Anya', 'Daria',
  'Chloe', 'Zoe', 'Fiona', 'Moira', 'Brynn', 'Saoirse', 'Niamh',
  'Nia', 'Amara', 'Imani', 'Zuri', 'Adaeze', 'Kaia', 'Naya',
  'Maya', 'Lena', 'Mira', 'Nina', 'Tara', 'Jade', 'Sage',
  'Quinn', 'Harper', 'Wren', 'Blair', 'Sloane', 'Reese', 'Piper',
  'Nora', 'Lydia', 'Daphne', 'Cora', 'Thea', 'Eloise', 'Margot',
];

const LAST_NAMES: string[] = [
  // English / American
  'Smith', 'Johnson', 'Brown', 'Taylor', 'Wilson', 'Clark', 'Hall',
  'Young', 'King', 'Wright', 'Baker', 'Green', 'Adams', 'Nelson',
  'Carter', 'Mitchell', 'Turner', 'Parker', 'Cooper', 'Reed', 'Ward',
  'Brooks', 'Gray', 'Stone', 'Fox', 'Lane', 'Cross', 'Cole',

  // Hispanic / Latin
  'Garcia', 'Santos', 'Rivera', 'Torres', 'Morales', 'Cruz', 'Reyes',
  'Flores', 'Mendez', 'Rojas', 'Vargas', 'Castillo', 'Ruiz', 'Ortega',

  // Asian
  'Kim', 'Park', 'Choi', 'Lee', 'Tanaka', 'Sato', 'Suzuki',
  'Nakamura', 'Chen', 'Wang', 'Zhang', 'Liu', 'Yang', 'Huang',

  // South Asian
  'Patel', 'Shah', 'Singh', 'Kumar', 'Sharma', 'Gupta', 'Das',
  'Kapoor', 'Mehta', 'Nair', 'Rao', 'Reddy', 'Bose', 'Malhotra',

  // European
  'Mueller', 'Weber', 'Fischer', 'Bauer', 'Schmidt', 'Richter', 'Wolf',
  'Bernard', 'Dupont', 'Moreau', 'Laurent', 'Rossi', 'Bianchi', 'Russo',
  'Berg', 'Lund', 'Holm', 'Strand', 'Johansson', 'Nilsson', 'Petrov',
  'Volkov', 'Novak', 'Horvat', 'Kowalski', 'Nowak', 'Szabo', 'Varga',

  // African
  'Okafor', 'Mensah', 'Diallo', 'Traore', 'Nkosi', 'Mbeki', 'Okeke',
  'Achebe', 'Osei', 'Kamara', 'Toure', 'Keita', 'Abadi', 'Farah',

  // Middle Eastern
  'Hassan', 'Ali', 'Abbas', 'Khalil', 'Salem', 'Khoury', 'Haddad',
];

export function getRandomNames(count: number): Array<{ first: string; last: string }> {
  // Return `count` unique name combinations
  // Shuffle first names, pick first `count`, pair with random last names
  const shuffledFirst = [...FIRST_NAMES];
  for (let i = 0; i < count && i < shuffledFirst.length; i++) {
    const j = i + Math.floor(Math.random() * (shuffledFirst.length - i));
    [shuffledFirst[i], shuffledFirst[j]] = [shuffledFirst[j], shuffledFirst[i]];
  }

  const result: Array<{ first: string; last: string }> = [];
  for (let i = 0; i < count && i < shuffledFirst.length; i++) {
    const lastIndex = Math.floor(Math.random() * LAST_NAMES.length);
    result.push({
      first: shuffledFirst[i],
      last: LAST_NAMES[lastIndex],
    });
  }
  return result;
}

export function getRandomFirstNames(count: number): string[] {
  // Just first names, unique
  const shuffled = [...FIRST_NAMES];
  const result: string[] = [];
  for (let i = 0; i < count && i < shuffled.length; i++) {
    const j = i + Math.floor(Math.random() * (shuffled.length - i));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    result.push(shuffled[i]);
  }
  return result;
}

export function getRandomLastNames(count: number): string[] {
  const shuffled = [...LAST_NAMES];
  const result: string[] = [];
  for (let i = 0; i < count && i < shuffled.length; i++) {
    const j = i + Math.floor(Math.random() * (shuffled.length - i));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    result.push(shuffled[i]);
  }
  return result;
}
