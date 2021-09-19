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
    if (key === nameActivChar) { // определяем дальность хода фигур
      dist = paramChar[key];
    }
  }

  if (dist === 1) {
    const rangeCill = oneСellАield.map((item) => item + numCellActiv);
    const x = rangeCill.findIndex((item) => item === numCellNext);
    return x;
  }
  if (dist === 2) {
    const rangeCill = twoСellАield.map((item) => item + numCellActiv);
    const x = rangeCill.findIndex((item) => item === numCellNext);
    return x;
  }
  if (dist === 4) {
    return true;
  }
}
