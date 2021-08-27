export function calcTileType(i, boardSize) {
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
