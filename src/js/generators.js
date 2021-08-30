import Team from './Team';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) { // разрешонные типы
  let levelChar = Math.floor(Math.random() * (maxLevel + 1));
  levelChar = levelChar === 0 ? levelChar += 1 : levelChar;
  const numberChar = Math.floor(Math.random() * (allowedTypes.length + 1));

  yield new allowedTypes[numberChar](levelChar);
}

// const chars = characterGenerator(new Team().arrObjChar, 2);
// console.log('выводим результат гегератора', chars.next().value);


export function generateTeam(allowedTypes, maxLevel, characterCount) { // количество персонажей
  const arrObjCharTeam = [];
  for (let i = 1; i <= characterCount;) {
    const chars = characterGenerator(allowedTypes, maxLevel);

    arrObjCharTeam.push(chars.next().value);
    i += 1;
  }
  return arrObjCharTeam;
}

const arrObjCharTeam = generateTeam(new Team().arrObjChar, 3, 4);
console.log('команда играков', arrObjCharTeam);
