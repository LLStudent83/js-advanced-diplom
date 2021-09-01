import Team from './Team';
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
  const numberChar = Math.floor(Math.random() * (allowedTypes.length + 1));

  yield new allowedTypes[numberChar](levelChar); // получаем одного героя из 6
}

function* generatorUniqueNumbers(characterCount, setObj) {
  let unicNum;
  while (setObj.size <= characterCount - 1) {
    unicNum = Math.floor(Math.random() * (14));
    if (!(setObj.has(unicNum))) {
      setObj.add(unicNum);
      console.log('выводим позиции персонажей', ...setObj);
      yield unicNum;
    }
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) { // количество персонажей
  const arrObjCharTeam = [];
  const setObj = new Set();
  for (let i = 1; i <= characterCount;) {
    const char = characterGenerator(allowedTypes, maxLevel);
    const arrPositionsPlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49];
    const arrPositionsPC = [7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 47, 48, 63, 64];

    const genNum = generatorUniqueNumbers(characterCount, setObj);

    const positionPlayer = arrPositionsPlayer[genNum.next().value];
    const objPositionedCharacter = new PositionedCharacter(char.next().value, positionPlayer);
    arrObjCharTeam.push(objPositionedCharacter);
    i += 1;
  }
  return arrObjCharTeam;
}

// const arrObjCharTeam = generateTeam(new Team().arrObjChar, 3, 2);
// console.log('команда играков', arrObjCharTeam);

// PositionedCharacter
// set.size возвращает длину
// set.has(value) – возвращает true, если значение присутствует в множестве, иначе false.
// new Set(iterable) – создаёт Set, и если в качестве аргумента был предоставлен итерируемый объект (обычно это массив), то копирует его значения в новый Set.
// set.add(value) – добавляет значение (если оно уже есть, то ничего не делает), возвращает тот же объект set.
