// import generateTeam from './generators';
import Team from './Team';
import GameState from './GameState';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';

export function calcTileType(i, boardSize) { // отрисовка краев поля
  const n = boardSize;
  if (i === 1) {
    return 'top-left';
  } if (i === n) {
    return 'top-right';
  } if (i === n ** 2) {
    return 'bottom-right';
  } if (i === n ** 2 - n + 1) {
    return 'bottom-left';
  } if (i >= 2 && i <= n - 1) {
    return 'top';
  } if (i > n * (n - 1) && i < n ** 2) {
    return 'bottom';
  } if (i === n * 2 || i === n * 3 || i === n * 4 || i === n * 5 || i === n * 6 || i === n * 7) {
    return 'right';
  } if (i === n * 1 + 1 || i === n * 2 + 1 || i === n * 3 + 1 || i === n * 4 + 1
    || i === n * 5 + 1 || i === n * 6 + 1 || i === n * 7 + 1) {
    return 'left';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

// eslint-disable-next-line consistent-return
export function calcAreaAction(numCellActiv, numCellNext, nameActivChar, action) { // move, attack
  const playerTurnParameters = {
    swordsman: 4,
    bowman: 2,
    magician: 1,
    daemon: 1,
    undead: 4,
    vampire: 2,
  };
  const playerAttacParameters = {
    swordsman: 1,
    bowman: 2,
    magician: 4,
    daemon: 4,
    undead: 1,
    vampire: 2,
  };
  let paramChar = playerTurnParameters;
  const oneСellАield = [1, 7, 8, 9, -1, -7, -8, -9];
  const twoСellАield = [1, 2, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18,
    -1, -2, -6, -7, -8, -9, -10, -14, -15, -16, -17, -18];

  if (action !== 'move') {
    paramChar = playerAttacParameters;
  }
  let dist;
  // eslint-disable-next-line guard-for-in
  for (const key in paramChar) {
    if (key === nameActivChar) { // определяем дальность действия фигуры
      dist = paramChar[key];
    }
  }

  if (dist === 1) {
    // создаем массив номеров ячеек диапазона атаки или хода
    const rangeCill = oneСellАield.map((item) => item + numCellActiv);
    // определяем входит или нет клетка предпологаемого удара или хода в диапазон
    const x = rangeCill.find((item) => item === numCellNext);
    return x;
  }
  if (dist === 2) {
    const rangeCill = twoСellАield.map((item) => item + numCellActiv);
    const x = rangeCill.find((item) => item === numCellNext);
    return x;
  }
  if (dist === 4) {
    return numCellNext;
  }
}

export function getMoveSellForPC(activCharPC, cells) { // возвращает номер ячейки для хода персонажа PC
  let moveSell;
  let rendomNumSell;
  while (!moveSell) {
    rendomNumSell = Math.floor(Math.random() * 63);
    moveSell = calcAreaAction(activCharPC.position, rendomNumSell, activCharPC.character.type, 'move');
    if (moveSell && !cells[moveSell].firstChild) {
      return moveSell;
    }
  }
}

export function getNewLevel(obj) { // возвращает массив новых команд персонажей при переходе на новый уровень
  const arrPositionsPlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49];
  const arrPositionCharPl = obj.charPl.map((char) => char.position);
  const arrPositionsPC = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 62, 63];
  const modArrPositionsPlayer = arrPositionsPlayer
    .filter((num) => arrPositionCharPl.indexOf(num) === -1);
  const levelPC = obj.level;
  // eslint-disable-next-line no-use-before-define
  let levelPl = levelPC === 4 ? levelPl = 2 : levelPl = levelPC - 1;
  const newArrPl = GameState.charPl.map((char) => {
    const { position } = char;
    const charMod = char.character.levelUp();
    return new PositionedCharacter(charMod, position);
  });

  const team = new Team().arrObjChar;
  //  ниже дополнительный персонаж игрока
  const newArrPlAdd = generateTeam(team, levelPl, levelPl, modArrPositionsPlayer); // уровень игрока и количество играков
  const summArrPl = [...newArrPl, ...newArrPlAdd];
  GameState.charPl = summArrPl;
  const newArrPC = generateTeam(team, levelPC, summArrPl.length, arrPositionsPC);
  GameState.charPC = newArrPC;
  const arrChar = [...summArrPl, ...newArrPC];
  return arrChar;
}

export function getNameThemes(numLevel) {
  let theme;
  if (numLevel === 1) {
    theme = themes.prairie;
  } if (numLevel === 2) {
    theme = themes.desert;
  } if (numLevel === 3) {
    theme = themes.arctic;
  } if (numLevel === 4) {
    theme = themes.mountain;
  }
  return theme;
}
