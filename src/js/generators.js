import PositionedCharacter from './PositionedCharacter';

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
  const numberChar = Math.floor(Math.random() * (allowedTypes.length));

  yield new allowedTypes[numberChar](levelChar); // получаем одного героя из 6
}

function* generatorUniqueNumbers(characterCount, setObj, length) {
  let unicNum;
  while (setObj.size <= characterCount - 1) {
    unicNum = Math.floor(Math.random() * (length));
    if (!(setObj.has(unicNum))) {
      setObj.add(unicNum);
      yield unicNum; // должен выдать номер
    }
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount, arrPositions) {
  const arrObjCharTeam = [];
  const setObj = new Set();
  for (let i = 1; i <= characterCount;) {
    const char = characterGenerator(allowedTypes, maxLevel);
    const genNum = generatorUniqueNumbers(characterCount, setObj, arrPositions.length - 1);
    const positionPlayer = arrPositions[genNum.next().value];
    const objPositionedCharacter = new PositionedCharacter(char.next().value, positionPlayer);
    arrObjCharTeam.push(objPositionedCharacter);
    i += 1;
  }
  return arrObjCharTeam;
}
